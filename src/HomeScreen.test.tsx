import { act, screen, userEvent } from "@testing-library/react-native";
import { renderWithProviders, testClient } from "./test/testUtils";
import HomeScreen from "./HomeScreen";
import React from "react";
import * as wagmi from "wagmi";
import { useWaitForTransactionFailAfter200ms } from "./test/mocks";
import { Hex } from "viem";

const user = userEvent.setup();
let initialState: Hex = "0x";

const prepareTestingEnvironment = async () => {
  // Before all tests, dump the pristine state of the blockchain into a variable
  const dump = await testClient.dumpState();
  initialState = dump;
};

const resetToInitialState = async () => {
  // After each test, reset the blockchain to the pristine state, so that tests are isolated
  await testClient.loadState({ state: initialState });
  await testClient.setAutomine(true);
};

const connectWallet = async () => {
  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();
  await user.press(connectButton);
};

beforeAll(async () => {
  return prepareTestingEnvironment();
});

afterEach(async () => {
  return resetToInitialState();
});

test("user is disconnected", async () => {
  renderWithProviders(<HomeScreen />);

  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();

  // Transaction button should NOT be visible before connecting the wallet
  const transactionButton = screen.queryByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).not.toBeOnTheScreen();
});

test("user connects the wallet", async () => {
  renderWithProviders(<HomeScreen />);
  await connectWallet();

  // Transaction button should be visible after connecting the wallet
  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();
});

test("transaction succeeds", async () => {
  renderWithProviders(<HomeScreen />);
  await connectWallet();

  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();
  await user.press(transactionButton);

  const loadingToast = await screen.findByText(/transaction processing/i);
  expect(loadingToast).toBeOnTheScreen();

  const successToast = await screen.findByText(/transaction completed/i);
  expect(successToast).toBeOnTheScreen();
});

test("transaction fails before being sent - insufficient balance", async () => {
  // Set the account balance to 0, simulating an insufficient balance
  await testClient.setBalance({
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    value: 0n,
  });

  renderWithProviders(<HomeScreen />);
  await connectWallet();

  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();

  // For some reason usePrepareSendTransaction only fails with insufficient balance in production.
  // In the test environment, the prepare hook doesn't fail and instead the actual transaction call does.
  await user.press(transactionButton);

  const insufficientBalanceMessage =
    await screen.findByText(/insufficient balance/i);
  expect(insufficientBalanceMessage).toBeOnTheScreen();
});

test("transaction fails after being sent", async () => {
  // Mock the useWaitForTransaction hook to fail after 200ms, simulating a failed transaction
  const spy = jest
    .spyOn(wagmi, "useWaitForTransaction")
    // @ts-expect-error mockImplementation is not typed
    .mockImplementation(useWaitForTransactionFailAfter200ms);

  renderWithProviders(<HomeScreen />);
  await connectWallet();

  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();
  await user.press(transactionButton);

  const loadingToast = await screen.findByText(/transaction processing/i);
  expect(loadingToast).toBeOnTheScreen();

  const failureToast = await screen.findByText(/transaction failed/i);
  expect(failureToast).toBeOnTheScreen();

  // Restore original hook
  spy.mockRestore();
});

test("transaction button should disable while loading", async () => {
  // Disable mining blocks, so we can test the loading state
  await testClient.setAutomine(false);

  renderWithProviders(<HomeScreen />);
  await connectWallet();

  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();

  await user.press(transactionButton);

  // Test the loading state
  expect(transactionButton).toBeDisabled();

  // Enable mining blocks again
  await testClient.setAutomine(true);

  const successToast = await screen.findByText(/transaction completed/i);
  expect(successToast).toBeOnTheScreen();
  expect(transactionButton).toBeEnabled();
});
