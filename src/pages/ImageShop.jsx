import ImageGallery from "../components/ImageGallery";
import Logo from "../components/Logo";
import TotalShopButton from "../components/TotalShopButton";
import { useSelector } from "react-redux";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

/**
 * Pagina di acquisto immagini
 *
 * @returns {React.ReactElement}  Pagina di acquisto immagini
 */
export default function ImageShop() {
  // const imageList = [
  //   { id: 1, src: "/tmp/istockphoto-500645381-1024x1024.jpg" },
  //   { id: 2, src: "/tmp/istockphoto-535967907-1024x1024.jpg" },
  //   { id: 3, src: "/tmp/istockphoto-636828120-1024x1024.jpg" },
  //   { id: 4, src: "/tmp/istockphoto-852157310-1024x1024.jpg" },
  //   { id: 5, src: "/tmp/istockphoto-936552298-1024x1024.jpg" },
  //   { id: 6, src: "/tmp/istockphoto-961494108-1024x1024.jpg" },
  //   { id: 7, src: "/tmp/istockphoto-139877917-1024x1024.jpg" },
  //   { id: 8, src: "/tmp/istockphoto-1139730571-1024x1024.jpg" },
  // ];

  const imagesList = useSelector((state) => state.cart.products);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="text-center text-blue fw-bold">
          1 Foto - 9€
          <hr />
          3 Foto - 25€
          <hr />
          <strong>Tutte</strong> le Foto - 25€
          <hr />
          Il <strong>tuo</strong> video personalizzato - 25€
          <hr />
          Il <strong>tuo</strong> video e 10 foto - 35€
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div><Logo size="logo-xs" /></div>
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <img src="/images/icon-info.png" className="logo-xs pointer"/>
        </OverlayTrigger>
      </div>
      <div className="my-md text-start">
        <h2>Ci siamo <strong>atleta!</strong></h2>
        <p>Ecco le tue foto</p>
      </div>
      <ImageGallery images={imagesList} />
      <TotalShopButton />
    </div>
  );
}
