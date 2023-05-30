import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  const navigateToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const navigateToRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  return (
    <View style={styles.container}>
      <Button title="Login" onPress={navigateToLogin} />
      <Button title="Register" onPress={navigateToRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});