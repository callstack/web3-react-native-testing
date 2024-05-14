import { Pressable, Text } from "react-native";
import { useAccount, useConnect } from "wagmi";
import * as MockReact from "react";

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

export function usePrepareSendTransactionFail({
  to,
  value,
}: UsePrepareSendTransactionFail) {
  const [state, setState] = MockReact.useState({
    config: {
      mode: "prepared",
      to,
      value,
      accessList: undefined,
      account: undefined,
      data: undefined,
      gas: 21000n,
      gasPrice: undefined,
      maxFeePerGas: undefined,
      maxPriorityFeePerGas: undefined,
      nonce: undefined,
    },
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
  });

  MockReact.useEffect(() => {
    setTimeout(() => {
      setState({
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }, 100);
  }, []);

  return state;
}
