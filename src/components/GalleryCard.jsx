import { Row, Col, Card, Image } from 'react-bootstrap';
import { Play } from 'lucide-react';

export default function GalleryCard({ title, logo, images = [], totalImages, eventId, onPhotoClick }) {
  // Controllo se images esiste
  if (!images || images.length === 0) {
    return null;
  }

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
      
      <div className="d-flex gap-1">
        {/* Prima immagine grande a sinistra */}
        <div style={{ flex: '1' }}>
          <Card 
            className="bg-dark border-0 p-0 overflow-hidden position-relative"
            style={{ 
              aspectRatio: '1/1',
              cursor: 'pointer',
              height: '100%'
            }}
            onClick={() => onPhotoClick(eventId)}
          >
            <Card.Img
              src={displayImages[0]?.src}
              alt="Gallery image 1"
              style={{ 
                height: '100%', 
                objectFit: 'cover' 
              }}
            />
            
            {displayImages[0]?.isVideo && (
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
          </Card>
        </div>

        {/* Griglia 2x2 a destra */}
        <div style={{ flex: '1', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px' }}>
          {displayImages.slice(1, 5).map((image, index) => {
            const actualIndex = index + 1;
            const isLast = actualIndex === 4 && remainingCount > 0;
            
            return (
              <Card 
                key={actualIndex}
                className="bg-dark border-0 p-0 overflow-hidden position-relative"
                style={{ 
                  cursor: 'pointer',
                  aspectRatio: '1/1'
                }}
                onClick={() => onPhotoClick(eventId)}
              >
                <Card.Img
                  src={image.src}
                  alt={`Gallery image ${actualIndex + 1}`}
                  style={{ 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
                
                {isLast && (
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                  >
                    <span className="text-white fw-bold" style={{ fontSize: '2rem' }}>
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}