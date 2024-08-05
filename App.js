import React from "react";
import { StatusBar, View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./app/redux/store";
import { ThemeProvider } from "./app/context/ThemeContext";
import { LoginProvider } from "./app/context/LoginContext";
import { ConnectProvider } from "./app/context/ConnectContext";
import { UserProvider } from "./app/context/UserContext";
import { DataProvider } from "./app/context/DataContext";
import { ChecklistProvider } from "./app/context/ChecklistContext";
import CheckNavigation from "./app/navigation/CheckNavigation";
import { DataTable, DefaultTheme ,PaperProvider } from "react-native-paper";
require("moment/locale/vi");

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: 'black', // Change this to your desired text color
  },
};

export default function App() {
  return (
    <Provider store={store} > 
      <PaperProvider theme={customTheme}>
        <LoginProvider>
          <ConnectProvider>
          <ThemeProvider>
            <UserProvider>
              <DataProvider>
                <ChecklistProvider>
                  <NavigationContainer>
                    <StatusBar />
                    <CheckNavigation />
                  </NavigationContainer>
                </ChecklistProvider>
              </DataProvider>
            </UserProvider>
          </ThemeProvider>
          </ConnectProvider>
        </LoginProvider>
      </PaperProvider>
    </Provider>
  );
}
