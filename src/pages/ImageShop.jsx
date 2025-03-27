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
    { id: 1, src: "Bugatti.jpg" },
    { id: 2, src: "Lamborghini.jpg" },
    { id: 3, src: "Opel.jpg" },
    { id: 4, src: "Opel.jpg" },
    { id: 5, src: "Opel.jpg" },
    { id: 6, src: "Opel.jpg" },
    { id: 7, src: "Opel.jpg" },
    { id: 8, src: "Opel.jpg" },
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
