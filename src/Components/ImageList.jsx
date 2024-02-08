import React, { useState } from "react";
import Carousel from "./Carousel";

const ImageList = ({ currentAlbum, handleEdit, handleDeleteImage }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="allAlbums">
      {currentAlbum.images.map((image, index) => {
        return (
          <div
            className="album"
            key={index}
            onClick={() => handleImageClick(index)}
          >
            <div className="overlay-buttons">
              <button onClick={() => handleEdit(image)}>Edit</button>
              <button onClick={() => handleDeleteImage(image.id)}>
                Delete
              </button>
            </div>
            <img src={image.imageURL} />
            <h3>{image.title}</h3>
          </div>
        );
      })}
      {/* // Carousel component that displays a modal for viewing images in a carousel format */}
      {selectedImageIndex !== null && (
        <Carousel
          currentAlbum={currentAlbum}
          setSelectedImageIndex={setSelectedImageIndex}
          selectedImageIndex={selectedImageIndex}
        />
      )}
    </div>
  );
};

export default ImageList;
