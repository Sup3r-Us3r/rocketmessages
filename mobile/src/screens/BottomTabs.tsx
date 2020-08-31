import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import Chat from './Chat';
import Rooms from './Rooms';
import Friends from './Friends';
import Profile from './Profile';

const Tabs = createMaterialTopTabNavigator();

const BottomTabs = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Chat"
      tabBarPosition="bottom"
      tabBarOptions={{
        style: {
          backgroundColor: '#fff',
          borderTopColor: 'rgba(255, 255, 255, 0.2)',
          alignContent: 'center',
          height: 45,
        },
        activeTintColor: '#7159c1',
        inactiveTintColor: '#999',
        showIcon: true,
        showLabel: false,
        indicatorStyle: {
          backgroundColor: '#7159c1',
        },
        tabStyle: {
          flexDirection: 'row',
        },
        labelStyle: {
          marginBottom: 8,
        },
      }}>
      <Tabs.Screen
        name="Chat"
        component={Chat}
        options={{
          title: 'Conversas',
          tabBarIcon: ({color}) => (
            <MaterialIcons name="chat-bubble-outline" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="Rooms"
        component={Rooms}
        options={{
          title: 'Grupos',
          tabBarIcon: ({color}) => (
            <Feather name="users" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="Friends"
        component={Friends}
        options={{
          title: 'Amigos',
          tabBarIcon: ({color}) => (
            <MaterialIcons name="location-searching" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Perfil',
          tabBarIcon: ({color}) => (
            <Feather name="settings" color={color} size={20} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default BottomTabs;
