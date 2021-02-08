import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Kalam_300Light,
  Kalam_400Regular,
  Kalam_700Bold,
} from "@expo-google-fonts/kalam";

import InitScreen from "./src/screens/InitScreen";

export default function App() {
  let [fontsLoaded] = useFonts({
    Kalam_300Light,
    Kalam_400Regular,
    Kalam_700Bold,
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <View style={styles.container}>
      <InitScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
