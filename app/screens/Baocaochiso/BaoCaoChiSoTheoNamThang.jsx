import {
  StyleSheet,
  View,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  BackHandler
} from "react-native";
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";
import ItemChiSo from "../../components/Item/ItemChiSo";
import { COLORS, SIZES } from "../../constants/theme";
import ModalBaocaochisoThangNam from "../../components/Modal/ModalBaocaochisoThangNam";


const BaoCaoChiSoTheoNamThang = ({ navigation, route }) => {
  const { height } = Dimensions.get("window");

  const { data } = route.params;
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [height * 0.8], []);
  const [opacity, setOpacity] = useState(1);
  const [item, setItem] = useState([]);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
    } else {
      setOpacity(0.2);
    }
  }, []);

  
  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetModalRef.current.close();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (opacity == 0.2) {
        handleCloseBottomSheet();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [opacity]);

  const toggleTodo = async (item, index) => {
    setItem(item)
    bottomSheetModalRef.current.expand();
    setOpacity(0.2);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={() => console.log("run")}
          accessible={false}
        >
            <ImageBackground
              source={require("../../../assets/bg_new.png")}
              resizeMode="stretch"
              style={{ flex: 1, width: "100%" }}
            >
              <View style={{ flex: 1, width: "100%" , opacity: opacity}}>
                <View style={[styles.container]}>
                  <View style={styles.content}>
                    {data.data.length > 0 && (
                      <FlatList
                        // style={{
                          
                        // }}
                        data={data.data}
                        renderItem={({ item, index }) => (
                          <ItemChiSo
                            key={index}
                            item={item}
                            toggleTodo={toggleTodo}
                          />
                        )}
                        scrollEventThrottle={16}
                        ListFooterComponent={<View style={{ height: 80 }} />}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                      />
                    )}
                  </View>
                </View>
              </View>

              <BottomSheet
              ref={bottomSheetModalRef} 
              index={-1} 
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              enablePanDownToClose={true}
              enableContentPanningGesture={true}
              enableHandlePanningGesture={true}
              onClose={handleCloseBottomSheet}
            >
              <BottomSheetView>
                <ModalBaocaochisoThangNam item={item} handleCloseBottomSheet={handleCloseBottomSheet}/>
              </BottomSheetView>
            </BottomSheet>
            </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default BaoCaoChiSoTheoNamThang;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 12,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  button: {
    backgroundColor: COLORS.color_bg,
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: adjust(20),
    fontWeight: "600",
    paddingVertical: 10,
  },
  content: {
    paddingTop: 10,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
