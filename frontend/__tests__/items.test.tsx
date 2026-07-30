import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemsPage from "../app/items/page";

describe("ItemsPage Component", () => {
  test("renders without crashing", () => {
    render(<ItemsPage />);
    expect(screen.getByRole("heading", { name: /items directory/i })).toBeInTheDocument();
  });

  test("displays the expected number of mock items", () => {
    render(<ItemsPage />);
    expect(screen.getByText("Item One")).toBeInTheDocument();
    expect(screen.getByText("Item Two")).toBeInTheDocument();
    expect(screen.getByText("Item Three")).toBeInTheDocument();
    expect(screen.getByText("Item Four")).toBeInTheDocument();

    const itemLinks = screen.getAllByRole("link", { name: /item/i });
    expect(itemLinks).toHaveLength(4);
  });

  test("each item links to the correct detail page URL using its id", () => {
    render(<ItemsPage />);
    const mockItemIds = ["1", "2", "3", "4"];

    mockItemIds.forEach((id) => {
      const link = screen.getByRole("link", { name: new RegExp(`id: ${id}`, "i") });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/items/${id}`);
    });
  });

  test("shows inline error when name is empty or whitespace", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    await user.type(nameInput, "   ");
    await user.type(descInput, "Valid description");
    await user.click(submitBtn);

    expect(screen.getByText(/name cannot be empty or just whitespace/i)).toBeInTheDocument();
  });

  test("shows inline error on duplicate item name (case-insensitive) and blocks submission", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    // Try adding "item one" (case insensitive match for "Item One")
    await user.type(nameInput, "item one");
    await user.type(descInput, "Duplicate test description");
    await user.click(submitBtn);

    expect(screen.getByText(/an item with this name already exists/i)).toBeInTheDocument();
  });

  test("deletes an item without shifting or reassigning remaining item IDs", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    expect(screen.getByText("Item Two")).toBeInTheDocument();

    const deleteItemTwoBtn = screen.getByRole("button", { name: /delete item two/i });
    await user.click(deleteItemTwoBtn);

    // Item Two should be removed
    expect(screen.queryByText("Item Two")).not.toBeInTheDocument();

    // Remaining items should preserve their original IDs (1, 3, 4)
    expect(screen.getByRole("link", { name: /id: 1/i })).toHaveAttribute("href", "/items/1");
    expect(screen.getByRole("link", { name: /id: 3/i })).toHaveAttribute("href", "/items/3");
    expect(screen.getByRole("link", { name: /id: 4/i })).toHaveAttribute("href", "/items/4");
  });

  test("generates unique ID with no collisions after deleting highest ID item", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    // Delete Item Four (highest ID = 4)
    const deleteItemFourBtn = screen.getByRole("button", { name: /delete item four/i });
    await user.click(deleteItemFourBtn);
    expect(screen.queryByText("Item Four")).not.toBeInTheDocument();

    // Remaining max ID is 3. Adding a new item should generate ID 4 cleanly
    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    await user.type(nameInput, "New Unique Item");
    await user.type(descInput, "Testing unique ID generation");
    await user.click(submitBtn);

    expect(screen.getByText("New Unique Item")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /id: 4/i })).toHaveAttribute("href", "/items/4");
  });
});
