import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  const navigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const navigateToRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
