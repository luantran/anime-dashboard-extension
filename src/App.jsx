import { useState, useEffect } from 'react';
import './App.css'
import OverlayButton from "./components/OverlayButton.jsx";
import ImageCarousel from "./components/Carousel.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { getCachedImages } from "./services/githubService.js";
import { ImageContext } from './context/ImageContext.js';

function App() {
    const [allImages, setAllImages] = useState();
    const [carouselInterval, setCarouselInterval] = useState(10000);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);

    useEffect(() => {
        console.log("useEffect: starts");
        getCachedImages().then(images => {
            setAllImages(images);
            console.log("useEffect App: end");
        });
    }, [])



    return (
      <ImageContext.Provider value={{allImages, setAllImages, carouselInterval, setCarouselInterval}}>
          <Sidebar />
          <main id="main-view"
                className="w-100 h-100 position-relative d-flex align-items-center justify-content-center text-center">
              <OverlayButton />
              <ImageCarousel />
          </main>
      </ImageContext.Provider>
          )
}
export default App
