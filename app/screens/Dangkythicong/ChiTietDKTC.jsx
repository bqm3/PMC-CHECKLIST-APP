import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TextInput, TouchableOpacity, Dimensions, StatusBar } from "react-native";
import { getDangKyThiCongDetail, updateDangKyThiCongStatus } from "./api";
import { useSelector } from "react-redux";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const ChiTietDKTC = ({ route, navigation }) => {
  const { id } = route.params || {};
  const { authToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getDangKyThiCongDetail(id, authToken);
        setData(response.data.data);
      } catch (e) {
        setError("Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, authToken]);

  useEffect(() => {
    if (data) {
      setNewStatus(data.tinh_trang_pd ?? 0);
      setLyDoTuChoi(data.ly_do_tc || "");
    }
  }, [data]);

  // Trạng thái khả dụng
  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 0:
        return [
          { value: 0, label: "Chờ duyệt", color: "#F59E0B", icon: "hourglass-empty" },
          { value: 1, label: "Đã duyệt", color: "#10B981", icon: "check-circle" },
          { value: 2, label: "Từ chối", color: "#EF4444", icon: "cancel" },
        ];
      case 1:
        return [
          { value: 1, label: "Đã duyệt", color: "#10B981", icon: "check-circle" },
          { value: 3, label: "Hoàn thành", color: "#8B5CF6", icon: "done-all" },
        ];
      case 2:
        return [{ value: 2, label: "Từ chối", color: "#EF4444", icon: "cancel" }];
      case 3:
        return [{ value: 3, label: "Hoàn thành", color: "#8B5CF6", icon: "done-all" }];
      default:
        return [
          { value: 0, label: "Chờ duyệt", color: "#F59E0B", icon: "hourglass-empty" },
          { value: 1, label: "Đã duyệt", color: "#10B981", icon: "check-circle" },
          { value: 2, label: "Từ chối", color: "#EF4444", icon: "cancel" },
        ];
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      0: { label: "Chờ duyệt", color: "#F59E0B", icon: "hourglass-empty", bg: "#FEF3C7" },
      1: { label: "Đã duyệt", color: "#10B981", icon: "check-circle", bg: "#D1FAE5" },
      2: { label: "Từ chối", color: "#EF4444", icon: "cancel", bg: "#FEE2E2" },
      3: { label: "Hoàn thành", color: "#8B5CF6", icon: "done-all", bg: "#EDE9FE" },
    };
    return statusMap[status] || statusMap[0];
  };

  const canUpdateStatus = (currentStatus) => currentStatus !== 2 && currentStatus !== 3;

  const handleUpdateStatus = async () => {
    if (!data) return;
    if (newStatus === 2 && !lyDoTuChoi.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do từ chối!");
      return;
    }

    const currentStatus = data.tinh_trang_pd ?? 0;
    if (newStatus === 3 && currentStatus !== 1) {
      Alert.alert("Lỗi", 'Chỉ có thể chuyển sang "Hoàn thành" khi đã ở trạng thái "Đã duyệt"');
      return;
    }
    if (currentStatus === 3 && newStatus !== 3) {
      Alert.alert("Lỗi", 'Không thể thay đổi trạng thái khi đã "Hoàn thành"');
      return;
    }
    if (currentStatus === 2 && newStatus !== 2) {
      Alert.alert("Lỗi", 'Không thể thay đổi trạng thái khi đã "Từ chối"');
      return;
    }

    setSaving(true);
    try {
      const updateData = { tinh_trang_pd: newStatus };
      if (newStatus === 2) updateData.ly_do_tc = lyDoTuChoi;
      const response = await updateDangKyThiCongStatus(data.id_dang_ky_tc, updateData, authToken);
      Alert.alert("Thành công", response.data.message, [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert("Lỗi", `${e.response.data.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) return null;

  const detailData = data;
  const currentStatusInfo = getStatusInfo(data.tinh_trang_pd ?? 0);

  return (
    <View style={styles.container}>
      {/* Status Badge */}
      <View style={[styles.statusContainer]}>
        {(data?.tinh_trang_pd == 2 || data?.tinh_trang_pd == 3 || data.isChange == 0) && (
          <View style={[styles.statusBadge, { backgroundColor: currentStatusInfo.bg, padding: 12, borderRadius: 8, marginBottom: 12 }]}>
            <View style={{ alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name={currentStatusInfo.icon} size={20} color={currentStatusInfo.color} style={{ marginRight: 8 }} />
                <Text style={[styles.statusText, { color: currentStatusInfo.color, fontWeight: "bold", fontSize: 16 }]}>
                  {currentStatusInfo.label}
                </Text>
              </View>

              {data?.tinh_trang_pd == 2 && data.ly_do_tc && (
                <Text
                  style={{
                    color: "#991B1B",
                    marginTop: 8,
                    fontSize: 14,
                    textAlign: "center",
                    fontStyle: "italic",
                    lineHeight: 20,
                  }}
                >
                  Lý do: {data.ly_do_tc}
                </Text>
              )}
            </View>
          </View>
        )}
        {/* Cập nhật trạng thái - GỘP VÀO ĐÂY */}
        {data && canUpdateStatus(data.tinh_trang_pd ?? 0) && data.isChange == 1 && (
          <View style={styles.statusUpdateBox}>
            <Text style={styles.selectLabel}>Chọn trạng thái mới:</Text>
            <SelectDropdown
              data={getAvailableStatuses(data.tinh_trang_pd ?? 0)}
              onSelect={(selectedItem) => setNewStatus(selectedItem.value)}
              defaultValue={getAvailableStatuses(data.tinh_trang_pd ?? 0).find((s) => s.value === newStatus)}
              buttonTextAfterSelection={(selectedItem) => selectedItem.label}
              rowTextForSelection={(item) => item.label}
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownButtonText}
              dropdownStyle={styles.dropdown}
              rowStyle={styles.dropdownRow}
              rowTextStyle={styles.dropdownRowText}
              disabled={saving}
              renderCustomizedRowChild={(item) => (
                <View style={styles.dropdownRowContent}>
                  <Icon name={item.icon} size={18} color={item.color} />
                  <Text style={[styles.dropdownRowText, { color: item.color }]}>{item.label}</Text>
                </View>
              )}
            />
            {newStatus === 2 && (
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Lý do từ chối:</Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Nhập lý do từ chối..."
                  value={lyDoTuChoi}
                  onChangeText={setLyDoTuChoi}
                  editable={!saving}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.updateButton,
                {
                  opacity: saving || newStatus === (data.tinh_trang_pd ?? 0) || (newStatus === 2 && !lyDoTuChoi.trim()) ? 0.5 : 1,
                  marginTop: 10,
                },
              ]}
              onPress={handleUpdateStatus}
              disabled={saving || newStatus === (data.tinh_trang_pd ?? 0) || (newStatus === 2 && !lyDoTuChoi.trim())}
            >
              {saving ? <ActivityIndicator color="#fff" size="small" /> : <Icon name="save" size={18} color="#fff" />}
              <Text style={styles.updateButtonText}>{saving ? "Đang cập nhật..." : "Cập nhật trạng thái"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Thông tin cơ bản */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="info" size={20} color="#6366F1" />
            <Text style={styles.cardTitle}>Thông tin cơ bản</Text>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Loại hình" value={detailData.loai === 1 ? "Trong ngày" : "Dài hạn"} icon="category" />
            <InfoRow label="Tên hồ sơ đăng ký" value={detailData.ten_ho_so_dk} icon="folder" />
            <InfoRow label="Tòa nhà" value={detailData.ent_toanha?.Toanha || ""} icon="business" />
            <InfoRow label="Căn hộ" value={detailData.nt_canho?.ma_can_ho || ""} icon="home" />
            <InfoRow label="Tên chủ hộ" value={detailData.ten_chu_ho} icon="person" />
            <InfoRow label="SĐT chủ hộ" value={detailData.sdt_chu_ho} icon="phone" />
            <InfoRow label="Tên nhà thầu" value={detailData?.nt_list?.ten_nt} icon="engineering" />
            <InfoRow label="MST/CCCD/SĐT nhà thầu" value={detailData?.nt_list?.mst_cccd_sdt} icon="badge" />
            <InfoRow label="Email người đăng ký" value={detailData.mail_nguoi_dk || "-"} icon="email" />
            <InfoRow label="Từ ngày" value={detailData.tu_ngay} icon="event" />
            <InfoRow label="Đến ngày" value={detailData.den_ngay} icon="event-available" />
            <InfoRow label="Ghi chú" value={detailData.ghi_chu || "-"} icon="note" />
          </View>
        </View>

        {/* Thông tin nhân sự */}
        {Array.isArray(detailData.nt_dangky_tcns) && detailData.nt_dangky_tcns.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="group" size={20} color="#6366F1" />
              <Text style={styles.cardTitle}>Thông tin nhân sự</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{detailData.nt_dangky_tcns.length}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {detailData.nt_dangky_tcns.map((item, idx) => (
                <View key={idx} style={styles.personCard}>
                  <View style={styles.personHeader}>
                    <Icon name="person" size={18} color="#6366F1" />
                    <Text style={styles.personName}>{item.ho_ten}</Text>
                  </View>
                  <InfoRow label="Giới tính" value={item.gioi_tinh} />
                  <InfoRow label="CCCD" value={item.cccd || (item.cccd_image ? "Có ảnh" : "-")} />
                  <InfoRow label="SĐT" value={item.so_dien_thoai || "-"} />
                  <InfoRow label="Địa chỉ" value={item.dia_chi || "-"} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Hạng mục thi công */}
        {Array.isArray(detailData.nt_dangky_tchm) && detailData.nt_dangky_tchm.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="construction" size={20} color="#6366F1" />
              <Text style={styles.cardTitle}>Hạng mục thi công</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{detailData.nt_dangky_tchm.length}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {detailData.nt_dangky_tchm.map((hm, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Icon name="check-circle-outline" size={16} color="#10B981" />
                  <Text style={styles.listItemText}>
                    {hm?.nt_hangmuc_sc?.hang_muc_sc}
                    {hm?.ghi_chu_khac ? `: ${hm.ghi_chu_khac}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tài liệu đính kèm */}
        {Array.isArray(detailData.nt_dangky_tctl) && detailData.nt_dangky_tctl.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="attach-file" size={20} color="#6366F1" />
              <Text style={styles.cardTitle}>Tài liệu đính kèm</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{detailData.nt_dangky_tctl.length}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {detailData.nt_dangky_tctl.map((tl, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Icon name="description" size={16} color="#8B5CF6" />
                  <Text style={styles.listItemText}>{tl.ten_tai_lieu || tl.nt_tailieu?.ten_tai_lieu || "Tài liệu"}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabel}>
      {icon && <Icon name={icon} size={14} color="#6B7280" style={styles.infoIcon} />}
      <Text style={styles.infoLabelText}>{label}:</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  statusContainer: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
    flex: 1,
  },
  badge: {
    backgroundColor: "#EDE9FE",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 140,
    marginRight: 12,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoLabelText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    textAlign: "right",
    fontWeight: "400",
  },
  personCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  personHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  personName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    lineHeight: 20,
  },
  currentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  currentStatusLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  currentStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  currentStatusText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    width: "100%",
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  dropdownButtonText: {
    textAlign: "left",
    color: "#374151",
    fontSize: 14,
  },
  dropdown: {
    borderRadius: 8,
    elevation: 4,
  },
  dropdownRow: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownRowContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownRowText: {
    fontSize: 14,
    marginLeft: 8,
  },
  reasonContainer: {
    marginBottom: 16,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#374151",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statusUpdateBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "stretch",
  },
});

export default ChiTietDKTC;
