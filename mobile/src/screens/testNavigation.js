import * as React from 'react';
import {Text, View, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

function MessagesScreen({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
      <Button
        onPress={() => navigation.navigate('Conversa')}
        title="Conversa"
      />
    </View>
  );
}

function Conversa() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Conversa Especifica!</Text>
    </View>
  );
}

function AjustesScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>AjustesScreen!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MessagesScreen" component={MessagesScreen} />
      <Tab.Screen name="AjustesScreen" component={AjustesScreen} />
    </Tab.Navigator>
  );
}
function GettingStarter({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>GettingStarter!</Text>
      <Button
        onPress={() => navigation.navigate('BottomTabs')}
        title="Navega"
      />
    </View>
  );
}
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Getting Starter" component={GettingStarter} />
      <Stack.Screen name="BottomTabs" component={MyTabs} />
      <Stack.Screen name="Conversa" component={Conversa} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
