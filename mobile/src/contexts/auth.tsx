import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import * as auth from '../services/auth';

import {ISignInResponse} from '../services/auth';

interface IUserSentData {
  username?: string;
  email: string;
  password: string;
}

interface IAuthContextData {
  signed: boolean;
  userData: ISignInResponse | null;
  signIn(userSentData: IUserSentData): Promise<ISignInResponse>;
  signUp(userSentData: IUserSentData): Promise<void>;
  signOut(): void;
  loading: boolean;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider: React.FC = ({children}) => {
  const [userData, setUserData] = useState<ISignInResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function signIn(userSentData: IUserSentData): Promise<ISignInResponse> {
    const response = await auth.signIn(userSentData);

    if (response?.username) {
      setUserData(response);
    }

    await AsyncStorage.setItem(
      '@rocketMessages/userData',
      JSON.stringify(response),
    );

    return response;
  }

  async function signUp(userSentData: IUserSentData) {
    const response = await auth.signUp(userSentData);

    if (response) {
      return response;
    }
  }

  async function signOut() {
    await AsyncStorage.clear();

    return setUserData(null);
  }

  useEffect(() => {
    async function handleLocalStorageData() {
      const userDataStoraged = await AsyncStorage.getItem(
        '@rocketMessages/userData',
      );

      if (userDataStoraged) {
        setUserData(JSON.parse(userDataStoraged));
      }

      await new Promise((resolve) => setTimeout(() => resolve(), 1000));

      return setLoading(false);
    }

    handleLocalStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{signed: !!userData, loading, userData, signIn, signUp, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
