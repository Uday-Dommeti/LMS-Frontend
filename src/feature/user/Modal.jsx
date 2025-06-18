import React, { useEffect } from "react";

import "./TopicDetails.css";

function Modal({ modalSrc, setModalSrc }) {
  const closeModal = () => {
    const modalEl = document.getElementById("fullScreenImage");
    if (modalEl) modalEl.style.display = "none";
    setModalSrc(null);
  };

  return (
    <div
      className="modal  bg-opacity-25"
      id="fullScreenImage"
      onClick={(e) => {
        if (e.target.classList.contains("modal")) closeModal();
      }}
    >
      <div className="d-flex justify-content-center">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        {modalSrc?.type === "img" ? (
          <img className="modal-img" src={modalSrc?.src} alt="" />
        ) : (
          <iframe
            src={modalSrc?.src}
            style={{
              width: "80vw",
              height: "100%",
              border: "none",
            }}
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  );
}

export default Modal;
