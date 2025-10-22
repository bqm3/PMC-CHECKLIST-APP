import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getSharePointList } from "../../utils/util";

const { width, height } = Dimensions.get("window");

const DocumentViewer = ({ visible, onClose, url, title = "Tài liệu" }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentUri, setDocumentUri] = useState(null);

  useEffect(() => {
    if (visible && url) {
      loadDocument();
    } else if (!visible) {
      // Reset trạng thái khi modal đóng lại
      setLoading(true);
      setError(null);
      setDocumentUri(null);
    }
  }, [visible, url]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);
    setDocumentUri(null);

    try {
      const isOfficeDoc = /\.(docx|xlsx|pptx|pdf)$/i.test(url);

      console.log(isOfficeDoc);

      if (isOfficeDoc) {
        // 1. VỚI FILE OFFICE: Gọi API ở chế độ 'url'
        const response = await getSharePointDocument(url, "url"); // Gửi mode='url'

        // API backend sẽ trả về JSON вида { url: "..." }
        // Dùng URL này với Google Docs Viewer
        setDocumentUri(response);
      } else {
        // 2. VỚI PDF/ẢNH: Gọi API ở chế độ 'data' (hoặc không cần gửi mode)
        const dataUri = await getSharePointDocument(url, "data");
        setDocumentUri(dataUri);
      }
    } catch (err) {
      console.error("Error loading document:", err);
      setError("Không thể tải được tài liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="error-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDocument}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (documentUri) {
      return (
        <WebView
          source={{ uri: 'https://pmcwebvn-my.sharepoint.com/:b:/g/personal/phongsohoa_pmcweb_vn/EUbBppgDMSZKkmvkVXXhDf8BPC7c4q9oJvVs80muAMESfw' }}
          style={styles.webView}
          startInLoadingState={true}
          scalesPageToFit={true}
          originWhitelist={["*"]}
          mixedContentMode="always"
          allowFileAccess={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          androidLayerType="hardware"
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
            setError("Không thể hiển thị tài liệu. Vui lòng thử lại.");
          }}
          renderLoading={() => (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={styles.statusText}>Đang tải tài liệu...</Text>
            </View>
          )}
        />
      );
    }

    return null; // Trường hợp không có gì để hiển thị
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>{renderContent()}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
  },
  closeButton: { padding: 8 },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerSpacer: { width: 40 },
  content: { flex: 1, backgroundColor: "#fff" },
  webView: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statusText: { marginTop: 16, fontSize: 16, color: "#6B7280" },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

export default DocumentViewer;
