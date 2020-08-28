import React from 'react';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {enableScreens} from 'react-native-screens';

import Auth from '../screens/Auth';

const AuthStack = createNativeStackNavigator();

const AuthRoutes = () => {
  enableScreens();

  return (
    <AuthStack.Navigator
      screenOptions={{
        // animationEnabled: false,
        headerShown: false,
        stackAnimation: 'fade',
      }}>
      <AuthStack.Screen name="Auth" component={Auth} />
    </AuthStack.Navigator>
  );
};

export default AuthRoutes;
