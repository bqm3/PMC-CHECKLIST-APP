import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import adjust from "../../adjust";

const ModalBaocaochisoThangNam = ({ item, handleCloseBottomSheet }) => {
  const [showFullNote, setShowFullNote] = useState(false);
  const [height, setHeight] = useState(70)

  const handlePress = () => {
    setShowFullNote(!showFullNote);
    setHeight(100)
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
        <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleCloseBottomSheet}
          >
            <AntDesign name="close" size={24} color="red" />
          </TouchableOpacity>
          {/* Hình ảnh */}
          <Image
            source={{
              uri: `https://drive.google.com/thumbnail?id=${item.Image}&sz=w1000`,
            }}
            style={styles.image}
          />
          {/* <Text>test</Text> */}
          <View style={styles.row}>
            <View style={{ width: 100 }}>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Ngày gửi
              </Text>
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.title, { fontWeight: "500", color: "black" }]}
            >
              : {item?.Day}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={{ width: 100 }}>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Báo cáo
              </Text>
            </View>
            <View style={{ width: SIZES.width - 160 }}>
              <Text
                allowFontScaling={false}
                style={[styles.title, { fontWeight: "500", color: "black" }]}
              >
                : Tháng {item?.Month} - Năm {item?.Year}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ width: 100 }}>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Hạng mục
              </Text>
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.title, { fontWeight: "500", color: "black" }]}
            >
              : {item?.ent_hangmuc_chiso?.Ten_Hangmuc_Chiso} (
              {item?.ent_hangmuc_chiso?.ent_loai_chiso?.TenLoaiCS})
            </Text>
          </View>
          <View style={styles.row}>
            <View style={{ width: 100 }}>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Số tiêu thụ
              </Text>
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.title, { fontWeight: "500", color: "black" }]}
            >
              : {item?.Chiso}
            </Text>
          </View>
          <View style={[styles.row, { marginBottom: adjust(15) }]}>
            <View style={{ width: 100, height: 50 }}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.title,
                  {
                    color: "black",
                  },
                ]}
              >
                Số tiêu thụ tháng trước
              </Text>
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.title, { fontWeight: "500", color: "black" }]}
            >
              : {item?.Chiso_Before ? item?.Chiso_Before : "(Không có)"}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={{ width: 100 }}>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Người gửi
              </Text>
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.title, { fontWeight: "500", color: "black" }]}
            >
              : {item?.ent_user?.Hoten}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={{ width: 100 }}>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Ghi chú
              </Text>
            </View>
            <TouchableOpacity onPress={handlePress}>
              <View style={{ width: SIZES.width - 140, height: height }}>
                <Text
                  allowFontScaling={false}
                  style={[styles.title, { fontWeight: "500", color: "black" }]}
                  numberOfLines={showFullNote ? undefined : 2}
                  ellipsizeMode="tail"
                >
                  {`: ${item?.Ghichu}`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default React.memo(ModalBaocaochisoThangNam);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: adjust(250),
    resizeMode: "contain",
    // justifyContent: "center",
    // alignContent: "center",
    paddingBottom: 10,
  },
  title: {
    paddingTop: 4,
    fontSize: adjust(16),
    paddingVertical: 2,
    color: "black",
    fontWeight: "700",
    textAlign: "left",
    flexWrap: "wrap",
  },
  row: {
    width: "100%",
    height: adjust(30),
    flexDirection: "column",
    flexWrap: "wrap",
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
