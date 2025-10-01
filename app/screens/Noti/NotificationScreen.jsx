import React, { useEffect, useState, useCallback, memo, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
  Alert,
  Platform,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import adjust from "../../adjust";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification as deleteNotificationApi } from "./api";
import { COLORS } from "../../constants/theme";

// Helper function for time formatting
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

// Memoized Notification Item
const NotificationItem = memo(({ item, onPress, onDelete }) => {
  const swipeableRef = useRef(null);

  const renderRightActions = useCallback(
    () => (
      <TouchableOpacity
        style={styles.swipeDeleteButton}
        onPress={() => {
          swipeableRef.current?.close();
          onDelete(item.id);
        }}
        activeOpacity={0.7}
      >
        <LinearGradient colors={["#EF4444", "#DC2626"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.swipeDeleteGradient}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.swipeDeleteText}>Xóa</Text>
        </LinearGradient>
      </TouchableOpacity>
    ),
    [item.id, onDelete]
  );

  const isUnread = item.is_read === 0;
  const gradientColors = useMemo(() => (isUnread ? ["#FFF1F2", "#FFE4E6"] : ["#FFFFFF", "#FAFAFA"]), [isUnread]);

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false} friction={2} rightThreshold={40}>
      <TouchableOpacity style={[styles.item, isUnread && styles.unreadItem]} onPress={onPress} activeOpacity={0.7}>
        <LinearGradient colors={gradientColors} style={styles.itemGradient}>
          {isUnread && <View style={styles.unreadIndicator} />}

          <View style={styles.itemHeader}>
            <View style={styles.iconContainer}>
              <LinearGradient colors={isUnread ? ["#EF4444", "#F87171"] : ["#94A3B8", "#CBD5E1"]} style={styles.iconGradient}>
                <Ionicons name={isUnread ? "notifications" : "notifications-outline"} size={20} color="#fff" />
              </LinearGradient>
            </View>

            <View style={styles.content}>
              <Text style={[styles.title, isUnread && styles.unreadTitle]} numberOfLines={2}>
                {item.title || "(Không có tiêu đề)"}
              </Text>
              <Text style={styles.contentText} numberOfLines={2}>
                {item.message || "(Không có nội dung)"}
              </Text>
              <View style={styles.footer}>
                <Ionicons name="time-outline" size={14} color="#94A3B8" />
                <Text style={styles.time}>{formatTime(item.created_at)}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Swipeable>
  );
});

