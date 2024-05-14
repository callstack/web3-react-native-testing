import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Contact } from "../home/ContactItem";

interface TransactionModalProps {
  contact: Contact;
  disabled: boolean;
  onConfirm: () => void;
}

function TransactionModal(
  { contact, disabled, onConfirm }: TransactionModalProps,
  ref: React.Ref<BottomSheetModal>,
) {
  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      opacity={0.5}
      enableTouchThrough={false}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[
        { backgroundColor: "transparent" },
        StyleSheet.absoluteFillObject,
      ]}
    />
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["50%"]}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.bodyText}>
          Send 0.001 ETH to{" "}
          <Text style={styles.nameText}>{contact?.name ?? ""}</Text>
        </Text>
        <Pressable
          role="button"
          disabled={disabled}
          style={({ pressed }) => [
            { opacity: pressed ? 0.8 : 1 },
            { backgroundColor: disabled ? "gray" : "rgb(103,215,105)" },
            styles.sendButton,
          ]}
          onPress={onConfirm}
        >
          <Text style={styles.sendButtonText}>Confirm</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
  },
  bodyText: {
    fontSize: 20,
  },
  nameText: {
    fontWeight: "600",
  },
  sendButton: {
    height: 50,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderCurve: "continuous",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default forwardRef(TransactionModal);
