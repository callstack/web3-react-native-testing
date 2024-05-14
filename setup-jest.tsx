import "@testing-library/react-native/extend-expect";
import "react-native-gesture-handler/jestSetup.js";
import React from "react";
import { View as MockView } from "react-native";
import { MockConnectButton } from "./src/test/mocks";

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

jest.mock("@gorhom/bottom-sheet", () => require("@gorhom/bottom-sheet/mock"));
