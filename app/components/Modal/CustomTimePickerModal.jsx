import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment-timezone";
import adjust from "../../adjust";
import dayjs from "dayjs";
import { max } from "lodash";

const TIMEZONE = "Asia/Ho_Chi_Minh";

const CustomTimePickerModal = ({ isVisible, onConfirm, onCancel, maximumDate, selectedDate }) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [maxHour, setMaxHour] = useState(23);
  const [maxMinute, setMaxMinute] = useState(59);

  const getMaxHour = () => {
    const today = moment.tz(TIMEZONE).format("YYYY-MM-DD");
    const selectedDay = moment.tz(selectedDate, "YYYY-MM-DD", TIMEZONE).format("YYYY-MM-DD");

    if (selectedDay === today) {
      const currentHour = parseInt(moment.tz(TIMEZONE).format("HH"));
      return currentHour;
    }

    return 23;
  };

  const getMaxMinute = () => {
    const today = moment.tz(TIMEZONE).format("YYYY-MM-DD");
    const selectedDay = moment.tz(selectedDate, "YYYY-MM-DD", TIMEZONE).format("YYYY-MM-DD");
    const currentHour = parseInt(moment.tz(TIMEZONE).format("HH"));
    const currentMinute = parseInt(moment.tz(TIMEZONE).format("mm"));

    // Nếu là ngày hôm nay và giờ bằng giờ hiện tại
    if (selectedDay === today && hour === currentHour) {
      return currentMinute;
    }

    return 59;
  };

  useEffect(() => {
    const maxHour = getMaxHour();
    const maxMinute = getMaxMinute();
    setMaxHour(maxHour);
    setMaxMinute(maxMinute);
  }, [selectedDate, isVisible]);

  useEffect(() => {
    const maxMinute = getMaxMinute();
    setMaxMinute(maxMinute);
  }, [hour]);

  const handleConfirm = () => {
    const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    onConfirm(timeString);
  };

  const handleHourChange = (newHour) => {
    if (newHour >= 0 && newHour <= maxHour) {
      setHour(newHour);
      // Reset minute nếu giờ thay đổi vào giờ cuối cùng của ngày hôm nay
      if (newHour === maxHour && minute > getMaxMinute()) {
        setMinute(getMaxMinute());
      }
    }
  };

  const handleMinuteChange = (newMinute) => {
    if (newMinute >= 0 && newMinute <= maxMinute) {
      setMinute(newMinute);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Chọn giờ</Text>
            {/* <TouchableOpacity onPress={onCancel}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity> */}
          </View>

          <View style={styles.timeInputContainer}>
            {/* Hour Picker */}
            <View style={styles.timeSection}>
              <Text style={styles.label}>Giờ</Text>
              <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {Array.from({ length: maxHour + 1 }, (_, i) => i).map((h) => (
                  <TouchableOpacity key={h} onPress={() => handleHourChange(h)} style={[styles.timeOption, hour === h && styles.timeOptionSelected]}>
                    <Text style={[styles.timeText, hour === h && styles.timeTextSelected]}>{String(h).padStart(2, "0")}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Separator */}
            <View style={styles.separator}>
              <Text style={styles.separatorText}>:</Text>
            </View>

            {/* Minute Picker */}
            <View style={styles.timeSection}>
              <Text style={styles.label}>Phút</Text>
              <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                 {Array.from({ length: maxMinute + 1 }, (_, i) => i).map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => handleMinuteChange(m)}
                    style={[styles.timeOption, minute === m && styles.timeOptionSelected]}
                  >
                    <Text style={[styles.timeText, minute === m && styles.timeTextSelected]}>{String(m).padStart(2, "0")}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: adjust(18),
    fontWeight: "600",
    color: "#333",
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: 250,
  },
  timeSection: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: adjust(14),
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 4,
  },
  timeOptionSelected: {
    backgroundColor: "#4630EB",
  },
  timeText: {
    fontSize: adjust(16),
    fontWeight: "500",
    color: "#333",
  },
  timeTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  separator: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  separatorText: {
    fontSize: adjust(24),
    fontWeight: "600",
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: adjust(16),
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#4630EB",
  },
  confirmButtonText: {
    fontSize: adjust(16),
    fontWeight: "600",
    color: "white",
  },
});

export default CustomTimePickerModal;
