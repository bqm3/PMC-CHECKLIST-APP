import React, { useEffect } from "react";
import { StatusBar, View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./app/redux/store";
import { ReloadProvider } from "./app/context/ReloadContext";
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
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";
require("moment/locale/vi");

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "black", // Change this to your desired text color
  },
};

SplashScreen.preventAutoHideAsync(); // Không tự ẩn splash cho đến khi sẵn sàng
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
LogBox.ignoreLogs(["TNodeChildrenRenderer: Support for defaultProps"]);
export default function App() {
  useEffect(() => {
    async function prepare() {
      // Đợi load dữ liệu, asset, v.v...
      await SplashScreen.hideAsync(); // Ẩn splash khi đã sẵn sàng
    }

    prepare();
  }, []);

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
                        <ReloadProvider>
                          <ChecklistProvider>
                            <ChecklistLaiProvider>
                              <NavigationContainer>
                                <StatusBar />
                                <CheckNavigation />
                              </NavigationContainer>
                            </ChecklistLaiProvider>
                          </ChecklistProvider>
                        </ReloadProvider>
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
