import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { personalActions } from '../repositories/personal/personal-slice';

import Carousel from 'react-bootstrap/Carousel';
import ImageGallery from "../components/ImageGallery";
import CustomLightbox from "../components/CustomLightbox";
import { fetchPurchased } from "../repositories/personal/personal-actions";
import { isAuthenticated } from "../utils/auth";
import { redirect } from "react-router-dom";

export default function Personal() {
  const dispatch = useDispatch();
  const purchasedItems = useSelector((state) => state.personal.purchased) ?? [];

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  // recuper dei contenuti
  useEffect(() => {
    dispatch(fetchPurchased())
  }, []);

  const openLightbox = (images, startIndex = 0, select, actions) => {
    setIndex(startIndex);
    setOpen(true);
    setSlides(images);
    setSelect(select);
    setActions(actions);
  };

   // const purchasedItems = [
  //   {
  //     keyPreview: "istockphoto-500645381-1024x1024.jpg",
  //     keyThumbnail: "istockphoto-500645381-1024x1024.jpg",
  //     keyOriginal: "istockphoto-500645381-1024x1024.jpg",
  //     urlPreview: "/tmp/istockphoto-500645381-1024x1024.jpg",
  //     urlThumbnail: "/tmp/istockphoto-500645381-1024x1024.jpg",
  //     urlOriginal: "/tmp/istockphoto-500645381-1024x1024.jpg",
  //   },
  //   {
  //     keyPreview: "istockphoto-535967907-1024x1024.jpg",
  //     keyThumbnail: "istockphoto-535967907-1024x1024.jpg",
  //     keyOriginal: "istockphoto-535967907-1024x1024.jpg",
  //     urlPreview: "/tmp/istockphoto-535967907-1024x1024.jpg",
  //     urlThumbnail: "/tmp/istockphoto-535967907-1024x1024.jpg",
  //     urlOriginal: "/tmp/istockphoto-535967907-1024x1024.jpg",
  //   },
  //   {
  //     keyPreview: "istockphoto-636828120-1024x1024.jpg",
  //     keyThumbnail: "istockphoto-636828120-1024x1024.jpg",
  //     keyOriginal: "istockphoto-636828120-1024x1024.jpg",
  //     urlPreview: "/tmp/istockphoto-636828120-1024x1024.jpg",
  //     urlThumbnail: "/tmp/istockphoto-636828120-1024x1024.jpg",
  //     urlOriginal: "/tmp/istockphoto-636828120-1024x1024.jpg",
  //   },
  // ];

  // const allPurchasedItems = [
  //   {
  //     keyPreview: "istockphoto-852157310-1024x1024.jpg",
  //     keyThumbnail: "istockphoto-852157310-1024x1024.jpg",
  //     keyOriginal: "istockphoto-852157310-1024x1024.jpg",
  //     urlPreview: "/tmp/istockphoto-852157310-1024x1024.jpg",
  //     urlThumbnail: "/tmp/istockphoto-852157310-1024x1024.jpg",
  //     urlOriginal: "/tmp/istockphoto-852157310-1024x1024.jpg",
  //   },
  //   {
  //     keyPreview: "istockphoto-936552298-1024x1024.jpg",
  //     keyThumbnail: "istockphoto-936552298-1024x1024.jpg",
  //     keyOriginal: "istockphoto-936552298-1024x1024.jpg",
  //     urlPreview: "/tmp/istockphoto-936552298-1024x1024.jpg",
  //     urlThumbnail: "/tmp/istockphoto-936552298-1024x1024.jpg",
  //     urlOriginal: "/tmp/istockphoto-936552298-1024x1024.jpg",
  //   },
  //   {
  //     keyPreview: "istockphoto-961494108-1024x1024.jpg",
  //     keyThumbnail: "istockphoto-961494108-1024x1024.jpg",
  //     keyOriginal: "istockphoto-961494108-1024x1024.jpg",
  //     urlPreview: "/tmp/istockphoto-961494108-1024x1024.jpg",
  //     urlThumbnail: "/tmp/istockphoto-961494108-1024x1024.jpg",
  //     urlOriginal: "/tmp/istockphoto-961494108-1024x1024.jpg",
  //   },
  //   {
  //     keyPreview: "istockphoto-139877917-1024x1024.jpg",
  //     keyThumbnail: "istockphoto-139877917-1024x1024.jpg",
  //     keyOriginal: "istockphoto-139877917-1024x1024.jpg",
  //     urlPreview: "/tmp/istockphoto-139877917-1024x1024.jpg",
  //     urlThumbnail: "/tmp/istockphoto-139877917-1024x1024.jpg",
  //     urlOriginal: "/tmp/istockphoto-139877917-1024x1024.jpg",
  //   },
  //   {
  //     keyPreview: "istockphoto-1139730571-1024x1024.jpg",
  //     keyThumbnail: "istockphoto-1139730571-1024x1024.jpg",
  //     keyOriginal: "istockphoto-1139730571-1024x1024.jpg",
  //     urlPreview: "/tmp/istockphoto-1139730571-1024x1024.jpg",
  //     urlThumbnail: "/tmp/istockphoto-1139730571-1024x1024.jpg",
  //     urlOriginal: "/tmp/istockphoto-1139730571-1024x1024.jpg",
  //   },
  // ];
  return (
    <>
      <div className="container">
        { purchasedItems?.length > 0 ?
        <>
          <h2 className="my-sm">Ecco i tuoi acquisti!</h2>
          <div className="px-lg">
            <Carousel>
              {purchasedItems.map((image, i) => (
                <Carousel.Item key={image.keyPreview || image.keyThumbnail || i}>
                  <div className="ratio ratio-1-1">
                    <img
                      src={image.urlPreview || image.urlThumbnail}
                      className="d-block w-100 object-fit-cover"
                      alt="..."
                      onClick={() => openLightbox(purchasedItems, i, false, true)}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </>
        :
        <>
          <h2 className="my-sm">Non hai effettuato acquisti</h2>
        </>
        }
        { purchasedItems?.length > 0 &&
        <>
          <div className="mt-md">
            <ImageGallery
              images={purchasedItems}
              select={false}
              actions={true}
              onOpenLightbox={openLightbox}
            />
          </div>
        </>
        }
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

export function loader() {
  if (!isAuthenticated()) {
    return redirect("/");
  }
  return null;
}
