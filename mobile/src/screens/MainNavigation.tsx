import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens';

import Authentication from './Authentication';
import BottomTabs from './BottomTabs';
import Messages from './Messages';

// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  enableScreens();

  return (
    <Stack.Navigator
      initialRouteName="Authentication"
      screenOptions={{
        // animationEnabled: false,
        headerShown: false,
        stackAnimation: 'fade',
      }}>
      <Stack.Screen name="Authentication" component={Authentication} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
