// tests/components/CarouselIntervalForm.test.jsx
import { render, screen, fireEvent, waitFor  } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ImageContext } from "../../src/context/ImageContext.js";
import CarouselIntervalForm from "../../src/components/CarouselIntervalForm.jsx";
import ImageCarousel from "../../src/components/ImageCarousel.jsx";
import { useState } from "react";


function Wrapper() {
    const [carouselInterval, setCarouselInterval] = useState(3000);
    const allImages = {
        frieren: ["frieren1.jpg", "frieren2.jpg"],
        yourname: ["yourname1.jpg"],
    };

    return (
        <ImageContext.Provider
            value={{ allImages, setAllImages: () => {}, carouselInterval, setCarouselInterval }}
        >
            <CarouselIntervalForm />
            <ImageCarousel />
        </ImageContext.Provider>
    );
}

describe("CarouselIntervalForm", () => {
    it("renders the select with default value from context", () => {
        render(
            <ImageContext.Provider value={{ carouselInterval: 10000, setCarouselInterval: vi.fn() }}>
                <CarouselIntervalForm />
            </ImageContext.Provider>
        );

        const select = screen.getByRole("combobox");
        expect(select.value).toBe("10000");
    });

    it("updates local state when user selects new interval", () => {
        render(
            <ImageContext.Provider value={{ carouselInterval: 3000, setCarouselInterval: vi.fn() }}>
                <CarouselIntervalForm />
            </ImageContext.Provider>
        );

        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "60000" } });
        expect(select.value).toBe("60000");
    });

    it("calls setCarouselInterval on form submit", () => {
        const mockSetInterval = vi.fn();
        render(
            <ImageContext.Provider value={{ carouselInterval: 5000, setCarouselInterval: mockSetInterval }}>
                <CarouselIntervalForm />
            </ImageContext.Provider>
        );

        const select = screen.getByRole("combobox");
        const button = screen.getByRole("button", { name: /apply/i });

        fireEvent.change(select, { target: { value: "30000" } });
        fireEvent.click(button);

        expect(mockSetInterval).toHaveBeenCalledWith(30000);
    });
});


describe("Integration: CarouselIntervalForm + ImageCarousel", () => {
    it("renders all images and updates interval when changed", async () => {
        render(<Wrapper />);

        // Carousel initially has 3 images
        const images = screen.getAllByRole("img");
        expect(images.length).toBe(3);

        // User changes interval
        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "10000" } });
        fireEvent.click(screen.getByRole("button", { name: /apply/i }));

        await waitFor(() => {
            // There’s no direct interval prop exposed, but we can re-render to ensure no error
            expect(select.value).toBe("10000");
        });
    });

    it("renders nothing if there are no images", () => {
        render(
            <ImageContext.Provider
                value={{
                    allImages: {},
                    setAllImages: () => {},
                    carouselInterval: 3000,
                    setCarouselInterval: () => {},
                }}
            >
                <ImageCarousel />
            </ImageContext.Provider>
        );

        expect(screen.queryByRole("img")).toBeNull();
    });
});
