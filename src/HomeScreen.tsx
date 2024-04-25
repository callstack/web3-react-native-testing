import { W3mButton } from "@web3modal/wagmi-react-native";
import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { parseEther } from "viem";
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

function HomeScreen() {
  const { isConnected } = useAccount();
  const { config, isError: estimateGasError } = usePrepareSendTransaction({
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    value: parseEther("0.001"),
  });
  const { data: transaction, sendTransaction } = useSendTransaction(config);
  const {
    isError: txError,
    isLoading: txLoading,
    isSuccess: txSuccess,
  } = useWaitForTransaction(transaction);
  const toast = useToast();

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
        type: "error",
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

  return (
    <View style={styles.container}>
      <W3mButton />

      {isConnected && (
        <View style={styles.transaction}>
          {estimateGasError && <Text>Insufficient balance</Text>}

          <Button
            title="Send Transaction"
            disabled={estimateGasError || txLoading}
            onPress={() => {
              sendTransaction();
            }}
          />
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
