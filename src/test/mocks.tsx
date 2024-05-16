import { Pressable, Text } from "react-native";
import { useAccount, useConnect } from "wagmi";
import * as MockReact from "react";
import { View as MockView } from "react-native";

export type MockUseWaitForTransaction = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

type UsePrepareSendTransactionFail = {
  to: string;
  value: string;
  enabled: boolean;
};

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

export function MockConnectButton() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <Pressable
      role="button"
      onPress={() => connect({ connector: connectors[0] })}
    >
      <Text>{isConnected ? address : "Connect Wallet"}</Text>
    </Pressable>
  );
}

export function useWaitForTransactionFailAfter200ms() {
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
