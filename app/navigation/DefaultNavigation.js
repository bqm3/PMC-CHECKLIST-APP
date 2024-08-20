import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnBoardingScreen from "../screens/OnBoardingScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

const DefaultNavigation = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoginScreen"
          component={LoginScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default DefaultNavigation;

{
  /*  */
}
