import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { BASE_URL } from "../../constants/config";
import axiosClient from "../../api/axiosClient";
import { DataTable } from "react-native-paper";

// Header của bảng với chiều rộng tương ứng
const headerList = [
  { til: "STT", width: 28 },
  { til: "Ngày", width: 85 },
  { til: "Kỹ thuật", width: 70 },
  { til: "Làm sạch", width: 70 },
  { til: "Dịch vụ", width: 70 },
  { til: "Bảo vệ", width: 70 },
];

const DanhmucThongkeDashBoard = () => {
  const { authToken } = useSelector((state) => state.authReducer);
  const [dataPercentDays, setDataPercentDays] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    const handleDataPercent = async () => {
      try {
        setLoading(true); // Bắt đầu loading
        const res = await axiosClient.get(
          `${BASE_URL}/tb_checklistc/percent-checklist-days`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const dataRes = res.data.data;
        const transformedRows = dataRes.map((project, index) => ({
          id: index + 1,
          date: project.date,
          "Khối kỹ thuật": project.createdKhois["Khối kỹ thuật"]
            ?.completionRatio
            ? `${project.createdKhois["Khối kỹ thuật"].completionRatio} %`
            : "",
          "Khối làm sạch": project.createdKhois["Khối làm sạch"]
            ?.completionRatio
            ? `${project.createdKhois["Khối làm sạch"].completionRatio} %`
            : "",
          "Khối dịch vụ": project.createdKhois["Khối dịch vụ"]?.completionRatio
            ? `${project.createdKhois["Khối dịch vụ"].completionRatio} %`
            : "",
          "Khối bảo vệ": project.createdKhois["Khối bảo vệ"]?.completionRatio
            ? `${project.createdKhois["Khối bảo vệ"].completionRatio} %`
            : "",
        }));

        setDataPercentDays(transformedRows);
      } catch (err) {
        console.log("Error fetching data", err);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    handleDataPercent();
  }, [authToken]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/bg.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        {/* Hiển thị loading khi đang tải dữ liệu */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="white"
            style={styles.loadingIndicator}
          />
        ) : (
          <View>
            <Text style={styles.title}>
              Tỉ lệ hoàn thành checklist các ngày
            </Text>
            <ScrollView horizontal>
              <View>
                <DataTable.Header style={styles.tableHeader}>
                  {headerList.map((item, index) => (
                    <DataTable.Title
                      key={index}
                      style={{ width: item.width, justifyContent: "center" }}
                    >
                      <Text style={styles.headerText}>{item.til}</Text>
                    </DataTable.Title>
                  ))}
                </DataTable.Header>
                <ScrollView>
                  {dataPercentDays.map((item, index) => (
                    <DataTable.Row key={item.id} style={styles.tableRow}>
                      <DataTable.Cell
                        style={{
                          width: headerList[0].width,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.id}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          width: headerList[1].width,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.date}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          width: headerList[2].width,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item["Khối kỹ thuật"]}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          width: headerList[3].width,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item["Khối làm sạch"]}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          width: headerList[4].width,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item["Khối dịch vụ"]}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          width: headerList[5].width,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item["Khối bảo vệ"]}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "white",
  },
  tableHeader: {
    backgroundColor: "#eeeeee",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  tableRow: {
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DanhmucThongkeDashBoard;
