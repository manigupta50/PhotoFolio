import React from "react";

// Carousel component that displays a modal for viewing images in a carousel format
const Carousel = ({
  currentAlbum,
  setSelectedImageIndex,
  selectedImageIndex,
}) => {
  // Function to handle navigation to the previous image
  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : currentAlbum.images.length - 1
    );
  };

  // Function to handle navigation to the next image
  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex < currentAlbum.images.length - 1 ? prevIndex + 1 : 0
    );
  };
  return (
    <div className="imageModal">
      <div className="modal">
        <button
          className="closeButton"
          onClick={() => setSelectedImageIndex(null)}
        >
          Close
        </button>
        <img
          src={currentAlbum.images[selectedImageIndex].imageURL}
          alt={currentAlbum.images[selectedImageIndex].title}
        />
        <div className="carousel-nav">
          <button onClick={handlePrevImage}>Previous</button>
          <button onClick={handleNextImage}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
