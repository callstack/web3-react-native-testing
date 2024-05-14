import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import { Web3Modal } from "@web3modal/wagmi-react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "react-native-toast-notifications";
import {
  PublicClient,
  createTestClient,
  http,
  publicActions,
  walletActions,
} from "viem";
import { foundry } from "viem/chains";
import { WagmiConfig, createConfig } from "wagmi";
import { MockConnector } from "wagmi/connectors/mock";
import RootNavigator from "../navigation/RootNavigator";

type ConnectionFlags = {
  isAuthorized?: boolean;
  failConnect?: boolean;
  failSwitchChain?: boolean;
  noSwitchChain?: boolean;
};

const chains = [foundry];

export const testClient = createTestClient({
  transport: http(),
  chain: chains[0],
  mode: "anvil",
  account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  // account: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  pollingInterval: 100,
})
  .extend(publicActions)
  .extend(walletActions);

export function createTestConfig(flags?: ConnectionFlags) {
  const mockConnector = new MockConnector({
    chains,
    options: {
      walletClient: testClient,
      flags,
    },
  });

  return createConfig({
    connectors: [mockConnector],
    publicClient: testClient as PublicClient,
  });
}

export function renderWithProviders(flags?: ConnectionFlags) {
  const config = createTestConfig(flags);

  return render(
    <WagmiConfig config={config}>
      <Web3Modal />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <ToastProvider duration={1000} animationDuration={0}>
            <RootNavigator />
          </ToastProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </WagmiConfig>
  );
}
