
import { Row, Col, Card, Image } from 'react-bootstrap';


const GalleryCard = ({ title, logo, images, totalImages }) => {
  const displayImages = images.slice(0, 5);
  const remainingCount = totalImages - displayImages.length;
  
  return (
    <div className="border-bottom border-secondary pb-4 mb-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Image 
          src={logo} 
          alt={title} 
          roundedCircle 
          width={64} 
          height={64}
          style={{ objectFit: 'cover' }}
        />
        <h2 className="text-white fs-3 fw-bold mb-0">{title}</h2>
      </div>
      
      <Row className="g-2">
        {displayImages.map((image, index) => {
          const isLarge = index === 0;
          return (
            <Col 
              key={index} 
              xs={isLarge ? 12 : 6}
              className={isLarge ? 'mb-2' : ''}
            >
              <Card 
                className="bg-dark border-0 overflow-hidden position-relative"
                style={{ 
                  aspectRatio: '1/1',
                  cursor: 'pointer'
                }}
              >
                <Card.Img
                  src={image.src}
                  alt={`Gallery image ${index + 1}`}
                  style={{ 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
                
                {image.isVideo && index === 0 && (
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <div 
                      className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '80px', 
                        height: '80px',
                        opacity: 0.9 
                      }}
                    >
                      <Play 
                        size={40} 
                        className="text-dark ms-1" 
                        fill="currentColor" 
                      />
                    </div>
                  </div>
                )}
                
                {index === 4 && remainingCount > 0 && (
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                  >
                    <span className="text-white fw-bold" style={{ fontSize: '2.5rem' }}>
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
