import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useSelector } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import { useDebounce } from "../../hooks/useDebounce";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { anCongCuAPI, fetchProjects } from "./api";
import { ReloadContext } from "../../context/ReloadContext";
import { CongCuFormModal } from "./cong_cu_form";

// Màu chủ đạo
const COLORS = {
  primary: "#1976d2",
  background: "#F5F7FA",
  cardBg: "#FFFFFF",
  textMain: "#1A1A1A",
  textSec: "#6E7A8A",
  border: "#E1E4E8",
};

const AN_CONGCU_SCREEN = ({ route, navigation }) => {
  const { reloadKey } = useContext(ReloadContext);
  const { user, authToken } = useSelector((state) => state.authReducer);
  const shouldFetchDuan = (user?.ent_chucvu?.Role === 10 || user?.ent_chucvu?.Role === 5) && !user?.ID_Duan;
  const [duanFromHook, setDuanFromHook] = useState([]);
  const [congCu, setCongCu] = useState([]);
  const [baoCaos, setBaoCaos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBaoCaoId, setSelectedBaoCaoId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
  });

  // Khởi tạo giá trị mặc định chắc chắn có date
  const [filters, setFilters] = useState({
    tu_ngay: moment().subtract(30, "days").format("YYYY-MM-DD"),
    den_ngay: moment().format("YYYY-MM-DD"),
    search: "",
    page: 1,
    limit: 10,
    id_du_an: "",
  });
  const debouncedSearch = useDebounce(filters.search, 1000);

  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);

  useEffect(() => {
    if (!authToken) return;

    const loadCongCu = async () => {
      try {
        const response = await anCongCuAPI.getAllCongCu(authToken);
        setCongCu(response || []);
      } catch (error) {
        console.error("Error loading cong cu:", error);
      }
    };

    loadCongCu();
  }, [authToken]);

  useEffect(() => {
    if (!shouldFetchDuan || !authToken) return;
    const loadProjects = async () => {
      try {
        const data = await fetchProjects(authToken);
        setDuanFromHook(data || []);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };

    loadProjects();
  }, [shouldFetchDuan, authToken]);

  const fetchBaoCaos = useCallback(
    async (page = 1, limit = 10) => {
      try {
        if (page === 1) setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          fromDate: filters.tu_ngay,
          toDate: filters.den_ngay,
        });

        // Thêm filter theo dự án nếu có
        if (filters.id_du_an) {
          params.append("id_du_an", filters.id_du_an);
        }

        // Thêm search vào API call (nếu backend hỗ trợ)
        if (debouncedSearch.trim()) {
          params.append("search", debouncedSearch.trim());
        }
        const response = await anCongCuAPI.getAllBC_CongCu(authToken, params);

        if (page === 1) {
          setBaoCaos(response.data || []);
        } else {
          setBaoCaos((prev) => [...prev, ...(response.data || [])]);
        }

        setPagination({
          currentPage: response.pagination?.currentPage || page,
          totalItems: response.pagination?.totalItems || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } catch (err) {
        if (page === 1) setBaoCaos([]);
        console.log("err", err);
        Alert.alert("Lỗi", err.response?.data?.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters.tu_ngay, filters.den_ngay, filters.id_du_an, filters.search, authToken, debouncedSearch]
  );

  useEffect(() => {
    fetchBaoCaos(filters.page, filters.limit);
  }, [fetchBaoCaos, filters.page, filters.limit, reloadKey]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // reset page về 1
    setFilters((prev) => ({ ...prev, page: 1 }));

    // 🔥 gọi API trực tiếp
    await fetchBaoCaos(1, filters.limit);
  }, [fetchBaoCaos, filters.limit]);

  const handleResetFilters = () => {
    setFilters({
      tu_ngay: moment().subtract(30, "days").format("YYYY-MM-DD"),
      den_ngay: moment().format("YYYY-MM-DD"),
      search: "",
      page: 1,
      limit: 10,
      id_du_an: "",
    });
  };

  const handleViewDetail = (baoCao) => {
    setSelectedBaoCaoId(baoCao.id_bao_cao);
    setModalVisible(true);
  };

  const handleCreateNew = () => {
    setSelectedBaoCaoId(null);
    setModalVisible(true);
  };

  // Sửa lại handler cho đúng chuẩn thư viện Modal
  const onFromDateConfirm = (date) => {
    setShowFromDate(false);
    if (date) {
      setFilters((prev) => ({ ...prev, tu_ngay: moment(date).format("YYYY-MM-DD"), page: 1 }));
    }
  };

  const onToDateConfirm = (date) => {
    setShowToDate(false);
    if (date) {
      setFilters((prev) => ({ ...prev, den_ngay: moment(date).format("YYYY-MM-DD"), page: 1 }));
    }
  };

  // Load more function
  const loadMore = () => {
    if (loading || refreshing) return;

    const nextPage = filters.page + 1;
    if (nextPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: nextPage }));
    }
  };

  // Debounce search (optional - nếu backend chưa hỗ trợ search)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [debouncedSearch]);

  const renderBaoCaoItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleViewDetail(item)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.projectBadge}>
          <Text style={styles.projectBadgeText} numberOfLines={1}>
            🏢 {item.ent_duan?.Duan || "N/A"}
          </Text>
        </View>
        <Text style={styles.dateText}>{moment(item.ngay).format("DD/MM/YYYY")}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.trainerInfo}>
          <Text style={styles.trainerLabel}>Người báo cáo:</Text>
          <Text style={styles.trainerName} numberOfLines={1}>
            {item.ent_user?.UserName || "N/A"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <View style={styles.filterSection}>
        {/* Search Box */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm dự án, nội dung..."
            value={filters.search}
            onChangeText={(text) => setFilters((prev) => ({ ...prev, search: text }))}
            placeholderTextColor="#999"
          />
        </View>

        {/* Project Dropdown - Chỉ hiện khi có điều kiện */}
        {shouldFetchDuan && duanFromHook && duanFromHook.length > 0 && (
          <View style={styles.projectSelectorContainer}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              inputSearchStyle={styles.dropdownInputSearch}
              iconStyle={styles.dropdownIcon}
              containerStyle={styles.dropdownContainer}
              data={[
                { label: "Tất cả dự án", value: "" },
                ...duanFromHook.map((duan) => ({
                  label: duan.Duan || "N/A",
                  value: duan.ID_Duan?.toString() || "",
                })),
              ]}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="🏢 Chọn dự án"
              searchPlaceholder="Tìm kiếm dự án..."
              value={filters.id_du_an}
              onChange={(item) => {
                setFilters((prev) => ({
                  ...prev,
                  id_du_an: item.value,
                  page: 1,
                }));
              }}
              renderLeftIcon={() => <Text style={styles.dropdownLeftIcon}>🏢</Text>}
              renderItem={(item) => (
                <View style={[styles.dropdownItem, item.value === filters.id_du_an && styles.dropdownItemSelected]}>
                  <Text style={[styles.dropdownItemText, item.value === filters.id_du_an && styles.dropdownItemTextSelected]}>{item.label}</Text>
                  {item.value === filters.id_du_an && <Text style={styles.dropdownItemCheck}>✓</Text>}
                </View>
              )}
            />
          </View>
        )}

        {/* Date Range Filter */}
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={handleResetFilters} style={styles.resetButton}>
            <Text style={styles.resetText}>🔄</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateChip} onPress={() => setShowFromDate(true)}>
            <Text style={styles.dateLabel}>Từ: </Text>
            <Text style={styles.dateValue}>{moment(filters.tu_ngay).format("DD/MM/YYYY")}</Text>
          </TouchableOpacity>

          <View style={styles.dateDivider} />

          <TouchableOpacity style={styles.dateChip} onPress={() => setShowToDate(true)}>
            <Text style={styles.dateLabel}>Đến: </Text>
            <Text style={styles.dateValue}>{moment(filters.den_ngay).format("DD/MM/YYYY")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listWrapper}>
        <View style={styles.resultBar}>
          <Text style={styles.resultText}>
            Tìm thấy {pagination.totalItems} kết quả
            {pagination.totalPages > 1 && ` (Trang ${pagination.currentPage}/${pagination.totalPages})`}
          </Text>
        </View>

        {loading && filters.page === 1 ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 10, color: COLORS.textSec }}>Đang tải dữ liệu...</Text>
          </View>
        ) : (
          <FlatList
            data={baoCaos}
            renderItem={renderBaoCaoItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loading && filters.page > 1 ? (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
                </View>
              ) : pagination.currentPage >= pagination.totalPages && baoCaos.length > 0 ? (
                <View style={styles.endOfList}>
                  <Text style={styles.endOfListText}>Đã hiển thị hết dữ liệu</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyState}>
                  <Text style={{ fontSize: 40 }}>📂</Text>
                  <Text style={styles.emptyText}>Không có dữ liệu</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleCreateNew} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showFromDate}
        mode="date"
        locale="vi_VN"
        date={filters.tu_ngay ? moment(filters.tu_ngay).toDate() : new Date()}
        onConfirm={onFromDateConfirm}
        onCancel={() => setShowFromDate(false)}
        maximumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={showToDate}
        mode="date"
        locale="vi_VN"
        date={filters.den_ngay ? moment(filters.den_ngay).toDate() : new Date()}
        onConfirm={onToDateConfirm}
        onCancel={() => setShowToDate(false)}
        maximumDate={new Date()}
      />

      <CongCuFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedBaoCaoId(null);
        }}
        baoCaoId={selectedBaoCaoId}
        congCuResponse={congCu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterSection: {
    backgroundColor: "#fff",
    padding: 12,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textMain,
    height: "100%",
  },
  // Project Selector / Dropdown Styles
  projectSelectorContainer: {
    marginBottom: 12,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1E4E8",
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 44,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  dropdownSelectedText: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: "500",
    marginLeft: 8,
  },
  dropdownInputSearch: {
    height: 40,
    fontSize: 14,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderColor: COLORS.border,
    color: COLORS.textMain,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.textSec,
  },
  dropdownLeftIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dropdownContainer: {
    borderRadius: 10,
    borderColor: COLORS.border,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  dropdownItemSelected: {
    backgroundColor: "#E6F7FF",
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMain,
  },
  dropdownItemTextSelected: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  dropdownItemCheck: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: 8,
  },
  // Date Row Styles
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resetButton: {
    padding: 8,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    marginRight: 8,
  },
  resetText: {
    fontSize: 16,
  },
  dateChip: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#E6F7FF",
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BAE7FF",
  },
  dateDivider: {
    width: 8,
  },
  dateLabel: {
    fontSize: 13,
    color: COLORS.textSec,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
    marginLeft: 4,
  },
  listWrapper: {
    flex: 1,
  },
  resultBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultText: {
    fontSize: 12,
    color: COLORS.textSec,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  projectBadge: {
    backgroundColor: "#E6FFFB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  projectBadgeText: {
    color: "#006D75",
    fontWeight: "600",
    fontSize: 13,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  cardBody: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  contentText: {
    fontSize: 14,
    color: COLORS.textMain,
    lineHeight: 20,
    marginBottom: 2,
  },
  naText: {
    fontStyle: "italic",
    color: "#ccc",
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 10,
  },
  trainerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  trainerLabel: {
    fontSize: 12,
    color: "#888",
    marginRight: 4,
  },
  trainerName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  securityCount: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    lineHeight: 34,
  },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    color: COLORS.textSec,
    fontSize: 16,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textSec,
  },
  endOfList: {
    paddingVertical: 20,
    alignItems: "center",
  },
  endOfListText: {
    fontSize: 12,
    color: COLORS.textSec,
    fontStyle: "italic",
  },
});

export default AN_CONGCU_SCREEN;
