import ImageGallery from "../components/ImageGallery";
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
  ];

  return (
    <>
      <h1>ImageShop</h1>
      <ImageGallery images={imageList} />
      <TotalShopButton />
    </>
  );
}
