import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SensorScreen from "./screens/SensorScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import IntroScreen from "./screens/IntroScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IntroScreen">
        <Stack.Screen name="IntroScreen" component={IntroScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="SensorScreen" component={SensorScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
