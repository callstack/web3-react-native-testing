import React from "react";
import { render } from "@testing-library/react-native";
import { createConfig, useConnect, WagmiConfig, WagmiConfigProps } from "wagmi";
import { MockConnector } from "wagmi/connectors/mock";
import { createPublicClient, createWalletClient, http } from "viem";
import { Button } from "react-native";
import { foundry } from "viem/chains";
import { Web3Modal } from "@web3modal/wagmi-react-native";

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

export function MockConnectButton() {
  const { connect, connectors } = useConnect();

  return (
    <Button
      title="Connect Wallet"
      onPress={() => connect({ connector: connectors[0] })}
    />
  );
}

export function createTestConfig(flags?: ConnectionFlags) {
  const walletClient = createWalletClient({
    transport: http(foundry.rpcUrls.default.http[0]),
    chain: foundry,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    pollingInterval: 100,
  });

  const publicClient = createPublicClient({
    transport: http(foundry.rpcUrls.default.http[0]),
    chain: foundry,
    pollingInterval: 100,
  });

  return createConfig({
    connectors: [
      new MockConnector({
        options: {
          walletClient,
          flags,
        },
      }),
    ],
    publicClient,
  });
}

export function Providers({ children, config }: ProvidersProps) {
  return (
    <WagmiConfig config={config}>
      <Web3Modal />
      {children}
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
