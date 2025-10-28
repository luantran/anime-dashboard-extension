import { ImageContext } from "../context/ImageContext.js";
import {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import CarouselIntervalForm from "./CarouselIntervalForm.jsx";

function Sidebar() {
    const { allImages, setAllImages } = useContext(ImageContext);
    const fruits = ["apple", "banana", "cherry"];
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        // <Button variant="primary" onClick={handleShow}>
        //     Launch
        // </Button>
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar">
            <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title w-100 text-center fw-semibold">Settings</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>

            <div className="offcanvas-body d-flex flex-column flex-shrink-0 p-3">
                <ul className="list-unstyled ps-0 mt-3">

                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed"
                                data-bs-toggle="collapse" data-bs-target="#carousel-settings-collapse"
                                aria-expanded="false">
                            Carousel Settings
                        </button>
                        <div className="collapse" id="carousel-settings-collapse" data-testid="carousel-settings-collapse">
                            <CarouselIntervalForm />
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed"
                                data-bs-toggle="collapse" data-bs-target="#wallpapers-collapse"
                                aria-expanded="false">
                            Wallpapers
                        </button>
                        <div className="collapse" id="wallpapers-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                {
                                    fruits.map((fruit) => (
                                        <li key={fruit}><a href={``} className={`rounded`}>{fruit}</a></li>
                                    ))
                                }
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;