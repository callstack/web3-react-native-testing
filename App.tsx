import "./polyfills";

import {
  Web3Modal,
  createWeb3Modal,
  defaultWagmiConfig,
} from "@web3modal/wagmi-react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { mainnet, sepolia } from "viem/chains";
import { WagmiConfig } from "wagmi";
import HomeScreen from "./src/HomeScreen";
import { ToastProvider } from "react-native-toast-notifications";

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
      <ToastProvider>
        <StatusBar style="auto" />
        <Web3Modal />
        <HomeScreen />
      </ToastProvider>
    </WagmiConfig>
  );
}
