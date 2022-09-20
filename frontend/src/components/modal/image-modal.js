import React, { useState } from "react";

function ImageModal({ list, toggleCarousel }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(list[0].url);

  function backward() {
    if (currentIndex === list.length - 1) {
      return;
    }
    setCurrentSrc(list[currentIndex + 1].url);
    setCurrentIndex(currentIndex + 1);
  }
  function forward() {
    if (currentIndex === 0) {
      return;
    }
    setCurrentSrc(list[currentIndex - 1].url);
    setCurrentIndex(currentIndex - 1);
  }

  return (
    <div className={`modal-container`}>
      <div className="modal">
        <div className="modal-top f12 gray1">
          <p className="modal-cancel gray4" onClick={toggleCarousel}>
            &#215;
          </p>
        </div>
        <div className="modal-carousel">
          {currentSrc !== list[0].url && (
            <div className="modal-carousel-forward" onClick={forward}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48"
                width="48"
                viewBox="0 0 48 48"
              >
                <path d="M20 44 0 24 20 4l2.8 2.85L5.65 24 22.8 41.15Z" />
              </svg>
            </div>
          )}
          <div className="modal-carousel-image-container">
            <img src={currentSrc} id="modal-full-image" />
          </div>
          {currentSrc !== list[list.length - 1].url && (
            <div className="modal-carousel-backward" onClick={backward}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48"
                width="48"
                viewBox="0 0 48 48"
              >
                <path d="m15.2 43.9-2.8-2.85L29.55 23.9 12.4 6.75l2.8-2.85 20 20Z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
