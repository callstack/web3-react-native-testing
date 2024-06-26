import { Pressable, Text } from "react-native";
import { useAccount, useConnect } from "wagmi";
import * as MockReact from "react";
import { View as MockView } from "react-native";

// Mock React Native Gesture Handler
import "react-native-gesture-handler/jestSetup.js";

// Mock @gorhom/bottom-sheet
jest.mock("@gorhom/bottom-sheet", () => require("@gorhom/bottom-sheet/mock"));

// Mock React Native Async Storage
jest.mock("@react-native-async-storage/async-storage", () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

// This mock doesn't actually change any implementation, it's just necessary to be able to `spyOn` during tests
jest.mock("wagmi", () => {
  const actual = jest.requireActual("wagmi");

  return {
    __esModule: true,
    ...actual,
  };
});

// Mock WalletConnect Web3Modal, and make it return dummy components during tests
jest.mock("@web3modal/wagmi-react-native", () => {
  const actual = jest.requireActual("@web3modal/wagmi-react-native");

  return {
    ...actual,
    Web3Modal: () => <MockView />,
    W3mButton: () => <MockConnectButton />,
  };
});

export function MockConnectButton() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  // During tests, mock the Connect Button to automatically connect to the first connector
  // instead of showing the WalletConnect Modal
  return (
    <Pressable
      role="button"
      onPress={() => connect({ connector: connectors[0] })}
    >
      <Text>{isConnected ? address : "Connect Wallet"}</Text>
    </Pressable>
  );
}

export function useWaitForTransactionReceiptFailAfter200ms() {
  const [state, setState] = MockReact.useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  MockReact.useEffect(() => {
    setTimeout(() => {
      setState({
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      });
    }, 100);

    setTimeout(() => {
      setState({
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }, 200);
  }, []);

  return state;
}
