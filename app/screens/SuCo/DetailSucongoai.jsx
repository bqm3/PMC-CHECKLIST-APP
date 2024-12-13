import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Entypo, AntDesign, Feather } from "@expo/vector-icons";
import { Provider, useDispatch, useSelector } from "react-redux";
import adjust from "../../adjust";
import moment from "moment";
import { COLORS, SIZES } from "../../constants/theme";
import { funcBaseUri_Image, getImageUrls } from "../../utils/util";

const DetailSucongoai = ({ navigation, route }) => {
  const data = route.params.data;

  const dispath = useDispatch();
  const { user, authToken } = useSelector((state) => state.authReducer);

  const images = data?.Duongdancacanh ? data.Duongdancacanh.split(",") : [];
  const imagesHandle = data?.Anhkiemtra ? data.Anhkiemtra.split(",") : [];
  const formattedTime = data?.Giosuco.slice(0, 5);

  const [isShowImage, setIsShowImage] = useState(false);
  const [dataImage, setDataImage] = useState(null);

  const handleShowImage = (img) => {
    setIsShowImage(true);
    setDataImage(img);
  };

  // const getImageUrls = (item) => {
  //   console.log('item', item)
  //   if (!item) return null;
  //   return item.endsWith(".jpg")
  //     ? funcBaseUri_Image(3, item.trim())
  //     : `https://drive.google.com/thumbnail?id=${item.trim()}&sz=w1000`;
  // };

  const [isLoading, setIsLoading] = useState(true);

  console.log("data", data);
  console.log("imagesHandle", imagesHandle);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg_new.png")}
              resizeMode="stretch"
              style={{ flex: 1, width: "100%" }}
            >
              <>
                {isShowImage ? (
                  <View style={styles.container}>
                    {isLoading && (
                      <ActivityIndicator
                        size="large"
                        color="#ffffff"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: [{ translateX: -25 }, { translateY: -25 }],
                        }}
                      />
                    )}
                    <Image
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                      source={{
                        uri: getImageUrls(3, dataImage),
                      }}
                      onLoadStart={() => setIsLoading(true)}
                      onLoadEnd={() => setIsLoading(false)}
                      onError={() => {
                        setIsLoading(false);
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 50,
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => setIsShowImage(false)}
                    >
                      <AntDesign name="close" size={adjust(40)} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                      <Text style={styles.header}>
                        Tình trạng:{" "}
                        {(data.Tinhtrangxuly == 0 && "Chưa xử lý") ||
                          (data.Tinhtrangxuly == 1 && "Đang xử lý") ||
                          (data.Tinhtrangxuly == 2 && "Đã xử lý")}
                      </Text>
                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Hạng mục
                        </Text>

                        <View style={styles.action}>
                          <TextInput
                            allowFontScaling={false}
                            value={
                              data?.ent_hangmuc?.Hangmuc || "Chưa có hạng mục"
                            }
                            editable={false}
                            placeholder="Hạng mục"
                            placeholderTextColor="gray"
                            style={{
                              paddingLeft: 12,
                              color: "#05375a",
                              width: "75%",
                              fontSize: adjust(16),
                              height: adjust(50),
                            }}
                            pointerEvents="none"
                          />
                        </View>
                      </View>
                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Người gửi
                        </Text>

                        <View style={styles.action}>
                          <TextInput
                            allowFontScaling={false}
                            value={`${data?.ent_user?.Hoten} - ${data?.ent_user?.ent_chucvu?.Chucvu}`}
                            editable={false}
                            placeholder="Hạng mục"
                            placeholderTextColor="gray"
                            style={{
                              paddingLeft: 12,
                              color: "#05375a",
                              width: "75%",
                              fontSize: adjust(16),
                              height: adjust(50),
                            }}
                            pointerEvents="none"
                          />
                        </View>
                      </View>
                      {data?.ID_Handler != null && (
                        <View style={{ width: "100%" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            Người xử lý
                          </Text>

                          <View style={styles.action}>
                            <TextInput
                              allowFontScaling={false}
                              value={`${data?.ent_handler?.Hoten} - ${data?.ent_handler?.ent_chucvu?.Chucvu}`}
                              editable={false}
                              placeholder="Hạng mục"
                              placeholderTextColor="gray"
                              style={{
                                paddingLeft: 12,
                                color: "#05375a",
                                width: "75%",
                                fontSize: adjust(16),
                                height: adjust(50),
                              }}
                              pointerEvents="none"
                            />
                          </View>
                        </View>
                      )}
                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Ngày giờ sự cố
                        </Text>

                        <View style={styles.action}>
                          <TextInput
                            allowFontScaling={false}
                            value={`${formattedTime} ${moment(
                              data.Ngaysuco
                            ).format("DD-MM-YYYY")}`}
                            editable={false}
                            placeholder="Hạng mục"
                            placeholderTextColor="gray"
                            style={{
                              paddingLeft: 12,
                              color: "#05375a",
                              width: "75%",
                              fontSize: adjust(16),
                              height: adjust(50),
                            }}
                            pointerEvents="none"
                          />
                        </View>
                      </View>
                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Ngày xử lý
                        </Text>
                        <View style={styles.action}>
                          <TextInput
                            allowFontScaling={false}
                            value={data?.Ngayxuly || "Chưa có"}
                            editable={false}
                            style={{
                              paddingLeft: 12,
                              color: "#05375a",
                              fontSize: adjust(16),
                              height: adjust(50),
                            }}
                            pointerEvents="none"
                          />
                        </View>
                      </View>
                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Nội dung sự cố
                        </Text>
                        <View style={styles.inputs}>
                          <TextInput
                            allowFontScaling={false}
                            value={data?.Noidungsuco}
                            editable={false}
                            placeholder="Nội dung sự cố"
                            placeholderTextColor="gray"
                            multiline
                            style={[
                              styles.textInput,
                              {
                                paddingHorizontal: 10,
                                height: 70,
                                textAlignVertical: "top",
                              },
                            ]}
                            autoCapitalize="sentences"
                          />
                        </View>
                      </View>
                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Hình ảnh
                        </Text>
                        <FlatList
                          horizontal={true}
                          contentContainerStyle={{
                            flexGrow: 1,
                            gap: 12,
                          }}
                          data={images}
                          renderItem={({ item, index }) => (
                            <View>
                              <Image
                                source={{
                                  uri: getImageUrls(3, item),
                                }}
                                style={{
                                  width: 100,
                                  height: 140,
                                  position: "relative",
                                  opacity: 0.9,
                                }}
                              />
                              <TouchableOpacity
                                style={{
                                  position: "absolute",
                                  top: 40,
                                  left: 30,
                                  width: 50,
                                  height: 50,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                onPress={() => handleShowImage(item)}
                              >
                                <Feather
                                  name="zoom-in"
                                  size={adjust(30)}
                                  color="gray"
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                          scrollEventThrottle={16}
                          scrollEnabled={true}
                        />
                      </View>
                      {data.Tinhtrangxuly == 2 && (
                        <View>
                          <View style={{ width: "100%" }}>
                            <Text allowFontScaling={false} style={styles.text}>
                              Ghi chú
                            </Text>
                            <View style={styles.inputs}>
                              <TextInput
                                allowFontScaling={false}
                                value={
                                  data?.Ghichu === null ||
                                  data?.Ghichu === undefined ||
                                  data?.Ghichu === "undefined"
                                    ? ""
                                    : data.Ghichu
                                }
                                editable={false}
                                placeholder="Nội dung ghi chú"
                                placeholderTextColor="gray"
                                multiline
                                style={[
                                  styles.textInput,
                                  {
                                    height: 70,
                                    paddingHorizontal: 10,
                                    paddingLeft: 10,
                                    textAlignVertical: "top",
                                  },
                                ]}
                                autoCapitalize="sentences"
                              />
                            </View>
                          </View>
                          {imagesHandle.length > 0 && (
                            <View style={{ width: "100%" }}>
                              <Text
                                allowFontScaling={false}
                                style={styles.text}
                              >
                                Hình ảnh xử lý
                              </Text>
                              <FlatList
                                horizontal={true}
                                contentContainerStyle={{
                                  flexGrow: 1,
                                  gap: 12,
                                }}
                                data={imagesHandle}
                                renderItem={({ item, index }) => (
                                  <View>
                                    <Image
                                      source={{
                                        uri: getImageUrls(3, item),
                                      }}
                                      style={{
                                        width: 100,
                                        height: 140,
                                        position: "relative",
                                        opacity: 0.9,
                                      }}
                                    />
                                    <TouchableOpacity
                                      style={{
                                        position: "absolute",
                                        top: 40,
                                        left: 30,
                                        width: 50,
                                        height: 50,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                      onPress={() => handleShowImage(item)}
                                    >
                                      <Feather
                                        name="zoom-in"
                                        size={adjust(30)}
                                        color="gray"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                scrollEventThrottle={16}
                                scrollEnabled={true}
                              />
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </ScrollView>
                )}
              </>
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DetailSucongoai;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
  },
  text: {
    fontSize: 15,
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 50,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  action: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 50,
    backgroundColor: "white",
    zIndex: 1,
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: adjust(15),
    color: "white",
    fontWeight: "500",
  },
  checkbox: {
    margin: 8,
    width: 24,
    height: 24,
  },
  image: {
    height: 100,
    resizeMode: "center",
    marginVertical: 10,
  },
  button: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  header: {
    fontSize: adjust(20),
    color: "white",
    fontWeight: "600",
    paddingLeft: 4,
  },
});
