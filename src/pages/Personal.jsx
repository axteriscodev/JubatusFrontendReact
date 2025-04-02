import Logo from "../components/Logo";
import Carousel from 'react-bootstrap/Carousel';
import ImageGallery from "../components/ImageGallery";

/**
 * Pagina personale utente
 * 
 * @returns {React.ReactElement}  Pagina personale.
 */
export default function Personal() {

    const imageList = [
        { key: 1, url: "/tmp/istockphoto-500645381-1024x1024.jpg" },
        { key: 2, url: "/tmp/istockphoto-535967907-1024x1024.jpg" },
        { key: 3, url: "/tmp/istockphoto-636828120-1024x1024.jpg" },
        { key: 4, url: "/tmp/istockphoto-852157310-1024x1024.jpg" },
        { key: 5, url: "/tmp/istockphoto-936552298-1024x1024.jpg" },
        { key: 6, url: "/tmp/istockphoto-961494108-1024x1024.jpg" },
        { key: 7, url: "/tmp/istockphoto-139877917-1024x1024.jpg" },
        { key: 8, url: "/tmp/istockphoto-1139730571-1024x1024.jpg" },
      ];

    return (
    <>
      <h2 className="my-sm">Ecco i tuoi acquisti!</h2>

      <Carousel>
      {imageList.map((image, i) => (
        <Carousel.Item>
          <img src={image.url} className="d-block w-100" alt="..."/>
        </Carousel.Item>
        ))}
      </Carousel>
      <div className="mt-md">
        <ImageGallery images={imageList} select={false} actions={true} />
      </div>
    </>
    );
}