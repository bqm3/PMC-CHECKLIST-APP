import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { bt_thongtinchung_API, bt_thietbi_da_API } from "./api";
import moment from "moment";
import { useLoading } from "../../context/LoadingContext";

const BaotriThietbiScreen = ({ navigation }) => {
  const { authToken } = useSelector((state) => state.authReducer);
  const { setIsLoading } = useLoading();
  const [dataPhieu, setDataPhieu] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dueDevicesCount, setDueDevicesCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resPhieu, resThietBi] = await Promise.all([
        bt_thongtinchung_API.getAll(authToken),
        bt_thietbi_da_API.getAll(authToken)
      ]);
      
      setDataPhieu(resPhieu.data.data || []);
      
      const devices = resThietBi.data.data || [];
      const todayStr = moment().format("YYYY-MM-DD");
      let count = 0;
      devices.forEach((device) => {
        let hasTaskToday = false;
        device.bt_nhomhm_tbi_da?.forEach((group) => {
          group.bt_thietbi_thietlap?.forEach((task) => {
            if (task.ngay_du_kien_tiep_theo === todayStr) {
                hasTaskToday = true;
            }
          });
        });
        if (hasTaskToday) count++;
      });
      setDueDevicesCount(count);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bảo trì:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const [resPhieu, resThietBi] = await Promise.all([
        bt_thongtinchung_API.getAll(authToken),
        bt_thietbi_da_API.getAll(authToken)
      ]);
      
      setDataPhieu(resPhieu.data.data || []);
      
      const devices = resThietBi.data.data || [];
      const todayStr = moment().format("YYYY-MM-DD");
      let count = 0;
      devices.forEach((device) => {
        let hasTaskToday = false;
        device.bt_nhomhm_tbi_da?.forEach((group) => {
          group.bt_thietbi_thietlap?.forEach((task) => {
            if (task.ngay_du_kien_tiep_theo === todayStr) {
                hasTaskToday = true;
            }
          });
        });
        if (hasTaskToday) count++;
      });
      setDueDevicesCount(count);
    } catch (error) {
      console.error("Lỗi khi refresh danh sách bảo trì:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredData = dataPhieu.filter((item) =>
    item.ten_phieu?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Hoàn thành":
        return { bg: "#dcfce7", text: "#166534" };
      case "Đang thực hiện":
        return { bg: "#fef9c3", text: "#854d0e" };
      default:
        return { bg: "#f3f4f6", text: "#4b5563" };
    }
  };

  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.trang_thai);
    
    return (
      <TouchableOpacity 
        style={styles.phieuItem}
        onPress={() => {
          navigation.navigate("chi_tiet_phieu_bt", { id: item.id_thongtinchung });
        }}
      >
        <View style={styles.phieuHeader}>
            <View style={{ flex: 1 }}>
                <Text style={styles.phieuName}>{item.ten_phieu}</Text>
                <Text style={styles.phieuDate}>Ngày bảo trì: {moment(item.ngay_bt).format("DD/MM/YYYY")}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {item.trang_thai || "Mới tạo"}
                </Text>
            </View>
        </View>

        <View style={styles.phieuFooter}>
            <View style={styles.metaInfo}>
                <Ionicons name="clipboard-outline" size={adjust(14)} color="#3b82f6" />
                <Text style={[styles.metaText, { color: "#3b82f6", fontWeight: "600" }]} numberOfLines={1}>
                    Tiến độ: {item.tong_da_xong || 0}/{item.tong_dau_viec || 0}
                </Text>
            </View>
            <View style={[styles.metaInfo, { justifyContent: "flex-end" }]}>
                 <Text style={styles.metaText}>Thiết bị: {item.tong_thiet_bi || 0}</Text>
            </View>
        </View>

        {item.ghi_chu ? (
            <View style={styles.noteBox}>
                <Text style={styles.noteText} numberOfLines={1}>Ghi chú: {item.ghi_chu}</Text>
            </View>
        ) : null}

        <View style={styles.creatorRow}>
            <View style={styles.metaInfo}>
                <MaterialCommunityIcons name="account-outline" size={adjust(12)} color="#94a3b8" />
                <Text style={styles.creatorTaskText} numberOfLines={1}>{item.ent_user?.UserName || "---"}</Text>
                <Ionicons name="time-outline" size={adjust(12)} color="#94a3b8" style={{ marginLeft: adjust(10) }} />
                <Text style={styles.creatorTaskText} numberOfLines={1}>{moment(item.created_at).format("HH:mm:ss DD/MM/YYYY")}</Text>
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/bg_new.png")}
      resizeMode="stretch"
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.card}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={adjust(20)} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm phiếu bảo trì..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {dueDevicesCount > 0 && (
                <TouchableOpacity 
                    style={styles.dueAlert}
                    onPress={() => navigation.navigate("tao_phieu_bt")}
                >
                    <View style={styles.dueAlertIcon}>
                        <Ionicons name="notifications" size={adjust(16)} color="white" />
                    </View>
                    <Text style={styles.dueAlertText}>
                        Hôm nay có <Text style={{ fontWeight: 'bold' }}>{dueDevicesCount}</Text> thiết bị cần được bảo trì
                    </Text>
                    <Ionicons name="chevron-forward" size={adjust(16)} color="#ef4444" />
                </TouchableOpacity>
            )}

            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => (item.id_thongtinchung || Math.random()).toString()}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.bg_button]} />
                }
                ListHeaderComponent={() => (
                    <View style={styles.listHeaderInner}>
                        <Text style={styles.resultCount}>Hiển thị {filteredData.length} phiếu bảo trì</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={adjust(50)} color="#d1d5db" />
                        <Text style={styles.emptyText}>Chưa có phiếu bảo trì nào</Text>
                    </View>
                )}
            />
        </View>

        {/* Floating Action Buttons Area */}
        <View style={styles.fabContainer}>
            {/* Nút Danh sách thiết bị */}
            <TouchableOpacity 
                style={[styles.fab, styles.fabSecondary]}
                onPress={() => navigation.navigate("ds_thiet_bi")}
            >
                <Ionicons name="cube-outline" size={adjust(24)} color="#2563eb" />
            </TouchableOpacity>

            {/* Nút Tạo phiếu bảo trì */}
            <TouchableOpacity 
                style={[styles.fab, styles.fabPrimary]}
                onPress={() => navigation.navigate("tao_phieu_bt")}
            >
                <Ionicons name="add" size={adjust(30)} color="white" />
            </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    padding: adjust(12),
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: adjust(12),
    overflow: "hidden",
    elevation: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    margin: adjust(12),
    paddingHorizontal: adjust(12),
    borderRadius: adjust(10),
    height: adjust(45),
  },
  searchIcon: {
    marginRight: adjust(10),
  },
  searchInput: {
    flex: 1,
    fontSize: adjust(15),
    color: "#111827",
  },
  listContent: {
    paddingHorizontal: adjust(15),
    paddingBottom: adjust(150),
  },
  listHeaderInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: adjust(10),
  },
  resultCount: {
    fontSize: adjust(13),
    color: "#6b7280",
    fontStyle: "italic",
  },
  phieuItem: {
    backgroundColor: "white",
    borderRadius: adjust(10),
    padding: adjust(15),
    marginBottom: adjust(12),
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  phieuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: adjust(10),
  },
  phieuName: {
    fontSize: adjust(16),
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: adjust(2),
  },
  phieuDate: {
    fontSize: adjust(13),
    color: "#6b7280",
  },
  statusBadge: {
    paddingHorizontal: adjust(8),
    paddingVertical: adjust(4),
    borderRadius: adjust(6),
  },
  statusText: {
    fontSize: adjust(11),
    fontWeight: "600",
  },
  phieuFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: adjust(10),
    gap: adjust(15),
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metaText: {
    fontSize: adjust(12),
    color: "#4b5563",
    marginLeft: adjust(5),
  },
  noteBox: {
    marginTop: adjust(8),
    backgroundColor: "#f9fafb",
    padding: adjust(6),
    borderRadius: adjust(4),
  },
  noteText: {
    fontSize: adjust(12),
    color: "#6b7280",
    fontStyle: "italic",
  },
  creatorRow: {
    marginTop: adjust(8),
    borderTopWidth: 1,
    borderTopColor: "#f8fafc",
    paddingTop: adjust(6),
  },
  creatorTaskText: {
    fontSize: adjust(11),
    color: "#94a3b8",
    marginLeft: adjust(4),
  },
  fabContainer: {
    position: "absolute",
    right: adjust(20),
    bottom: adjust(20),
    alignItems: "center",
    gap: adjust(15),
  },
  fab: {
    width: adjust(56),
    height: adjust(56),
    borderRadius: adjust(28),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabPrimary: {
    backgroundColor: COLORS.bg_button || "#3b82f6",
  },
  fabSecondary: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: adjust(60),
  },
  emptyText: {
    marginTop: adjust(10),
    color: "#9ca3af",
    fontSize: adjust(15),
  },
  dueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    marginHorizontal: adjust(12),
    marginBottom: adjust(12),
    padding: adjust(10),
    borderRadius: adjust(10),
    borderWidth: 1,
    borderColor: '#fee2e2',
    elevation: 1,
  },
  dueAlertIcon: {
    backgroundColor: '#ef4444',
    width: adjust(26),
    height: adjust(26),
    borderRadius: adjust(13),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: adjust(10),
  },
  dueAlertText: {
    flex: 1,
    fontSize: adjust(13),
    color: '#991b1b',
  },
});

export default BaotriThietbiScreen;
