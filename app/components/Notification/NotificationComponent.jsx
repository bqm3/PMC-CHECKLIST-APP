import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable"; // Import thư viện animatable
import New from "../../../assets/icons/ic_new2.svg";
import adjust from "../../adjust"; // Giả sử đây là một module điều chỉnh kích thước
import { PanGestureHandler } from "react-native-gesture-handler";

const NotificationComponent = ({
  notification,
  animation,
  setAnimation,
  setNotification,
}) => {
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

  const onSwipeUp = (event) => {
    if (event.nativeEvent.translationY < -10) {
      setAnimation("slideOutUp");
     // setNotification(null);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onSwipeUp}>
      <Animatable.View
        style={[
          styles.banner,
          {
            backgroundColor: "white",
          },
        ]}
        animation={animation} // Animation khi thông báo xuất hiện
        duration={1000} // Thời gian animation xuất hiện
        useNativeDriver
      >
        <TouchableOpacity style={styles.banner} onPress={onActionPress}>
          <View style={styles.innerContainer}>
            <New
              width={adjust(30)}
              height={adjust(30)}
              marginRight={adjust(5)}
            />
            <Text style={styles.title}>{notification?.data?.textTitle}</Text>
          </View>

          <Text style={styles.body}>
            {notification?.data?.textBody} (Ấn vào thông báo để cập nhật)
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: adjust(100),
    zIndex: 100,
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  body: {
    fontSize: 14,
    marginVertical: 5,
  },
});

export default NotificationComponent;
