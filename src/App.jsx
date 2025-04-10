import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import PinVerification from "./pages/PinVerification";
import Personal from "./pages/Personal";
import UploadSelfie, {
  loader as updateSelfieLoader,
} from "./pages/UploadSelfie";
import ProcessingSelfie from "./pages/ProcessingSelfie";
import ImageShop from "./pages/ImageShop";
import Purchased from "./pages/Purchased";
import AdminPanel from "./pages/AdminPanel";
import Checkout from "./pages/Checkout";
import CheckoutOutcome from "./pages/CheckoutOutcome";
import CreateEvent from "./pages/CreateEvent";
import ProcessingPhotos from "./pages/ProcessingPhotos";
import ErrorPage from "./pages/ErrorPage";
import ContentUnavailable from "./pages/ContentUnavailable";
import { isAuthenticated, isAdmin } from "./utils/auth";
import { loader as personalLoader} from "./pages/Personal";
import { loader as adminLoader } from "./pages/AdminPanel";
import { loader as createEventLoader } from "./pages/CreateEvent";

const getRedirectRoute = () => {
  if (isAdmin()) return "/admin";
  if (isAuthenticated()) return "/personal";

  return "/"; // Se non esiste un livello valido, rimanda al login
};

const router = createBrowserRouter([
  {
    path: "/",
    element: isAuthenticated() ? (
      <Navigate to={getRedirectRoute()} replace />
    ) : (
      <Login />
    ),
  },
  { path: "/pin-verification", element: <PinVerification /> },
  //{ path: "/personal", loader: checkAuthLoader, element: <Personal /> },
  {
    path: "/personal",
    element: <Personal />,
    loader: personalLoader
  },
  {
    path: "/event/:eventSlug",
    element: <UploadSelfie />,
    loader: updateSelfieLoader,
    errorElement: <ErrorPage />,
  },
  { path: "/processing-selfie", element: <ProcessingSelfie /> },
  { path: "/content-unavailable", element: <ContentUnavailable /> },
  { path: "/image-shop", element: <ImageShop />, errorElement: <ErrorPage /> },
  { path: "/checkout", element: <Checkout /> },
  {
    path: "/checkout-outcome",
    element: <CheckoutOutcome />,
    errorElement: <ErrorPage />,
  },
  { path: "/purchased", element: <Purchased />/*, errorElement: <ErrorPage />*/ },
  { path: "/processing-photos", element: <ProcessingPhotos /> },
  {
    path: "/admin",
    element:<AdminPanel />,
    loader: adminLoader,
  },
  {
    path: "/admin/create-event",
    element: <CreateEvent />,
    loader: createEventLoader,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
