import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  RefreshControl,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector } from "react-redux";
import { COLORS, SIZES } from "../../constants/theme";
import { getDangKyThiCong, getUser, updatePhanQuyen, updateDangKyThiCongStatus } from "./api";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import moment from "moment-timezone";
import adjust from "../../adjust";
import QRCode from "react-native-qrcode-svg";
import CustomModal from "./CustomModal";
const { width } = Dimensions.get("window");

// Optimized constants with better color scheme
const STATUS_OPTIONS = [
  { label: "Tất cả", value: "all", color: "#64748B", bgColor: "rgba(100, 116, 139, 0.1)" },
  { label: "Chờ duyệt", value: "0", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.1)" },
  { label: "Đã duyệt", value: "1", color: "#10B981", bgColor: "rgba(16, 185, 129, 0.1)" },
  { label: "Từ chối", value: "2", color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.1)" },
  { label: "Hoàn thành", value: "3", color: "#10B981", bgColor: "rgba(16, 185, 129, 0.1)" },
];

const STATUS_STYLES = {
  0: {
    label: "Chờ duyệt",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
    icon: "time-outline",
    gradient: ["#F59E0B", "#FBBF24"],
  },
  1: {
    label: "Đã duyệt",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    icon: "checkmark-circle-outline",
    gradient: ["#10B981", "#34D399"],
  },
  2: {
    label: "Từ chối",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    icon: "close-circle-outline",
    gradient: ["#EF4444", "#F87171"],
  },
  3: {
    label: "Hoàn thành",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    icon: "checkmark-circle-outline",
    gradient: ["#10B981", "#34D399"],
  },
};

const DEFAULT_STATUS_STYLE = {
  label: "Chờ duyệt",
  color: "#F59E0B",
  bgColor: "rgba(245, 158, 11, 0.1)",
  icon: "time-outline",
  gradient: ["#F59E0B", "#FBBF24"],
};

// Memoized helper function
const getStatusStyle = (status) => STATUS_STYLES[status] || DEFAULT_STATUS_STYLE;

// Optimized StatusBadge component
const StatusBadge = React.memo(({ status }) => {
  const statusStyle = getStatusStyle(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bgColor }]}>
      <Ionicons name={statusStyle.icon} size={adjust(14)} color={statusStyle.color} />
      <Text style={[styles.statusText, { color: statusStyle.color }]}>{statusStyle.label}</Text>
    </View>
  );
});

// Optimized ActionButton component
const ActionButton = React.memo(({ title, icon, onPress, color = COLORS.color_primary }) => (
  <TouchableOpacity style={[styles.actionButton, { borderColor: color, backgroundColor: `${color}15` }]} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={adjust(18)} color={color} />
    <Text style={[styles.actionButtonText, { color }]}>{title}</Text>
  </TouchableOpacity>
));

// Optimized DatePickerButton component
const DatePickerButton = React.memo(({ label, date, onPress }) => (
  <TouchableOpacity style={styles.datePickerButton} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.datePickerLabel}>{label}</Text>
    <View style={styles.datePickerValue}>
      <Ionicons name="calendar-outline" size={adjust(16)} color={COLORS.color_primary} />
      <Text style={styles.datePickerText}>{date ? moment(date).format("DD/MM/YYYY") : "Chọn ngày"}</Text>
    </View>
  </TouchableOpacity>
));

// Optimized EmptyState component
const EmptyState = React.memo(({ fadeAnim }) => (
  <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
    <Ionicons name="document-outline" size={80} color="#94A3B8" />
    <Text style={styles.emptyTitle}>Không có dữ liệu</Text>
    <Text style={styles.emptySubtitle}>Thử thay đổi bộ lọc hoặc kéo xuống để làm mới</Text>
  </Animated.View>
));

