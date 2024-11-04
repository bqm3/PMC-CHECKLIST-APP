import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import * as Location from 'expo-location';
import { useLocation } from '../context/LocationContext';


const YourComponent = () => {
 
    const { location, errorMsg } = useLocation();
    console.log(location)
  return (
    <View>
        <View>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <Text>
          Latitude: {location?.coords.latitude}, Longitude: {location?.coords.longitude}
        </Text>
      )}
    </View>
    </View>
  );
};

export default YourComponent;
