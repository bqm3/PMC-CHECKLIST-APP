import React, { useEffect, useRef } from "react";
import { StatusBar, AppState, Alert, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch } from "react-redux";
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
import { DefaultTheme, PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";
import { logoutAction } from "./app/redux/actions/authActions";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "./app/constants/theme";
import { deleteAllData } from "./app/sqlite/SQLiteDataManager";
require("moment/locale/vi");

const customTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, text: "black" },
};

SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state", "TNodeChildrenRenderer: Support for defaultProps"]);

// ✅ App chỉ bọc Provider
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
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
                                  {/* Mọi hook Redux/logic phiên đưa vào đây */}
                                  <RootApp />
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
      </SafeAreaProvider>
    </Provider>
  );
}

function RootApp() {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const lastActiveTime = useRef(Date.now());
  const TIMEOUT_DURATION = 30 * 60 * 1000;

  useEffect(() => {
    (async () => {
      await SplashScreen.hideAsync();
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await deleteAllData();
      dispatch(logoutAction());
    } catch (error) {
      console.error("Error clearing data:", error);
      dispatch(logoutAction());
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const was = appState.current;

      // rời app
      if (was === "active" && (nextAppState === "inactive" || nextAppState === "background")) {
        lastActiveTime.current = Date.now();
      }

      // quay lại app
      if ((was === "inactive" || was === "background") && nextAppState === "active") {
        const timeAway = Date.now() - lastActiveTime.current;
        if (timeAway > TIMEOUT_DURATION) {
          handleLogout();
          Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại để tiếp tục sử dụng");
        }
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg_button }} edges={["bottom"]}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={Platform.OS === "android" ? "#ffffff" : undefined}
        translucent={Platform.OS === "android" ? false : undefined}
        hidden={false} // Luôn hiển thị
      />
      <CheckNavigation />
    </SafeAreaView>
  );
}
