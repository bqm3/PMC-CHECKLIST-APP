import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {login} from '../redux/actions/authActions';
import {COLORS, SIZES} from '../constants/theme';
import Title from '../components/Title';
import ButtonSubmit from '../components/ButtonSubmit';

import UserContext from '../context/UserContext';

const HideKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const LoginScreen = ({navigation}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();

  const {userData, saveUser} = useContext(UserContext);
  const {error, isLoading, user} = useSelector(state => state.authReducer);

  const [show, setShow] = useState(false);
  
  const [data, setData] = useState({
    UserName: '',
    Password: '',
    Emails: '',
    Duan: '',
  });

  const handleSubmit = async () => {
    dispatch(login(data.UserName, data.Password));
  };

  useEffect(() => {
    if (user && error === false) {
      setData({
        ...data,
        UserName: user.UserName,
        Emails: user.Emails,
        Duan: user?.ent_duan?.Duan
      });
      saveUser(user);
    }else  if(user === null && error === true){
      Alert.alert('PMC Thông báo', 'Sai tên đăng nhập hoặc mật khẩu', [
       
        {
          text: 'Hủy',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Xác nhận', onPress: () => console.log('OK Pressed')},
      ]);
      setData({
        ...data,
        UserName: data.UserName,
        Password: data.Password,
        Emails: "",
        Duan: ""
      });
    }
  }, [user, error]);

  const handleChangeText = (key, value) => {
    setData(data => ({
      ...data,
      [key]: value,
    }));
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      <HideKeyboard>
        <View style={[styles.container, {flex: 1}]}>
          <View
            style={[styles.container, {width: SIZES.width, marginBottom: 40}]}>
            <Image
              style={{width: 224, height: 150, resizeMode: 'contain'}}
              source={require('../../assets/company_logo.png')}
            />
            <View style={[styles.container, {width: '80%'}]}>
              <Title text={'Đăng nhập'} size={20} top={10} />
              <View
                style={{
                  marginTop: 20,
                  justifyContent: 'flex-start',
                  width: '100%',
                }}>
                <View style={styles.action}>
                  <TextInput
                    placeholder="Nhập tài khoản"
                    placeholderTextColor="gray"
                    style={[styles.textInput]}
                    autoCapitalize="none"
                    value={data.UserName ? data.UserName : user?.UserName}
                    onChangeText={val =>
                      handleChangeText('UserName', val)
                    }
                  />
                </View>

                <View style={styles.action}>
                  <TextInput
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor="gray"
                    style={[styles.textInput]}
                    autoCapitalize="none"
                    value={data.Password}
                    onChangeText={val =>
                      handleChangeText('Password', val)
                    }
                    secureTextEntry={!show}
                    // onSubmitEditing={()=>handleSubmit()}
                  />
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => setShow(!show)}>
                    {show ? (
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                        }}
                        source={require('../../assets/eye.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                        }}
                        source={require('../../assets/hidden.png')}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.action}>
                  <TextInput
                    placeholder="Email cá nhân"
                    value={data.Emails}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholderTextColor="gray"
                    style={[styles.textInput]}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.action}>
                  <TextInput
                    placeholder="Dự án tham dự"
                    value={data.Duan}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholderTextColor="gray"
                    style={[styles.textInput]}
                    autoCapitalize="none"
                  />
                </View>

                {/* <Dropdown
                  ref={ref}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={dataList}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Thuộc dự án"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={item => {
                    setValue(item.value);
                  }}
                  renderItem={renderItem}
                  confirmSelectItem
                  onConfirmSelectItem={item => {
                    Alert.alert('Confirm', 'Message confirm', [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                      },
                      {
                        text: 'Confirm',
                        onPress: () => {
                          setValue(item.value);
                          ref.current.close();
                        },
                      },
                    ]);
                  }}
                  //   renderLeftIcon={() => (
                  //   )}
                /> */}

                <View style={{height: 20}} />
                <ButtonSubmit
                  text={'Đăng Nhập'}
                  // navigationNext={navigationNext}
                  isLoading={isLoading}
                  onPress={() => handleSubmit()}
                />
              </View>
            </View>
          </View>
        </View>
      </HideKeyboard>

      {isKeyboardVisible === true ? (
        <></>
      ) : (
        <>
          <View
            style={{
              backgroundColor: COLORS.bg_main,
              position: 'absolute',
              bottom: 0,
              height: 40,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '700',
              }}>
              Copyright by @Phòng số hóa - PMC
            </Text>
          </View>
        </>
      )}
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg_white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  action: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  textInput: {
    paddingLeft: 12,
    color: '#05375a',
    width: '88%',
    fontSize: 16,
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },

  dropdown: {
    marginTop: 12,
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#05375a',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#05375a',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
