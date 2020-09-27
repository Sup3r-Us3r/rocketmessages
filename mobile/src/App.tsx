import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar} from 'react-native';

import './config/ReactotronConfig';

import {NavigationContainer} from '@react-navigation/native';

import Routes from './routes';

import {store, persistor} from './store';

import {AuthProvider} from './contexts/auth';

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Routes />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
