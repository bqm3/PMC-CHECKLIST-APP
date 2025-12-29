import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import { anCongCuAPI } from "./api"; // Đảm bảo đường dẫn đúng
import { ReloadContext } from "../../context/ReloadContext"; // Đảm bảo đường dẫn đúng

const { width, height } = Dimensions.get("window");

// --- CONSTANTS & THEME ---
const COLORS = {
  primary: "#1976d2",
  primaryLight: "#e3f2fd",
  success: "#52c41a",
  warning: "#faad14",
  error: "#f5222d",
  background: "#F5F7FA",
  cardBg: "#FFFFFF",
  textMain: "#1F2937",
  textSec: "#6B7280",
  border: "#E5E7EB",
  inputBg: "#F9FAFB",
};

const ROLES = {
  ADMIN: 1,
  MANAGER: 10,
};

// --- SUB-COMPONENT: Item Công Cụ (Tối ưu Re-render) ---
const CongCuItem = React.memo(
  ({ item, index, editMode, isExpanded, onToggleExpand, onChangeData, onImageAction, onRemoveImage, congCuResponse, canEditRequestQty }) => {
    // Tính toán options tình trạng
    const tinhTrangOptions = useMemo(() => {
      const cc = congCuResponse?.find((c) => c.id_cong_cu === item.id_cong_cu);
      return cc?.tinh_trang?.map((t) => ({ label: t, value: t })) || [];
    }, [congCuResponse, item.id_cong_cu]);

    return (
      <View style={[styles.itemCard, isExpanded && styles.itemCardExpanded]}>
        {/* Header Item */}
        <TouchableOpacity style={styles.itemHeader} onPress={() => onToggleExpand(item.id_cong_cu)} activeOpacity={editMode ? 0.7 : 1}>
          <View style={styles.itemHeaderLeft}>
            <View style={styles.indexBadge}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.ten_cong_cu}</Text>
              <Text style={styles.itemUnit}>Đơn vị: {item.don_vi}</Text>
              {item.link_anh && <Text style={[styles.itemUnit, { color: "red" }]}>Hình ảnh: Có</Text>}
            </View>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {/* Body Item */}
        <View style={styles.itemBody}>
          <View style={styles.row}>
            {/* Số lượng Yêu cầu */}
            <View style={styles.col}>
              <Text style={styles.label}>SL Yêu cầu</Text>
              {editMode && canEditRequestQty ? (
                <TextInput
                  style={styles.input}
                  value={String(item.so_luong_yc)}
                  onChangeText={(t) => onChangeData(index, "so_luong_yc", parseInt(t) || 0)}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
              ) : (
                <View style={styles.readOnlyBox}>
                  <Text style={styles.value}>{item.so_luong_yc}</Text>
                </View>
              )}
            </View>

            {/* Số lượng Thực tế */}
            <View style={styles.col}>
              <Text style={styles.label}>SL Thực tế</Text>
              {editMode ? (
                <TextInput
                  style={[styles.input, { fontWeight: "bold", color: COLORS.primary }]}
                  value={String(item.so_luong_tt)}
                  onChangeText={(t) => onChangeData(index, "so_luong_tt", parseInt(t) || 0)}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
              ) : (
                <View style={styles.readOnlyBox}>
                  <Text style={[styles.value, { fontWeight: "bold" }]}>{item.so_luong_tt}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.fullRow}>
            <Text style={styles.label}>Tình trạng</Text>
            {editMode ? (
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                data={[{ label: "-- Chọn tình trạng --", value: "" }, ...tinhTrangOptions]}
                labelField="label"
                valueField="value"
                placeholder="Chọn tình trạng..."
                value={item.tinh_trang}
                onChange={(e) => onChangeData(index, "tinh_trang", e.value)}
              />
            ) : (
              <Text style={styles.value}>{item.tinh_trang || "—"}</Text>
            )}
          </View>

          <View style={styles.fullRow}>
            <Text style={styles.label}>Ghi chú</Text>
            {editMode ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={item.ghi_chu}
                onChangeText={(t) => onChangeData(index, "ghi_chu", t)}
                placeholder="Nhập ghi chú..."
                multiline
                numberOfLines={2}
              />
            ) : (
              <Text style={styles.valueNote}>{item.ghi_chu || "Không có ghi chú"}</Text>
            )}
          </View>
        </View>

        {/* Image Section (Expandable) */}
        {isExpanded && (
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>📸 Hình ảnh đính kèm</Text>

            {/* Hiển thị ảnh nếu có (cả view mode và edit mode) */}
            {item.imagePreview || item.link_anh ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: item.imagePreview || item.link_anh }} style={styles.imagePreview} resizeMode="cover" />
                {/* Nút xóa chỉ hiện ở edit mode */}
                {editMode && (
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => onRemoveImage(index)}>
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              /* Nút thêm ảnh chỉ hiện ở edit mode */
              editMode && (
                <View style={styles.imageActions}>
                  <TouchableOpacity style={styles.imageBtn} onPress={() => onImageAction(index, "camera")}>
                    <Text style={styles.imageBtnIcon}>📷</Text>
                    <Text style={styles.imageBtnText}>Chụp ảnh</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageBtn} onPress={() => onImageAction(index, "gallery")}>
                    <Text style={styles.imageBtnIcon}>🖼️</Text>
                    <Text style={styles.imageBtnText}>Thư viện</Text>
                  </TouchableOpacity>
                </View>
              )
            )}

            {/* Thông báo không có ảnh ở view mode */}
            {!editMode && !item.imagePreview && !item.link_anh && <Text style={styles.noImageText}>Không có hình ảnh</Text>}
          </View>
        )}
      </View>
    );
  }
);

