import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import adjust from "../../adjust";

const ModalCallSucongoai = ({ userPhone, setIsModalcall }) => {
  const handleCall = (numberPhone) => {
    if (numberPhone) {
      Linking.openURL(`tel:${numberPhone}`).catch((err) =>
        console.error("Failed to make a call", err)
      );
    } else {
      console.log("Số điện thoại không hợp lệ");
    }
  };

  const renderSeparator = () => <View style={styles.separator} />;

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          handleCall(item.Sodienthoai);
        }}
      >
        <View >
        <View style={styles.nameContainer}>
            <Text allowFontScaling={false} style={styles.name}>
              {item.Hoten}
            </Text>
            <Text allowFontScaling={false} style={styles.position}>
              ({item.ent_chucvu.Chucvu})
            </Text>
          </View>

          <View style={styles.phoneContainer}>
            <Text allowFontScaling={false} style={styles.phoneNumber}>
              {item.Sodienthoai}
            </Text>
            <View style={styles.callButton}>
              <Image
                source={require("../../../assets/icons/ic_phone2.png")}
                style={styles.phoneIcon}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Liên hệ</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalcall(false)}
            >
              <Image
                source={require("../../../assets/icons/ic_close.png")}
                style={[styles.closeIcon, {tintColor: "white"}]}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.list}
            data={userPhone}
            ItemSeparatorComponent={renderSeparator}
            renderItem={renderItem}
            scrollEventThrottle={16}
            ListFooterComponent={<View style={{ height: 80 }} />}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default React.memo(ModalCallSucongoai);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(242, 242, 242, 0.98)",
  },
  content: {
    flex: 1,
    padding: adjust(15),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: adjust(15),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: adjust(10),
  },
  headerTitle: {
    fontSize: adjust(20),
    fontWeight: "600",
    color: COLORS.primary,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    borderRadius: adjust(12),
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
  },
  name: {
    fontSize: adjust(16),
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: adjust(4),
    marginEnd: adjust(4),
  },
  position: {
    fontSize: adjust(14),
    color: "#7f8c8d",
    fontWeight: "500",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneNumber: {
    fontSize: adjust(15),
    color: "#34495e",
    fontWeight: "500",
    width: adjust(100),
        marginEnd: adjust(4),
  },
  callButton: {
    width: adjust(20),
    height: adjust(20),
    borderRadius: adjust(20),
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginEnd: adjust(10)
  },
  closeIcon: {
    width: adjust(20),
    height: adjust(20),
  },
  phoneIcon: {
    width: adjust(15),
    height: adjust(15),
    transform: [{ scaleX: -1 }],
  },
  closeButton: {
    width: adjust(36),
    height: adjust(36),
    borderRadius: adjust(18),
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginVertical: adjust(8),
    marginHorizontal: adjust(15),
  },
});
