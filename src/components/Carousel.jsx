import { ImageContext } from "../context/ImageContext.js";
import Carousel from 'react-bootstrap/Carousel';

import {useContext, useEffect, useState} from "react";

function ImageCarousel() {
    const { allImages, setAllImages } = useContext(ImageContext);
    const { carouselInterval, setCarouselInterval } = useContext(ImageContext);
    const [imageList, setImageList] = useState([]);
    const [index, setIndex] = useState(0);

    // Collect all image URLs once allImages is loaded
    useEffect(() => {
        if (!allImages) return;
        const urls = Object.values(allImages).flat(); // merge all arrays
        setImageList(urls);
        const randomIndex = Math.floor(Math.random() * imageList.length);
        setIndex(randomIndex);
    }, [allImages]);

    // Log interval for debugging (optional)
    useEffect(() => {
        if (carouselInterval && imageList.length) {
            console.log("Carousel interval:", carouselInterval);
        }
    }, [carouselInterval, imageList]);

    if (!imageList.length) return null;

    return (
        // <div
        //     className="vh-100 vw-100 overflow-hidden"
        //     style={{ position: "fixed", top: 0, left: 0 }}
        // >
        // <Carousel
        //     activeIndex={index}
        //     onSelect={setIndex}
        //     fade
        //     indicators={false}
        //     ride="carousel"
        //     interval={5000}
        //     controls={false}
        // >
        //     {
        //         imageList.map((url, index) => (
        //         <Carousel.Item key={`image-${index}`}>
        //             <img
        //                 className="d-block w-100 h-100 object-fit-cover"
        //                 src={url}
        //                 alt={`Slide-${index}`}
        //                  >
        //             </img>
        //         </Carousel.Item>
        //     ))
        //
        //     }
        //
        // </Carousel>
        // </div>
        <div
            className="vh-100 vw-100 overflow-hidden position-fixed top-0 start-0"
            style={{ position: "fixed", top: 0, left: 0 }}
        >
            <Carousel
                activeIndex={index}
                onSelect={setIndex}
                fade
                indicators={false}
                controls={false}
                interval={carouselInterval || 5000}
                pause={false}
                slide={true}
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