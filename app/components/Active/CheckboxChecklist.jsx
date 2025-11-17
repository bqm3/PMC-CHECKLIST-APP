import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Linking
} from "react-native";
import adjust from "../../adjust";

const Checkbox = ({ isCheck, onPress, color, size, location }) => {
  const showAlert = () => {
    Alert.alert(
      "Thông báo",
      "Vui lòng chờ trong giây lát để ứng dụng lấy dữ liệu vị trí hoặc kiểm tra và cấp quyền truy cập vị trí trong phần Cài đặt để đảm bảo trải nghiệm tốt nhất.",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Mở cài đặt",
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  };
  return (
    <TouchableOpacity
      style={[
        styles.box,
        {
          borderColor: color ? color : "white",
          width: size ? adjust(30) : adjust(24),
          height: size ? adjust(30) : adjust(24),
        },
      ]}
      onPress={() => {
        if (location) {
          onPress();
        } else {
          showAlert();
        }
      }}
    >
      {isCheck && (
        <Image
          source={require("../../../assets/icons/ic_checkbox.png")}
          style={{
            width: adjust(size ? size * 0.9 : 20),
            height: adjust(size ? size * 0.9 : 20),
            tintColor: color ? color : "white",
          }}
          resizeMode="contain"
        />
        // <Entypo
        //   name="check"
        //   size={adjust(size ? size * 0.9 : 20)}
        //   color={color ? color : "black"}
        // />
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  box: {
    width: adjust(24),
    height: adjust(24),
    borderWidth: 2,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
