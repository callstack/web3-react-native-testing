import { screen } from "@testing-library/react-native";
import { UserEventInstance } from "@testing-library/react-native/build/user-event/setup";
import { CONTACTS } from "../features/home/HomeScreen";

export async function connectWallet(user: UserEventInstance) {
  const connectButton = screen.getByRole("button", { name: "Connect Wallet" });
  expect(connectButton).toBeOnTheScreen();
  await user.press(connectButton);
}

export async function pressFirstContact(user: UserEventInstance) {
  const firstContact = screen.getByRole("button", { name: CONTACTS[0].name });
  expect(firstContact).toBeOnTheScreen();
  await user.press(firstContact);
}
