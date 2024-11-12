import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import ActiveChecklist from "../../components/Active/ActiveCheckList";
import Button from "../../components/Button/Button";
import ChecklistContext from "../../context/ChecklistContext";
import adjust from "../../adjust";
import WebView from "react-native-webview";
import { useHeaderHeight } from "@react-navigation/elements";

const NotCheckList = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Hangmuc, hangMuc, Hangmuc, isScan } =
    route.params;

  const { isLoadingDetail } = useSelector((state) => state.entReducer);
  const { dataChecklistFilterContext } = useContext(ChecklistContext);
  const [dataChecklistFilter, setDataChecklistFilter] = useState([]);
  const [tieuchuan, setTieuchuan] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [modalVisibleTieuChuan, setModalVisibleTieuChuan] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const headerHeight = useHeaderHeight();

  useEffect(() => {
    const dataChecklist = dataChecklistFilterContext?.filter(
      (item) => item.ID_Hangmuc == ID_Hangmuc
    );

    setDataChecklistFilter(dataChecklist);
  }, [ID_Hangmuc]);

  // view item flatlist
  const renderItem = (item, index) => {
    return (
      <View
        style={[
          styles.content,
          {
            backgroundColor: `${item?.Tinhtrang}` === "1" ? "#ea9999" : "white",
          },
        ]}
        key={item?.ID_Checklist}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={{ width: "90%" }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(16),
                  color: "black",
                  fontWeight: "600",
                }}
                numberOfLines={5}
              >
                {item?.Sothutu}. {item?.Checklist}
              </Text>
            </View>
          </View>

          <View
            style={{
              // width: "25%",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            {item.Tieuchuan !== "" && item.Tieuchuan !== null ? (
              <TouchableOpacity
                onPress={() => handlePopupActiveTieuChuan(item, index)}
              >
                <Image
                  source={require("../../../assets/icons/ic_certificate.png")}
                  style={{
                    width: adjust(30),
                    height: adjust(30),
                    tintColor: "black",
                  }}
                />
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  width: adjust(30),
                  height: adjust(30),
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  // format number
  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    if (number == 0) return `0`;
    return number;
  };

  const handlePopupActiveTieuChuan = useCallback((item, index) => {
    setOpacity(0.2);
    setTieuchuan(item.Tieuchuan);
    setModalVisibleTieuChuan(true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <BottomSheetModalProvider>
          <ImageBackground
            source={require("../../../assets/bg.png")}
            resizeMode="cover"
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex: 1,
                opacity: opacity,
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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={[styles.text, { fontSize: 17 }]}
                        >
                          Hạng mục: {Hangmuc?.Hangmuc}
                        </Text>
                        {Hangmuc.Important === 1 && (
                          <Image
                            source={require("../../../assets/icons/ic_star.png")}
                            style={{
                              width: 20,
                              height: 20,
                              marginLeft: 5,
                              tintColor: "white",
                            }}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          Số lượng: {decimalNumber(dataChecklistFilter?.length)}{" "}
                          Checklist
                        </Text>
                        {Hangmuc?.FileTieuChuan !== null &&
                          Hangmuc?.FileTieuChuan !== undefined &&
                          Hangmuc?.FileTieuChuan !== "" && (
                            <View>
                              <TouchableOpacity
                                onPress={() => {
                                  setShow(true);
                                }}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  source={require("../../../assets/icons/ic_bookmark.png")}
                                  style={{
                                    tintColor: "white",
                                    resizeMode: "contain",
                                  }}
                                />
                                <Text style={styles.text}>Tiêu chuẩn </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {isLoadingDetail === false &&
                dataChecklistFilter &&
                dataChecklistFilter?.length > 0 && (
                  <>
                    <FlatList
                      style={{
                        margin: 12,
                        flex: 1,
                        marginBottom: 80,
                      }}
                      data={dataChecklistFilter}
                      renderItem={({ item, index, separators }) =>
                        renderItem(item, index)
                      }
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />
                      )}
                      showsHorizontalScrollIndicator = {false}
                      keyExtractor={(item, index) =>
                        `${item?.ID_Checklist}_${index}`
                      }
                    />
                  </>
                )}

              {isLoadingDetail === true && dataChecklistFilter?.length == 0 && (
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

          {/* Modal show tieu chuan  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleTieuChuan}
            onRequestClose={() => {
              setModalVisibleTieuChuan(!modalVisibleTieuChuan);
            }}
          >
            <View style={[styles.centeredView, { height: "100%" }]}>
              <View
                style={[
                  styles.modalView,
                  {
                    width: "60%",
                    height: "auto",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignContent: "center",
                  },
                ]}
              >
                <ScrollView>
                  <Text allowFontScaling={false} style={{ paddingBottom: 30 }}>
                    {tieuchuan}{" "}
                  </Text>
                </ScrollView>
                <Button
                  text={"Đóng"}
                  backgroundColor={COLORS.bg_button}
                  color={"white"}
                  onPress={() => {
                    setModalVisibleTieuChuan(false);
                    setOpacity(1);
                  }}
                />
              </View>
            </View>
          </Modal>

          <Modal
            animationType={"slide"}
            transparent={false}
            visible={show}
            onRequestClose={() => {
              console.log("Modal has been closed.");
            }}
          >
            <TouchableOpacity onPress={() => setShow(false)}>
              <Image
                source={require("../../../assets/icons/ic_close.png")}
                style={{
                  width: adjust(30),
                  height: adjust(30),
                  marginTop: 40,
                  textAlign: "right",
                  marginRight: 20,
                  marginBottom: 10,
                  alignSelf: "flex-end",
                }}
              />
            </TouchableOpacity>
            {Hangmuc?.FileTieuChuan && (
              <View
                style={{
                  flex: 1,
                }}
              >
                {loading && (
                  <View
                    style={{
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                    }}
                  >
                    <ActivityIndicator size="large" color="gray" />
                  </View>
                )}

                <WebView
                  style={{ flex: 1 }}
                  source={{
                    uri: Hangmuc.FileTieuChuan,
                  }}
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => setLoading(false)}
                />
              </View>
            )}
          </Modal>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default NotCheckList;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
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
    width: adjust(20),
    height: adjust(20),
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
    // flex: 1,
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
    padding: 10,
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
