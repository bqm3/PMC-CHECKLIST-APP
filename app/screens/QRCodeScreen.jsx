import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Linking, Alert } from "react-native";
import { Camera } from "expo-camera";
import { COLORS } from "../constants/theme";
import CustomButton from "../components/Button/Button";

export default function QRCodeScreen({
  setModalVisibleQr,
  setOpacity,
  handlePushDataFilterQr,
  setIsScan,
}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
      } else if (status === "denied") {
        Alert.alert(
          'Permission Required',
          'Camera access is required to take photos. Please enable it in settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setHasPermission(false),
            },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
          { cancelable: false }
        );
      } else {
        setHasPermission(false);
      }
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScan(true);
    setScanned(true);
    if (type && data) {
      handlePushDataFilterQr(data);
    }
  };

  if (hasPermission === null) {
    return <Text allowFontScaling={false}>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.noAccessContainer}>
        <Text allowFontScaling={false} style={styles.noAccessText}>
          No access to camera
        </Text>
        <Button title="Open Settings" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, { borderRadius: 12 }]}
      />
      <View
        style={{
          position: "absolute",
          bottom: 40,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
        }}
      >
        <CustomButton
          text={"Đóng"}
          backgroundColor={"white"}
          color={"black"}
          onPress={() => {
            setModalVisibleQr(false);
            setOpacity(1);
          }}
        />
        <CustomButton
          text={"Quét lại"}
          backgroundColor={COLORS.bg_button}
          color={"white"}
          onPress={() => setScanned(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noAccessText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
});
