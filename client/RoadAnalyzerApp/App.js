import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Location from "expo-location";

export default function App() {
  let text = "Waiting..";
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
    let location = Location.getCurrentPositionAsync({});
    setLocation(location);
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      _subscribe();
      return () => _unsubscribe();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>
          <Text>{text}</Text>
          Accelerometer: (in gs where 1g = 9.81 m/s^2)
        </Text>
        <Text style={styles.text}>X: {x}</Text>
        <Text style={styles.text}>Y: {y}</Text>
        <Text style={styles.text}>Z: {z}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={subscription ? _unsubscribe : _subscribe}
            style={styles.button}
          >
            <Text>{subscription ? "On" : "Off"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={_slow}
            style={[styles.button, styles.middleButton]}
          >
          <Text>Slower</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
  },
});
