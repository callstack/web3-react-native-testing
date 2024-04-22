import { W3mButton } from "@web3modal/wagmi-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAccount } from "wagmi";

function HomeScreen() {
  const { isConnected } = useAccount();

  return (
    <View style={styles.container}>
      {isConnected ? <Text>Connected</Text> : <W3mButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
