// VideoScreen.js

import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";

export default function VideoScreen({ navigation }) {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const handleVideoPress = () => {
    if (isVideoReady) {
      navigation.replace("HomeScreen");
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) {
      setIsVideoReady(false);
    } else if (status.didJustFinish) {
      navigation.replace("HomeScreen");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handleVideoPress}
      >
        <Video
          ref={videoRef}
          source={require("../assets/Grafika_projekt.mp4")} // Update with the correct path
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain" // Use 'contain' for correct aspect ratio
          shouldPlay
          onReadyForDisplay={() => setIsVideoReady(true)}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          style={styles.video}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
