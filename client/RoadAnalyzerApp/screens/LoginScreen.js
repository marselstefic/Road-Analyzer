// RegisterScreen.js
import React, { useState } from 'react';
import { Button, View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {

    try {
      const response = await fetch("http://192.168.64.102:5000/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log("User registered successfully");
        navigation.navigate('SensorScreen'); // Navigate to SensorScreen after successful registration
      }
    } catch (error) {
      console.error("Failed to register user: " + error);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="login" size={40} color="#000" />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirm Password" 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        secureTextEntry 
      />
      <Button
        title="Register"
        onPress={registerUser}
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
