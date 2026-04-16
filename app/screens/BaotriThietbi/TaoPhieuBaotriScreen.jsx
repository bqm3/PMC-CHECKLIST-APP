import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { bt_thietbi_da_API, bt_thongtinchung_API } from "./api";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useLoading } from "../../context/LoadingContext";

const TaoPhieuBaotriScreen = ({ navigation }) => {
  const { authToken } = useSelector((state) => state.authReducer);
  const { setIsLoading } = useLoading();
  const [dataThietBi, setDataThietBi] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]); // Array of id_thietbi_thietlap
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [maintenanceType, setMaintenanceType] = useState("daily");
  
  const [formData, setFormData] = useState({
    ten_phieu: "",
    ngay_bt: new Date(),
    ghi_chu: "",
  });

  const todayStr = useMemo(() => moment().format("YYYY-MM-DD"), []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await bt_thietbi_da_API.getAll(authToken);
      const devices = response.data.data || [];
      setDataThietBi(devices);

      const autoSelected = [];
      devices.forEach((device) => {
        device.bt_nhomhm_tbi_da?.forEach((group) => {
          group.bt_thietbi_thietlap?.forEach((task) => {
            if (task.ngay_du_kien_tiep_theo === todayStr) {
              autoSelected.push(task.id_thietbi_thietlap);
            }
          });
        });
      });

      if (autoSelected.length === 0) {
        setMaintenanceType("adhoc");
      }
      setSelectedTasks(autoSelected);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thiết bị:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasTasksToday = useMemo(() => {
    return dataThietBi.some(device => 
      device.bt_nhomhm_tbi_da?.some(group => 
        group.bt_thietbi_thietlap?.some(task => task.ngay_du_kien_tiep_theo === todayStr)
      )
    );
  }, [dataThietBi, todayStr]);

  const filteredData = useMemo(() => {
    if (maintenanceType === "adhoc") return dataThietBi;
    return dataThietBi.filter(device => {
      let hasTaskToday = false;
      device.bt_nhomhm_tbi_da?.forEach(group => {
        group.bt_thietbi_thietlap?.forEach(task => {
          if (task.ngay_du_kien_tiep_theo === todayStr) hasTaskToday = true;
        });
      });
      return hasTaskToday;
    });
  }, [maintenanceType, dataThietBi, todayStr]);

  const toggleTask = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const toggleSelectAll = () => {
    const allVisibleTaskIds = [];
    filteredData.forEach(device => {
      device.bt_nhomhm_tbi_da?.forEach(group => {
        group.bt_thietbi_thietlap?.forEach(task => {
          if (maintenanceType === "adhoc" || task.ngay_du_kien_tiep_theo === todayStr) {
            allVisibleTaskIds.push(task.id_thietbi_thietlap);
          }
        });
      });
    });

    if (selectedTasks.length === allVisibleTaskIds.length && allVisibleTaskIds.length > 0) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(allVisibleTaskIds);
    }
  };

  const handleConfirmDate = (date) => {
    setFormData({ ...formData, ngay_bt: date });
    setDatePickerVisibility(false);
  };

  const handleCreate = async () => {
    if (!formData.ten_phieu) {
      Alert.alert("Thông báo", "Vui lòng nhập tên phiếu");
      return;
    }

    if (selectedTasks.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một hạng mục bảo trì");
      return;
    }
    
    setIsLoading(true);

    const formattedTasks = [];
    dataThietBi.forEach(device => {
      device.bt_nhomhm_tbi_da?.forEach(group => {
        group.bt_thietbi_thietlap?.forEach(task => {
          if (selectedTasks.includes(task.id_thietbi_thietlap)) {
            formattedTasks.push({
              id_thietbida: device.id_thietbida,
              id_thietbi_thietlap: task.id_thietbi_thietlap,
              hang_muc: task.hang_muc || "",
              noi_dung_cong_viec: task.noi_dung_cong_viec || "",
              id_dmhanhdong_list: task.id_dmhanhdong_list || "",
              id_dmtansuat: task.id_dmtansuat || "",
              ngay_du_kien_tiep_theo: task.ngay_du_kien_tiep_theo || "",
              stt: task.stt || ""
            });
          }
        });
      });
    });

    const payload = {
      ten_phieu: formData.ten_phieu,
      ngay_bt: moment(formData.ngay_bt).format("YYYY-MM-DD"),
      ghi_chu: formData.ghi_chu,
      loai_bt: maintenanceType,
      selected_tasks: formattedTasks
    };
    
    try {
        const response = await bt_thongtinchung_API.create(authToken, payload);
        Alert.alert("Thành công", "Đã tạo phiếu bảo trì mới");
        navigation.goBack();
      } catch (error) {
        console.error("Lỗi khi tạo phiếu bảo trì:", error);
        Alert.alert("Lỗi", "Không thể tạo phiếu bảo trì");
      } finally {
        setIsLoading(false);
      }
  };

  const renderItem = ({ item }) => {
    const groups = item.bt_nhomhm_tbi_da || [];
    
    return (
      <View style={styles.deviceCard}>
        <View style={styles.deviceHeader}>
            <View style={{ flex: 1 }}>
                <Text style={styles.deviceName}>{item.ten_thietbi_da}</Text>
                <Text style={styles.deviceInfoText}>Vị trí: {item.vi_tri_lap_dat || "---"}</Text>
            </View>
            <View style={styles.deviceBadge}>
                <Text style={styles.deviceCodeText}>{item.bt_dmthietbi?.ma_thietbi}</Text>
            </View>
        </View>

        <View style={styles.taskList}>
            {groups.map((group, gIdx) => (
                <View key={gIdx} style={styles.groupContainer}>
                    <Text style={styles.groupNameText}>{group.ten_nhomhm}</Text>
                    {group.bt_thietbi_thietlap?.map((task, tIdx) => {
                        if (maintenanceType === "daily" && task.ngay_du_kien_tiep_theo !== todayStr) return null;
                        
                        const isSelected = selectedTasks.includes(task.id_thietbi_thietlap);
                        return (
                            <TouchableOpacity 
                                key={tIdx} 
                                style={[styles.taskItem, isSelected && styles.taskItemSelected]}
                                onPress={() => toggleTask(task.id_thietbi_thietlap)}
                            >
                                <Ionicons 
                                    name={isSelected ? "checkbox" : "square-outline"} 
                                    size={adjust(20)} 
                                    color={isSelected ? COLORS.bg_button : "#6b7280"} 
                                />
                                <View style={styles.taskInfo}>
                                    <Text style={[styles.taskName, isSelected && styles.taskNameSelected]}>{task.hang_muc}</Text>
                                    <Text style={styles.taskContentText}>{task.noi_dung_cong_viec}</Text>
                                    <View style={styles.taskFooter}>
                                        <Text style={styles.taskDateText}>Kế hoạch: {task.ngay_du_kien_tiep_theo}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/bg_new.png")}
      resizeMode="stretch"
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.formCard}>
            <View style={styles.staticHeader}>
                <Text style={styles.label}>Loại bảo trì</Text>
                <View style={styles.typeSelector}>
                    {hasTasksToday && (
                        <TouchableOpacity 
                            style={[styles.typeButton, maintenanceType === "daily" && styles.typeButtonActive]}
                            onPress={() => setMaintenanceType("daily")}
                        >
                            <Text style={[styles.typeButtonText, maintenanceType === "daily" && styles.typeButtonTextActive]}>Theo ngày</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        style={[styles.typeButton, maintenanceType === "adhoc" && styles.typeButtonActive]}
                        onPress={() => setMaintenanceType("adhoc")}
                    >
                        <Text style={[styles.typeButtonText, maintenanceType === "adhoc" && styles.typeButtonTextActive]}>Đột xuất</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formRow}>
                  <View style={{ flex: 1, marginRight: adjust(10) }}>
                    <Text style={styles.label}>Tên phiếu bảo trì</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên phiếu..."
                        placeholderTextColor="#9ca3af"
                        value={formData.ten_phieu}
                        onChangeText={(text) => setFormData({ ...formData, ten_phieu: text })}
                    />
                  </View>
                  <View style={{ width: adjust(120) }}>
                    <Text style={styles.label}>Ngày tạo</Text>
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setDatePickerVisibility(true)}>
                        <Text style={styles.dateText}>
                        {moment(formData.ngay_bt).format("DD/MM/YYYY")}
                        </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.label}>Ghi chú</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Nhập ghi chú cho phiếu bảo trì..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={2}
                    value={formData.ghi_chu}
                    onChangeText={(text) => setFormData({ ...formData, ghi_chu: text })}
                />

                <View style={styles.thietBiHeader}>
                    <Text style={styles.label}>Chọn hạng mục ({selectedTasks.length})</Text>
                    <TouchableOpacity onPress={toggleSelectAll}>
                        <Text style={styles.selectAllText}>Chọn tất cả</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_thietbida.toString()}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={(
                    <Text style={styles.emptyText}>Không có thiết bị/hạng mục nào cần bảo trì</Text>
                )}
            />

            <View style={styles.staticFooter}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleCreate}
                >
                    <Text style={styles.buttonText}>Tạo phiếu</Text>
                </TouchableOpacity>
            </View>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          date={formData.ngay_bt}
        />
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
    padding: adjust(15),
    flex: 1,
  },
  formCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: adjust(12),
    overflow: "hidden",
    elevation: 3,
  },
  staticHeader: {
    padding: adjust(15),
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  label: {
    fontSize: adjust(14),
    fontWeight: "700",
    color: "#374151",
    marginBottom: adjust(6),
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: adjust(8),
    padding: adjust(4),
    marginBottom: adjust(15),
  },
  typeButton: {
    flex: 1,
    paddingVertical: adjust(8),
    alignItems: 'center',
    borderRadius: adjust(6),
  },
  typeButtonActive: {
    backgroundColor: 'white',
    elevation: 2,
  },
  typeButtonText: {
    fontSize: adjust(13),
    color: '#6b7280',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: COLORS.bg_button || '#3b82f6',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: adjust(8),
    paddingHorizontal: adjust(12),
    paddingVertical: adjust(8),
    fontSize: adjust(14),
    color: "#111827",
    marginBottom: adjust(10),
  },
  textArea: {
    height: adjust(60),
    textAlignVertical: "top",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: adjust(8),
    paddingHorizontal: adjust(12),
    paddingVertical: adjust(8),
    marginBottom: adjust(10),
    backgroundColor: "#f9fafb",
  },
  dateText: {
    fontSize: adjust(14),
    color: "#111827",
  },
  thietBiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: adjust(5),
  },
  selectAllText: {
    fontSize: adjust(13),
    color: COLORS.bg_button || "#3b82f6",
    fontWeight: "600",
  },
  listContent: {
    padding: adjust(15),
  },
  deviceCard: {
    backgroundColor: "#f9fafb",
    borderRadius: adjust(10),
    padding: adjust(12),
    marginBottom: adjust(15),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: adjust(10),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: adjust(8),
  },
  deviceName: {
    fontSize: adjust(15),
    fontWeight: '700',
    color: '#1f2937',
  },
  deviceInfoText: {
    fontSize: adjust(12),
    color: '#6b7280',
    marginTop: adjust(2),
  },
  deviceCodeText: {
    fontSize: adjust(11),
    color: '#4b5563',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: adjust(6),
    paddingVertical: adjust(2),
    borderRadius: adjust(4),
  },
  taskList: {
    marginTop: adjust(5),
  },
  groupContainer: {
    marginBottom: adjust(10),
  },
  groupNameText: {
    fontSize: adjust(12),
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: adjust(5),
    textTransform: 'uppercase',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: adjust(8),
    paddingHorizontal: adjust(10),
    backgroundColor: 'white',
    borderRadius: adjust(6),
    marginBottom: adjust(5),
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  taskItemSelected: {
    borderColor: COLORS.bg_button || '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  taskInfo: {
    marginLeft: adjust(10),
    flex: 1,
  },
  taskName: {
    fontSize: adjust(13),
    color: '#374151',
    fontWeight: '700',
  },
  taskNameSelected: {
    color: COLORS.bg_button || '#3b82f6',
  },
  taskContentText: {
    fontSize: adjust(12),
    color: '#6b7280',
    marginTop: adjust(2),
  },
  taskFooter: {
    marginTop: adjust(4),
  },
  taskDateText: {
    fontSize: adjust(11),
    color: '#9ca3af',
  },
  staticFooter: {
    padding: adjust(15),
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  button: {
    backgroundColor: COLORS.bg_button || "#3b82f6",
    borderRadius: adjust(8),
    paddingVertical: adjust(12),
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: adjust(16),
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    fontSize: adjust(14),
    color: "#9ca3af",
    marginTop: adjust(40),
  },
});

export default TaoPhieuBaotriScreen;
