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

const projectId = "e72f41e9c11cda6247c0a5796ec8d2c1";

const metadata = {
  name: "Web3Modal RN",
  description: "Web3Modal RN Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

const chains = [mainnet, sepolia];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true,
});

export default function App() {
  return (
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
