import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { COLORS } from "../../constants/theme";
import DanhmucThongkeDashBoard from "./DanhmucThongkeDashboard";
import DanhmucTraCuu from "./DanhmucTraCuu";
import DanhmucTraCuuCa from "./DanhmucTracuuCa";

const TabButtons = ({
  tabButtonType,
  selectedTab,
  setSelectedTab,
  opacity,
}) => {
  return (
    <View style={[styles.container, { opacity: opacity }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      </ScrollView>
    </View>
  );
};

const DanhmucTracuuVsThongke = ({ route, navigation }) => {
  const setIsLoading = route.params.setIsLoading;
  const setColorLoading = route.params.setColorLoading;
  const [selectedTab, setSelectedTab] = useState("Tra cứu");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setColorLoading("white")
  },[])


  const TabButtonType = [
    { title: "Tra cứu" },
    { title: "Tra cứu ca" },
    { title: "Thống kê" },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "Tra cứu":
        return (
          <DanhmucTraCuu
            opacity={opacity}
            setOpacity={setOpacity}
            navigation={navigation}
          />
        );
      case "Thống kê":
        return <DanhmucThongkeDashBoard />;
      case "Tra cứu ca":
        return (
          <DanhmucTraCuuCa
            opacity={opacity}
            setOpacity={setOpacity}
            navigation={navigation}
            setIsLoading={setIsLoading}
            setColorLoading={setColorLoading}
          />
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
    marginHorizontal: 10,
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
    fontWeight: "bold",
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
