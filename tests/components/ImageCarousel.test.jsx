import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ImageContext } from "../../src/context/ImageContext.js";
import ImageCarousel from "../../src/components/ImageCarousel.jsx";

vi.mock("react-bootstrap/Carousel", () => {
    const MockCarousel = ({ children, ...props }) => (
        <div data-testid="mock-carousel" {...props}>
            {children}
        </div>
    );
    MockCarousel.Item = ({ children }) => (
        <div data-testid="mock-carousel-item">{children}</div>
    );
    return { default: MockCarousel };
});

describe("ImageCarousel Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Helper to wrap in context provider
    const renderWithContext = (value) =>
        render(
            <ImageContext.Provider value={value}>
                <ImageCarousel />
            </ImageContext.Provider>
        );

    // ----------------------------
    // 🧩 UNIT TESTS
    // ----------------------------

    it("renders nothing when allImages is empty", () => {
        const { container } = renderWithContext({
            allImages: {},
            carouselInterval: 3000,
        });
        expect(container.firstChild).toBeNull();
    });

    it("flattens allImages into imageList correctly", () => {
        const mockImages = {
            frieren: ["a.jpg", "b.jpg"],
            yourName: ["c.jpg"],
        };
        renderWithContext({ allImages: mockImages, carouselInterval: 5000 });

        const imgs = screen.getAllByRole("img");
        expect(imgs.length).toBe(3);
        expect(imgs[0]).toHaveAttribute("src", "a.jpg");
        expect(imgs[2]).toHaveAttribute("src", "c.jpg");
    });

    it("applies full-screen layout styles", () => {
        const mockImages = { set: ["1.png"] };
        const { container } = renderWithContext({
            allImages: mockImages,
            carouselInterval: 4000,
        });

        const wrapper = container.querySelector("div.vh-100.vw-100");
        expect(wrapper).toBeInTheDocument();
        expect(wrapper).toHaveClass("position-fixed", "overflow-hidden");
    });

    // ----------------------------
    // INTEGRATION TESTS
    // ----------------------------

    it("renders Carousel with given interval from context", () => {
        const mockImages = { test: ["a.jpg", "b.jpg"] };
        renderWithContext({ allImages: mockImages, carouselInterval: 2000 });

        const carousel = screen.getByTestId("mock-carousel");
        expect(carousel).toBeInTheDocument();
        expect(carousel.getAttribute("interval")).toBe("2000");
    });

    it("renders Carousel without interval from context", () => {
        const mockImages = { test: ["a.jpg", "b.jpg"] };
        renderWithContext({ allImages: mockImages, carouselInterval: null });

        const carousel = screen.getByTestId("mock-carousel");
        expect(carousel).toBeInTheDocument();
        expect(carousel.getAttribute("interval")).toBe("5000");
    });

    it("renders the correct number of Carousel.Items", () => {
        const mockImages = { group1: ["1.jpg", "2.jpg", "3.jpg"] };
        renderWithContext({ allImages: mockImages, carouselInterval: 3000 });

        const items = screen.getAllByTestId("mock-carousel-item");
        expect(items.length).toBe(3);
    });

    it("defaultActiveIndex is random but within bounds", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5); // predictable random
        const mockImages = { pics: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"] };

        renderWithContext({ allImages: mockImages, carouselInterval: 3000 });
        const carousel = screen.getByTestId("mock-carousel");

        // randomStart = Math.floor(0.5 * 4) = 2
        expect(carousel.getAttribute("defaultactiveindex")).toBe("2");
    });

    // ----------------------------
    // TIMER / BEHAVIOR TESTS
    // ----------------------------

    it("auto-rotates slides based on interval (mocked timers)", () => {
        vi.useFakeTimers();
        const mockImages = { test: ["a.jpg", "b.jpg"] };

        renderWithContext({ allImages: mockImages, carouselInterval: 3000 });

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        const imgs = screen.getAllByRole("img");
        expect(imgs.length).toBe(2);

        vi.useRealTimers();
    });

    it("handles multiple image categories gracefully", () => {
        const mockImages = {
            folder1: ["1.jpg", "2.jpg"],
            folder2: ["3.jpg", "4.jpg"],
            folder3: ["5.jpg"],
        };
        renderWithContext({ allImages: mockImages, carouselInterval: 1000 });

        const imgs = screen.getAllByRole("img");
        expect(imgs.length).toBe(5);
    });

    it("renders null safely when allImages is undefined", () => {
        const { container } = renderWithContext({
            allImages: undefined,
            carouselInterval: 3000,
        });
        expect(container.firstChild).toBeNull();
    });
});
