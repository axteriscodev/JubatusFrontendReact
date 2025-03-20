import React, { useState } from "react";

export default function ImageGallery({ images }) {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageClick = (imageId) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      selectedImages([...selectedImages, imageId]);
    }
  };

  return (
    <>
      {images.map((image) => (
        <div
          key={image.id}
          className={selectedImages.includes(image.id) ? "selected" : ""}
          onClick={() => handleImageClick(image.id)}
        >
          <img src={image.src} alt={'Image ${image.id}'} />
        </div>
      ))}
    </>
  );
}
