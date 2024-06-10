import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Address } from "viem";

export type Contact = {
  id: string;
  name: string;
  address: Address;
};

type ContactItemProps = {
  contact: Contact;
  onPress: () => void;
};

function ContactItem({ contact, onPress }: ContactItemProps) {
  return (
    <Pressable
      role="button"
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        styles.container,
      ]}
      onPress={onPress}
    >
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.address}>{contact.address}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 4,
  },
  name: {
    fontSize: 16,
  },
  address: {
    fontSize: 12,
    color: "gray",
  },
});

export default ContactItem;
