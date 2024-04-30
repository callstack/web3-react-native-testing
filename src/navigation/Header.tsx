import { W3mButton } from "@web3modal/wagmi-react-native";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

function Header() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonWrapper}>
        <W3mButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  buttonWrapper: {
    marginBottom: 10,
  },
});

export default Header;
