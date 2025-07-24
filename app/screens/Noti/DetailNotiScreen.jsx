import React from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";

const { width, height } = Dimensions.get("window");

const DetailNotiScreen = ({ route }) => {
  const { noti } = route.params;

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} ngày trước`;

    const pad = (n) => (n < 10 ? `0${n}` : n);
    return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="cover" style={styles.backgroundImage}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{noti.title}</Text>
          <Text style={styles.content}>{noti.message}</Text>
          <Text style={styles.time}>{formatTime(noti.created_at)}</Text>
        </ScrollView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  backgroundImage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: adjust(20),
    fontWeight: "bold",
    color: "white",
    lineHeight: adjust(28),
    marginBottom: 12,
  },
  content: {
    fontSize: adjust(16),
    color: "white",
    lineHeight: adjust(24),
    textAlign: "justify",
    marginBottom: 20,
  },
  time: {
    fontSize: adjust(14),
    color: "white",
    fontWeight: "600",
  },
});

export default DetailNotiScreen;