const getLoaiText = (loai) => {
  switch (loai) {
    case 1:
      return "Trong ngày";
    case 2:
      return "Dài hạn";
    default:
      return "Không rõ";
  }
};
const ListDKTC = ({ navigation, route }) => {
  const { authToken, user } = useSelector((state) => state.authReducer);
  const { setIsLoading, setColorLoading } = route.params;

  // Animation refs - optimized
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;

  // Optimized initial state
  const defaultFilters = useMemo(
    () => ({
      name: "",
      status: "all",
      startDate: moment().startOf("month").toDate(),
      endDate: moment().toDate(),
    }),
    []
  );
  const [filters, setFilters] = useState(defaultFilters);

  const [data, setData] = useState([]);
  const [linkQR, setLinkQR] = useState("");
  const [user_phe_duyet, setUserPheDuyet] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [savingPhanQuyen, setSavingPhanQuyen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const [error, setError] = useState(null);
  const [datePickerMode, setDatePickerMode] = useState(null);
  const [modals, setModals] = useState({
    showQR: false,
    showNoiQuy: false,
    showPhanQuyen: false,
  });

  const isRole = `${user?.ent_chucvu?.Role}` === `1` || `${user?.ent_chucvu?.Role}` === `10` || `${user?.ent_chucvu?.Role}` === `5`;

  // Optimized animation effect
  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);
    animation.start();

    return () => animation.stop();
  }, []);

  // Optimized fetch function
  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        if (!authToken) {
          setData([]);
          return;
        }

        const params = {
          ...filters,
          fromDate: filters.startDate ? moment(filters.startDate).format("YYYY-MM-DD") : undefined,
          toDate: filters.endDate ? moment(filters.endDate).format("YYYY-MM-DD") : undefined,
        };

        const res = await getDangKyThiCong(params, authToken);
        const responseData = res?.data?.data.data || [];
        setData(Array.isArray(responseData) ? responseData : []);
        setLinkQR(res?.data?.data?.duan?.link_dk_nha_thau || "");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        setData([]);

        if (!isRefresh) {
          Alert.alert("Lỗi", "Không thể tải dữ liệu. Vui lòng thử lại.", [{ text: "OK" }]);
        }
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [filters, authToken, setIsLoading]
  );

  const getUserPheDuyet = useCallback(async () => {
    const res = await getUser(authToken);
    setUserPheDuyet(res?.data?.data || []);
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      getUserPheDuyet();
    }, [fetchData, getUserPheDuyet])
  );

  // Khi mở modal phân quyền, khởi tạo checkedUsers
  useEffect(() => {
    if (modals.showPhanQuyen && Array.isArray(user_phe_duyet)) {
      setCheckedUsers(user_phe_duyet.filter((u) => u.isRegistered).map((u) => u.userName));
    }
  }, [modals.showPhanQuyen, user_phe_duyet]);

  const handleToggleUser = (userName) => {
    setCheckedUsers((prev) => (prev.includes(userName) ? prev.filter((u) => u !== userName) : [...prev, userName]));
  };

  const handleSavePhanQuyen = async () => {
    setSavingPhanQuyen(true);
    try {
      const res = await updatePhanQuyen({ arrUserName: checkedUsers }, authToken);
      Alert.alert("Thành công", res.data.message);
      setModals((prev) => ({ ...prev, showPhanQuyen: false }));
      getUserPheDuyet();
    } catch (err) {
      Alert.alert("Lỗi", err.response.data.message);
    } finally {
      setSavingPhanQuyen(false);
    }
  };

  // Hàm cập nhật nhanh trạng thái Hoàn thành
  const handleQuickComplete = async (item) => {
    Alert.alert("Xác nhận", `Bạn có chắc muốn chuyển hồ sơ này sang trạng thái 'Hoàn thành'?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Hoàn thành",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            await updateDangKyThiCongStatus(item.id_dang_ky_tc, { tinh_trang_pd: 3 }, authToken);
            fetchData();
            Alert.alert("Thành công", "Đã chuyển sang trạng thái Hoàn thành!");
          } catch (e) {
            Alert.alert("Lỗi", e?.response?.data?.message || "Không thể cập nhật trạng thái!");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  // Optimized filtered data
  const dataFiltered = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.filter((item) => {
      if (!item) return false;

      // Name filter
      if (filters.name && !item.ten_ho_so_dk?.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && String(item.tinh_trang_pd) !== filters.status) {
        return false;
      }

      return true;
    });
  }, [data, filters.name, filters.status]);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Optimized handlers with single useMemo
  const handlers = useMemo(
    () => ({
      // Modal handlers
      openQR: () => setModals((prev) => ({ ...prev, showQR: true })),
      closeQR: () => setModals((prev) => ({ ...prev, showQR: false })),
      openNoiQuy: () => setModals((prev) => ({ ...prev, showNoiQuy: true })),
      closeNoiQuy: () => setModals((prev) => ({ ...prev, showNoiQuy: false })),
      openPhanQuyen: () => setModals((prev) => ({ ...prev, showPhanQuyen: true })),
      closePhanQuyen: () => setModals((prev) => ({ ...prev, showPhanQuyen: false })),

      // Date picker handlers
      openStartDate: () => setDatePickerMode("start"),
      openEndDate: () => setDatePickerMode("end"),
      closeDatePicker: () => setDatePickerMode(null),
      confirmDate: (date) => {
        if (datePickerMode === "start") {
          setFilters((f) => ({ ...f, startDate: date }));
        } else if (datePickerMode === "end") {
          setFilters((f) => ({ ...f, endDate: date }));
        }
        setDatePickerMode(null);
      },

      // Filter handlers
      setName: (name) => setFilters((f) => ({ ...f, name })),
      clearName: () => setFilters((f) => ({ ...f, name: "" })),
      setStatus: (status) => {
        if (status === "all") {
          setFilters(defaultFilters);
        } else {
          setFilters((f) => ({ ...f, status }));
        }
      },
    }),
    [datePickerMode, defaultFilters]
  );

  // Optimized renderItem
  const renderItem = useCallback(
    ({ item, index }) => {
      if (!item) return null;

      const statusStyle = getStatusStyle(item.tinh_trang_pd);

      return (
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChiTietDKTC", { headerTitle: item.ten_ho_so_dk, id: item.id_dang_ky_tc })}
            activeOpacity={0.7}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.ten_ho_so_dk || "Không có tên"}
                </Text>
                <StatusBadge status={item.tinh_trang_pd} />
              </View>
            </View>

            {/* Card Body */}
            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <Ionicons name="document-text-outline" size={18} color="#64748B" />
                <Text style={styles.infoText}>Loại: {getLoaiText(item.loai)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="home-outline" size={18} color="#64748B" />
                <Text style={styles.infoText}>
                  Căn hộ: {item?.ent_toanha.Toanha} {item?.nt_canho.ma_can_ho}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={18} color="#64748B" />
                <Text style={styles.infoText}>
                  Chủ hộ/Phụ trách VP: {item.ten_chu_ho || "Không rõ"} {"\n"}
                  SĐT: {item.sdt_chu_ho || "Không rõ"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={18} color="#64748B" />
                <Text style={styles.infoText}>
                  Nhà thầu: {item?.nt_list?.ten_nt || "Không rõ"} {"\n"}
                  MST/CCCD/SĐT: {item?.nt_list?.mst_cccd_sdt || "Không rõ"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color="#64748B" />
                <Text style={styles.infoText}>
                  {item.tu_ngay ? moment(item.tu_ngay).format("DD/MM/YYYY") : "Không rõ ngày"} -
                  {item.den_ngay ? moment(item.den_ngay).format("DD/MM/YYYY") : "Không rõ ngày"}
                </Text>
              </View>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooterRow}>
              <TouchableOpacity style={styles.detailButtonV2} onPress={() => navigation.navigate("ChiTietDKTC", { data: item })} activeOpacity={0.85}>
                <Ionicons name="information-circle-outline" size={18} color="#6366F1" style={{ marginRight: 6 }} />
                <Text style={styles.detailButtonV2Text}>Chi tiết</Text>
              </TouchableOpacity>
              {/* Nút Hoàn thành nhanh */}
              {item.tinh_trang_pd == 1 && item.isChange == 1 && (
                <TouchableOpacity style={styles.quickDoneButton} onPress={() => handleQuickComplete(item)} activeOpacity={0.85}>
                  <Ionicons name="checkmark-done-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.quickDoneButtonText}>Hoàn thành</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [slideAnim, fadeAnim, navigation]
  );

  const keyExtractor = useCallback((item) => String(item?.id_dang_ky_tc || Math.random()), []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: adjust(200),
      offset: adjust(200) * index,
      index,
    }),
    []
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <ImageBackground
        source={require("../../../assets/bg_new.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.1)" translucent />

          {/* Header with semi-transparent overlay */}
          <Animated.View
            style={[
              styles.header,
              {
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm tên hồ sơ..."
                placeholderTextColor="#94A3B8"
                value={filters.name}
                onChangeText={handlers.setName}
                returnKeyType="search"
              />
              {filters.name.length > 0 && (
                <TouchableOpacity onPress={handlers.clearName} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>

            {/* Status Filter */}
            <View style={styles.statusFilterContainer}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusFilterButton,
                    {
                      backgroundColor: filters.status === option.value ? option.color : option.bgColor,
                      borderColor: option.color,
                    },
                  ]}
                  onPress={() => handlers.setStatus(option.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.statusFilterText, { color: filters.status === option.value ? "#FFFFFF" : option.color }]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date Filter */}
            <View style={styles.dateFilterContainer}>
              <DatePickerButton label="Từ ngày" date={filters.startDate} onPress={handlers.openStartDate} />
              <DatePickerButton label="Đến ngày" date={filters.endDate} onPress={handlers.openEndDate} />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              {/* <ActionButton title="Nội quy" icon="document-text-outline" onPress={handlers.openNoiQuy} color="#8B5CF6" /> */}
              <ActionButton title="QR Code" icon="qr-code-outline" onPress={handlers.openQR} color="#06B6D4" />
              {isRole && <ActionButton title="Phân quyền" icon="people-outline" onPress={handlers.openPhanQuyen} color="#F97316" />}
            </View>
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            <FlatList
              data={dataFiltered}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={() => <EmptyState fadeAnim={fadeAnim} />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  // colors={[COLORS.color_primary]}
                  colors={[COLORS.bg_button]}
                  tintColor={COLORS.bg_button}
                  progressBackgroundColor="#FFFFFF"
                />
              }
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
            />
          </View>

          {/* Date Picker Modal */}
          <DateTimePickerModal
            isVisible={!!datePickerMode}
            mode="date"
            date={datePickerMode === "start" ? filters.startDate : filters.endDate}
            onConfirm={handlers.confirmDate}
            onCancel={handlers.closeDatePicker}
            minimumDate={datePickerMode === "end" ? filters.startDate : undefined}
            maximumDate={undefined}
          />

          {/* Modals */}
          <CustomModal visible={modals.showQR} onClose={handlers.closeQR} title="QR Đăng ký thi công" icon="qr-code-outline">
            <View style={styles.modalPlaceholder}>
              {linkQR ? (
                <>
                  <QRCode value={linkQR} size={180} color="#222" backgroundColor="#fff" />
                  <Text
                    style={{
                      marginTop: 16,
                      fontSize: 13,
                      color: "#64748B",
                      textAlign: "center",
                      wordBreak: "break-all",
                    }}
                    numberOfLines={2}
                    ellipsizeMode="middle"
                  >
                    {linkQR}
                  </Text>
                </>
              ) : (
                <Text style={styles.modalPlaceholderText}>Không có link QR</Text>
              )}
            </View>
          </CustomModal>

          <CustomModal visible={modals.showPhanQuyen} onClose={handlers.closePhanQuyen} title="Phân quyền phê duyệt" icon="people-outline">
            <View style={{ marginTop: 8, minWidth: adjust(300), maxWidth: adjust(300) }}>
              {Array.isArray(user_phe_duyet) && user_phe_duyet.length > 0 ? (
                user_phe_duyet.map((u) => (
                  <View key={u.userName} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    <TouchableOpacity
                      onPress={() => handleToggleUser(u.userName)}
                      disabled={savingPhanQuyen}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        borderWidth: 1.5,
                        borderColor: "#06B6D4",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10,
                        backgroundColor: checkedUsers.includes(u.userName) ? "#06B6D4" : "#fff",
                      }}
                    >
                      {checkedUsers.includes(u.userName) && <Ionicons name="checkmark" size={18} color="#fff" />}
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, color: "#222" }}>{u.hoTen}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "#888", textAlign: "center", marginVertical: 16 }}>Không có dữ liệu user</Text>
              )}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 18 }}>
              <TouchableOpacity
                onPress={handlers.closePhanQuyen}
                disabled={savingPhanQuyen}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                  backgroundColor: "#F1F5F9",
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "#222", fontWeight: "600" }}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSavePhanQuyen}
                disabled={savingPhanQuyen}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                  backgroundColor: "#06B6D4",
                }}
              >
                {savingPhanQuyen ? <ActivityIndicator size={18} color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "600" }}>Lưu</Text>}
              </TouchableOpacity>
            </View>
          </CustomModal>
        </SafeAreaView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  backgroundImageStyle: {
    opacity: 0.8,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 249, 250, 0.95)",
  },
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingBottom: adjust(16),
    marginHorizontal: adjust(12),
    marginTop: adjust(8),
    borderRadius: adjust(20),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: adjust(8),
    shadowOffset: { width: 0, height: adjust(4) },
    elevation: 6,
    backdropFilter: "blur(10px)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: adjust(16),
    marginHorizontal: adjust(16),
    marginTop: adjust(16),
    paddingHorizontal: adjust(16),
    height: adjust(50),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: {
    marginRight: adjust(12),
  },
  searchInput: {
    flex: 1,
    fontSize: adjust(16),
    color: "#1E293B",
    fontWeight: "400",
  },
  clearButton: {
    padding: adjust(6),
    borderRadius: adjust(12),
  },
  statusFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: adjust(16),
    marginTop: adjust(16),
    gap: adjust(8),
  },
  statusFilterButton: {
    flex: 1,
    paddingVertical: adjust(10),
    paddingHorizontal: adjust(12),
    borderRadius: adjust(24),
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  statusFilterText: {
    fontSize: adjust(13),
    fontWeight: "600",
  },
  dateFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: adjust(16),
    marginTop: adjust(16),
    gap: adjust(12),
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: adjust(16),
    padding: adjust(16),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  datePickerLabel: {
    fontSize: adjust(12),
    color: "#64748B",
    marginBottom: adjust(6),
    fontWeight: "500",
  },
  datePickerValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: adjust(6),
  },
  datePickerText: {
    fontSize: adjust(14),
    fontWeight: "600",
    color: "#1E293B",
  },
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: adjust(16),
    marginTop: adjust(16),
    gap: adjust(10),
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: adjust(12),
    borderRadius: adjust(16),
    borderWidth: 1.5,
    gap: adjust(6),
  },
  actionButtonText: {
    fontSize: adjust(12),
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingTop: adjust(12),
  },
  listContainer: {
    paddingHorizontal: adjust(12),
    paddingBottom: adjust(20),
  },
  itemSeparator: {
    height: adjust(12),
  },
  cardContainer: {
    marginBottom: adjust(4),
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: adjust(20),
    padding: adjust(20),
    marginHorizontal: adjust(4),
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: adjust(12),
    shadowOffset: { width: 0, height: adjust(4) },
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.5)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: adjust(16),
  },
  statusIndicator: {
    width: adjust(4),
    height: adjust(50),
    borderRadius: adjust(2),
    marginRight: adjust(16),
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    flex: 1,
    fontSize: adjust(16),
    fontWeight: "700",
    color: "#1E293B",
    lineHeight: adjust(24),
    marginRight: adjust(12),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: adjust(6),
    paddingHorizontal: adjust(10),
    borderRadius: adjust(16),
    gap: adjust(4),
  },
  statusText: {
    fontSize: adjust(11),
    fontWeight: "700",
  },
  cardBody: {
    marginBottom: adjust(20),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: adjust(5),
    gap: adjust(10),
  },
  infoText: {
    fontSize: adjust(14),
    color: "#64748B",
    flex: 1,
    fontWeight: "500",
    fontWeight: 'bold'
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.color_primary,
    paddingVertical: adjust(10),
    paddingHorizontal: adjust(20),
    borderRadius: adjust(24),
    gap: adjust(8),
    shadowColor: COLORS.color_primary,
    shadowOpacity: 0.3,
    shadowRadius: adjust(8),
    shadowOffset: { width: 0, height: adjust(4) },
    elevation: 4,
  },
  detailButtonText: {
    color: "#FFFFFF",
    fontSize: adjust(13),
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: adjust(100),
    paddingHorizontal: adjust(20),
  },
  emptyTitle: {
    fontSize: adjust(20),
    fontWeight: "700",
    color: "#64748B",
    marginTop: adjust(20),
    marginBottom: adjust(8),
  },
  emptySubtitle: {
    fontSize: adjust(14),
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: adjust(22),
  },
  modalPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: adjust(50),
  },
  modalPlaceholderText: {
    fontSize: adjust(14),
    color: "#000000",
    textAlign: "center",
    marginTop: adjust(16),
    lineHeight: adjust,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: adjust(10),
    marginTop: adjust(8),
  },
  detailButtonV2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: adjust(24),
    paddingVertical: adjust(10),
    paddingHorizontal: adjust(20),
    borderWidth: 1.5,
    borderColor: "#6366F1",
    shadowColor: "#6366F1",
    shadowOpacity: 0.08,
    shadowRadius: adjust(8),
    shadowOffset: { width: 0, height: adjust(2) },
    elevation: 2,
  },
  detailButtonV2Text: {
    color: "#6366F1",
    fontSize: adjust(13),
    fontWeight: "700",
  },
  quickDoneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    borderRadius: adjust(24),
    paddingVertical: adjust(10),
    paddingHorizontal: adjust(20),
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.15,
    shadowRadius: adjust(8),
    shadowOffset: { width: 0, height: adjust(2) },
    elevation: 2,
  },
  quickDoneButtonText: {
    color: "#fff",
    fontSize: adjust(13),
    fontWeight: "700",
  },
});

export default ListDKTC;
