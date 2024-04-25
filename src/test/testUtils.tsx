import { render } from "@testing-library/react-native";
import { Web3Modal } from "@web3modal/wagmi-react-native";
import React from "react";
import { ToastProvider } from "react-native-toast-notifications";
import {
  createTestClient,
  createWalletClient,
  http,
  publicActions,
  walletActions,
} from "viem";
import { foundry } from "viem/chains";
import {
  WagmiConfig,
  WagmiConfigProps,
  configureChains,
  createConfig,
} from "wagmi";
import { MockConnector } from "wagmi/connectors/mock";
import { publicProvider } from "wagmi/providers/public";

type ProvidersProps = {
  children: React.ReactNode;
  config?: WagmiConfigProps["config"];
};

type ConnectionFlags = {
  isAuthorized?: boolean;
  failConnect?: boolean;
  failSwitchChain?: boolean;
  noSwitchChain?: boolean;
};

const { chains, publicClient } = configureChains([foundry], [publicProvider()]);

export const testClient = createTestClient({
  transport: http(),
  chain: chains[0],
  mode: "anvil",
  account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  pollingInterval: 100,
})
  .extend(publicActions)
  .extend(walletActions);

const walletClient = createWalletClient({
  transport: http(),
  chain: chains[0],
  account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  pollingInterval: 100,
});

export function createTestConfig(flags?: ConnectionFlags) {
  const mockConnector = new MockConnector({
    chains,
    options: {
      walletClient,
      flags,
    },
  });

  return createConfig({
    connectors: [mockConnector],
    publicClient,
  });
}

export function Providers({ children, config }: ProvidersProps) {
  return (
    <WagmiConfig config={config}>
      <ToastProvider>
        <Web3Modal />
        {children}
      </ToastProvider>
    </WagmiConfig>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  flags?: ConnectionFlags,
) {
  const config = createTestConfig(flags);
  return render(<Providers config={config}>{ui}</Providers>);
}
