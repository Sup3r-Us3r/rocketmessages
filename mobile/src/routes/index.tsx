import React, {useContext} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

import AuthContex from '../contexts/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes = () => {
  const {signed, loading} = useContext(AuthContex);

  const wrapperStyles = StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  if (loading) {
    return (
      <View style={wrapperStyles.wrapper}>
        <ActivityIndicator size="large" color="#7159c1" />
      </View>
    );
  }

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
