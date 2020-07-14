import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Authentication from './Authentication';
import BottomTabs from './BottomTabs';
import Messages from './Messages';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Authentication"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="Authentication" component={Authentication} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
