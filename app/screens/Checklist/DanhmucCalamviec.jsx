import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
  } from "react-native";
  import React, { useRef, useState, useEffect } from "react";
  import { Dropdown } from "react-native-element-dropdown";
  import moment from "moment";
  import ButtonChecklist from "../../components/ButtonCheckList";
  import { COLORS, SIZES } from "../../constants/theme";
  import { AntDesign, Ionicons } from "@expo/vector-icons";
  import ItemKhuVuc from "../../components/ItemKhuVuc";
  import ItemGiamSat from "../../components/ItemGiamSat";
import ItemCalamviec from "../../components/ItemCalamviec";
  
  const calamviecList = [
    { label: "Nam", value: "sang" },
    { label: "Nữ", value: "chieu" },
    { label: "Khác", value: "toi" },
  ];
  
  const data = [
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
    {
      id: 1,
      title: "123",
    },
  ];
  
  const DanhmucCalamviec = ({ navigation }) => {
    const ref = useRef(null);
    const [heightView, setHeigtView] = useState(0);
    const date = new Date();
    const dateHour = moment(date).format("LT");
    const dateDay = moment(date).format("L");
    const [valueDate, setValueDate] = useState("");
  
    const HideKeyboard = ({ children }) => (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            {
              flexDirection: "column",
            },
          ]}
        >
          <HideKeyboard>
            <View
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                // console.log(x, y, width, height)
                setHeigtView(height);
              }}
              style={{
                flexDirection: "column",
                padding: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    flex: 2.8,
                    justifyContent: "space-around",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={styles.text}>Tên ca</Text>
                  <Text style={styles.text}>Giờ bắt đầu</Text>
                  <Text style={styles.text}>Giờ kết thúc</Text>
                </View>
                <View style={{ flex: 7, justifyContent: "space-around" }}>
                  <View style={{ marginLeft: 10 }}>
                    <TextInput
                    //   value={dateDay}
                    placeholder="Tên ca"
                      placeholderTextColor="#666666"
                      style={[
                        styles.textInput,
                        {
                          paddingHorizontal: 10,
                        },
                      ]}
                      autoCapitalize="none"
                    />
                  </View>
                
                  <View style={{ marginLeft: 10, marginVertical: 10 }}>
                    <TextInput
                      // value={"dateHour"}
                      placeholder="Giờ bắt đầu"
                      placeholderTextColor="#666666"
                      style={[
                        styles.textInput,
                        {
                          paddingHorizontal: 10,
                        },
                      ]}
                      onChangeText={(data) => console.log("run", data)}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <TextInput
                    placeholder="Giờ kết thúc"
                      // value={"dateHour"}
                      placeholderTextColor="#666666"
                      style={[
                        styles.textInput,
                        {
                          paddingHorizontal: 10,
                        },
                      ]}
                      onChangeText={(data) => console.log("run", data)}
                    />
                  </View>
                </View>
              </View>
              <View>
                <Text style={{
                    fontSize: 15,
                    color: 'black',
                    paddingHorizontal: 12,
                    paddingTop: 10,
                }}>
                Công việc tạo Ca checklist chỉ làm 1 lần duy nhất. Sau khi tạo xong Ca, hãy nhấn nút Xác thực để hoàn thành công việc tạo Ca. Lưu ý rằng đã Xác thực thì sẽ không thêm và sửa đổi Ca làm việc.
                </Text>
              </View>
              {/* inputs  */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 20,
                }}
              >
                <ButtonChecklist
                  text={"Thêm"}
                  width={"auto"}
                  color={COLORS.bg_main}
                  icon={<Ionicons name="add" size={24} color="white" />}
                  onPress={() =>
                    Alert.alert("Button with adjusted color pressed")
                  }
                />
                <ButtonChecklist
                  text={"Lưu"}
                  width={"auto"}
                  color="red"
                  icon={
                    <Ionicons
                      name="save"
                      size={24}
                      color="white"
                      style={{ marginRight: 4 }}
                    />
                  }
                  onPress={() =>
                    Alert.alert("Button with adjusted color pressed")
                  }
                />
                 <ButtonChecklist
                  text={"Xác thực"}
                  width={"auto"}
                  color={COLORS.bg_main}
                  icon={<AntDesign name="check" size={24} color="white" />}
                  onPress={() =>
                    Alert.alert("Button with adjusted color pressed")
                  }
                />
              </View>

              
            </View>
          </HideKeyboard>
          <View style={{ marginTop: 10, height: SIZES.height - heightView }}>
            <Text
              style={[
                styles.text,
                {
                  textAlign: "center",
                  fontSize: 16,
                },
              ]}
            >
              Danh sách Ca thực hiện Check list trong Tòa nhà
            </Text>
            <FlatList
              horizontal={false}
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ marginVertical: 10 }}
              data={data}
              renderItem={(item) => <ItemCalamviec />}
              keyExtractor={(item, index) => index.toString()}
              scrollEventThrottle={16}
              ListFooterComponent={<View style={{ height: 120 }} />}
              scrollEnabled={true}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    text: { fontSize: 15, color: "black", fontWeight: "600" },
    textInput: {
      color: "#05375a",
      // marginHorizontal: 10,
      fontSize: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "gray",
      height: 36,
      paddingVertical: 4,
      backgroundColor: "white",
    },
    dropdown: {
      marginTop: 10,
      height: 36,
      paddingHorizontal: 10,
      backgroundColor: "white",
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
    head: {
      backgroundColor: COLORS.bg_main,
      // height: 30
    },
    headText: {
      textAlign: "center",
      color: COLORS.text_main,
    },
    row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  });
  
  export default DanhmucCalamviec;
  