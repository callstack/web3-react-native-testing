import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import { Web3Modal } from "@web3modal/wagmi-react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "react-native-toast-notifications";
import {
  Address,
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

// Choose chains to use while testing. Foundry will point to Anvil
const chains = [foundry];

// Account we will use while testing. This is Anvil's first account
export const TEST_ACCOUNTS = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as Address,
    key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },
];

// Create a Viem Test Client, and connect to Anvil
export const testClient = createTestClient({
  transport: http(),
  chain: chains[0],
  mode: "anvil",
  // Pass the account address and private key, so we can sign transactions
  account: TEST_ACCOUNTS[0].address,
  key: TEST_ACCOUNTS[0].key,
  // Use a low pollingInterval to speed up tests
  pollingInterval: 100,
})
  // Extend the client with public and wallet actions, so it can also act as a Public Client and Wallet Client
  .extend(publicActions)
  .extend(walletActions);

export function renderWithProviders() {
  // Create a Wagmi Config specifically for testing
  // Pass the testClient as the connector walletClient
  // Pass the testClient as the config publicClient
  const testConfig = createConfig({
    connectors: [
      new MockConnector({
        chains,
        options: {
          walletClient: testClient,
        },
      }),
    ],
    publicClient: testClient as PublicClient,
  });

  return render(
    // Pass the test Wagmi Config to the Wagmi Provider
    <WagmiConfig config={testConfig}>
      <Web3Modal />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          {/* Use smaller durations for the Toast library to speed up tests */}
          <ToastProvider duration={1000} animationDuration={0}>
            <RootNavigator />
          </ToastProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </WagmiConfig>
  );
}
