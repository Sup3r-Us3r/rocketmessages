import React from 'react';
import {StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import MainNavigation from './screens/MainNavigation';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </>
  );
};

export default App;