// --- MAIN COMPONENT ---
export const CongCuFormModal = ({ visible, onClose, baoCaoId, congCuResponse }) => {
  const { reload } = useContext(ReloadContext);
  const { user, authToken } = useSelector((state) => state.authReducer);

  // State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [ngay, setNgay] = useState(moment().format("YYYY-MM-DD"));
  const [baoCaoDetail, setBaoCaoDetail] = useState(null);
  const [chiTietList, setChiTietList] = useState([]);
  const [originalChiTietList, setOriginalChiTietList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Derived Values
  const isCheckEditSoLuongYC = useMemo(() => user?.ent_chucvu?.Role === ROLES.MANAGER || user?.ent_chucvu?.Role === ROLES.ADMIN, [user]);

  const isToday = useMemo(() => moment(ngay).isSame(moment(), "day"), [ngay]);
  const isNewReport = useMemo(() => !baoCaoId, [baoCaoId]);

  // Map Data Helper
  const mapCongCuWithDetails = useCallback(
    (chiTiet = []) =>
      (congCuResponse || []).map((cc) => {
        const existingDetail = chiTiet.find((ct) => ct.id_cong_cu === cc.id_cong_cu);
        return {
          id_cong_cu: cc.id_cong_cu,
          ten_cong_cu: cc.ten_cong_cu,
          don_vi: cc.don_vi,
          so_luong_yc: existingDetail?.so_luong_yc || 0,
          so_luong_tt: existingDetail?.so_luong_tt || 0,
          tinh_trang: existingDetail?.tinh_trang || "",
          ghi_chu: existingDetail?.ghi_chu || "",
          link_anh: existingDetail?.link_anh || null,
          imageFile: null,
          imagePreview: existingDetail?.link_anh || null,
          is_delete_image: false,
        };
      }),
    [congCuResponse]
  );

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (isNewReport) {
        setNgay(moment().format("YYYY-MM-DD"));
        const soLuongYC = await anCongCuAPI.getLastestdayBC_CongCu(authToken);
        setChiTietList(mapCongCuWithDetails(soLuongYC));
        setEditMode(true);
      } else {
        const response = await anCongCuAPI.getBaoCaoDetail(authToken, baoCaoId);
        setBaoCaoDetail(response.data);
        setNgay(response.data.ngay);
        const mapped = mapCongCuWithDetails(response?.data?.chi_tiet);
        setChiTietList(mapped);
        setOriginalChiTietList(JSON.parse(JSON.stringify(mapped)));

        // Tự động bật edit nếu là báo cáo hôm nay
        if (moment(response.data.ngay).isSame(moment(), "day")) {
          setEditMode(true);
        } else {
          setEditMode(false);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu báo cáo.");
    } finally {
      setLoading(false);
    }
  }, [isNewReport, authToken, baoCaoId, mapCongCuWithDetails]);

  useEffect(() => {
    if (visible) fetchData();
    else {
      // Reset state khi đóng modal
      setChiTietList([]);
      setBaoCaoDetail(null);
      setExpandedId(null);
      setEditMode(false);
    }
  }, [visible, fetchData]);

  // Handlers
  const handleChiTietChange = useCallback((index, field, value) => {
    setChiTietList((prev) => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };
      return newList;
    });
  }, []);

  const handleImageAction = useCallback(async (index, type) => {
    try {
      let result;
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      };

      if (type === "camera") {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted) return Alert.alert("Quyền truy cập", "Cần cấp quyền camera.");
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setChiTietList((prev) => {
          const newList = [...prev];
          newList[index] = {
            ...newList[index],
            imageFile: asset,
            imagePreview: asset.uri,
            is_delete_image: false,
          };
          return newList;
        });
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể xử lý ảnh.");
    }
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setChiTietList((prev) => {
      const newList = [...prev];
      newList[index] = {
        ...newList[index],
        imageFile: null,
        imagePreview: null,
        link_anh: null,
        is_delete_image: true,
      };
      return newList;
    });
  }, []);

  const toggleRowExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const validItems = chiTietList.filter((item) => item.so_luong_yc > 0);
    if (validItems.length === 0) return Alert.alert("Thông báo", "Vui lòng nhập ít nhất một công cụ.");

    try {
      setSubmitting(true);
      const formData = new FormData();
      const detailsPayload = [];
      let fileCount = 0;

      validItems.forEach((item) => {
        const detail = {
          id_cong_cu: item.id_cong_cu,
          so_luong_yc: item.so_luong_yc,
          so_luong_tt: item.so_luong_tt,
          tinh_trang: item.tinh_trang,
          ghi_chu: item.ghi_chu,
          is_delete_image: item.is_delete_image,
        };

        if (item.imageFile) {
          const fileName = item.imageFile.uri.split("/").pop() || `img_${Date.now()}.jpg`;
          detail.originalname = fileName;
          detail.fileIndex = fileCount;
          formData.append("files", {
            uri: item.imageFile.uri,
            type: "image/jpeg",
            name: fileName,
          });
          fileCount++;
        } else if (item.link_anh) {
          detail.existingImage = item.link_anh;
        }
        detailsPayload.push(detail);
      });

      formData.append("details", JSON.stringify(detailsPayload));

      const apiCall = isNewReport ? anCongCuAPI.createBaoCao(authToken, formData) : anCongCuAPI.updateBaoCao(authToken, baoCaoId, formData);

      const res = await apiCall;
      Alert.alert("Thành công", res.message || "Lưu báo cáo thành công!");
      onClose();
      reload();
    } catch (error) {
      Alert.alert("Lỗi", error?.response?.data?.message || "Có lỗi xảy ra khi lưu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setChiTietList(JSON.parse(JSON.stringify(originalChiTietList)));
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <CongCuItem
        item={item}
        index={index}
        editMode={editMode}
        isExpanded={expandedId === item.id_cong_cu}
        onToggleExpand={toggleRowExpand}
        onChangeData={handleChiTietChange}
        onImageAction={handleImageAction}
        onRemoveImage={handleRemoveImage}
        congCuResponse={congCuResponse}
        canEditRequestQty={isCheckEditSoLuongYC}
      />
    ),
    [editMode, expandedId, handleChiTietChange, handleImageAction, handleRemoveImage, congCuResponse, isCheckEditSoLuongYC, toggleRowExpand]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true} // BẮT BUỘC: Để hiện nền mờ
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop: Bấm vùng tối để đóng modal */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* Modal Container: Chiếm 75% màn hình */}
        <View style={styles.modalContainer}>
          {/* Handle trang trí */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isNewReport ? `Tạo báo cáo mới ngày: ${moment().format("DD/MM/YYYY")}` : `Chi tiết báo cáo ngày: ${moment(ngay).format("DD/MM/YYYY")}`}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.headerCloseIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
          ) : (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
              <FlatList
                data={chiTietList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_cong_cu.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                removeClippedSubviews={true}
                ListHeaderComponent={
                  !isNewReport && baoCaoDetail ? (
                    <View style={styles.infoCard}>
                      <Text style={styles.infoTitle}>ℹ️ Thông tin chung</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Dự án:</Text>
                        <Text style={styles.infoValue}>{baoCaoDetail.ent_duan?.Duan}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Người tạo:</Text>
                        <Text style={styles.infoValue}>{baoCaoDetail.ent_user?.Hoten}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày:</Text>
                        <Text style={styles.infoValue}>{moment(ngay).format("DD/MM/YYYY")}</Text>
                      </View>
                    </View>
                  ) : null
                }
                ListFooterComponent={<View style={{ height: 100 }} />}
              />

              {/* Footer Buttons */}
              {editMode && isToday && (
                <View style={styles.footer}>
                  {!isNewReport && (
                    <TouchableOpacity style={[styles.footerBtn, styles.cancelBtn]} onPress={handleCancelEdit} disabled={submitting}>
                      <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={[styles.footerBtn, styles.submitBtn]} onPress={handleSubmit} disabled={submitting}>
                    {submitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitBtnText}>{isNewReport ? "Gửi báo cáo" : "Cập nhật"}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </KeyboardAvoidingView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // --- BOTTOM SHEET STYLES ---
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Màu nền tối mờ
    justifyContent: "flex-end", // Đẩy nội dung xuống đáy
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  modalContainer: {
    height: "75%", // Chiều cao chiếm khoảng 3/4 màn hình
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  dragHandleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
  },

  // --- HEADER & COMMON ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textMain,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCloseIcon: {
    fontSize: 16,
    color: COLORS.textSec,
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textSec,
  },
  listContent: {
    padding: 16,
  },

  // --- INFO CARD ---
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    width: 90,
    color: COLORS.textSec,
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    color: COLORS.textMain,
    fontWeight: "500",
    fontSize: 14,
  },

  // --- ITEM CARD ---
  itemCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  itemCardExpanded: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },
  itemHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  indexText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textMain,
  },
  itemUnit: {
    fontSize: 12,
    color: COLORS.textSec,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 14,
    color: COLORS.textSec,
    paddingHorizontal: 8,
  },
  itemBody: {
    padding: 12,
    backgroundColor: "#FAFAFA",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  fullRow: {
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSec,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textMain,
  },
  readOnlyBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  value: {
    fontSize: 14,
    color: COLORS.textMain,
  },
  valueNote: {
    fontSize: 14,
    color: COLORS.textSec,
    fontStyle: "italic",
  },
  dropdown: {
    height: 44,
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  dropdownPlaceholder: { color: COLORS.textSec, fontSize: 14 },
  dropdownSelectedText: { color: COLORS.textMain, fontSize: 14 },

  // --- IMAGE SECTION ---
  imageSection: {
    padding: 12,
    backgroundColor: "#F0F9FF",
    borderTopWidth: 1,
    borderTopColor: "#BAE6FD",
  },
  imageSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0284C7",
    marginBottom: 10,
  },
  imageActions: {
    flexDirection: "row",
    gap: 12,
  },
  imageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BAE6FD",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  imageBtnIcon: { marginRight: 6, fontSize: 16 },
  imageBtnText: { color: "#0284C7", fontWeight: "600", fontSize: 13 },
  imagePreviewContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  // --- FOOTER ---
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: { color: COLORS.textSec, fontWeight: "600" },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flex: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
