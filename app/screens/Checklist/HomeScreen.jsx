//import liraries
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  ent_calv_get,
  ent_hangmuc_get,
  ent_khuvuc_get,
  ent_tang_get,
  ent_toanha_get,
  ent_khoicv_get,
} from "../../redux/actions/entActions";
import { Alert, Linking } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { BASE_URL } from "../../constants/config";
import ItemHome from "../../components/Item/ItemHome";
import adjust from "../../adjust";
import ReportContext from "../../context/ReportContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const handleRegistrationError = (message) => {
  Alert.alert("Lỗi", message);
};

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Only show the settings alert if finalStatus is not granted
    if (finalStatus !== "granted") {
      Alert.alert(
        "Thông báo",
        "Bạn đã từ chối nhận thông báo. Hãy bật thông báo trong Cài đặt để tiếp tục.",
        [
          {
            text: "Mở cài đặt",
            onPress: () => Linking.openSettings(), // Open app settings if the user denies notification permissions
          },
          { text: "Hủy", style: "cancel" },
        ]
      );
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError("Không tìm thấy thông tin máy");
      return;
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Phải sử dụng thiết bị thật");
  }
}

const dataDanhMuc = [
  {
    id: 1,
    status: null,
    path: "Thực hiện Checklist",
    icon: require("../../../assets/icons/o-01.png"),
  },
  {
    id: 2,
    status: null,
    path: "Tra cứu",
    icon: require("../../../assets/icons/o-02.png"),
  },

  {
    id: 3,
    status: null,
    path: "Checklist Lại",
    icon: require("../../../assets/icons/o-01.png"),
  },
  {
    id: 4,
    status: null,
    path: "Xử lý sự cố",
    icon: require("../../../assets/icons/o-04.png"),
  },
  {
    id: 5,
    status: "new",
    path: "Báo cáo chỉ số",
    icon: require("../../../assets/icons/o-05.png"),
  },
];

const dataGD = [
  {
    id: 1,
    status: null,
    path: "Thông báo sự cố",
    icon: require("../../../assets/icons/o-04.png"),
  },
  {
    id: 2,
    status: null,
    path: "Tra cứu",
    icon: require("../../../assets/icons/o-02.png"),
  },
  {
    id: 5,
    status: "new",
    path: "Báo cáo chỉ số",
    icon: require("../../../assets/icons/o-05.png"),
  },
];

const dataKST = [
  {
    id: 1,
    status: null,
    path: "Thực hiện Checklist",
    icon: require("../../../assets/icons/o-01.png"),
  },
  {
    id: 2,
    status: null,
    path: "Tra cứu",
    icon: require("../../../assets/icons/o-02.png"),
  },
  {
    id: 4,
    status: null,
    path: "Checklist Lại",
    icon: require("../../../assets/icons/o-01.png"),
  },

  {
    id: 3,
    status: null,
    path: "Xử lý sự cố",
    icon: require("../../../assets/icons/o-04.png"),
  },
  {
    id: 5,
    status: "new",
    path: "Báo cáo chỉ số",
    icon: require("../../../assets/icons/o-05.png"),
  },
];

// create a component
const HomeScreen = ({ navigation }) => {
  const dispath = useDispatch();
  const { user, authToken } = useSelector((state) => state.authReducer);
  const { setShowReport, showReport } = useContext(ReportContext);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  const renderItem = ({ item, index }) => (
    <ItemHome
      ID_Chucvu={user?.ID_Chucvu}
      item={item}
      index={index}
      showReport={showReport}
    />
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

  const int_calv = async () => {
    await dispath(ent_calv_get());
  };

  useEffect(() => {
    int_khuvuc();
    int_hangmuc();
    init_toanha();
    init_khoicv();
    init_tang();
    int_calv();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const dataRes = async () => {
      await axios
        .post(
          BASE_URL + "/ent_user/device-token",
          {
            deviceToken: expoPushToken,
          },
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        )
        .then((response) => {})
        .catch((err) => console.log("err device", err));
    };
    dataRes();
  }, [authToken]);

  // useEffect(() => {
  //   const dataRes = async () => {
  //     await axios
  //       .post(BASE_URL + "/date", {
  //         ID_Duan: user.ID_Duan
  //       })
  //       .then((response) => {
  //         setShowReport(response.data.data);
  //       })
  //       .catch((err) => console.log("err device", err));
  //   };
  //   dataRes();
  // }, [authToken]);
  // console.log('show', showReport)

  return (
    <ImageBackground
      source={require("../../../assets/bg_new.png")}
      resizeMode="stretch"
      style={{ flex: 1, width: "100%" }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {user?.ent_duan?.Logo ? (
            <Image
              source={{ uri: user?.ent_duan?.Logo }}
              resizeMode="contain"
              style={{ height: adjust(70), width: adjust(180) }}
            />
          ) : (
            <Image
              source={require("../../../assets/pmc_logo.png")}
              resizeMode="contain"
              style={{ height: adjust(80), width: adjust(200) }}
            />
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
            data={(() => {
              const baseData =
                user?.ent_chucvu?.Role == 3
                  ? dataDanhMuc
                  : user?.ent_chucvu?.Role == 1
                  ? dataGD
                  : user?.ent_chucvu?.Role == 2 && dataKST;

              // Kiểm tra showReport.show để lọc dữ liệu
              // return showReport?.show
              //   ? baseData
              //   : baseData?.filter((item) => item.path !== "Báo cáo chỉ số");

                return baseData
            })()}
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
