import { W3mButton } from "@web3modal/wagmi-react-native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { parseEther } from "viem";
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

function HomeScreen() {
  const toast = useToast();
  const { isConnected } = useAccount();
  const { config, isError: estimateGasError } = usePrepareSendTransaction({
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    value: parseEther("1000"),
  });
  const {
    data: transaction,
    sendTransaction,
    isError: sendError,
  } = useSendTransaction(config);
  const {
    isError: txError,
    isLoading: txLoading,
    isSuccess: txSuccess,
  } = useWaitForTransaction(transaction);

  useEffect(() => {
    if (txLoading) {
      toast.show("Transaction processing...", {
        type: "info",
      });
    }
  }, [txLoading]);

  useEffect(() => {
    if (txError) {
      toast.show("Transaction failed ⚠️", {
        type: "danger",
      });
    }
  }, [txError]);

  useEffect(() => {
    if (txSuccess) {
      toast.show("Transaction completed ✅", {
        type: "success",
      });
    }
  }, [txSuccess]);

  useEffect(() => {
    if (estimateGasError || sendError) {
      toast.show("Insufficient balance ⚠️", {
        type: "danger",
      });
    }
  }, [estimateGasError, sendError]);

  return (
    <View style={styles.container}>
      <W3mButton />

      {isConnected && (
        <View style={styles.transaction}>
          <Pressable
            role="button"
            disabled={txLoading}
            onPress={() => sendTransaction?.()}
          >
            <Text>Send Transaction</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },
  transaction: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});

export default HomeScreen;
