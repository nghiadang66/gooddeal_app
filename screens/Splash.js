import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Colors from "../themes/Colors";

const Splash = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
});

export default Splash;