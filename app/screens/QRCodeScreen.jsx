import React, { useState, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { COLORS } from "../constants/theme";
import Button from "../components/Button/Button";

export default function QRCodeScreen({
  setModalVisibleQr,
  setOpacity,
  handlePushDataFilterQr,
  setIsScan,
}) {
  const [scanned, setScanned] = useState(false);
  const processingRef = useRef(false); // Flag để tránh gọi nhiều lần
  const lastScannedRef = useRef(null); // Lưu mã QR vừa quét

  const handleBarCodeScanned = ({ type, data }) => {
    // Nếu đang xử lý hoặc đã quét rồi thì return
    if (processingRef.current || scanned) {
      return;
    }

    // Nếu cùng mã QR trong vòng 2 giây thì bỏ qua
    if (lastScannedRef.current === data) {
      return;
    }

    // Đánh dấu đang xử lý
    processingRef.current = true;
    lastScannedRef.current = data;
    setScanned(true);
    setIsScan(true);

    // Gọi callback
    handlePushDataFilterQr(data);

    // Reset flag sau 2 giây (phòng trường hợp cần quét lại)
    setTimeout(() => {
      processingRef.current = false;
    }, 2000);
  };

  const handleRescan = () => {
    setScanned(false);
    processingRef.current = false;
    lastScannedRef.current = null;
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", height: "100%" }}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: 12 }]}
        />
      </View>

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
        <Button
          text={"Đóng"}
          backgroundColor={"white"}
          color={"black"}
          onPress={() => {
            setModalVisibleQr(false);
            setOpacity(1);
            setScanned(false);
            processingRef.current = false;
            lastScannedRef.current = null;
          }}
        />
        <Button
          text={"Quét lại"}
          backgroundColor={COLORS.bg_button}
          color={"white"}
          onPress={handleRescan}
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
});