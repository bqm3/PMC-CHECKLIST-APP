import { WebView } from "react-native-webview";
import { StyleSheet, SafeAreaView, Image } from "react-native";

export default function WebViewImage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        style={styles.container}
        source={{
          uri: "https://drive.google.com/file/d/1kSW9Ds2fW_yfQf51IJvMgGrwKu9LRR63/view?usp=sharing",
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
