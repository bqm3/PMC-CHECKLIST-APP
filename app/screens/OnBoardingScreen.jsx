import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard
} from 'react-native';
import React from 'react';
import Button from '../components/Button';

const HideKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const OnBoardingScreen = ({navigation}) => {
  return (
    <HideKeyboard>
      {/* <ImageBackground
        source={require('../../assets/background_company.png')}
        resizeMode="cover"
        style={styles.defaultFlex}> */}
        <View style={styles.defaultFlex}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            {/* <Image
              style={{width: 224, height: 150, resizeMode: 'contain'}}
              source={require('../../assets/company_logo.png')}
            /> */}
            <Button onPress={()=>navigation.navigate('LoginScreen')} text={'Click để tiếp tục'} />
          </View>
        </View>
      {/* </ImageBackground> */}
    </HideKeyboard>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  defaultFlex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
