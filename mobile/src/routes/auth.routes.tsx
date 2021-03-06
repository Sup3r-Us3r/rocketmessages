import React from 'react';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {enableScreens} from 'react-native-screens';

import Auth from '../screens/Auth';
import ForgotPassword from '../screens/ForgotPassword';
import VerificationCode from '../screens/VerificationCode';

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
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: true,
          headerTitle: 'Recuperar senha',
          headerTintColor: '#7159c1',
        }}
      />
      <AuthStack.Screen
        name="VerificationCode"
        component={VerificationCode}
        options={{
          headerShown: true,
          headerTitle: 'Verificar código de segurança',
          headerTintColor: '#7159c1',
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthRoutes;
