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
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import TransactionModal from "../transaction/TransactionModal";
import ContactItem, { Contact } from "./ContactItem";

export const CONTACTS = [
  {
    id: "1",
    name: "Vitalik Buterin",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  {
    id: "2",
    name: "Thiago Brezinski",
    address: "0x0CBA9374CD43bF34E0402b10227bB022F2fea5A7",
  },
  {
    id: "3",
    name: "Punk 1234",
    address: "0x4fe547Fa933d705b0cBB433277d78A3687Fd1D3D",
  },
  {
    id: "4",
    name: "Nick Johnson",
    address: "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
  },
  {
    id: "5",
    name: "Hal Finney",
    address: "0x077E22D4D11f898Eb379DBac2441DfAa5839373f",
  },
  {
    id: "6",
    name: "Test Account",
    address: "0x9247Ab385Bee424db5B09B696864867a53A77f1A",
  },
];

const TX_PRICE = parseEther("0.0001");

function HomeScreen() {
  const toast = useToast();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(
    undefined
  );

  const { isConnected, address } = useAccount();
  const { data: balance, isSuccess: isBalanceSuccess } = useBalance({
    address,
  });
  const isInsufficientBalance = (balance?.value ?? 0) < TX_PRICE;

  const { config } = usePrepareSendTransaction({
    to: selectedContact?.address ?? "",
    value: TX_PRICE,
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
    if (selectedContact && isBalanceSuccess && isInsufficientBalance) {
      toast.show("Insufficient balance ⚠️", {
        type: "warning",
      });
    }
  }, [selectedContact, balance]);

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
          disabled={isInsufficientBalance || txLoading || !sendTransaction}
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
