import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import PinVerification from "./pages/PinVerification";
import Personal from "./pages/Personal";
import UploadSelfie, {
  loader as updateSelfieLoader,
} from "./pages/UploadSelfie";
import { checkAuthLoader } from "./utils/auth";
import ProcessingSelfie from "./pages/ProcessingSelfie";
import ImageShop from "./pages/ImageShop";
import Purchased from "./pages/Purchased";
import AdminPanel from "./pages/AdminPanel";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/pin-verification", element: <PinVerification /> },
  { path: "/personal", loader: checkAuthLoader, element: <Personal /> },
  {
    path: "/event/:eventSlug",
    element: <UploadSelfie />,
    loader: updateSelfieLoader,
  },
  { path: "/processing-selfie", element: <ProcessingSelfie /> },
  { path: "/image-shop", element: <ImageShop /> },
  { path: "/purchased", element: <Purchased /> },
  { path: "/admin", loader: checkAuthLoader, element: <AdminPanel /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
