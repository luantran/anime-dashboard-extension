import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImageContext } from "../../src/context/ImageContext.js";
import ImageCarousel from "../../src/components/ImageCarousel.jsx";

describe("ImageCarousel", () => {
    it("renders all images from context", () => {
        const mockImages = {
            frieren: ["frieren1.jpg", "frieren2.jpg"],
            yourname: ["yourname1.jpg"]
        };

        render(
            <ImageContext.Provider value={{ allImages: mockImages, carouselInterval: 3000 }}>
                <ImageCarousel />
            </ImageContext.Provider>
        );

        const images = screen.getAllByRole("img");
        expect(images.length).toBe(3);
        expect(images[0]).toHaveAttribute("src", expect.stringMatching(/frieren|yourname/));
    });

    it("renders nothing when there are no images", () => {
        render(
            <ImageContext.Provider value={{ allImages: {}, carouselInterval: 3000 }}>
                <ImageCarousel />
            </ImageContext.Provider>
        );

        expect(screen.queryByRole("img")).toBeNull();
    });
});
