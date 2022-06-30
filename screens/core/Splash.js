import React from "react";
import { StyleSheet, View } from "react-native";
import Spinner from "../../components/Other/Spinner";
import Colors from "../../themes/Colors";

const Splash = () => (
  <View style={styles.container}>
    <Spinner />
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