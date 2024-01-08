// RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(
        "http://" + process.env.EXPO_PUBLIC_API_URL + "/login",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log("User logged in successfully");
        navigation.navigate("SensorScreen", { postedBy: username });
      }
    } catch (error) {
      console.error("Failed to log in: " + error);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="login" size={40} color="#000" style={styles.icon} />
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
      <TouchableOpacity style={styles.button} onPress={loginUser}>
        <Text style={styles.buttonText}>Login</Text>
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
    backgroundColor: "#1e90ff",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
