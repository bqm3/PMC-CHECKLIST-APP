//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";
import ItemHome from "../../components/Item/ItemHome";
import { COLORS } from "../../constants/theme";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import CopyRight from "../../components/CopyRight";

const dataDanhMuc = [
  {
    id: 1,
    path: "Thực hiện Check list",
    icon: require("../../../assets/icons/o-01.png"),
    role: 2,
  },
  {
    id: 2,
    path: "Tra cứu",
    icon: require("../../../assets/icons/o-02.png"),
    role: 2,
  },
  {
    id: 3,
    path: "Danh mục Khu vực",
    icon: require("../../../assets/icons/o-03.png"),
    role: 1,
  },
  {
    id: 4,
    path: "Danh mục Check list",
    icon: require("../../../assets/icons/o-04.png"),
    role: 1,
  },
  {
    id: 5,
    path: "Danh mục Giám sát",
    icon: require("../../../assets/icons/o-05.png"),
    role: 1,
  },
  {
    id: 6,
    path: "Danh mục Ca làm việc",
    icon: require("../../../assets/icons/o-06.png"),
    role: 1,
  },
];
// create a component
const HomeScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.authReducer);

  const renderItem = ({ item, index }) => (
    <ItemHome roleUser={user?.Permission} item={item} index={index} />
  );
  return (
    <ImageBackground
      source={require("../../../assets/thumbnail.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
            }}
          >
            Digital Transformation Good day and Happy
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: "white",
              fontWeight: "700",
              textTransform: "uppercase",
              paddingTop: 8,
            }}
          >
            Dự án: {user?.ent_duan?.Duan}
          </Text>
        </View>

        <View
          style={[
            styles.content,
            {
              width: "100%",
              alignContent: "center",
            },
          ]}
        >
          <FlatList
            style={{
              width: "100%",
              paddingHorizontal: 20,
            }}
            numColumns={3}
            data={dataDanhMuc}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            contentContainerStyle={{ gap: 20 }}
            columnWrapperStyle={{ gap: 20 }}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 15,
            }}
          >
            Người Giám sát chỉ thực hiện công việc Check list, Tra cứu và Đổi
            mật khẩu.
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 15,
            }}
          >
            Giám đốc Tòa nhà toàn quyền sử dụng.
          </Text>
        </View>

        <CopyRight />
      </View>
    </ImageBackground>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-around',
    paddingBottom:40
  },
  content: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});

//make this component available to the app
export default HomeScreen;
