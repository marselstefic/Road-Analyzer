import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SensorScreen from './screens/SensorScreen'; // Import SensorScreen component
import RegisterScreen from './screens/RegisterScreen';

const Stack = createStackNavigator();

export default function RegisterScreen({ navigation }) {
  const ToLoginScreen = async () => {
    navigation.navigate('LoginScreen');
  }

  const ToRegisterScreen = async () => {
    navigation.navigate('RegisterScreen');
  }


  return (
    <View style={styles.container}>
      <Button
        title="Login"
        onPress={ToLoginScreen}
      />
      <Button
        title="Register"
        onPress={ToRegisterScreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    padding: 8,
  },
});
