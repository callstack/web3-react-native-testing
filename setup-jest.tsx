import "@testing-library/react-native/extend-expect";
import React from "react";
import { View as MockView } from "react-native";
import { MockConnectButton } from "./testUtils";

jest.mock("@react-native-async-storage/async-storage", () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

jest.mock("@web3modal/wagmi-react-native", () => {
  const actual = jest.requireActual("@web3modal/wagmi-react-native");

  return {
    ...actual,
    Web3Modal: () => <MockView />,
    W3mButton: () => <MockConnectButton />,
  };
});
