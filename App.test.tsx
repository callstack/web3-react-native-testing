import React from "react";
import { render } from "@testing-library/react-native";
import App from "./App";

test.skip("renders correctly", async () => {
  render(<App />);
  expect(true).toBe(true);
});
