// tests/components/OverlayButton.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OverlayButton from "../../src/components/OverlayButton.jsx";
import Sidebar from "../../src/components/Sidebar.jsx";
import { ImageContext } from "../../src/context/ImageContext.js";

describe("OverlayButton component", () => {
    it("renders a Bootstrap button with correct variant and classes", () => {
        render(<OverlayButton />);
        const button = screen.getByRole("button", { name: /toggle sidebar/i });

        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("btn-outline-light");
        expect(button).toHaveClass("position-absolute", "top-0", "start-0");
    });

    it("has correct Bootstrap data attributes for offcanvas toggle", () => {
        render(<OverlayButton />);
        const button = screen.getByRole("button", { name: /toggle sidebar/i });

        expect(button).toHaveAttribute("data-bs-toggle", "offcanvas");
        expect(button).toHaveAttribute("data-bs-target", "#offcanvasSidebar");
        expect(button).toHaveAttribute("aria-controls", "offcanvasSidebar");
        expect(button).toHaveAttribute("title", "Open sidebar");
    });

    it("contains a list icon element with appropriate classes", () => {
        render(<OverlayButton />);
        const icon = screen.getByRole("button", { name: /toggle sidebar/i }).querySelector("i");

        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass("bi", "bi-list", "fs-6");
        expect(icon).toHaveAttribute("aria-hidden", "true");
    });
});

describe("Integration: OverlayButton + Sidebar", () => {
    const mockContext = {
        allImages: {},
        setAllImages: () => {},
        carouselInterval: 3000,
        setCarouselInterval: () => {},
    };

    it("renders both the overlay button and the sidebar", () => {
        render(
            <ImageContext.Provider value={mockContext}>
                <OverlayButton />
                <Sidebar />
            </ImageContext.Provider>
        );

        const button = screen.getByRole("button", { name: /toggle sidebar/i });
        const sidebar = document.querySelector("#offcanvasSidebar");


        expect(button).toBeInTheDocument();
        expect(sidebar).toBeInTheDocument();
        expect(button).toHaveAttribute("data-bs-target", "#offcanvasSidebar");
    });

    it("simulates clicking the overlay button to open sidebar (conceptually)", () => {
        render(
            <ImageContext.Provider value={mockContext}>
                <OverlayButton />
                <Sidebar />
            </ImageContext.Provider>
        );

        const button = screen.getByRole("button", { name: /toggle sidebar/i });
        const sidebar = document.querySelector("#offcanvasSidebar");

        expect(sidebar).toHaveAttribute("id", "offcanvasSidebar");

        // Simulate a click — in real Bootstrap this would open the offcanvas
        fireEvent.click(button);

        // Conceptual assertion: attributes are linked correctly
        expect(button.getAttribute("data-bs-target")).toBe(`#${sidebar.id}`);
    });
});
