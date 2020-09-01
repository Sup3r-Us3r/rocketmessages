import React from 'react';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {enableScreens} from 'react-native-screens';

import BottomTabs from '../screens/BottomTabs';
import Messages from '../screens/Messages';

const AppStack = createNativeStackNavigator();

interface IAppRoutesProps {
  currentRouteName: string;
}

const AppRoutes: React.FC = () => {
  enableScreens();

  return (
    <AppStack.Navigator
      screenOptions={{
        // animationEnabled: false,
        headerShown: false,
        stackAnimation: 'fade',
      }}>
      <AppStack.Screen name="BottomTabs" component={BottomTabs} />
      <AppStack.Screen name="Messages" component={Messages} />
    </AppStack.Navigator>
  );
};

export default AppRoutes;
