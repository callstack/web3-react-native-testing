import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { parseEther } from "viem";
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import TransactionModal from "../transaction/TransactionModal";
import ContactItem, { Contact } from "./ContactItem";

// TODO: Remove all ENS
export const CONTACTS = [
  {
    id: "1",
    name: "Vitalik Buterin",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  {
    id: "2",
    name: "Thiago Brezinski",
    address: "thiagobrez.eth",
  },
  {
    id: "3",
    name: "Gavin Wood",
    address: "gavin.eth",
  },
  {
    id: "4",
    name: "Nick Johnson",
    address: "nick.eth",
  },
  {
    id: "5",
    name: "Hal Finney",
    address: "hal.eth",
  },
  {
    id: "6",
    name: "Test Account",
    address: "0x9247Ab385Bee424db5B09B696864867a53A77f1A",
  },
];

function HomeScreen() {
  const toast = useToast();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(
    undefined
  );
  const { isConnected } = useAccount();

  const {
    config,
    isLoading: estimateGasLoading,
    isError: estimateGasError,
  } = usePrepareSendTransaction({
    to: selectedContact?.address ?? "",
    value: parseEther("0.0001"),
    enabled: !!selectedContact,
  });

  const {
    data: transaction,
    sendTransaction,
    error: sendError,
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

      bottomSheetModalRef.current?.dismiss();
    }
  }, [txSuccess]);

  useEffect(() => {
    if (estimateGasError) {
      toast.show("Insufficient balance ⚠️", {
        type: "warning",
      });
    }
  }, [estimateGasError]);

  useEffect(() => {
    if (sendError) {
      toast.show(
        sendError.message.substring(0, sendError.message.indexOf("\n")),
        {
          type: "danger",
        }
      );
    }
  }, [sendError]);

  const onPressContact = (contact: Contact) => {
    setSelectedContact(contact);
    bottomSheetModalRef.current?.present();
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.notConnected}>
          <Text>Connect to a wallet to view contacts</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={CONTACTS}
        renderItem={({ item }) => (
          <ContactItem contact={item} onPress={() => onPressContact(item)} />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "lightgray" }} />
        )}
      />

      <BottomSheetModalProvider>
        <TransactionModal
          ref={bottomSheetModalRef}
          contact={selectedContact}
          disabled={estimateGasLoading || estimateGasError || txLoading}
          onConfirm={() => sendTransaction?.()}
        />
      </BottomSheetModalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notConnected: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
