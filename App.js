import React from "react";
import { StatusBar, View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./app/redux/store";
import { ThemeProvider } from "./app/context/ThemeContext";
import { LoginProvider } from "./app/context/LoginContext";
import { LocationProvider } from "./app/context/LocationContext";
import { ConnectProvider } from "./app/context/ConnectContext";
import { UserProvider } from "./app/context/UserContext";
import { ReportProvider } from "./app/context/ReportContext";
import { ExpoTokenProvider } from "./app/context/ExpoTokenContext";
import { DataProvider } from "./app/context/DataContext";
import { ChecklistProvider } from "./app/context/ChecklistContext";
import { ChecklistLaiProvider } from "./app/context/ChecklistLaiContext";
import CheckNavigation from "./app/navigation/CheckNavigation";
import { DataTable, DefaultTheme, PaperProvider } from "react-native-paper";
require("moment/locale/vi");

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "black", // Change this to your desired text color
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={customTheme}>
        <LoginProvider>
          <LocationProvider>
            <ExpoTokenProvider>
              <ConnectProvider>
                <ThemeProvider>
                  <UserProvider>
                    <DataProvider>
                      <ReportProvider>
                        <ChecklistProvider>
                          <ChecklistLaiProvider>
                            <NavigationContainer>
                              <StatusBar />
                              <CheckNavigation />
                            </NavigationContainer>
                          </ChecklistLaiProvider>
                        </ChecklistProvider>
                      </ReportProvider>
                    </DataProvider>
                  </UserProvider>
                </ThemeProvider>
              </ConnectProvider>
            </ExpoTokenProvider>
          </LocationProvider>
        </LoginProvider>
      </PaperProvider>
    </Provider>
  );
}
