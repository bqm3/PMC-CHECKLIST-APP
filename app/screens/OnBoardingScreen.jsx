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
import adjust from "../adjust";

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const OnBoardingScreen = ({ navigation }) => {
  return (
    <HideKeyboard>
      <ImageBackground
        source={require("../../assets/bg_new.png")}
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
             style={{ width: adjust(120), height: adjust(70), resizeMode: "contain" }}
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
