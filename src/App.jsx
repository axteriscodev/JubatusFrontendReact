import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Personal from "./pages/Personal";
import UploadSelfie, {
  loader as updateSelfieLoader,
} from "./pages/UploadSelfie";
import ProcessingSelfie from "./pages/ProcessingSelfie";
import ImageShop from "./pages/ImageShop";
import Purchased from "./pages/Purchased";
import AdminPanel from "./pages/AdminPanel";
import CreateEvent from "./pages/CreateEvent";
import ProcessingPhotos from "./pages/ProcessingPhotos";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/personal", element: <Personal /> },
  {
    path: "/event/:eventSlug",
    element: <UploadSelfie />,
    loader: updateSelfieLoader,
  },
  { path: "/processing-selfie", element: <ProcessingSelfie /> },
  { path: "/image-shop", element: <ImageShop /> },
  { path: "/processing-photos", element: <ProcessingPhotos />},
  { path: "/purchased", element: <Purchased /> },

  { path: "/admin", element: <AdminPanel /> },
  { path: "/admin/create-event", element: <CreateEvent />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
