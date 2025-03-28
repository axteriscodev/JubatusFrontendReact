import ImageGallery from "../components/ImageGallery";
import Logo from "../components/Logo";
import TotalShopButton from "../components/TotalShopButton";

/**
 * Pagina di acquisto immagini
 *
 * @returns {React.ReactElement}  Pagina di acquisto immagini
 */
export default function ImageShop() {
  const imageList = [
    { id: 1, src: "/tmp/istockphoto-500645381-1024x1024.jpg" },
    { id: 2, src: "/tmp/istockphoto-535967907-1024x1024.jpg" },
    { id: 3, src: "/tmp/istockphoto-636828120-1024x1024.jpg" },
    { id: 4, src: "/tmp/istockphoto-852157310-1024x1024.jpg" },
    { id: 5, src: "/tmp/istockphoto-936552298-1024x1024.jpg" },
    { id: 6, src: "/tmp/istockphoto-961494108-1024x1024.jpg" },
    { id: 7, src: "/tmp/istockphoto-139877917-1024x1024.jpg" },
    { id: 8, src: "/tmp/istockphoto-1139730571-1024x1024.jpg" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div><Logo size="logo-sm" /></div>
        <div><img src="/images/icon-info.png" width={100}/></div>
      </div>
      <div className="my-md text-start">
        <h2>Ci siamo ATLETA!</h2>
        <p>Ecco le tue foto</p>
      </div>
      <ImageGallery images={imageList} />
      <TotalShopButton />
    </div>
  );
}
