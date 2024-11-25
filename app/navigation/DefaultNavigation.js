import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
          PrivacyPolicy
        />
      </Stack.Navigator>
    </>
  );
};

export default DefaultNavigation;

{
  /*  */
}
