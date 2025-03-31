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
import Checkout from "./pages/Checkout";
import CheckoutOutcome from "./pages/CheckoutOutcome";
import CreateEvent from "./pages/CreateEvent";
import ProcessingPhotos from "./pages/ProcessingPhotos";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/pin-verification", element: <PinVerification /> },
  { path: "/personal", loader: checkAuthLoader, element: <Personal /> },
  {
    path: "/event/:eventSlug",
    element: <UploadSelfie />,
    loader: updateSelfieLoader,
    errorElement: <ErrorPage />
  },
  { path: "/processing-selfie", element: <ProcessingSelfie /> },
  { path: "/image-shop", element: <ImageShop />, errorElement: <ErrorPage /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/checkout-outcome", element: <CheckoutOutcome />, errorElement: <ErrorPage /> },
  { path: "/purchased", element: <Purchased />, errorElement: <ErrorPage /> },
  { path: "/processing-photos", element: <ProcessingPhotos />},
  { path: "/admin", element: <AdminPanel /> },
  { path: "/admin/create-event", element: <CreateEvent />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
