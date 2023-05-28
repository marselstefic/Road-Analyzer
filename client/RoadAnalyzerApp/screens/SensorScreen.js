import React, { useState, useEffect } from "react";
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Accelerometer, Gyroscope } from "expo-sensors";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SensorScreen() {
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const _slow = () => {
    Accelerometer.setUpdateInterval(2000);
    Gyroscope.setUpdateInterval(2000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
    Gyroscope.setUpdateInterval(16);
  };

  const postDataToServer = async (data) => {
    try {
      const response = await fetch("http://192.168.64.102:5000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log("Data posted successfully");
      }
    } catch (error) {
      console.error("Failed to post data: " + error);
    }
  };

  const _subscribe = async () => {
    setSubscription([
      Accelerometer.addListener((accelerometerData) => {
        setAccelData(accelerometerData);
        postDataToServer({
          accelerometerX: accelerometerData.x,
          accelerometerY: accelerometerData.y,
          accelerometerZ: accelerometerData.z,
          gyroX: gyroData.x,
          gyroY: gyroData.y,
          gyroZ: gyroData.z,
          latitude: location ? location.latitude : null,
          longitude: location ? location.longitude : null,
          timestamp: location ? location.timestamp : null,
        });
      }),
      Gyroscope.addListener((gyroscopeData) => {
        setGyroData(gyroscopeData);
        postDataToServer({
          accelerometerX: accelData.x,
          accelerometerY: accelData.y,
          accelerometerZ: accelData.z,
          gyroX: gyroscopeData.x,
          gyroY: gyroscopeData.y,
          gyroZ: gyroscopeData.z,
          latitude: location ? location.latitude : null,
          longitude: location ? location.longitude : null,
          timestamp: location ? location.timestamp : null,
        });
      }),
    ]);

    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          const {
            coords: { latitude, longitude },
            timestamp,
          } = newLocation;
          setLocation({ latitude, longitude, timestamp });
        }
      );
    } catch (error) {
      setErrorMsg("Permission to access location was denied");
    }
  };

  const _unsubscribe = () => {
    subscription.forEach((sub) => sub && sub.remove());
    setSubscription([]);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();

    return () => _unsubscribe();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}, Timestamp: ${location.timestamp}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>
          {text}
          {"\n"}
          Accelerometer: (in gs where 1g = 9.81 m/s^2)
        </Text>
        <Text style={styles.text}>Accel X: {accelData.x}</Text>
        <Text style={styles.text}>Accel Y: {accelData.y}</Text>
        <Text style={styles.text}>Accel Z: {accelData.z}</Text>
        <Text style={styles.text}>Gyro X: {gyroData.x}</Text>
        <Text style={styles.text}>Gyro Y: {gyroData.y}</Text>
        <Text style={styles.text}>Gyro Z: {gyroData.z}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={subscription.length > 0 ? _unsubscribe : _subscribe}
            style={styles.button}
          >
            <Text>{subscription.length > 0 ? "Off" : "On"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={_slow}
            style={[styles.button, styles.middleButton]}
          >
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});