const NotificationScreen = ({ navigation, route }) => {
  const { authToken } = useSelector((state) => state.authReducer);
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
        setUnreadCount(res.unreadCount || 0);
      } catch (err) {
        setNotificationsData([]);
        Alert.alert("Lỗi", err.response?.data?.message || "Không thể tải thông báo. Vui lòng thử lại!");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [authToken]
  );

  const markAsRead = useCallback(
    async (notificationId) => {
      const notification = notificationsData.find((item) => item.id === notificationId);
      if (!notification || notification.is_read === 1) return;

      // Optimistic update
      setNotificationsData((prev) => prev.map((item) => (item.id === notificationId ? { ...item, is_read: 1 } : item)));
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await markNotificationAsRead(authToken, notificationId);
      } catch (err) {
        // Rollback on error
        setNotificationsData((prev) => prev.map((item) => (item.id === notificationId ? { ...item, is_read: 0 } : item)));
        setUnreadCount((prev) => prev + 1);
        console.error("Error marking notification as read:", err);
      }
    },
    [authToken, notificationsData]
  );

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notificationsData.filter((item) => item.is_read === 0).map((item) => item.id);
    if (unreadIds.length === 0) return;

    try {
      await markAllNotificationsAsRead(authToken, unreadIds);
      setNotificationsData((prev) => prev.map((item) => ({ ...item, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      Alert.alert("Lỗi", err.response?.data?.message || "Không thể đánh dấu tất cả đã đọc!");
    }
  }, [authToken, notificationsData]);

  const deleteNotification = useCallback(
    (notificationId) => {
      Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa thông báo này?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNotificationApi(authToken, notificationId);
              setNotificationsData((prev) => {
                const deletedItem = prev.find((item) => item.id === notificationId);
                if (deletedItem?.is_read === 0) {
                  setUnreadCount((count) => Math.max(0, count - 1));
                }
                return prev.filter((item) => item.id !== notificationId);
              });
            } catch (err) {
              Alert.alert("Lỗi", err.response?.data?.message || "Không thể xóa thông báo!");
            }
          },
        },
      ]);
    },
    [authToken]
  );

  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  const renderHeader = useCallback(() => {
    if (unreadCount === 0) return null;

    return (
      <LinearGradient colors={["#EF4444", "#DC2626"]} style={styles.headerActions} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <View style={styles.headerLeft}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
          <Text style={styles.unreadCount}>thông báo chưa đọc</Text>
        </View>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead} activeOpacity={0.8}>
          <Ionicons name="checkmark-done" size={16} color="#EF4444" />
          <Text style={styles.markAllText}>Đánh dấu tất cả</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }, [unreadCount, markAllAsRead]);

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <LinearGradient colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]} style={styles.emptyIconGradient}>
            <Ionicons name="notifications-off-outline" size={64} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </View>
        <Text style={styles.emptyText}>Không có thông báo</Text>
        <Text style={styles.emptySubText}>Các thông báo mới sẽ xuất hiện ở đây</Text>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item, idx) => String(item.id || idx), []);

  const renderItem = useCallback(
    ({ item }) => {
      const handlePress = () => {
        // Đánh dấu đã đọc nếu chưa đọc
        if (item.is_read === 0) {
          markAsRead(item.id);
        }

        // Điều hướng dựa trên loại thông báo
        if (item.type === 1) {
          const screen = item.id_detail ? "ChiTietDKTC" : "Đăng ký thi công";
          const params = item.id_detail ? { id: item.id_detail, headerTitle: item.title_detail } : { noti: item };

          if (item.id_detail) {
            navigation.navigate(screen, params);
          } else {
            navigation.navigate(screen, params);
          }
        } else {
          navigation.navigate("DetailNotiScreen", { noti: item });
        }
      };

      return <NotificationItem item={item} onPress={handlePress} onDelete={deleteNotification} />;
    },
    [markAsRead, deleteNotification, navigation]
  );

  if (loading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="cover" style={styles.backgroundImage}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EF4444" />
            <Text style={styles.loadingText}>Đang tải thông báo...</Text>
          </View>
        </ImageBackground>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="cover" style={styles.backgroundImage}>
        <FlatList
          data={notificationsData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchNotificationsData(true)}
              colors={["#EF4444"]}
              tintColor="#EF4444"
              progressBackgroundColor="#ffffff"
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
        />
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  loadingText: {
    marginTop: 16,
    fontSize: adjust(16),
    color: "#64748B",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#EF4444",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    minWidth: 32,
    alignItems: "center",
  },
  badgeText: {
    fontSize: adjust(14),
    color: "#EF4444",
    fontWeight: "700",
  },
  unreadCount: {
    fontSize: adjust(15),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 4,
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    backgroundColor: "#fff",
  },
  unreadItem: {
    shadowColor: "#EF4444",
    shadowOpacity: 0.2,
    elevation: 5,
  },
  itemGradient: {
    borderRadius: 16,
  },
  unreadIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#EF4444",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  itemHeader: {
    flexDirection: "row",
    padding: 14,
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 12,
  },
  iconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: adjust(16),
    color: "#334155",
    marginBottom: 6,
    lineHeight: adjust(22),
    fontWeight: "600",
  },
  unreadTitle: {
    fontWeight: "700",
    color: "#0F172A",
  },
  contentText: {
    fontSize: adjust(14),
    color: "#64748B",
    marginBottom: 8,
    lineHeight: adjust(20),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  time: {
    fontSize: adjust(12),
    color: "#94A3B8",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  emptyText: {
    fontSize: adjust(20),
    color: "#fff",
    fontWeight: "700",
    marginTop: 8,
  },
  emptySubText: {
    fontSize: adjust(14),
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  swipeDeleteButton: {
    justifyContent: "center",
    width: 80,
    marginLeft: 8,
    borderRadius: 16,
  },
  swipeDeleteGradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  swipeDeleteText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: adjust(12),
    letterSpacing: 0.5,
  },
});

export default NotificationScreen;
