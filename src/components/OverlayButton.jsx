import {Button} from "react-bootstrap";

function OverlayButton() {
    return (
        <Button
            variant="outline-light"
            className="position-absolute top-0 start-0 m-3 z-3"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasSidebar"
            aria-controls="offcanvasSidebar"
            aria-label="Toggle sidebar"
            title="Open sidebar"
        >
            <i className="bi bi-list fs-6" aria-hidden="true"></i>
        </Button>
    );
}

export default OverlayButton;
