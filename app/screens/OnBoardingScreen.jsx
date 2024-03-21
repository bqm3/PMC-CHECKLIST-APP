import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
} from "react-native";
import React from "react";
import Button from "../components/Button/Button";
import { COLORS } from "../constants/theme";

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const OnBoardingScreen = ({ navigation }) => {
  return (
    <HideKeyboard>
      <ImageBackground
        source={require("../../assets/bg_company.jpg")}
        resizeMode="cover"
        style={styles.defaultFlex}
      >
        <View style={styles.defaultFlex}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Image
             style={{ width: 120, height: 70, resizeMode: "contain" }}
              source={require("../../assets/pmc_logo.png")}
            />
            <Button
              onPress={() => navigation.navigate("LoginScreen")}
              text={"Click để tiếp tục"}
              color={"gray"}
              backgroundColor={"white"}
            />
          </View>
        </View>
      </ImageBackground>
    </HideKeyboard>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  defaultFlex: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
});
