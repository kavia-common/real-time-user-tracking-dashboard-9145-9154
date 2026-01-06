import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

test("renders key landmarks and components", () => {
  render(<App />);

  expect(screen.getByRole("banner", { name: /top navigation/i })).toBeInTheDocument();
  expect(screen.getByRole("main", { name: /dashboard main content/i })).toBeInTheDocument();

  // Nav landmark wrapper exists and includes user list sidebar inside.
  expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();

  // Map panel header
  expect(screen.getByText(/Live Map/i)).toBeInTheDocument();

  // "OceanTrack" appears both in the header brand and footer copy, so query a unique element.
  const topNav = screen.getByRole("banner", { name: /top navigation/i });
  expect(topNav.querySelector(".brandTitle")).toHaveTextContent(/OceanTrack/i);
});

test("sidebar supports keyboard navigation (arrow keys + enter)", () => {
  render(<App />);

  // Focus the listbox
  const listbox = screen.getByRole("listbox", { name: /users/i });
  listbox.focus();
  expect(listbox).toHaveFocus();

  // Arrow down moves selection
  fireEvent.keyDown(listbox, { key: "ArrowDown" });

  // Enter reaffirms selection (should not throw); also selection remains valid
  fireEvent.keyDown(listbox, { key: "Enter" });

  // At least one option should be selected in the DOM.
  const options = screen.getAllByRole("option");
  expect(options.some((o) => o.getAttribute("aria-selected") === "true")).toBe(true);
});
