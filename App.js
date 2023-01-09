import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import UploadScreen from "./src/UploadScreen";

const App = () => {
  return (
    <View style={styles.container}>
      <UploadScreen />
      <StatusBar style="light" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
