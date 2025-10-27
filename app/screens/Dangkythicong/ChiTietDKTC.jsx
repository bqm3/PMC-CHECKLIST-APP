import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getDangKyThiCongDetail, updateDangKyThiCongStatus, uploadImage, addNewCCDC, updateInfoCCDC } from "./api";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DocumentViewer from "./DocumentViewer";
import moment from "moment-timezone";
import { set } from "lodash";

const { width } = Dimensions.get("window");

const ChiTietDKTC = ({ route, navigation }) => {
  const { id } = route.params || {};
  const insets = useSafeAreaInsets();
  const { setIsLoading } = route.params;
  const { authToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [saving, setSaving] = useState(false);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [congCuList, setCongCuList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const [congCuModalVisible, setCongCuModalVisible] = useState(false);
  const [editingCongCu, setEditingCongCu] = useState(null);
  const [congCuForm, setCongCuForm] = useState({
    ten_cong_cu: "",
    so_luong: "",
    ghi_chu: "",
  });

  const fetchData = async (isLoading) => {
    setIsLoading(isLoading);
    setError(null);
    try {
      const response = await getDangKyThiCongDetail(id, authToken);
      setData(response.data.data);
      if (response.data.data.nt_congcu_tc_list) {
        setCongCuList(response.data.data.nt_congcu_tc_list);
      }
    } catch (e) {
      setError("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, [id, authToken]);

  useEffect(() => {
    if (data) {
      setNewStatus(data.tinh_trang_pd ?? 0);
      setLyDoTuChoi(data.ly_do_tc || "");
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Thông báo", "Cần cấp quyền camera để chụp ảnh");
        }
      }
    })();
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      0: { label: "Chờ duyệt", color: "#F59E0B", icon: "hourglass-empty", bg: "#FEF3C7" },
      1: { label: "Đã duyệt", color: "#10B981", icon: "check-circle", bg: "#D1FAE5" },
      2: { label: "Từ chối", color: "#EF4444", icon: "cancel", bg: "#FEE2E2" },
      3: { label: "Hoàn thành", color: "#8B5CF6", icon: "done-all", bg: "#EDE9FE" },
    };
    return statusMap[status] || statusMap[0];
  };

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

  const canUpdateStatus = (currentStatus) => currentStatus !== 2 && currentStatus !== 3;

  const handleOpenAddCongCu = () => {
    setEditingCongCu(null);
    setCongCuForm({ ten_cong_cu: "", so_luong: "", ghi_chu: "" });
    setCongCuModalVisible(true);
  };

  const handleOpenEditCongCu = (item) => {
    setEditingCongCu(item);
    setCongCuForm({
      ten_cong_cu: item.ten_cong_cu,
      so_luong: item.so_luong?.toString() || "",
      ghi_chu: item.ghi_chu || "",
    });
    setCongCuModalVisible(true);
  };

  const handleCloseCongCuModal = () => {
    setCongCuModalVisible(false);
    setEditingCongCu(null);
    setCongCuForm({ ten_cong_cu: "", so_luong: "", ghi_chu: "" });
  };

  const handleSaveCongCu = async () => {
    if (!editingCongCu && !congCuForm.ten_cong_cu.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên công cụ");
      return;
    }

    if (!congCuForm.so_luong || isNaN(congCuForm.so_luong) || parseInt(congCuForm.so_luong) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số lượng hợp lệ");
      return;
    }

    setSaving(true);
    try {
      if (editingCongCu) {
        const updateData = { ghi_chu: congCuForm.ghi_chu.trim() };
        const response = await updateInfoCCDC(editingCongCu.id_cong_cu, updateData, authToken);
        Alert.alert("Thành công", response?.data?.message ?? "Cập nhật thành công", [{ text: "OK", onPress: () => fetchData(false) }]);
      } else {
        const newData = {
          id_dang_ky_tc: id,
          ten_cong_cu: congCuForm.ten_cong_cu.trim(),
          so_luong: parseInt(congCuForm.so_luong),
          ghi_chu: congCuForm.ghi_chu.trim(),
        };
        const response = await addNewCCDC(newData, authToken);
        Alert.alert("Thành công", response.data.message || "Thêm công cụ thành công", [{ text: "OK", onPress: () => fetchData(false) }]);
      }
      handleCloseCongCuModal();
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleTakePhoto = async (congCuId, type) => {
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 1 });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        // const updatedList = congCuList.map((item) => {
        //   if (item.id_cong_cu === congCuId) {
        //     return {
        //       ...item,
        //       [type === "vao" ? "link_anh_vao" : "link_anh_ra"]: imageUri,
        //       [type === "vao" ? "new_image_vao" : "new_image_ra"]: true,
        //     };
        //   }
        //   return item;
        // });
        // setCongCuList(updatedList);
        setIsLoading(true);
        const res = await uploadImage(congCuId, imageUri, type, authToken);
        fetchData(false);
        Alert.alert("Thành công", res.data.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const showImageOptions = (congCuId, type) => {
    handleTakePhoto(congCuId, type);
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

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
    setSaving(true);
    try {
      const updateData = { tinh_trang_pd: newStatus };
      if (newStatus === 2) updateData.ly_do_tc = lyDoTuChoi;
      const response = await updateDangKyThiCongStatus(data.id_dang_ky_tc, updateData, authToken);
      Alert.alert("Thành công", response.data.message, [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert("Lỗi", `${e.response?.data?.message || "Có lỗi xảy ra"}`);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return moment(dateString).tz("Asia/Ho_Chi_Minh").format(" HH:mm:ss DD/MM/YYYY");
  };

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

  const currentStatusInfo = getStatusInfo(data.tinh_trang_pd ?? 0);

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {(data?.tinh_trang_pd == 2 || data?.tinh_trang_pd == 3) && (
          <View style={[styles.statusBadge, { backgroundColor: currentStatusInfo.bg, padding: 10, borderRadius: 8, marginBottom: 10 }]}>
            <View style={{ alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name={currentStatusInfo.icon} size={18} color={currentStatusInfo.color} style={{ marginRight: 6 }} />
                <Text style={[styles.statusText, { color: currentStatusInfo.color, fontWeight: "bold", fontSize: 15 }]}>
                  {currentStatusInfo.label}
                </Text>
              </View>
              {data?.tinh_trang_pd == 2 && data.ly_do_tc && <Text style={styles.rejectReasonText}>Lý do: {data.ly_do_tc}</Text>}
            </View>
          </View>
        )}

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
              {saving ? <ActivityIndicator color="#fff" size="small" /> : <Icon name="save" size={16} color="#fff" />}
              <Text style={styles.updateButtonText}>{saving ? "Đang cập nhật..." : "Cập nhật trạng thái"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="info" size={18} color="#6366F1" />
            <Text style={styles.cardTitle}>Thông tin cơ bản</Text>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Loại hình" value={data.loai === 1 ? "Trong ngày" : "Dài hạn"} icon="category" />
            <InfoRow label="Tên hồ sơ" value={data.ten_ho_so_dk} icon="folder" />
            <InfoRow label="Tòa nhà" value={data.ent_toanha?.Toanha || ""} icon="business" />
            <InfoRow label="Căn hộ" value={data.nt_canho?.ma_can_ho || ""} icon="home" />
            <InfoRow label="Chủ hộ" value={data.ten_chu_ho} icon="person" />
            <InfoRow label="SĐT" value={data.sdt_chu_ho} icon="phone" />
            <InfoRow label="Nhà thầu" value={data?.nt_list?.ten_nt} icon="engineering" />
            <InfoRow label="MST/CCCD" value={data?.nt_list?.mst_cccd_sdt} icon="badge" />
            <InfoRow label="Email" value={data.mail_nguoi_dk || "-"} icon="email" />
            <InfoRow label="Từ ngày" value={data.tu_ngay} icon="event" />
            <InfoRow label="Đến ngày" value={data.den_ngay} icon="event-available" />
            {data.ghi_chu && <InfoRow label="Ghi chú" value={data.ghi_chu} icon="note" />}
          </View>
        </View>

        {Array.isArray(data.nt_dangky_tcns) && data.nt_dangky_tcns.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="group" size={18} color="#6366F1" />
              <Text style={styles.cardTitle}>Nhân sự thi công</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{data.nt_dangky_tcns.length}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {data.nt_dangky_tcns.map((item, idx) => (
                <View key={idx} style={styles.personCard}>
                  <View style={styles.personHeader}>
                    <Icon name="person" size={16} color="#6366F1" />
                    <Text style={styles.personName}>{item.ho_ten}</Text>
                  </View>
                  <InfoRow label="Giới tính" value={item.gioi_tinh} />
                  <InfoRow label="CCCD" value={item.cccd || (item.cccd_image ? "Có ảnh" : "-")} />
                  {item.so_dien_thoai && <InfoRow label="SĐT" value={item.so_dien_thoai} />}
                  {item.dia_chi && <InfoRow label="Địa chỉ" value={item.dia_chi} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {Array.isArray(data.nt_dangky_tchm) && data.nt_dangky_tchm.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="construction" size={18} color="#6366F1" />
              <Text style={styles.cardTitle}>Hạng mục thi công</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{data.nt_dangky_tchm.length}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {data.nt_dangky_tchm.map((hm, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Icon name="check-circle-outline" size={14} color="#10B981" />
                  <Text style={styles.listItemText}>
                    {hm?.nt_hangmuc_sc?.hang_muc_sc}
                    {hm?.ghi_chu_khac ? `: ${hm.ghi_chu_khac}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {Array.isArray(data.nt_dangky_tctl) && data.nt_dangky_tctl.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="attach-file" size={18} color="#6366F1" />
              <Text style={styles.cardTitle}>Tài liệu đính kèm</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{data.nt_dangky_tctl.length}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {data.nt_dangky_tctl.map((tl, idx) => {
                const hasLink = tl.noi_luu_tru;
                const docTitle = tl.ten_tai_lieu || tl.nt_tailieu?.ten_tai_lieu || "Tài liệu";
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.documentItem, hasLink && styles.documentItemClickable, !hasLink && styles.documentItemDisabled]}
                    onPress={() => Alert.alert("Thông báo", "Vui lòng lên website để xem chi tiết", [{ text: "Đóng" }])}
                    activeOpacity={hasLink ? 0.7 : 1}
                    disabled={!hasLink}
                  >
                    <View style={styles.documentInfo}>
                      <Icon name="description" size={14} color="#8B5CF6" />
                      <Text style={styles.listItemText}>{docTitle}</Text>
                      {hasLink && (
                        <View style={styles.linkIconContainer}>
                          <Icon name="visibility" size={18} color="#6366F1" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="build-circle" size={18} color="#6366F1" />
            <Text style={styles.cardTitle}>Công cụ dụng cụ</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{congCuList.length}</Text>
            </View>
            {/* Nếu đã hoàn thành (tinh_trang_pd === 3) thì không cho thêm công cụ */}
            {data?.tinh_trang_pd !== 3 && data?.tinh_trang_pd !== 2 && (
              <TouchableOpacity style={styles.addButton} onPress={handleOpenAddCongCu}>
                <Icon name="add" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.cardContent}>
            {congCuList.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có công cụ nào</Text>
            ) : (
              congCuList.map((item, idx) => (
                <View key={item.id_cong_cu || idx} style={styles.congCuCard}>
                  <View style={styles.congCuHeader}>
                    <Icon name="build" size={16} color="#6366F1" />
                    <Text style={styles.congCuName}>{item.ten_cong_cu || "Công cụ"}</Text>
                    {/* Không cho sửa nếu đã hoàn thành */}
                    {data?.tinh_trang_pd !== 3 && data?.tinh_trang_pd !== 2 && (
                      <TouchableOpacity style={styles.editIconButton} onPress={() => handleOpenEditCongCu(item)}>
                        <Icon name="edit" size={16} color="#6366F1" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.congCuInfo}>
                    <InfoRow label="Số lượng" value={item.so_luong?.toString() || "0"} />
                    {item.ngay_vao && <InfoRow label="Ngày" value={formatDate(item.ngay_vao)} />}
                    {item.ngay_ra && <InfoRow label="Ngày ra" value={formatDate(item.ngay_ra)} />}
                    {item.users && (
                      <InfoRow label="Người thực hiện" value={Array.isArray(item.users) && item.users.length ? item.users.join(", ") : "-"} />
                    )}
                    {item.ghi_chu && <InfoRow label="Ghi chú" value={item.ghi_chu} />}
                  </View>
                  {/* Nếu đã hoàn thành thì ẩn phần ảnh */}
                  {data?.tinh_trang_pd !== 3 && data?.tinh_trang_pd !== 2 && (
                    <>
                      <View style={styles.imageSection}>
                        <Text style={styles.imageSectionTitle}>Ảnh vào</Text>
                        <View style={styles.imageActions}>
                          {item.link_anh_vao ? (
                            <TouchableOpacity style={styles.imagePreview} onPress={() => handleViewImage(item.link_anh_vao)}>
                              <Image source={{ uri: item.link_anh_vao }} style={styles.thumbnailImage} />
                              <View style={styles.imageOverlay}>
                                <Icon name="zoom-in" size={20} color="#fff" />
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.noImageBox}>
                              <Icon name="image-not-supported" size={28} color="#9CA3AF" />
                              <Text style={styles.noImageText}>Chưa có ảnh</Text>
                            </View>
                          )}
                          <TouchableOpacity style={styles.addImageButton} onPress={() => showImageOptions(item.id_cong_cu, "vao")}>
                            <Icon name="add-a-photo" size={18} color="#fff" />
                            <Text style={styles.addImageText}>{item.link_anh_vao ? "Đổi ảnh" : "Chụp ảnh"}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.imageSection}>
                        <Text style={styles.imageSectionTitle}>Ảnh ra</Text>
                        <View style={styles.imageActions}>
                          {item.link_anh_ra ? (
                            <TouchableOpacity style={styles.imagePreview} onPress={() => handleViewImage(item.link_anh_ra)}>
                              <Image source={{ uri: item.link_anh_ra }} style={styles.thumbnailImage} />
                              <View style={styles.imageOverlay}>
                                <Icon name="zoom-in" size={20} color="#fff" />
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.noImageBox}>
                              <Icon name="image-not-supported" size={28} color="#9CA3AF" />
                              <Text style={styles.noImageText}>Chưa có ảnh</Text>
                            </View>
                          )}
                          <TouchableOpacity style={styles.addImageButton} onPress={() => showImageOptions(item.id_cong_cu, "ra")}>
                            <Icon name="add-a-photo" size={18} color="#fff" />
                            <Text style={styles.addImageText}>{item.link_anh_ra ? "Đổi ảnh" : "Chụp ảnh"}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Modal visible={congCuModalVisible} transparent={true} animationType="slide" onRequestClose={handleCloseCongCuModal}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kavContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{editingCongCu ? "Sửa công cụ" : "Thêm công cụ mới"}</Text>
                  </View>

                  <ScrollView
                    style={styles.modalBody}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {!editingCongCu && (
                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>
                          Tên công cụ <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Nhập tên công cụ"
                          value={congCuForm.ten_cong_cu}
                          onChangeText={(text) => setCongCuForm({ ...congCuForm, ten_cong_cu: text })}
                          editable={!saving}
                        />
                      </View>
                    )}
                    {editingCongCu && (
                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Tên công cụ</Text>
                        <View style={styles.readonlyInput}>
                          <Text style={styles.readonlyText}>{editingCongCu.ten_cong_cu}</Text>
                          <Icon name="lock" size={16} color="#9CA3AF" />
                        </View>
                        <Text style={styles.helperText}>Tên công cụ không thể thay đổi</Text>
                      </View>
                    )}
                    {!editingCongCu && (
                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>
                          Số lượng <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Nhập số lượng"
                          value={congCuForm.so_luong}
                          onChangeText={(text) => setCongCuForm({ ...congCuForm, so_luong: text })}
                          keyboardType="numeric"
                          editable={!saving}
                        />
                      </View>
                    )}
                    {editingCongCu && (
                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Số lượng</Text>
                        <View style={styles.readonlyInput}>
                          <Text style={styles.readonlyText}>{editingCongCu.so_luong}</Text>
                          <Icon name="lock" size={16} color="#9CA3AF" />
                        </View>
                        <Text style={styles.helperText}>Số lượng không thể thay đổi</Text>
                      </View>
                    )}
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Ghi chú</Text>
                      <TextInput
                        style={[styles.formInput, styles.textArea]}
                        placeholder="Nhập ghi chú (không bắt buộc)"
                        value={congCuForm.ghi_chu}
                        onChangeText={(text) => setCongCuForm({ ...congCuForm, ghi_chu: text })}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        editable={!saving}
                      />
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCloseCongCuModal} disabled={saving}>
                      <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleSaveCongCu} disabled={saving}>
                      {saving ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Icon name="save" size={18} color="#fff" />
                          <Text style={styles.saveButtonText}>{editingCongCu ? "Cập nhật" : "Thêm mới"}</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={imageModalVisible} transparent={true} animationType="fade" onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setImageModalVisible(false)}>
            <Icon name="close" size={32} color="#fff" />
          </TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />}
        </View>
      </Modal>
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
  kavContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  statusContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  rejectReasonText: {
    color: "#991B1B",
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
    flex: 1,
  },
  badge: {
    backgroundColor: "#EDE9FE",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7C3AED",
  },
  addButton: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cardContent: {
    padding: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    fontStyle: "italic",
    paddingVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingVertical: 2,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 130,
    marginRight: 8,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoLabelText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: "#1F2937",
    textAlign: "right",
    fontWeight: "400",
  },
  personCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  personHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  personName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingVertical: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    marginLeft: 6,
    lineHeight: 18,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  documentItemClickable: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
  },
  documentItemDisabled: {
    opacity: 0.5,
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  linkIconContainer: {
    marginLeft: 6,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  congCuCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  congCuHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  congCuName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 6,
    flex: 1,
  },
  editIconButton: {
    padding: 2,
  },
  congCuInfo: {
    marginBottom: 8,
  },
  imageSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  imageSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  imageActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  imagePreview: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#6366F1",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageBox: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  addImageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  addImageText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  fullScreenImage: {
    width: width,
    height: "80%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "85%",
    // paddingBottom: Platform.OS === "ios" ? 34 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  required: {
    color: "#EF4444",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  readonlyInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  readonlyText: {
    fontSize: 14,
    color: "#6B7280",
  },
  helperText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 3,
    fontStyle: "italic",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 11,
    borderRadius: 6,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  selectLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  dropdownButton: {
    width: "100%",
    height: 42,
    borderRadius: 6,
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
    borderRadius: 6,
    elevation: 4,
  },
  dropdownRow: {
    height: 42,
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
    marginTop: 12,
    marginBottom: 8,
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 10,
    minHeight: 70,
    backgroundColor: "#fff",
    fontSize: 13,
    color: "#374151",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    borderRadius: 6,
    paddingVertical: 11,
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
    backgroundColor: "#F3F4F6",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  errorText: {
    fontSize: 15,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statusUpdateBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "stretch",
  },
});

export default ChiTietDKTC;
