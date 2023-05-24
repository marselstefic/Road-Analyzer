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
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = async () => {
    setSubscription([
      Accelerometer.addListener((accelerometerData) => {
        setAccelData(accelerometerData);
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
    if (subscription) {
      subscription.forEach((sub) => sub && sub.remove());
    }
    setSubscription(null);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      _subscribe();
    })();

    return () => {
      if (Array.isArray(subscription)) {
        _unsubscribe();
      }
    };
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
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
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
