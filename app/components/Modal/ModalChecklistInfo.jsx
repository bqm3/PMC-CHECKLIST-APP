import { StyleSheet, Text, View } from 'react-native'
import React from "react";
import { COLORS } from "../../constants/theme";
import Button from "../Button/Button";

const ModalChecklistInfo = ({ dataModal, handleToggleModal }) => {
    return (
        <View >
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.text}>Checklist: <Text style={{ color: COLORS.bg_active }}>{dataModal?.Checklist}</Text></Text>
                <Text style={styles.text}>
                    Giá trị định danh:{" "}
                    <Text style={{ color: COLORS.bg_active }}>{(dataModal?.Giatridinhdanh)}
                    </Text></Text>
                <Text style={styles.text}>Giá trị nhận: <Text style={{ color: COLORS.bg_active }}>{dataModal?.Giatrinhan}</Text></Text>
                <Text style={styles.text}>Mã số: <Text style={{ color: COLORS.bg_active }}>{dataModal?.Maso}</Text></Text>
                <Text style={styles.text}>Tên khu vực: <Text style={{ color: COLORS.bg_active }}>{dataModal?.ent_khuvuc.Tenkhuvuc}</Text></Text>
                <Text style={styles.text}>Khối công việc: <Text style={{ color: COLORS.bg_active }}>{dataModal?.ent_khuvuc?.ent_khoicv?.KhoiCV}</Text></Text>
                <Text style={styles.text}>Tòa nhà: <Text style={{ color: COLORS.bg_active }}>{dataModal?.ent_khuvuc?.ent_toanha?.Toanha}</Text></Text>
                <Text style={styles.text}>Tầng: <Text style={{ color: COLORS.bg_active }}>{dataModal?.ent_tang?.Tentang}</Text></Text>
            </View>
            <Button
                color={'white'}
                backgroundColor={COLORS.bg_button}
                text={'Đóng'}
                onPress={() => handleToggleModal(false, null, "1")}>
            </Button>
        </View>
    )
}

export default ModalChecklistInfo

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: "black",
        fontWeight: "500",
        paddingVertical: 2,
    },
})