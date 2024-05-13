import { WebView } from 'react-native-webview';
import { StyleSheet, SafeAreaView, Image } from 'react-native';

export default function WebViewImage() {
  return (<SafeAreaView style={{ flex: 1 }}>
    <WebView
      style={styles.container}
      source={{ uri: 'https://drive.google.com/thumbnail?id=1GbBrpAz0lZ5kJVa0KSOPT3uOAy7YTvmr' }}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
