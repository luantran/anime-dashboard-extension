function OverlayButton() {
    return (
        <button
            className="btn btn-outline-light position-absolute top-0 start-0 m-3 z-3"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasSidebar"
            aria-controls="offcanvasSidebar"
            aria-label="Toggle sidebar"
            title="Open sidebar"
        >
            <span aria-hidden="true">
                  <i className="bi bi-list fs-6"></i>
            </span>
        </button>
    );
}

export default OverlayButton;
