import React from 'react';
import TabNavigation from './TabNavigation';
import DefaultNavigation from './DefaultNavigation';
import {Provider, useDispatch, useSelector} from 'react-redux';
import { Text, View } from 'react-native';

export default function CheckNavigation() {
  const {error, user} = useSelector(state => state.authReducer);
 
  return (
    <>
      {user && error === false ? (
        <>
          <TabNavigation />
        </>
      ) : (
        <>
          <DefaultNavigation />
          
        </>
      )}
    </>
  );
}
