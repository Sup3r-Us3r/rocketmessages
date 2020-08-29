import React from 'react';
import {View, Text, Image} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {enableScreens} from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BottomTabs from '../screens/BottomTabs';
import Messages from '../screens/Messages';

const AppStack = createNativeStackNavigator();

const AppRoutes = () => {
  enableScreens();

  return (
    <AppStack.Navigator
      screenOptions={{
        // animationEnabled: false,
        headerShown: false,
        stackAnimation: 'fade',
      }}>
      <AppStack.Screen name="BottomTabs" component={BottomTabs} />
      <AppStack.Screen
        name="Messages"
        component={Messages}
        // options={{
        //   contentStyle: {
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //   },
        //   backButtonInCustomView: true,
        //   headerLeft: () => (
        //     <Image
        //       source={{uri: 'https://bit.ly/3fqFao7'}}
        //       style={{marginLeft: 0, height: 50, width: 50}}
        //     />
        //   ),
        //   headerRight: () => (
        //     <View>
        //       <Ionicons name="ios-options" size={20} color="#fff" />
        //       <Text>Test</Text>
        //     </View>
        //   ),
        //   headerShown: true,
        //   headerTintColor: '#fff',
        //   headerStyle: {
        //     backgroundColor: '#7159c1',
        //   },
        // }}
      />
    </AppStack.Navigator>
  );
};

export default AppRoutes;
