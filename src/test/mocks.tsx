import { Button } from "react-native";
import { useAccount, useConnect } from "wagmi";
import * as viem from "viem";
import * as MockReact from "react";
import { FetchStatus, UseQueryResult } from "@tanstack/react-query";

export type MockUseWaitForTransaction = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function MockConnectButton() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <Button
      title={isConnected ? address : "Connect Wallet"}
      onPress={() => connect({ connector: connectors[0] })}
    />
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
