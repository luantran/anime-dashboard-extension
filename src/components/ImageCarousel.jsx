import { ImageContext } from "../context/ImageContext.js";
import Carousel from 'react-bootstrap/Carousel';

import {useContext, useEffect, useMemo, useState} from "react";

function ImageCarousel() {
    const { allImages, setAllImages } = useContext(ImageContext);
    const { carouselInterval, setCarouselInterval } = useContext(ImageContext);
    const [imageList, setImageList] = useState([]);


    // Collect all image URLs once allImages is loaded
    useEffect(() => {
        if (!allImages) return;
        const urls = Object.values(allImages).flat(); // merge all arrays
        setImageList(urls);

    }, [allImages, imageList.length]);

    // Random starting slide
    const randomStart = useMemo(() => {
        return imageList.length
            ? Math.floor(Math.random() * imageList.length)
            : 0;
    }, [imageList]);

    if (!imageList.length) return null;

    return (
        <div
            className="vh-100 vw-100 overflow-hidden position-fixed top-0 start-0"
            style={{ position: "fixed", top: 0, left: 0 }}
        >
            <Carousel
                defaultActiveIndex={randomStart}
                fade
                indicators={false}
                controls={false}
                interval={carouselInterval || 5000}
                pause={false}
                slide
            >
                {imageList.map((url, i) => (
                    <Carousel.Item key={`image-${i}`}>
                        <img
                            className="d-block w-100 h-100 object-fit-cover"
                            src={url}
                            alt={`Slide-${i}`}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>

    );
}

export default ImageCarousel;