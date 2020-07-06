import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import GetStarted from './GetStarted';
import BottomTabs from './BottomTabs';
import Messages from './Messages';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="GetStarted"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
