import ImageGallery from '../components/ImageGallery';

/**
 * Pagina di acquisto immagini
 * 
 * @returns {React.ReactElement}  Pagina di acquisto immagini
 */
export default function ImageShop() {
    const imageList = [];

    return (<ImageGallery images={imageList} />);
}