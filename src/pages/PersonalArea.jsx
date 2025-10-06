import { redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslations } from "../features/TranslationProvider";
import { isAuthenticated } from "../utils/auth";
import { Row, Col } from "react-bootstrap";
import GalleryCard from "../components/GalleryCard";
import { logOut } from "../utils/auth";
import { Button } from "react-bootstrap";

export default function PersonalArea() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslations();

  const galleries = [];

  const handleLogout = () => {
    logOut();
    navigate("/", { replace: true });
  };

  const navigateToDetail = (eventId) => {}

  return (
    <div className="container">
      <div className="d-flex justify-content-end my-sm">
        <Button onClick={handleLogout} variant="outline-danger">
          <i className="bi bi-box-arrow-right"></i> Logout
        </Button>
      </div>

      <Row>
        <Col lg={8} xl={6} className="mx-auto">
          {galleries.map((gallery) => (
            <GalleryCard
              key={gallery.id}
              title={gallery.title}
              logo={gallery.logo}
              images={gallery.images}
              totalImages={gallery.totalImages}
              eventId={gallery.id}
              onPhotoClick={navigateToDetail}
            />
          ))}
        </Col>
      </Row>
    </div>
  );
}
