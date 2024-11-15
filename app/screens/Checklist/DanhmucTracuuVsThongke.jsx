import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import DanhmucTracuuContent from "./DanhmucTracuuContent";
import DanhmucTraCuuContent from "./DanhmucThongkeContent";
import { COLORS } from "../../constants/theme";
import { WebView } from "react-native-webview";
import DanhmucThongkeDashBoard from "./DanhmucThongkeDashboard";

const TabButtons = ({
  tabButtonType,
  selectedTab,
  setSelectedTab,
  opacity,
}) => {
  return (
    <View style={[styles.container, { opacity: opacity }]}>
      {tabButtonType.map((tab, index) => (
        <TouchableOpacity
          disabled={opacity == 1 ? false : true}
          key={index}
          style={[
            styles.tabButton,
            selectedTab === tab.title && styles.selectedTabButton,
          ]}
          onPress={() => setSelectedTab(tab.title)}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab.title && styles.selectedTabText,
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const DanhmucTracuuVsThongke = ({ route, navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Tra cứu");
  const [opacity, setOpacity] = useState(1);

  const TabButtonType = [{ title: "Tra cứu" }, { title: "Thống kê" }];
  
  const renderContent = () => {
    switch (selectedTab) {
      case "Tra cứu":
        return (
          <DanhmucTraCuuContent
            opacity={opacity}
            setOpacity={setOpacity}
            navigation={navigation}
          />
        );
      case "Thống kê":
        return (
          <DanhmucThongkeDashBoard />
        );
      default:
        return (
          <View>
            <Text>Select a tab to see content</Text>
          </View>
        );
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/bg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.mainContainer]}>
        <TabButtons
          tabButtonType={TabButtonType}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          opacity={opacity}
        />
        {renderContent()}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  tabButton: {
    width: 150,
    marginHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    alignItems: "center",
  },
  selectedTabButton: {
    backgroundColor: COLORS.bg_button,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  selectedTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DanhmucTracuuVsThongke;
