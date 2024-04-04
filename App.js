import React from "react";
import { StatusBar, View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./app/redux/store";
import { ThemeProvider } from "./app/context/ThemeContext";
import { LoginProvider } from "./app/context/LoginContext";
import { UserProvider } from "./app/context/UserContext";
import CheckNavigation from "./app/navigation/CheckNavigation";
import { PaperProvider } from "react-native-paper";
require("moment/locale/vi");

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <LoginProvider>
          <ThemeProvider>
            <UserProvider>
              <NavigationContainer>
                <StatusBar /> 
                <CheckNavigation />
              </NavigationContainer>
            </UserProvider>
          </ThemeProvider>
        </LoginProvider>
      </PaperProvider>
    </Provider>
  );
}
