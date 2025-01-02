import ChecklistContext from "../../context/ChecklistContext";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Linking,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS } from "../../constants/theme";
import adjust from "../../adjust";
import axios from "axios";
import { BASE_URL } from "../../constants/config";

const NotKhuVucTracuuCa = ({ route, navigation }) => {
  const { Date, ID_Calv } = route.params;
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [dataKhuvuc, setDataKhuvuc] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);


  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async() => {
    setIsLoadingDetail(true)
    try {
      const res = await axios.get(
        `${BASE_URL}/ent_checklist/filter-mul-day/${Date}/${ID_Calv}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
        setDataKhuvuc(res.data.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const toggleTodo = (item) => {
    navigation.navigate("Tổng hạng mục chưa checklist", {
      hangmucs: item.hangmucs,
    });
  }


  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => toggleTodo(item)}
        style={[
          styles.content,
          {
            backgroundColor:
              dataSelect[0] === item ? COLORS.bg_button : "white",
          },
        ]}
        key={index}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "90%",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: dataSelect[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.ent_khuvuc?.Tenkhuvuc} - {item?.ent_khuvuc?.ent_toanha?.Toanha}
          </Text>
        </View>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 50,
            backgroundColor: dataSelect[0] === item ? "white" : "gray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: adjust(16),
              color: dataSelect[0] === item ? "black" : "white",
              fontWeight: "600",
            }}
          >
            {item?.hangmucs.length}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg.png")}
              resizeMode="cover"
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  // opacity: opacity,
                }}
              >
                <View style={{ margin: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      // onPress={() => handleFilterData(true, 0.5)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "cloumn",
                          gap: 8,
                        }}
                      >
                        {isLoadingDetail == false && (
                          <Text
                            allowFontScaling={false}
                            style={[styles.text, { fontSize: adjust(18) }]}
                          >
                            Số lượng: {dataKhuvuc?.length} khu vực
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {isLoadingDetail === false &&
                  dataKhuvuc &&
                  dataKhuvuc?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={dataKhuvuc}
                        renderItem={({ item, index, separators }) =>
                          renderItem(item, index)
                        }
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 16 }} />
                        )}
                        showsVerticalScrollIndicator = {false}
                        keyExtractor={(item, index) =>
                          `${item?.ID_Checklist}_${index}`
                        }
                      />
                    </>
                  )}

                {isLoadingDetail === false && dataKhuvuc?.length == 0 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 80,
                    }}
                  >
                    <Image
                      source={require("../../../assets/icons/delete_bg.png")}
                      resizeMode="contain"
                      style={{ height: 120, width: 120 }}
                    />
                    <Text
                      allowFontScaling={false}
                      style={[styles.danhmuc, { padding: 10 }]}
                    >
                      Khu vực của ca này đã hoàn thành !
                    </Text>
                  </View>
                )}

                {isLoadingDetail === true && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator
                      style={{
                        marginRight: 4,
                      }}
                      size="large"
                      color={COLORS.bg_white}
                    ></ActivityIndicator>
                  </View>
                )}
              </View>
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default NotKhuVucTracuuCa;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: adjust(15), color: "white", fontWeight: "600" },
  headerTable: {
    color: "white",
  },
  outter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.color_bg,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: adjust(20),
    fontWeight: "600",
    paddingVertical: 10,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
