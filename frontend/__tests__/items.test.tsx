import React from "react";
import { render, screen } from "@testing-library/react";
import ItemsPage from "../app/items/page";

describe("ItemsPage Component", () => {
  test("renders without crashing", () => {
    render(<ItemsPage />);
    expect(screen.getByRole("heading", { name: /items directory/i })).toBeInTheDocument();
  });

  test("displays the expected number of mock items", () => {
    render(<ItemsPage />);
    // Check main title / list heading or item links
    // The component initially renders 4 mock items
    const itemOne = screen.getByText("Item One");
    const itemTwo = screen.getByText("Item Two");
    const itemThree = screen.getByText("Item Three");
    const itemFour = screen.getByText("Item Four");

    expect(itemOne).toBeInTheDocument();
    expect(itemTwo).toBeInTheDocument();
    expect(itemThree).toBeInTheDocument();
    expect(itemFour).toBeInTheDocument();

    // Check count of items displayed in list
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
});
