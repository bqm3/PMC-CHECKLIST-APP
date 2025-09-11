import React, { useEffect, useRef } from "react";
import { StatusBar, AppState, Alert } from "react-native";
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
require("moment/locale/vi");

const customTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, text: "black" },
};

SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "TNodeChildrenRenderer: Support for defaultProps",
]);

// ✅ App chỉ bọc Provider
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
          dispatch(logoutAction());
          Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại để tiếp tục sử dụng");
        }
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [dispatch]);

  return (
    <>
      <StatusBar />
      <CheckNavigation />
    </>
  );
}
