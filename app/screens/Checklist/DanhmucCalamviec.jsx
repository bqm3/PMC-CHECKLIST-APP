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
import { Provider, useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import ButtonChecklist from "../../components/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ItemCalamviec from "../../components/ItemCalamviec";

import { ent_khoicv_get, ent_calv_get } from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL } from "../../constants/config";


const DanhmucCalamviec = ({ navigation }) => {
  const ref = useRef(null);
  const dispath = useDispatch();
  const { error, isLoading, ent_khoicv, ent_calv } = useSelector(
    (state) => state.entReducer
  );
  const { user,authToken } = useSelector((state) => state.authReducer);

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_calv = async() => {
    await dispath(ent_calv_get());
  }

  useEffect(() => {
    init_khoicv();
    init_calv()
  }, []);

  const [heightView, setHeigtView] = useState(0);

  const dateHour = moment(new Date()).format("LT");
  const [dataInput, setDataInput] = useState({
    tenca: "",
    giobd: dateHour,
    giokt: dateHour,
    khoicv: null,
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async() => {
    if (dataInput.tenca === "" || dataInput.khoicv === null) {
      Alert.alert("PMC Thông báo", "Thiêu thông tin ca làm việc", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data= {
        Tenca: dataInput.tenca,
        Giobatdau: dataInput.giobd,
        Gioketthuc: dataInput.giokt,
        ID_KhoiCV: dataInput.khoicv,
        ID_Duan: user.ID_Duan
      }
      await axios.post(BASE_URL+'/ent_calv/create', 
      data,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        init_calv()
        handleAdd()
        Alert.alert("PMC Thông báo", response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
        
      })
        .catch((err) => {
          Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
        });
      
    }
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    giobd: false,
    giokt: false,
  });

  const showDatePicker = (key) => {
    setDatePickerVisibility(() => ({
      ...data,
      [key]: true,
    }));
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (key, date) => {
    handleChangeText(key, moment(date).format("LT"));
    hideDatePicker();
  };

  const handleAdd = () => {
    setDataInput({
      tenca: "",
      giobd: dateHour,
      giokt: dateHour,
      khoicv: null,
    });
  };

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
        {/* <HideKeyboard> */}
        <View
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
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
                flex: 3,
                justifyContent: "space-around",
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.text}>Tên ca</Text>
              <Text style={styles.text}>Giờ bắt đầu</Text>
              <Text style={styles.text}>Giờ kết thúc</Text>
              <Text style={styles.text}>Khối công việc</Text>
            </View>
            <View style={{ flex: 7, justifyContent: "space-around" }}>
              <View style={{ marginLeft: 10 }}>
                <TextInput
                  value={dataInput.tenca}
                  placeholder="Nhập tên ca thực hiện checklist"
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                    },
                  ]}
                  autoCapitalize="none"
                  onChangeText={(val) => handleChangeText("tenca", val)}
                />
              </View>

              <TouchableOpacity
                onPress={() => showDatePicker("giobd")}
                style={{ marginLeft: 10, marginVertical: 10 }}
              >
                <TextInput
                  value={dataInput.giobd}
                  placeholder="Nhập giờ bắt đầu ca làm việc"
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                    },
                  ]}
                  pointerEvents="none"
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible.giobd}
                  mode="time"
                  isDarkModeEnabled={true}
                  onConfirm={(date) => handleConfirm("giobd", date)}
                  onCancel={hideDatePicker}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => showDatePicker("giokt")}
                style={{ marginLeft: 10 }}
              >
                <TextInput
                  value={dataInput.giokt}
                  placeholder="Nhập giờ kết thúc ca làm việc"
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                    },
                  ]}
                  pointerEvents="none"
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible.giokt}
                  mode="time"
                  isDarkModeEnabled={true}
                  onConfirm={(date) => handleConfirm("giokt", date)}
                  onCancel={hideDatePicker}
                />
              </TouchableOpacity>
              <View style={{ marginLeft: 10 }}>
                <Dropdown
                  ref={ref}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={ent_khoicv ? ent_khoicv : []}
                  maxHeight={300}
                  labelField="KhoiCV"
                  valueField="ID_Khoi"
                  placeholder="Khối công việc"
                  value={dataInput.khoicv}
                  onChange={(item) => {
                    handleChangeText("khoicv", item.ID_Khoi);
                  }}
                  confirmSelectItem
                  onConfirmSelectItem={(item) => {
                    Alert.alert("PMC", "Xác nhận đồng ý", [
                      {
                        text: "Cancel",
                        onPress: () => {},
                      },
                      {
                        text: "Confirm",
                        onPress: () => {
                          handleChangeText("khoicv", item.ID_Khoi);
                          ref.current.close();
                        },
                      },
                    ]);
                  }}
                />
              </View>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 15,
                color: "black",
                paddingHorizontal: 12,
                paddingTop: 10,
              }}
            >
              Công việc tạo Ca checklist chỉ làm 1 lần duy nhất. Sau khi tạo
              xong Ca, hãy nhấn nút Xác thực để hoàn thành công việc tạo Ca. Lưu
              ý rằng đã Xác thực thì sẽ không thêm và sửa đổi Ca làm việc.
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
              onPress={handleAdd}
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
              onPress={handlePushDataSave}
            />
            <ButtonChecklist
              text={"Xác thực"}
              width={"auto"}
              color={COLORS.bg_main}
              icon={<AntDesign name="check" size={24} color="white" />}
              onPress={() => Alert.alert("Button with adjusted color pressed")}
            />
          </View>
        </View>
        {/* </HideKeyboard> */}

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
            data={ent_calv}
            renderItem={({item, index}) => <ItemCalamviec key={index} item={item}/>}
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
