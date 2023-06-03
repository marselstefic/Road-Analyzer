// RegisterScreen.js
import React, { useState } from "react";
import {
  Button,
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerUser = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://164.8.162.93:5000/register", {
        method: "POST",
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
        navigation.navigate("SensorScreen", { postedBy: username }); // Navigate to SensorScreen after successful registration
      }
    } catch (error) {
      console.error("Failed to register user: " + error);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="account-plus" size={40} color="#000" style={styles.icon} />
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
      <TouchableOpacity style={styles.button} onPress={registerUser}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  icon: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});