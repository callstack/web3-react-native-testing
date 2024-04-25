import { act, screen, userEvent } from "@testing-library/react-native";
import { renderWithProviders, testClient } from "./test/testUtils";
import HomeScreen from "./HomeScreen";
import React from "react";
import * as wagmi from "wagmi";
import { useWaitForTransactionFailAfter200ms } from "./test/mocks";

const user = userEvent.setup();

const resetToInitialState = async () => {
  jest.restoreAllMocks();

  await testClient.loadState({
    state:
      "0x1f8b08000000000000ffad55db6a1c310cfd9779ce837c9125e5671649b6c3d26437ec6e4a4ac8bf57b39b160225b4743c307864e99c235963bf2df678f46fcbfddb727879b2715aee177885e56ef1e3fe607a1e37c35f8e88bbec9fc6f9a24fcfd7c01496073def1ef74ffbcbcde2e28557cf157d8e1b413151d72b40dfcfb9f797c7cb8fdf5a9e4fe3fb490f5d8fffa4e60b9591b5edc6ab8ff379b7ea0bf0ddf369ef63adc487fdea138bcb3d7c04c4c787537a7fbf5bd4fdf872b89cd79848ac76279156bb6607b65c9ab0955edcc9b5e424a58b205e6b7d3cac282bae3eea751e08398d24035c4c2dd75f52fdd86fcb313f5f8e277d5845aefcc189bd54d5893537ea469dbc34e22261a314f50c294ddba69c9157e2c1699489de2705b997de3066e6a036d10294e7969cc56bf5debb351580a9d990b1f72c01537aca536b9662be25671d28562b57b24282c4c82c195c89a7cddc1cac0ab62f383f31d0fcbf118936482d7473bc33702ec4509073ccea448684091b94556ae23c3b1a87176684f589e01ad13ecb1f7225102121704c9c72f7a290c0a9433284013dd1dadbce5bd6576092d86cc3b2d7c914f9e1882a0be791668234624705daa69cd4865285dc06e58658a3a390a662a556d43aac99abcaa69c1244403d29a2b9e726e8c8a6a9cd68acce490c34ce8e2d3915c6204d35f738173ccd3814521d557912b6f85d32686c77862d396791d9dbc0a4da99679bd5475363ce94a377a2854d726e9bed67905adc34bbeb05b6fb747bbdff04d130d3d4d7060000",
  });

  await testClient.setAutomine(true);
};

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

  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();
  await user.press(connectButton);

  // Transaction button should be visible after connecting the wallet
  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();
});

test("transaction succeeds", async () => {
  renderWithProviders(<HomeScreen />);

  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();
  await user.press(connectButton);

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

test.skip("prepare transaction fails - insufficient balance", async () => {
  // await act(async () => {
  //   await testClient.setBalance({
  //     address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  //     value: parseEther("0"),
  //   });
  // });

  renderWithProviders(<HomeScreen />);

  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();
  await user.press(connectButton);

  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();
  expect(transactionButton).toBeDisabled();

  const insufficientBalanceMessage =
    await screen.findByText(/insufficient balance/i);
  expect(insufficientBalanceMessage).toBeOnTheScreen();
});

test("transaction fails", async () => {
  jest
    .spyOn(wagmi, "useWaitForTransaction")
    // @ts-expect-error mockImplementation is not typed
    .mockImplementation(useWaitForTransactionFailAfter200ms);

  renderWithProviders(<HomeScreen />);

  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();
  await user.press(connectButton);

  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();
  await user.press(transactionButton);

  const loadingToast = await screen.findByText(/transaction processing/i);
  expect(loadingToast).toBeOnTheScreen();

  const failureToast = await screen.findByText(/transaction failed/i);
  expect(failureToast).toBeOnTheScreen();
});

test("transaction button should disable while loading", async () => {
  await testClient.setAutomine(false);

  renderWithProviders(<HomeScreen />);

  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();
  await user.press(connectButton);

  const transactionButton = screen.getByRole("button", {
    name: /send transaction/i,
  });
  expect(transactionButton).toBeOnTheScreen();
  await user.press(transactionButton);
  expect(transactionButton).toBeDisabled();

  await testClient.setAutomine(true);

  const successToast = await screen.findByText(
    /transaction completed/i,
    {},
    {
      timeout: 4000,
    },
  );
  expect(successToast).toBeOnTheScreen();
  expect(transactionButton).toBeEnabled();
});
