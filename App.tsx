import "./polyfills";

import { NavigationContainer } from "@react-navigation/native";
import {
  Web3Modal,
  createWeb3Modal,
  defaultWagmiConfig,
} from "@web3modal/wagmi-react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { mainnet, sepolia } from "viem/chains";
import { WagmiConfig } from "wagmi";
import RootNavigator from "./src/navigation/RootNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Web3Modal projectId
const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_CLOUD_PROJECT_ID ?? "";

// Web3Modal metadata
const metadata = {
  name: "React Native Web3 Testing",
  description: "React Native Web3 Testing Example",
  url: "https://callstack.com",
  icons: ["https://avatars.githubusercontent.com/u/42239399?v=4"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

// Choose chains to enable
const chains = [mainnet, sepolia];

// Use Web3Modal's utils to create the Wagmi config and attach to Web3Modal
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// Init Web3Modal instance
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true,
});

export default function App() {
  return (
    // TODO: Fix TS error
    // Pass wagmiConfig to the Wagmi Provider
    <WagmiConfig config={wagmiConfig}>
      <StatusBar style="auto" />
      <Web3Modal />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <ToastProvider>
            <RootNavigator />
          </ToastProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </WagmiConfig>
  );
}
