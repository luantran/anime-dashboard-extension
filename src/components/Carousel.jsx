import { ImageContext } from "../context/ImageContext.js";
import {useContext, useEffect, useState} from "react";

function ImageCarousel() {
    const { allImages, setAllImages } = useContext(ImageContext);
    const [imageList, setImageList] = useState([]);

    // Collect all image URLs once allImages is loaded
    useEffect(() => {
        if (!allImages) return;
        const urls = Object.values(allImages).flat(); // merge all arrays
        setImageList(urls);
    }, [allImages]);

    if (!imageList.length) return null;

    return (
        <div
            id="carouselContainer"
            className="carousel slide w-100 h-100"
            data-bs-ride="carousel"
            data-bs-interval="10000"
        >
            <div className="carousel-inner h-100" id="carouselInner">
                {imageList.map((url, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                        <img
                            src={url}
                            className="d-block w-100 h-100"
                            alt={`Slide ${index + 1}`}
                        />
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselContainer"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon"></span>
            </button>

            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselContainer"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon"></span>
            </button>
        </div>
    );
}

export default ImageCarousel;