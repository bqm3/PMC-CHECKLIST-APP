import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable"; // Import thư viện animatable
import adjust from "../../adjust"; // Giả sử đây là một module điều chỉnh kích thước
import { PanGestureHandler } from "react-native-gesture-handler";

const NotificationComponent = ({
  notification,
  animation,
  setAnimation,
  setNotification,
}) => {
  const [offsetY, setOffsetY] = useState(0); // Theo dõi khoảng cách vuốt

  const onActionPress = () => {
    const url = Platform.select({
      ios: "https://apps.apple.com/vn/app/checklist-pmc/id6503722675",
      android:
        "https://play.google.com/store/apps/details?id=com.anonymous.PMCCHECKLISTAPP&pcampaignid=web_share",
    });
    Linking.openURL(url).catch((err) =>
      console.error("Không thể mở liên kết:", err)
    );
  };

  useEffect(() => {
    if (animation === "slideOutUp") {
      setTimeout(() => setNotification(null), 500); // Xóa thông báo sau 500ms (thời gian animation)
    }
  }, [animation]);

  if (!notification) return null;

  return (
    // <PanGestureHandler onGestureEvent={onSwipeUp}>
    <Animatable.View
      style={[
        styles.banner,
        animation === "slideOutUp" && { height: 0, opacity: 0 },
      ]}
      animation={animation} // Animation khi thông báo xuất hiện
      duration={1000} // Thời gian animation xuất hiện
      useNativeDriver
    >
      <TouchableOpacity style={styles.banner_noti} onPress={onActionPress}>
        <View style={styles.noti}>
          <View style={styles.innerContainer}>
            <Image
              source={require("../../../assets/icons/ic_new3.png")}
              style={{
                width: adjust(30),
                height: adjust(30),
                marginRight: adjust(5),
                tintColor: "green",
              }}
              resizeMode="contain"
            />
            <Text style={styles.title}>{notification?.data?.textTitle}</Text>
          </View>

          <Text style={styles.body}>
            {notification?.data?.textBody} (Ấn vào thông báo để cập nhật)
          </Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
    // </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: adjust(150),
    zIndex: 100,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  banner_noti: {
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  body: {
    fontSize: 14,
    marginVertical: 5,
    fontWeight: "medium",
  },
  noti: {
    backgroundColor: "#f9fcfa",
    width: "95%",
    padding: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default NotificationComponent;
