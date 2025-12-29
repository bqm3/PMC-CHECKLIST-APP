import { View, Text, TouchableOpacity, Modal, Image, StyleSheet, Dimensions, Animated } from "react-native";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme"; // Đảm bảo đường dẫn đúng
import adjust from "../../adjust"; // Đảm bảo đường dẫn đúng

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ItemHome({ item, index, roleUser, passwordCore, showAlert, checkP0 }) {
  const navigation = useNavigation();
  const [showSubmenu, setShowSubmenu] = useState(false);
  
  // 1. Khởi tạo giá trị Animation (scale bắt đầu từ 0)
  const scaleValue = useRef(new Animated.Value(0)).current;

  // Lọc submenu items dựa trên requireP0
  const availableSubmenuItems = useMemo(() => {
    if (!item.children) return [];

    const childrenArray = Array.isArray(item.children) ? item.children : Object.values(item.children);

    return childrenArray.filter((child) => !child.requireP0 || checkP0);
  }, [item.children, checkP0]);

  // 2. Chạy hiệu ứng khi showSubmenu thay đổi
  useEffect(() => {
    if (showSubmenu) {
      scaleValue.setValue(0); // Reset về 0
      Animated.spring(scaleValue, {
        toValue: 1, // Phóng to về kích thước thật
        friction: 6, // Độ nảy (càng thấp càng nảy nhiều)
        tension: 50, // Tốc độ (càng cao càng nhanh)
        useNativeDriver: true,
      }).start();
    }
  }, [showSubmenu]);

  const handlePress = () => {
    // Kiểm tra password trước
    if (!passwordCore) {
      showAlert("Mật khẩu của bạn không đủ mạnh. Vui lòng cập nhật mật khẩu mới với độ bảo mật cao hơn.");
      return;
    }

    // Nếu có submenu, hiển thị modal
    if (item.isMenu && item.children) {
      setShowSubmenu(true);
      return;
    }

    // Navigate bình thường
    navigation.navigate(item.path);
  };

  const handleSubmenuPress = (submenuItem) => {
    // Kiểm tra password lại (theo logic cũ của bạn)
    if (!passwordCore) {
      showAlert("Mật khẩu của bạn không đủ mạnh. Vui lòng cập nhật mật khẩu mới với độ bảo mật cao hơn.");
      return;
    }
    
    setShowSubmenu(false);

    setTimeout(() => {
      navigation.navigate(submenuItem.path);
    }, 100);
  };

  const renderIcon = (iconData, size = 40) => {
    if (typeof iconData === 'function') {
      // Icon là SVG component
      const IconComponent = iconData;
      return <IconComponent width={adjust(size)} height={adjust(size)} />;
    }
    // Fallback cho Image
    return (
      <Image 
        source={iconData} 
        resizeMode="contain" 
        style={styles.itemIcon} 
      />
    );
  };

  return (
    <>
      <TouchableOpacity 
        onPress={handlePress} 
        style={styles.itemContainer}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <View style={styles.iconWrapper}>
            {renderIcon(item.icon, 40)}
          </View>
          <Text 
            allowFontScaling={false} 
            numberOfLines={2}
            style={[
              styles.itemText, 
              roleUser !== 1 && item?.role === 1 && styles.itemTextWhite
            ]}
          >
            {item.title || item.path}
            {item.status && <Text style={styles.statusText}> ({item.status})</Text>}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Submenu Modal */}
      {item.isMenu && item.children && (
        <Modal 
          visible={showSubmenu} 
          transparent={true} 
          animationType="fade" // Giữ fade cho lớp nền mờ (overlay)
          onRequestClose={() => setShowSubmenu(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowSubmenu(false)}
          >
            {/* 3. Dùng Animated.View thay cho View thường */}
            <Animated.View 
              style={[
                styles.modalContainer,
                { transform: [{ scale: scaleValue }] } // Áp dụng hiệu ứng scale
              ]}
            >
              {/* Chặn sự kiện onPress để không đóng modal khi click vào nội dung bên trong */}
              <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
                <View style={styles.modalContent}>
                  {/* Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{item.path}</Text>
                    <TouchableOpacity onPress={() => setShowSubmenu(false)} style={styles.closeButton}>
                      <FontAwesome name="times" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Submenu Grid */}
                  <View style={styles.submenuGrid}>
                    {availableSubmenuItems.map((submenuItem) => (
                      <TouchableOpacity 
                        key={submenuItem.id} 
                        style={styles.submenuGridItem} 
                        onPress={() => handleSubmenuPress(submenuItem)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.submenuIconCircle, { backgroundColor: `${submenuItem.color || "#3b82f6"}15` }]}>
                          {renderIcon(submenuItem.icon)}
                        </View>
                        <Text style={styles.submenuGridText} numberOfLines={2}>
                          {submenuItem.title || submenuItem.path}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    height: adjust(80),
    backgroundColor: COLORS.bg_white,
    borderRadius: 16,
    marginHorizontal: 6,
    marginBottom: 12,
    // Shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow Android
    elevation: 3,
  },
  itemContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  iconWrapper: {
    width: adjust(40),
    height: adjust(40),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  itemIcon: {
    width: "100%",
    height: "100%",
  },
  itemText: {
    color: "black",
    fontSize: adjust(13),
    fontWeight: "600",
    textAlign: "center",
    lineHeight: adjust(20),
    width: "100%",
  },
  itemTextWhite: {
    color: "white",
  },
  statusText: {
    color: "green",
    fontWeight: "800",
    fontSize: adjust(11),
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền tối hơn chút để nổi bật modal
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    maxWidth: 420,
    // Shadow và background đã chuyển vào modalContent hoặc giữ ở đây nếu cần layout
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  modalTitle: {
    fontSize: adjust(18),
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  submenuGrid: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  submenuGridItem: {
    width: "50%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  submenuIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  submenuGridText: {
    fontSize: adjust(13),
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: adjust(16),
  },
});