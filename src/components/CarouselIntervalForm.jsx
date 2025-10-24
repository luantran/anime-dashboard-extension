import Form from 'react-bootstrap/Form';
import {Button} from "react-bootstrap";
import {ImageContext} from "../context/ImageContext.js";
import {useContext, useState} from "react";

function CarouselIntervalForm() {
    const { carouselInterval, setCarouselInterval } = useContext(ImageContext);
    const [selectedInterval, setSelectedInterval] = useState(carouselInterval || 5000);

    const handleChange = (e) => {
        setSelectedInterval(Number(e.target.value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCarouselInterval(selectedInterval);
        console.log("Updated interval to:", selectedInterval);
    };
    return (
        <Form onSubmit={handleSubmit} className="d-flex align-items-center gap-2 mt-2">
            <Form.Select
                aria-label="Select carousel interval"
                value={selectedInterval}
                onChange={handleChange}
            >
                <option value="3000">3 seconds</option>
                <option value="10000">10 seconds</option>
                <option value="30000">30 seconds</option>
                <option value="60000">1 minute</option>
                <option value="300000">5 minute</option>

            </Form.Select>

            <Button type="submit" variant="outline-light" size="sm">
                Apply
            </Button>
        </Form>
    );
}
export default CarouselIntervalForm;