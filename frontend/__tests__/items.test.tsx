import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemsPage from "../app/items/page";

describe("ItemsPage Component - Granular Unit Tests", () => {
  test("1. Renders the correct initial number of mock items on page load", () => {
    render(<ItemsPage />);
    const itemLinks = screen.getAllByRole("link", { name: /item/i });
    expect(itemLinks).toHaveLength(4);
    expect(screen.getByText("Item One")).toBeInTheDocument();
    expect(screen.getByText("Item Two")).toBeInTheDocument();
    expect(screen.getByText("Item Three")).toBeInTheDocument();
    expect(screen.getByText("Item Four")).toBeInTheDocument();
  });

  test("2. Successfully adds a new item when the form is submitted with valid, unique data", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    await user.type(nameInput, "Item Five");
    await user.type(descInput, "Fifth item description");
    await user.click(submitBtn);

    expect(screen.getByText("Item Five")).toBeInTheDocument();
    expect(screen.getByText("Fifth item description")).toBeInTheDocument();
    const itemLinks = screen.getAllByRole("link", { name: /item/i });
    expect(itemLinks).toHaveLength(5);
  });

  test("3. Blocks submission and shows an inline error when the name field is empty or whitespace only", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    await user.type(nameInput, "   ");
    await user.type(descInput, "Description text");
    await user.click(submitBtn);

    expect(screen.getByText(/name cannot be empty or just whitespace/i)).toBeInTheDocument();
    const itemLinks = screen.getAllByRole("link", { name: /item/i });
    expect(itemLinks).toHaveLength(4);
  });

  test("4. Blocks submission and shows an inline error when a duplicate name (case-insensitive) is submitted", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    await user.type(nameInput, "item one");
    await user.type(descInput, "Duplicate test");
    await user.click(submitBtn);

    expect(screen.getByText(/an item with this name already exists/i)).toBeInTheDocument();
    const itemLinks = screen.getAllByRole("link", { name: /item/i });
    expect(itemLinks).toHaveLength(4);
  });

  test("5. Automatically assigns the correct next id based on the highest existing id, not the list length", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    // Delete Item Two (ID: 2). Remaining IDs: 1, 3, 4. Length = 3. Max ID = 4.
    const deleteItemTwoBtn = screen.getByRole("button", { name: /delete item two/i });
    await user.click(deleteItemTwoBtn);

    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    await user.type(nameInput, "Item Six");
    await user.type(descInput, "Testing highest ID assignment");
    await user.click(submitBtn);

    // Next ID should be 5 (max ID 4 + 1), NOT 4 (list length 3 + 1)
    expect(screen.getByRole("link", { name: /id: 5/i })).toHaveAttribute("href", "/items/5");
  });

  test("6. Successfully deletes an item when its delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    expect(screen.getByText("Item Two")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: /delete item two/i });
    await user.click(deleteBtn);

    expect(screen.queryByText("Item Two")).not.toBeInTheDocument();
    const itemLinks = screen.getAllByRole("link", { name: /item/i });
    expect(itemLinks).toHaveLength(3);
  });

  test("7. After deleting the item with the highest id, confirms a newly added item still receives a unique, non-colliding id", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    // Delete Item Four (highest ID = 4). Remaining IDs: 1, 2, 3. Highest remaining ID = 3.
    const deleteItemFourBtn = screen.getByRole("button", { name: /delete item four/i });
    await user.click(deleteItemFourBtn);

    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    await user.type(nameInput, "New Item");
    await user.type(descInput, "Testing non-colliding ID generation");
    await user.click(submitBtn);

    // New item receives ID 4 (3 + 1), which is unique among remaining IDs (1, 2, 3)
    expect(screen.getByRole("link", { name: /id: 4/i })).toHaveAttribute("href", "/items/4");
    expect(screen.getByText("New Item")).toBeInTheDocument();
  });

  test("8. After deleting an item from the middle of the list, confirms the remaining items keep their original ids unchanged", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    // Delete Item Two (middle item with ID 2)
    const deleteItemTwoBtn = screen.getByRole("button", { name: /delete item two/i });
    await user.click(deleteItemTwoBtn);

    // Verify remaining items preserve their original IDs (1, 3, 4)
    expect(screen.getByRole("link", { name: /id: 1/i })).toHaveAttribute("href", "/items/1");
    expect(screen.getByRole("link", { name: /id: 3/i })).toHaveAttribute("href", "/items/3");
    expect(screen.getByRole("link", { name: /id: 4/i })).toHaveAttribute("href", "/items/4");
  });

  test("9. Confirms the form resets and clears any error messages after a successful submission", async () => {
    const user = userEvent.setup();
    render(<ItemsPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole("button", { name: /create item/i });

    // Trigger an inline error first
    await user.type(nameInput, " ");
    await user.click(submitBtn);

    expect(screen.getByText(/name cannot be empty or just whitespace/i)).toBeInTheDocument();

    // Now submit valid data
    await user.clear(nameInput);
    await user.type(nameInput, "Valid Item");
    await user.type(descInput, "Valid description text");
    await user.click(submitBtn);

    // Check inputs are reset to empty using RTL matchers
    expect(nameInput).toHaveValue("");
    expect(descInput).toHaveValue("");

    // Check error message is cleared
    expect(screen.queryByText(/name cannot be empty or just whitespace/i)).not.toBeInTheDocument();
  });
});
