import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element
}), { virtual: true });

test("renders app without crashing", async () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<App />);
  await new Promise((resolve) => setTimeout(resolve, 0));
  consoleError.mockRestore();
});
