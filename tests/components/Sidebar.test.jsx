// tests/components/Sidebar.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { ImageContext } from "../../src/context/ImageContext.js";
import Sidebar from "../../src/components/Sidebar.jsx";

// Full integration wrapper with real state
function Wrapper() {
    const [carouselInterval, setCarouselInterval] = useState(3000);
    const [allImages, setAllImages] = useState({});

    return (
        <ImageContext.Provider
            value={{ allImages, setAllImages, carouselInterval, setCarouselInterval }}
        >
            <Sidebar />
        </ImageContext.Provider>
    );
}

describe("Sidebar component", () => {
    const mockSetAllImages = vi.fn();

    const renderSidebar = (contextValues = {}) => {
        const defaultContext = {
            allImages: {},
            setAllImages: mockSetAllImages,
            carouselInterval: 5000,
            setCarouselInterval: vi.fn(),
        };
        return render(
            <ImageContext.Provider value={{ ...defaultContext, ...contextValues }}>
                <Sidebar />
            </ImageContext.Provider>
        );
    };

    it("renders the sidebar title and sections", () => {
        renderSidebar();

        expect(screen.getByText("Settings")).toBeInTheDocument();
        expect(screen.getByText("Carousel Settings")).toBeInTheDocument();
        expect(screen.getByText("Wallpapers")).toBeInTheDocument();
    });

    it("renders the fruit list", () => {
        renderSidebar();
        expect(screen.getByText("apple")).toBeInTheDocument();
        expect(screen.getByText("banana")).toBeInTheDocument();
        expect(screen.getByText("cherry")).toBeInTheDocument();
    });

    it("contains a collapse section for carousel settings", () => {
        renderSidebar();

        const button = screen.getByRole("button", { name: /carousel settings/i });
        const collapseDiv = screen.getByTestId
            ? screen.queryByTestId("carousel-settings-collapse")
            : screen.getByText("Carousel Settings").closest("button");

        expect(button).toBeInTheDocument();
        expect(collapseDiv).toBeTruthy();
    });

    it("should have a close button", () => {
        renderSidebar();
        const buttons = screen.getAllByRole("button");
        const closeButton = buttons.find(btn => btn.classList.contains("btn-close"));
        expect(closeButton).toBeTruthy();
        expect(closeButton).toHaveAttribute("data-bs-dismiss", "offcanvas");
    });

});

describe("Integration: Sidebar + CarouselIntervalForm", () => {
    it("renders the form inside the collapse section", () => {
        render(<Wrapper />);

        // The button for Carousel Settings exists
        const carouselButton = screen.getByRole("button", { name: /carousel settings/i });
        expect(carouselButton).toBeInTheDocument();
    });

    it("updates carousel interval via CarouselIntervalForm", async () => {
        render(<Wrapper />);

        // Expand the section manually (Bootstrap collapse not functional in JSDOM)
        // So we directly query the <select>
        const select = await screen.findByRole("combobox");
        expect(select.value).toBe("3000");

        fireEvent.change(select, { target: { value: "10000" } });

        const applyBtn = screen.getByRole("button", { name: /apply/i });
        fireEvent.click(applyBtn);

        expect(select.value).toBe("10000"); // local state updated
    });

    it("renders wallpaper items correctly", () => {
        render(<Wrapper />);
        expect(screen.getByText("apple")).toBeInTheDocument();
        expect(screen.getByText("banana")).toBeInTheDocument();
        expect(screen.getByText("cherry")).toBeInTheDocument();
    });
});
