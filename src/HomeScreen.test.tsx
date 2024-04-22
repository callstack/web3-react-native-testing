import { screen, userEvent } from "@testing-library/react-native";
import { renderWithProviders } from "../testUtils";
import HomeScreen from "./HomeScreen";

const user = userEvent.setup();

test("connects to provider", async () => {
  renderWithProviders(<HomeScreen />);

  const connectButton = screen.getByText("Connect Wallet");
  expect(connectButton).toBeOnTheScreen();
  await user.press(connectButton);

  const connectedText = await screen.findByText("Connected");
  expect(connectedText).toBeOnTheScreen();
});
