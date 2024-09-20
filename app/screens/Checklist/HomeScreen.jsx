//import liraries
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  ent_calv_get,
  ent_hangmuc_get,
  ent_khuvuc_get,
  ent_tang_get,
  ent_toanha_get,
  ent_khoicv_get
} from "../../redux/actions/entActions";
import ItemHome from "../../components/Item/ItemHome";
import ItemHomePSH from "../../components/Item/ItemHomePSH";
import adjust from "../../adjust";

const dataDanhMuc = [
  {
    id: 1,
    path: "Thực hiện Checklist",
    icon: require("../../../assets/icons/o-01.png"),
  },
  {
    id: 2,
    path: "Tra cứu",
    icon: require("../../../assets/icons/o-02.png"),
  },
  {
    id: 3,
    path: "Checklist Lại",
    icon: require("../../../assets/icons/o-01.png"),
  },
  {
    id: 4,
    path: "Xử lý sự cố",
    icon: require("../../../assets/icons/o-04.png"),
  },
];

const dataGDKST = [
  {
    id: 1,
    path: "Thông báo sự cố",
    icon: require("../../../assets/icons/o-04.png"),
  },
  {
    id: 2,
    path: "Tra cứu",
    icon: require("../../../assets/icons/o-02.png"),
  },
];

// create a component
const HomeScreen = ({ navigation }) => {
  const dispath = useDispatch();
  const { user, authToken } = useSelector((state) => state.authReducer);


  const renderItem = ({ item, index }) => (
    <ItemHome ID_Chucvu={user?.ID_Chucvu} item={item} index={index} />
  );

  const int_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const int_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_tang = async () => {
    await dispath(ent_tang_get());
  };

  useEffect(() => {
    int_khuvuc();
    int_hangmuc();
    init_toanha();
    init_khoicv();
    init_tang();
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/bg_new.png")}
      resizeMode="stretch"
      style={{ flex: 1, width: "100%" }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {user.ent_duan.Logo ? (
            <Image
              source={{ uri: user.ent_duan.Logo }}
              resizeMode="contain"
              style={{ height: adjust(70), width: adjust(180) }}
            />
          ) : (
            <Image
              source={require("../../../assets/pmc_logo.png")}
              resizeMode="contain"
              style={{ height: adjust(80), width: adjust(200) }}
            />
            // <Text>Hello</Text>
          )}
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(20),
              color: "white",
              fontWeight: "700",
              textTransform: "uppercase",
              paddingTop: 8,
            }}
          >
            Dự án: {user?.ent_duan?.Duan}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              color: "white",
              fontSize: adjust(16),
              marginTop: 10,
            }}
            numberOfLines={1}
          >
            Tài khoản: {user?.UserName}
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
            numColumns={2}
            data={(user.ID_Chucvu == 4 || user.ID_Chucvu == 3) ? dataDanhMuc : dataGDKST}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
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
            allowFontScaling={false}
            style={{
              color: "white",
              fontSize: adjust(16),
            }}
          >
            Người Giám sát chỉ thực hiện công việc Checklist, Tra cứu và Đổi mật
            khẩu.
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              color: "white",
              fontSize: adjust(16),
            }}
          >
            Giám đốc Tòa nhà toàn quyền sử dụng.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});

//make this component available to the app
export default HomeScreen;
