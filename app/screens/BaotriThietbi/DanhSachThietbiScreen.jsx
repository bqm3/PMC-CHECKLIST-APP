import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { bt_thietbi_da_API, nhomtbAPI, thietbiAPI, tansuatAPI, hanhdongAPI } from "./api";
import { debounce } from "lodash";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";

const DanhSachThietbiScreen = ({ navigation }) => {
  const { authToken } = useSelector((state) => state.authReducer);
  const [loading, setLoading] = useState(false);
  const [dataThietBi, setDataThietBi] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState([]);

  // Filter and Master data states
  const [filterNhomTB, setFilterNhomTB] = useState(null);
  const [filterDmthietbi, setFilterDmthietbi] = useState(null);
  const [nhomtbOptions, setNhomtbOptions] = useState([]);
  const [dmthietbiOptions, setDmthietbiOptions] = useState([]);
  const [tansuatList, setTansuatList] = useState([]);
  const [hanhdongList, setHanhdongList] = useState([]);

  useEffect(() => {
    fetchOptions();
    fetchData(); // Initial internal fetch
  }, []);

  const fetchOptions = async () => {
    try {
      const [nhomRes, dmRes, tsRes, hdRes] = await Promise.all([
        nhomtbAPI.getList(authToken),
        thietbiAPI.getList(authToken),
        tansuatAPI.getList(authToken),
        hanhdongAPI.getList(authToken)
      ]);

      const nhomData = (nhomRes.data.data || []).map((item) => ({
        label: item.ten_nhomtb,
        value: item.id_nhomtb,
      }));

      const dmData = (dmRes.data.data || []).map((item) => ({
        label: item.ten_thietbi,
        value: item.id_dmthietbi,
        id_nhomtb: item.id_nhomtb,
      }));

      setNhomtbOptions([{ label: "Tất cả nhóm", value: null }, ...nhomData]);
      setDmthietbiOptions([{ label: "Tất cả thiết bị", value: null }, ...dmData]);
      setTansuatList(tsRes.data || []);
      setHanhdongList(hdRes.data || []);
    } catch (error) {
      console.error("Lỗi khi tải options:", error);
    }
  };

  const filteredDmOptions = useMemo(() => {
    if (!filterNhomTB) return dmthietbiOptions;
    return [{ label: "Tất cả thiết bị", value: null }, ...dmthietbiOptions.filter((i) => i.id_nhomtb === filterNhomTB && i.value !== null)];
  }, [filterNhomTB, dmthietbiOptions]);

  const fetchData = async (search = searchQuery, id_nhomtb = filterNhomTB, id_dmthietbi = filterDmthietbi) => {
    try {
      setLoading(true);
      const response = await bt_thietbi_da_API.getAll(authToken, search, id_nhomtb, id_dmthietbi);
      const data = response.data.data || [];
      setDataThietBi(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thiết bị:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useCallback(
    debounce((query, nhomId, dmId) => fetchData(query, nhomId, dmId), 500),
    [authToken],
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedFetchData(text, filterNhomTB, filterDmthietbi);
  };

  const handleChangeNhomTB = (item) => {
    setFilterNhomTB(item.value);
    setFilterDmthietbi(null); 
    fetchData(searchQuery, item.value, null);
  };

  const handleChangeDmThietbi = (item) => {
    setFilterDmthietbi(item.value);
    fetchData(searchQuery, filterNhomTB, item.value);
  };

  const toggleExpand = (id) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((i) => i !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  // Helper to get action names
  const getHanhDongNames = (ids) => {
    if (!ids) return "";
    const idArray = ids.split(",").map(id => id.trim());
    return idArray
      .map(id => {
        const hd = hanhdongList.find(h => String(h.id_dmhanhdong) === id);
        return hd ? hd.ten_hanh_dong : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  // Helper to get frequency name
  const getTanSuatName = (id) => {
    const ts = tansuatList.find(t => t.id_dmtansuat === id);
    return ts ? ts.ten_tan_suat : "---";
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedItems.includes(item.id_thietbida);
    const groups = item.bt_nhomhm_tbi_da || [];
    const groupName = item.bt_dmthietbi?.bt_dmnhomtb?.ten_nhomtb || "Chưa phân nhóm";
    const today = moment().format("YYYY-MM-DD");
    let hasTaskToday = false;

    groups.forEach((group) => {
      group.bt_thietbi_thietlap?.forEach((task) => {
        if (task.ngay_du_kien_tiep_theo === today) hasTaskToday = true;
      });
    });

    return (
      <View style={styles.thietBiItem}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => toggleExpand(item.id_thietbida)} style={styles.mainContent}>
          <View style={styles.thietBiHeaderInner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.thietBiText}>{item.ten_thietbi_da}</Text>
              {hasTaskToday && (
                <View style={styles.todayWarning}>
                  <Ionicons name="alert-circle" size={adjust(12)} color="#d97706" />
                  <Text style={styles.todayWarningText}>Có HM bảo trì hôm nay</Text>
                </View>
              )}
            </View>
            {item.bt_dmthietbi?.ma_thietbi && (
              <Text style={styles.thietBiCode}>
                {item.bt_dmthietbi.ten_thietbi}
                {"\n"}
                {item.bt_dmthietbi.ma_thietbi}
              </Text>
            )}
          </View>

          <View style={styles.tagContainer}>
            <View style={styles.groupTag}>
              <Text style={styles.groupTagText}>{groupName}</Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: item.trang_thai === "active" ? "#dcfce7" : "#fee2e2" }]}>
              <Text style={[styles.statusTagText, { color: item.trang_thai === "active" ? "#166534" : "#991b1b" }]}>
                {item.trang_thai === "active" ? "Hoạt động" : "Ngưng dùng"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={adjust(14)} color="#6b7280" />
            <Text style={styles.detailText} numberOfLines={1}>
              Vị trí: {item.vi_tri_lap_dat || "---"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="barcode-scan" size={adjust(14)} color="#6b7280" />
            <Text style={styles.detailText} numberOfLines={1}>
              S/N: {item.serial_number || "---"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={adjust(14)} color="#9ca3af" />
            <Text style={styles.detailText} numberOfLines={1}>
              Ngày lắp đặt: {item.ngay_lap_dat || "---"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={adjust(14)} color="#9ca3af" />
            <Text style={styles.detailText} numberOfLines={1}>
              Ngày nhập hệ thống: {item.created_at ? moment(item.created_at).format("DD/MM/YYYY") : "---"}
            </Text>
          </View>

          <View style={styles.expandRow}>
            <Text style={styles.expandText}>
              {groups.length} nhóm hạng mục - {groups.reduce((acc, g) => acc + (g.bt_thietbi_thietlap?.length || 0), 0)} nhiệm vụ
            </Text>
            <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={adjust(18)} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Nhà sản xuất</Text>
                <Text style={styles.infoValue}>{item.nha_san_xuat || "---"}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Ngày lắp đặt</Text>
                <Text style={styles.infoValue}>{item.ngay_lap_dat || "---"}</Text>
              </View>
            </View>

            {groups.length > 0 && (
              <View style={styles.groupList}>
                <Text style={styles.sectionTitle}>Cấu trúc hạng mục bảo trì:</Text>
                {groups.map((group, gIdx) => (
                  <View key={gIdx} style={styles.groupInner}>
                    <View style={styles.groupHeader}>
                      <View style={styles.dot} />
                      <Text style={styles.groupHeaderTitle}>{group.ten_nhomhm}</Text>
                    </View>
                    {group.bt_thietbi_thietlap &&
                      group.bt_thietbi_thietlap.map((task, tIdx) => (
                        <View key={tIdx} style={styles.taskItem}>
                          <Text style={styles.taskHangmuc}>{task.hang_muc}</Text>
                          <Text style={styles.taskContent}>{task.noi_dung_cong_viec}</Text>
                          
                          <View style={styles.taskMetaRow}>
                            <View style={styles.metaBadge}>
                              <Ionicons name="repeat-outline" size={adjust(12)} color="#059669" />
                              <Text style={styles.metaBadgeText}>Tần suất: {getTanSuatName(task.id_dmtansuat)}</Text>
                            </View>
                          </View>

                          {task.id_dmhanhdong_list && (
                            <View style={styles.taskMetaRow}>
                                <View style={[styles.metaBadge, { backgroundColor: '#fdf2f8' }]}>
                                    <Ionicons name="flash-outline" size={adjust(12)} color="#db2777" />
                                    <Text style={[styles.metaBadgeText, { color: '#db2777' }]}>
                                        Hàng động: {getHanhDongNames(task.id_dmhanhdong_list)}
                                    </Text>
                                </View>
                            </View>
                          )}

                          <View style={styles.taskFooter}>
                            <Ionicons name="time-outline" size={adjust(12)} color="#2563eb" />
                            <Text style={styles.taskDate}>Dự kiến: {task.ngay_du_kien_tiep_theo}</Text>
                          </View>
                        </View>
                      ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="stretch" style={styles.background}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.filterSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={adjust(20)} color="#9ca3af" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm theo tên hoặc mã thiết bị..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
              {searchQuery !== "" && (
                <TouchableOpacity onPress={() => handleSearchChange("")}>
                  <Ionicons name="close-circle" size={adjust(20)} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.dropdownRow}>
              {/* <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={nhomtbOptions}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Chọn nhóm TB"
                searchPlaceholder="Tìm nhóm..."
                value={filterNhomTB}
                onChange={handleChangeNhomTB}
                renderLeftIcon={() => <Ionicons style={styles.icon} color="#9ca3af" name="layers-outline" size={18} />}
              /> */}
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={filteredDmOptions}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Chọn thiết bị"
                searchPlaceholder="Tìm thiết bị..."
                value={filterDmthietbi}
                onChange={handleChangeDmThietbi}
                renderLeftIcon={() => <Ionicons style={styles.icon} color="#9ca3af" name="construct-outline" size={18} />}
              />
            </View>
          </View>

          {loading && dataThietBi.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.bg_button} />
              <Text style={styles.loadingText}>Đang tải danh sách thiết bị...</Text>
            </View>
          ) : (
            <FlatList
              data={dataThietBi}
              renderItem={renderItem}
              keyExtractor={(item) => item.id_thietbida.toString()}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={() => (
                <View style={styles.listHeaderInner}>
                  <Text style={styles.resultCount}>Hiển thị {dataThietBi.length} thiết bị</Text>
                  {loading && <ActivityIndicator size="small" color={COLORS.bg_button} />}
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Ionicons name="cube-outline" size={adjust(50)} color="#d1d5db" />
                  <Text style={styles.emptyText}> {loading ? "Đang tìm kiếm..." : "Không tìm thấy thiết bị nào"}</Text>
                </View>
              )}
            />
          )}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterSection: {
    padding: adjust(12),
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: adjust(12),
    borderRadius: adjust(10),
    height: adjust(42),
    marginBottom: adjust(10),
  },
  searchIcon: {
    marginRight: adjust(10),
  },
  searchInput: {
    flex: 1,
    fontSize: adjust(14),
    color: "#111827",
  },
  dropdownRow: {
    flexDirection: "row",
    gap: adjust(10),
  },
  dropdown: {
    flex: 1,
    height: adjust(40),
    backgroundColor: "#f3f4f6",
    borderRadius: adjust(8),
    paddingHorizontal: adjust(8),
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: adjust(13),
    color: "#9ca3af",
  },
  selectedTextStyle: {
    fontSize: adjust(13),
    color: "#1f2937",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: adjust(13),
  },
  listContent: {
    paddingHorizontal: adjust(15),
    paddingBottom: adjust(20),
  },
  listHeaderInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: adjust(10),
  },
  resultCount: {
    fontSize: adjust(13),
    color: "#6b7280",
    fontStyle: "italic",
  },
  thietBiItem: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: adjust(15),
  },
  mainContent: {
    flex: 1,
  },
  thietBiHeaderInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  thietBiText: {
    fontSize: adjust(16),
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
    marginRight: adjust(10),
  },
  thietBiCode: {
    fontSize: adjust(11),
    color: "#4b5563",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: adjust(6),
    paddingVertical: adjust(2),
    borderRadius: adjust(4),
    fontWeight: "600",
    textAlign: "right",
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: adjust(8),
    marginBottom: adjust(10),
    gap: adjust(8),
  },
  todayWarning: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: adjust(2),
  },
  todayWarningText: {
    fontSize: adjust(11),
    color: "#d97706",
    marginLeft: adjust(4),
    fontWeight: "600",
  },
  groupTag: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: adjust(8),
    paddingVertical: adjust(3),
    borderRadius: adjust(6),
  },
  groupTagText: {
    fontSize: adjust(11),
    color: "#2563eb",
    fontWeight: "600",
  },
  statusTag: {
    paddingHorizontal: adjust(8),
    paddingVertical: adjust(3),
    borderRadius: adjust(6),
  },
  statusTagText: {
    fontSize: adjust(11),
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: adjust(4),
  },
  detailText: {
    fontSize: adjust(13),
    color: "#4b5563",
    marginLeft: adjust(8),
    flex: 1,
  },
  expandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: adjust(10),
    backgroundColor: "#f9fafb",
    padding: adjust(8),
    borderRadius: adjust(6),
  },
  expandText: {
    fontSize: adjust(12),
    color: "#6b7280",
    fontWeight: "500",
  },
  expandedContent: {
    marginTop: adjust(10),
    padding: adjust(10),
    backgroundColor: "#f8fafc",
    borderRadius: adjust(8),
  },
  infoGrid: {
    flexDirection: "row",
    marginBottom: adjust(15),
    gap: adjust(10),
  },
  infoBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: adjust(11),
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: adjust(2),
  },
  infoValue: {
    fontSize: adjust(13),
    color: "#374151",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: adjust(14),
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: adjust(10),
  },
  groupInner: {
    marginBottom: adjust(15),
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: adjust(8),
  },
  dot: {
    width: adjust(6),
    height: adjust(6),
    borderRadius: adjust(3),
    backgroundColor: "#3b82f6",
    marginRight: adjust(8),
  },
  groupHeaderTitle: {
    fontSize: adjust(13),
    fontWeight: "600",
    color: "#334155",
  },
  taskItem: {
    backgroundColor: "white",
    padding: adjust(10),
    borderRadius: adjust(6),
    marginLeft: adjust(14),
    marginBottom: adjust(8),
    borderLeftWidth: 2,
    borderLeftColor: "#e2e8f0",
  },
  taskHangmuc: {
    fontSize: adjust(13),
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: adjust(2),
  },
  taskContent: {
    fontSize: adjust(12),
    color: "#64748b",
    lineHeight: adjust(16),
    marginBottom: adjust(6),
  },
  taskMetaRow: {
    flexDirection: 'row',
    marginBottom: adjust(4),
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: adjust(8),
    paddingVertical: adjust(2),
    borderRadius: adjust(4),
  },
  metaBadgeText: {
    fontSize: adjust(11),
    color: '#059669',
    fontWeight: '600',
    marginLeft: adjust(4),
  },
  taskFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: adjust(4),
  },
  taskDate: {
    fontSize: adjust(11),
    color: "#2563eb",
    marginLeft: adjust(4),
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: adjust(10),
    color: "#6b7280",
    fontSize: adjust(14),
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: adjust(50),
  },
  emptyText: {
    marginTop: adjust(10),
    color: "#9ca3af",
    fontSize: adjust(15),
  },
});

export default DanhSachThietbiScreen;
