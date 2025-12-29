import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { anDaoTaoAPI, getUserNhaThau_AN_Duan } from "./api";
import { ReloadContext } from "../../context/ReloadContext";

const COLORS = {
  primary: "#2563eb",
  primaryLight: "#dbeafe",
  background: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  textLight: "#64748b",
  border: "#e2e8f0",
  error: "#ef4444",
  success: "#22c55e",
  shadow: "#000",
};

const ANDaoTaoGiaoCaForm = ({ route, navigation }) => {
  const { reload } = useContext(ReloadContext);
  const { authToken, user } = useSelector((state) => state.authReducer);
  const { baoCaoId, ma_du_an, mode = "create" } = route.params || {};


  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [baoCaoDetails, setBaoCaoDetails] = useState(null);
  const [nhanSuList, setNhanSuList] = useState([]);
  const [loaiDaoTaoList, setLoaiDaoTaoList] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNguoiDTDropdown, setShowNguoiDTDropdown] = useState(false);

  const [formData, setFormData] = useState({
    id_du_an: user?.ID_Duan || "",
    ns_anninh: [],
    noidung_daotao: [],
    nguoi_dt: "",
    ngay_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
    link_video: [""],
  });

  const [errors, setErrors] = useState({});

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  // Fetch functions
  const fetchNhanSu = useCallback(async () => {
    try {
      const response = await getUserNhaThau_AN_Duan(ma_du_an, authToken);
      setNhanSuList(response.data || []);
    } catch (error) {
      Alert.alert("Lỗi", `Không thể tải danh sách nhân sự`);
    }
  }, [ma_du_an, authToken]);

  const fetchLoaiDaoTao = useCallback(async () => {
    try {
      const response = await anDaoTaoAPI.getLoaiDaoTao(authToken);
      setLoaiDaoTaoList(response || []);
    } catch (error) {
      Alert.alert("Lỗi", `Không thể tải danh sách loại đào tạo`);
    }
  }, [authToken]);

  const fetchBaoCaoDetails = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await anDaoTaoAPI.getBaoCaoById(id, authToken);
        setBaoCaoDetails(response.data);

        setFormData({
          id_du_an: response.data.id_du_an || user?.ID_Duan || "",
          ns_anninh: response.data.ns_anninh || [],
          noidung_daotao: response.data.noidung_daotao || [],
          nguoi_dt: response.data.nguoi_dt || "",
          ngay_dt: response.data.ngay_dt || moment().format("YYYY-MM-DD HH:mm:ss"),
          link_video: response.data.link_video || [""],
        });
      } catch (error) {
        Alert.alert("Lỗi", `Không thể tải chi tiết báo cáo`);
      } finally {
        setLoading(false);
      }
    },
    [authToken, user?.ID_Duan]
  );

  useEffect(() => {
    fetchNhanSu();
    fetchLoaiDaoTao();
    if (baoCaoId && (isEditMode || isViewMode)) {
      fetchBaoCaoDetails(baoCaoId);
    }
  }, [baoCaoId, isEditMode, isViewMode, fetchNhanSu, fetchLoaiDaoTao, fetchBaoCaoDetails]);

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLinkVideoChange = (index, value) => {
    const newLinks = [...formData.link_video];
    newLinks[index] = value;
    handleInputChange("link_video", newLinks);
  };

  const addLinkVideo = () => {
    handleInputChange("link_video", [...formData.link_video, ""]);
  };

  const removeLinkVideo = (index) => {
    const newLinks = formData.link_video.filter((_, i) => i !== index);
    handleInputChange("link_video", newLinks.length > 0 ? newLinks : [""]);
  };

  const toggleNhanSu = (maNV) => {
    const newList = formData.ns_anninh.includes(maNV)
      ? formData.ns_anninh.filter((item) => item !== maNV)
      : [...formData.ns_anninh, maNV];
    handleInputChange("ns_anninh", newList);
  };

  const toggleNoiDung = (id) => {
    const newList = formData.noidung_daotao.includes(id)
      ? formData.noidung_daotao.filter((item) => item !== id)
      : [...formData.noidung_daotao, id];
    handleInputChange("noidung_daotao", newList);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ns_anninh?.length) newErrors.ns_anninh = "Chọn ít nhất một nhân sự";
    if (!formData.noidung_daotao?.length) newErrors.noidung_daotao = "Chọn ít nhất một nội dung";
    if (!formData.nguoi_dt) newErrors.nguoi_dt = "Chọn người đào tạo";
    if (!formData.ngay_dt) newErrors.ngay_dt = "Chọn ngày đào tạo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        ...formData,
        link_video: formData.link_video.filter((link) => link.trim() !== ""),
      };

      if (isEditMode && baoCaoId) {
        await anDaoTaoAPI.updateBaoCao(baoCaoId, submitData, authToken);
        Alert.alert("Thành công", "Cập nhật báo cáo thành công");
      } else if (isCreateMode) {
        await anDaoTaoAPI.createBaoCao(submitData, authToken);
        Alert.alert("Thành công", "Tạo báo cáo thành công");
      }

      reload();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const onDateConfirm = (date) => {
    setShowDatePicker(false);
    if (date) {
      handleInputChange("ngay_dt", moment(date).format("YYYY-MM-DD HH:mm:ss"));
    }
  };

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Ngày đào tạo */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Ngày đào tạo <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.inputButton, errors.ngay_dt && styles.inputError]}
            onPress={() => !isViewMode && setShowDatePicker(true)}
            disabled={isViewMode}
          >
            <Text style={styles.inputButtonText}>
              📅 {moment(formData.ngay_dt).format("DD/MM/YYYY HH:mm")}
            </Text>
          </TouchableOpacity>
          {errors.ngay_dt && <Text style={styles.errorText}>{errors.ngay_dt}</Text>}
        </View>

        {/* Người đào tạo */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Người đào tạo <Text style={styles.required}>*</Text>
          </Text>
          {isViewMode ? (
            <View style={styles.viewBox}>
              <Text style={styles.viewText}>
                👤 {nhanSuList.find((ns) => ns.ma_nv === formData.nguoi_dt)?.ho_ten || "N/A"}
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.dropdown, errors.nguoi_dt && styles.inputError]}
                onPress={() => setShowNguoiDTDropdown(!showNguoiDTDropdown)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !formData.nguoi_dt && styles.dropdownPlaceholder,
                  ]}
                >
                  {formData.nguoi_dt
                    ? `👤 ${nhanSuList.find((ns) => ns.ma_nv === formData.nguoi_dt)?.ho_ten || ""}`
                    : "Chọn người đào tạo"}
                </Text>
                <Text style={styles.dropdownIcon}>{showNguoiDTDropdown ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {showNguoiDTDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.listScroll} nestedScrollEnabled>
                    {nhanSuList.map((ns) => (
                      <TouchableOpacity
                        key={ns.id}
                        style={[
                          styles.dropdownItem,
                          formData.nguoi_dt === ns.ma_nv && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          handleInputChange("nguoi_dt", ns.ma_nv);
                          setShowNguoiDTDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>{ns.ho_ten}</Text>
                          <Text style={styles.listItemSubtitle}>
                            {ns.ma_nv} • {ns.chuc_vu}
                          </Text>
                        </View>
                        {formData.nguoi_dt === ns.ma_nv && (
                          <Text style={styles.checkmarkBlue}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
          {errors.nguoi_dt && <Text style={styles.errorText}>{errors.nguoi_dt}</Text>}
        </View>

        {/* Nhân sự an ninh */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Nhân sự tham gia <Text style={styles.required}>*</Text>
          </Text>
          {isViewMode ? (
            <View style={styles.chipContainer}>
              {formData.ns_anninh.map((maNV) => {
                const ns = nhanSuList.find((n) => n.ma_nv === maNV);
                return (
                  <View key={maNV} style={styles.chip}>
                    <Text style={styles.chipText}>{ns?.ho_ten || maNV}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.listContainer}>
              <ScrollView style={styles.listScroll} nestedScrollEnabled>
                {nhanSuList.map((ns) => (
                  <TouchableOpacity
                    key={ns.id}
                    style={[
                      styles.listItem,
                      formData.ns_anninh.includes(ns.ma_nv) && styles.listItemSelected,
                    ]}
                    onPress={() => toggleNhanSu(ns.ma_nv)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        formData.ns_anninh.includes(ns.ma_nv) && styles.checkboxChecked,
                      ]}
                    >
                      {formData.ns_anninh.includes(ns.ma_nv) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{ns.ho_ten}</Text>
                      <Text style={styles.listItemSubtitle}>
                        {ns.ma_nv} • {ns.chuc_vu}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          {errors.ns_anninh && <Text style={styles.errorText}>{errors.ns_anninh}</Text>}
        </View>

        {/* Nội dung đào tạo */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Nội dung đào tạo <Text style={styles.required}>*</Text>
          </Text>
          {isViewMode ? (
            <View style={styles.chipContainer}>
              {formData.noidung_daotao.map((id) => {
                const loai = loaiDaoTaoList.find((l) => l.id === id);
                return (
                  <View key={id} style={styles.chip}>
                    <Text style={styles.chipText}>{loai?.noi_dung || id}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.listContainer}>
              <ScrollView style={styles.listScroll} nestedScrollEnabled>
                {loaiDaoTaoList.map((loai) => (
                  <TouchableOpacity
                    key={loai.id}
                    style={[
                      styles.listItem,
                      formData.noidung_daotao.includes(loai.id) && styles.listItemSelected,
                    ]}
                    onPress={() => toggleNoiDung(loai.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        formData.noidung_daotao.includes(loai.id) && styles.checkboxChecked,
                      ]}
                    >
                      {formData.noidung_daotao.includes(loai.id) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.listItemTitle}>{loai.noi_dung}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          {errors.noidung_daotao && <Text style={styles.errorText}>{errors.noidung_daotao}</Text>}
        </View>

        {/* Link video */}
        <View style={styles.section}>
          <Text style={styles.label}>Link video (tùy chọn)</Text>
          <Text style={styles.hint}>
            💡 Tải video lên OneDrive dự án, sau đó dán link chia sẻ vào đây
          </Text>

          {formData.link_video.map((link, index) => (
            <View key={index} style={styles.linkRow}>
              <TextInput
                style={[styles.input, styles.linkInput]}
                placeholder={`https://...`}
                value={link}
                onChangeText={(text) => handleLinkVideoChange(index, text)}
                editable={!isViewMode}
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              {!isViewMode && formData.link_video.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeLinkVideo(index)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {!isViewMode && (
            <TouchableOpacity onPress={addLinkVideo} style={styles.addButton} activeOpacity={0.7}>
              <Text style={styles.addButtonText}>+ Thêm link</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Chi tiết báo cáo */}
        {(isEditMode || isViewMode) && baoCaoDetails && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>📋 Thông tin chi tiết</Text>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Dự án</Text>
              <Text style={styles.detailValue}>{baoCaoDetails.ent_duan?.Duan || "N/A"}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Người tạo</Text>
              <Text style={styles.detailValue}>
                {baoCaoDetails.ent_user?.HoTen || "N/A"}
                {"\n"}
                <Text style={styles.detailValueLight}>
                  {baoCaoDetails.ent_user?.ent_chucvu?.Chucvu || ""}
                </Text>
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Ngày tạo</Text>
              <Text style={styles.detailValue}>
                {moment(baoCaoDetails.created_at).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cập nhật</Text>
              <Text style={styles.detailValue}>
                {moment(baoCaoDetails.updated_at).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer */}
      {!isViewMode && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.7}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>{isEditMode ? "Cập nhật" : "Lưu"}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        locale="vi_VN"
        date={formData.ngay_dt ? moment(formData.ngay_dt).toDate() : new Date()}
        onConfirm={onDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
        is24Hour={true}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: COLORS.error,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 12,
    lineHeight: 18,
  },
  inputButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  inputButtonText: {
    fontSize: 15,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    marginTop: 6,
  },
  viewBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: 12,
  },
  viewText: {
    fontSize: 15,
    color: COLORS.text,
  },
  listContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  listScroll: {
    maxHeight: 240,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  dropdown: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: COLORS.textLight,
  },
  dropdownIcon: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  dropdownList: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  checkmarkBlue: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  linkInput: {
    flex: 1,
  },
  deleteButton: {
    width: 36,
    height: 48,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: COLORS.card,
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  detailCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  detailValueLight: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "400",
  },
  footer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ANDaoTaoGiaoCaForm