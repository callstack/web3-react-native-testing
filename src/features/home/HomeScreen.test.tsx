import { screen, userEvent } from "@testing-library/react-native";
import { Hex } from "viem";
import * as wagmi from "wagmi";
import { useWaitForTransactionReceiptFailAfter200ms } from "../../test/mocks";
import {
  TEST_ACCOUNTS,
  renderWithProviders,
  testClient,
} from "../../test/config";
import { CONTACTS } from "./HomeScreen";
import { connectWallet, pressFirstContact } from "../../test/utils";

const user = userEvent.setup();
let initialState: Hex = "0x";

beforeAll(async () => {
  // Before all tests, dump the pristine state of the blockchain into a variable
  const dump = await testClient.dumpState();
  initialState = dump;
});

afterEach(async () => {
  // After each test, reset the blockchain to the pristine state, so that tests are isolated
  await testClient.loadState({ state: initialState });
  await testClient.setAutomine(true);
});

test("user is disconnected", async () => {
  renderWithProviders();

  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();

  // If wallet is not connected, a message should be displayed
  const connectMessage = screen.getByText(
    /connect to a wallet to view contacts/i
  );
  expect(connectMessage).toBeOnTheScreen();
});

test("user connects the wallet", async () => {
  renderWithProviders();
  await connectWallet(user);

  // If wallet is connected, a list of contacts should be displayed
  const firstContact = screen.getByRole("button", { name: CONTACTS[0].name });
  expect(firstContact).toBeOnTheScreen();
});

test("transaction succeeds", async () => {
  renderWithProviders();
  await connectWallet(user);
  await pressFirstContact(user);

  // A bottom sheet appears with the contact's details and transaction info
  const message = screen.getByText(`Send 0.001 ETH to ${CONTACTS[0].name}`);
  expect(message).toBeOnTheScreen();

  // Find the confirm button
  const confirmButton = screen.getByRole("button", { name: /confirm/i });

  // Button should be enabled before sending the transaction
  expect(confirmButton).toBeEnabled();
  expect(confirmButton).toBeOnTheScreen();

  // Press the confirm button
  await user.press(confirmButton);

  // Loading toast should appear
  const loadingToast = await screen.findByText(/transaction processing/i);
  expect(loadingToast).toBeOnTheScreen();

  // Success toast should appear
  const successToast = await screen.findByText(/transaction completed/i);
  expect(successToast).toBeOnTheScreen();
});

test("transaction fails", async () => {
  // Mock the useWaitForTransaction hook to fail after 200ms, simulating a failed transaction
  const spy = jest
    .spyOn(wagmi, "useWaitForTransactionReceipt")
    // @ts-expect-error mockImplementation is not typed
    .mockImplementation(useWaitForTransactionReceiptFailAfter200ms);

  renderWithProviders();
  await connectWallet(user);
  await pressFirstContact(user);

  // A bottom sheet appears with the contact's details and transaction info
  const message = screen.getByText(`Send 0.001 ETH to ${CONTACTS[0].name}`);
  expect(message).toBeOnTheScreen();

  // Find the confirm button
  const confirmButton = screen.getByRole("button", { name: /confirm/i });

  // Button should be enabled if balance is sufficient
  expect(confirmButton).toBeOnTheScreen();
  expect(confirmButton).toBeEnabled();

  // Press the confirm button
  await user.press(confirmButton);

  // Loading toast should appear
  const loadingToast = await screen.findByText(/transaction processing/i);
  expect(loadingToast).toBeOnTheScreen();

  // Failure toast should appear
  const failureToast = await screen.findByText(/transaction failed/i);
  expect(failureToast).toBeOnTheScreen();

  // Restore mock, so it doesn't affect our next tests
  spy.mockRestore();
});

test("insufficient balance", async () => {
  // Manually set the balance of the test account to 0, to simulate insufficient balance error
  await testClient.setBalance({
    address: TEST_ACCOUNTS[0].address,
    value: 0n,
  });

  renderWithProviders();
  await connectWallet(user);
  await pressFirstContact(user);

  // A bottom sheet appears with the contact's details and transaction info
  const message = screen.getByText(`Send 0.001 ETH to ${CONTACTS[0].name}`);
  expect(message).toBeOnTheScreen();

  // Find the confirm button
  const confirmButton = screen.getByRole("button", { name: /confirm/i });

  // Button should be disabled if balance is insufficient
  expect(confirmButton).toBeOnTheScreen();
  expect(confirmButton).toBeDisabled();

  // Error toast should appear
  const insufficientBalanceToast = await screen.findByText(
    /insufficient balance/i
  );
  expect(insufficientBalanceToast).toBeOnTheScreen();
});

test("confirm button should disable while loading", async () => {
  // Disable mining blocks, so we can test the loading state
  await testClient.setAutomine(false);

  renderWithProviders();
  await connectWallet(user);
  await pressFirstContact(user);

  // Find the confirm button
  const confirmButton = screen.getByRole("button", { name: /confirm/i });

  // Button should be enabled if balance is sufficient
  expect(confirmButton).toBeOnTheScreen();
  expect(confirmButton).toBeEnabled();

  // Press the confirm button
  await user.press(confirmButton);

  // Button should be disabled while waiting for the transaction
  expect(confirmButton).toBeDisabled();

  // Enable mining blocks again
  await testClient.setAutomine(true);

  // Wait for the transaction to succeed
  const successToast = await screen.findByText(/transaction completed/i);
  expect(successToast).toBeOnTheScreen();

  // Button should be enabled again after transaction is completed
  expect(confirmButton).toBeEnabled();
});
