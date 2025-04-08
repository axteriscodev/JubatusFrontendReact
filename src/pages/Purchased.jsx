import { useState } from "react";
import { useSelector } from "react-redux";

import Logo from "../components/Logo";
import Carousel from 'react-bootstrap/Carousel';
import ImageGallery from "../components/ImageGallery";
import CustomLightbox from "../components/CustomLightbox";

export default function Purchased() {
  const eventLogo = useSelector((state) => state.competition.logo);

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  const openLightbox = (images, startIndex = 0, select, actions) => {
    setIndex(startIndex);
    setOpen(true);
    setSlides(images);
    setSelect(select);
    setActions(actions);
  };

  const imagesList1 = [
    { keyPreview: 1, url: "/tmp/istockphoto-500645381-1024x1024.jpg" },
    { keyPreview: 2, url: "/tmp/istockphoto-535967907-1024x1024.jpg" },
    { keyPreview: 3, url: "/tmp/istockphoto-636828120-1024x1024.jpg" },
  ];

  const imagesList2 = [
    { keyPreview: 4, url: "/tmp/istockphoto-852157310-1024x1024.jpg" },
    { keyPreview: 5, url: "/tmp/istockphoto-936552298-1024x1024.jpg" },
    { keyPreview: 6, url: "/tmp/istockphoto-961494108-1024x1024.jpg" },
    { keyPreview: 7, url: "/tmp/istockphoto-139877917-1024x1024.jpg" },
    { keyPreview: 8, url: "/tmp/istockphoto-1139730571-1024x1024.jpg" },
  ];

  return (
    <>
  <div className="container">
    <div className="text-start"><Logo src={import.meta.env.VITE_API_URL + "/" + eventLogo} size="logo-xs" /></div>
    <h2 className="my-sm">Ecco i tuoi acquisti!</h2>
        <div className="px-lg">
          <Carousel>
            {imagesList1.map((image, i) => (
              <Carousel.Item key={image.keyPreview || i}>
                <div className="ratio ratio-1-1">
                  <img
                    src={image.url}
                    className="d-block w-100 object-fit-cover"
                    alt="..."
                    onClick={() => openLightbox(imagesList1, i, false, true)}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="mt-md">
          <ImageGallery
            images={imagesList2}
            select={false}
            actions={true}
            onOpenLightbox={openLightbox}
          />
        </div>
      </div>

      { open && <CustomLightbox
        open={open}
        slides={slides}
        index={index}
        setIndex={setIndex}
        select={select}
        actions={actions}
        onClose={() => setOpen(false)}
      />}
    </>
  );
}
