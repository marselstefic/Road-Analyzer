import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SensorScreen from './screens/SensorScreen'; // Import SensorScreen component
import RegisterScreen from './screens/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
      <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="SensorScreen" component={SensorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
