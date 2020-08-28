import React from 'react';
import {StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

// import MainNavigation from './screens/MainNavigation';
import Routes from './routes';

import {AuthProvider} from './contexts/auth';

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
