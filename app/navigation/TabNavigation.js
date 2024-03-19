import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image, Button, Text} from 'react-native';
import HomeScreen from '../screens/Checklist/HomeScreen';
import ThucHienChecklist from '../screens/Checklist/ThucHienChecklist';

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Trang chính">
      <Stack.Screen
        name="Trang chính"
        component={HomeScreen}
        // lazy={false}
        options={({route}) => ({
          headerShown: true,
          headerStyle: {
            // backgroundColor: COLORS.bg_main,
          },
          headerTitle: () => (
            <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>
              CHECKLIST- PMC
            </Text>
          ),
          headerTitleAlign: 'center',
          headerLeft: () => (
            // <Image
            //   style={{width: 90, height: 50, resizeMode: 'contain'}}
            //   source={require('../../assets/company_logo.png')}
            // />
            <></>
          ),
        })}
      />
      <Stack.Screen
        name="Thực hiện Check list"
        component={ThucHienChecklist}
        lazy={false}
        options={({route}) => ({
          headerShown: true,
          
          headerTitle: () => (
            <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>
              Thực hiện Checklist
            </Text>
          ),
          headerTitleAlign: 'center',
        })}
      />
    </Stack.Navigator>
  );
};

// const TabNavigation = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="Trang chủ"
//         lazy={true}
//         component={HomeStack}
// options={({ route }) => ({
//   headerShown: false,
//   // unmountOnBlur: true,
//   tabBarIcon: ({ focused, color, size }) => {
//     let iconName;
//     // if (route.name === "Trang chủ") {
//     //   iconName = !focused
//     //     ? require("../../assets/Icon-bottom/Trang_Chu.png")
//     //     : require("../../assets/Icon-bottom/Trang_Chu_Xanh.png");
//     // }
//     return (
//       <Image
//         source={iconName}
//         style={{ width: 24, height: 24 }}
//         resizeMode="stretch"
//       />
//     );
//   },
//   // tabBarActiveTintColor: COLORS.green,
//   // tabBarInactiveTintColor: COLORS.gray,
// })}
//       />

//     </Tab.Navigator>
//   );
// };

export default HomeStack;
