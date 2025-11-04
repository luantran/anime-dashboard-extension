import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import FloatingToDo from "../../src/components/FloatingToDo.jsx";

// Mock localStorage before each test
beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => "[]");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
});

describe("FloatingToDo Component", () => {

    it("renders the floating to-do card and UI elements", () => {
        render(<FloatingToDo />);
        expect(screen.getByTestId("todo-card")).toBeInTheDocument();
        expect(screen.getByTestId("todo-header")).toHaveTextContent("To-Do");
        expect(screen.getByTestId("todo-list")).toBeInTheDocument();
        expect(screen.getByTestId("todo-form")).toBeInTheDocument();
    });

    it("loads todos from localStorage on mount", () => {
        Storage.prototype.getItem.mockReturnValue(JSON.stringify(["Task A"]));
        render(<FloatingToDo />);
        expect(screen.getByText("Task A")).toBeInTheDocument();
    });

    it("saves todos to localStorage when items change", () => {
        const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
        render(<FloatingToDo />);
        const input = screen.getByTestId("todo-form");

        fireEvent.change(input, { target: { value: "Test Item" }});
        fireEvent.submit(input);

        expect(setItemSpy).toHaveBeenCalledWith("todos", JSON.stringify(["Test Item"]));
    });

    it("adds a new todo item when submitting non-empty input", () => {
        render(<FloatingToDo />);
        const input = screen.getByTestId("todo-form");

        fireEvent.change(input, { target: { value: "Buy milk" }});
        fireEvent.submit(input);

        expect(screen.getByText("Buy milk")).toBeInTheDocument();
    });

    it("clears the input field after adding a todo", () => {
        render(<FloatingToDo />);
        const input = screen.getByTestId("todo-form");

        fireEvent.change(input, { target: { value: "Clean room" }});
        fireEvent.submit(input);

        expect(input.value).toBe("");
    });

    it("does not add an empty or whitespace-only todo", () => {
        render(<FloatingToDo />);
        const input = screen.getByTestId("todo-form");

        fireEvent.change(input, { target: { value: "   " }});
        fireEvent.submit(input);

        expect(screen.queryAllByRole("listitem").length).toBe(0);
    });

    it("allows duplicate todo items (expected behavior)", () => {
        render(<FloatingToDo />);
        const input = screen.getByTestId("todo-form");

        fireEvent.change(input, { target: { value: "Read" }});
        fireEvent.submit(input);
        fireEvent.change(input, { target: { value: "Read" }});
        fireEvent.submit(input);

        expect(screen.getAllByText("Read").length).toBe(2);
    });

    it("removes a todo item when clicking the delete button", () => {
        render(<FloatingToDo />);
        const input = screen.getByTestId("todo-form");

        fireEvent.change(input, { target: { value: "Walk dog" }});
        fireEvent.submit(input);

        const removeBtn = screen.getByText("Walk dog").parentElement.querySelector("[role='button']");
        fireEvent.click(removeBtn);

        expect(screen.queryByText("Walk dog")).not.toBeInTheDocument();
    });
});
