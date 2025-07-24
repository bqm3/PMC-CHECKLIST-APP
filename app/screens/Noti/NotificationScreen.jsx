import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
  RefreshControl,
  Alert,
  Platform,
  Image,
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
// import { Swipeable } from "@gorhom/gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { BASE_URL } from "../../constants/config";
import adjust from "../../adjust";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification as deleteNotificationApi } from "./api";
import { COLORS } from "../../constants/theme";

// Memoized Notification Item for better performance
const NotificationItem = memo(({ item, onPress, onDelete }) => {
  const renderRightActions = () => (
    <TouchableOpacity style={[styles.swipeDeleteButton]} onPress={() => onDelete(item.id)} activeOpacity={0.7}>
      <LinearGradient colors={["#EF4444", "#F87171"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.swipeDeleteGradient}>
        <Image
          source={require("../../../assets/icons/delete_icon.png")}
          style={{ width: 24, height: 24, tintColor: "#fff", transform: [{ rotate: "-10deg" }] }}
        />
      </LinearGradient>
    </TouchableOpacity>
  );

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} ngày trước`;

    const pad = (n) => (n < 10 ? `0${n}` : n);
    return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  };

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false} friction={2}>
      <TouchableOpacity style={[styles.item, item.is_read == 0 && styles.unreadItem]} onPress={onPress} activeOpacity={0.8}>
        <LinearGradient colors={item.is_read == 0 ? ["#FFF5F5", "#FFE4E4"] : ["#FFFFFF", "#F8FAFC"]} style={styles.itemGradient}>
          <View style={styles.content}>
            <Text style={[styles.title, item.is_read == 0 && styles.unreadTitle]} numberOfLines={2}>
              {item.title || "(Không có tiêu đề)"}
            </Text>
            <Text style={styles.contentText} numberOfLines={2}>
              {item.message || "(Không có nội dung)"}
            </Text>
            <Text style={styles.time}>{formatTime(item.created_at)}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Swipeable>
  );
});

const NotificationScreen = ({ navigation, route }) => {
  const { authToken } = useSelector((state) => state.authReducer);
  const { setIsLoading, setColorLoading } = route.params || {};
  const [notificationsData, setNotificationsData] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationsData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      try {
        const res = await fetchNotifications(authToken);
        setNotificationsData(res.data || []);
        setUnreadCount(res.unreadCount);
      } catch (err) {
        setNotificationsData([]);
        Alert.alert("Lỗi", `${err.response?.data?.message || "Không thể tải thông báo. Vui lòng thử lại!"}`);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [authToken]
  );

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await markNotificationAsRead(authToken, notificationId);
        setNotificationsData((prev) => {
          const updated = prev.map((item) => (item.id === notificationId ? { ...item, is_read: 1 } : item));
          setUnreadCount((prev) => prev - 1);
          return updated;
        });
      } catch (err) {
        Alert.alert("Lỗi", `${err.response?.data?.message || "Không thể đánh dấu đã đọc!"}`);
      }
    },
    [authToken]
  );

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notificationsData.filter((item) => item.is_read == 0).map((item) => item.id);
    if (unreadIds.length === 0) return;
    try {
      await markAllNotificationsAsRead(authToken, unreadIds);
      setNotificationsData((prev) => prev.map((item) => ({ ...item, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      Alert.alert("Lỗi", `${err.response?.data?.message || "Không thể đánh dấu tất cả đã đọc!"}`);
    }
  }, [authToken, notificationsData]);

  const deleteNotification = useCallback(
    async (notificationId) => {
      Alert.alert("Xác nhận", "Bạn có chắc muốn xóa thông báo này?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNotificationApi(authToken, notificationId);
              setNotificationsData((prev) => prev.filter((item) => item.id !== notificationId));
            } catch (err) {
              Alert.alert("Lỗi", `${err.response?.data?.message || "Không thể xóa thông báo!"}`);
            }
          },
        },
      ]);
    },
    [authToken]
  );

  const onRefresh = useCallback(() => {
    fetchNotificationsData(true);
  }, [fetchNotificationsData]);

  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  const renderHeader = () => {
    if (unreadCount === 0) return null;

    return (
      <LinearGradient colors={["#EF4444", "#F87171"]} style={styles.headerActions}>
        <Text style={styles.unreadCount}>{unreadCount} thông báo chưa đọc</Text>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={80} color="white" />
      <Text style={styles.emptyText}>Không có thông báo</Text>
      <Text style={styles.emptySubText}>Các thông báo mới sẽ xuất hiện ở đây</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="cover" style={styles.backgroundImage}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.bg_button} />
            <Text style={styles.loadingText}>Đang tải thông báo...</Text>
          </View>
        ) : (
          <FlatList
            data={notificationsData}
            keyExtractor={(item, idx) => String(item.id || idx)}
            renderItem={({ item }) => (
              <NotificationItem
                item={item}
                onPress={() => {
                  if (item.is_read == 0) {
                    markAsRead(item.id);
                  }
                  if (item.type == 1) {
                    navigation.replace("Đăng ký thi công", { noti: item });
                  } else {
                    navigation.navigate("DetailNotiScreen", { noti: item });
                  }
                }}
                onDelete={deleteNotification}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#EF4444"]} tintColor="#EF4444" />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  backgroundImage: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  loadingText: {
    marginTop: 12,
    fontSize: adjust(16),
    color: "#475569",
    fontWeight: "500",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 80,
    flexGrow: 1,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  unreadCount: {
    fontSize: adjust(15),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  markAllText: {
    fontSize: adjust(13),
    color: "#EF4444",
    fontWeight: "600",
  },
  item: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  itemGradient: {
    padding: 16,
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: adjust(16),
    color: "#1E293B",
    marginBottom: 6,
    lineHeight: adjust(22),
    fontWeight: "600",
  },
  unreadTitle: {
    fontWeight: "700",
    color: "#111827",
  },
  contentText: {
    fontSize: adjust(14),
    color: "#4B5563",
    marginBottom: 8,
    lineHeight: adjust(20),
  },
  time: {
    fontSize: adjust(12),
    color: "#6B7280",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: adjust(20),
    color: "white",
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: adjust(15),
    color: "white",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  swipeDeleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%", // Đảm bảo luôn bằng item
    borderRadius: 16,
    marginVertical: 0, // Xóa margin dọc để không bị lệch
    flexDirection: "column",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    padding: 0,
    overflow: "hidden", // Đảm bảo bo góc
  },
  swipeDeleteGradient: {
    flex: 1,
    width: 80,
    height: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0, // Xóa padding dọc
    paddingHorizontal: 0,
  },
  swipeDeleteText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: adjust(12),
    marginTop: 2,
    letterSpacing: 0.5,
  },
});

export default NotificationScreen;
