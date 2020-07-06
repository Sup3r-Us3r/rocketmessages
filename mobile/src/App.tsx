import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

// import BottomNavigation from './screens/BottomNavigation';
// import TopNavigation from './screens/TopNavigation';
import MainNavigation from './screens/MainNavigation';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

      <NavigationContainer>
        {/* <TopNavigation /> */}
        <MainNavigation />
      </NavigationContainer>
    </>
  );
};

export default App;
