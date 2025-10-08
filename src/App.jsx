import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import PinVerification from "./pages/PinVerification";
import UploadSelfie from "./pages/UploadSelfie";
import {
  loader as updateSelfieLoader,
} from "./pages/UploadSelfie.loader";
import ProcessingSelfie from "./pages/ProcessingSelfie";
import PreOrder from "./pages/PreOrder";
import PreOrderPurchased from "./pages/PreOrderPurchased";
import ImageShop from "./pages/ImageShop";
import Purchased from "./pages/Purchased";
import Checkout from "./pages/Checkout";
import CheckoutOutcome from "./pages/CheckoutOutcome";
import ProcessingPhotos from "./pages/ProcessingPhotos";
import ErrorPage from "./pages/ErrorPage";
import ContentUnavailable from "./pages/ContentUnavailable";
import { isAuthenticated, isAdmin } from "./utils/auth";
import  PersonalArea from "./pages/PersonalArea";
import { loader as personalLoader} from "./pages/PersonalArea.loader";
import  AdminPanel  from "./pages/AdminPanel";
import { loader as adminLoader } from "./pages/AdminPanel.loader";
import CreateEvent from "./pages/CreateEvent";
import { loader as createEventLoader } from "./pages/CreateEvent/CreateEvent.loader";
import EmailSent from "./pages/EmailSent";
import ContentError from "./pages/ContentError";
import MailConfirmation from "./pages/MailConfirmation";
import ThankYou from "./pages/ThankYou";
import { LanguageProvider } from "./features/LanguageContext";
import { TranslationProvider } from "./features/TranslationProvider";
import PersonalOld from "./pages/Personal_Old";

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
  {
    path: "/email-sent",
    element: <EmailSent />,
  },
  { path: "/pin-verification/:userPin", element: <PinVerification /> },
  //{ path: "/personal", loader: checkAuthLoader, element: <Personal /> },
  {
    path: "/personal",
    element: <PersonalArea />,
    loader: personalLoader,
    children : [{
      path: "/:slug",
      element: <PersonalOld />,
      loader: personalLoader,
    }]
  },
  {
    path: "/event/:eventSlug",
    element: <UploadSelfie />,
    loader: updateSelfieLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/event/:eventSlug/:userHash",
    element: <UploadSelfie />,
    loader: updateSelfieLoader,
    errorElement: <ErrorPage />,
  },
  { path: "/processing-selfie", element: <ProcessingSelfie /> },
  { path: "/content-unavailable", element: <ContentUnavailable /> },
  //{ path: "/pre-order", element: <PreOrder />, errorElement: <ErrorPage /> },
  { path: "/pre-order", element: <PreOrder /> },
  { path: "/pre-order-purchased", element: <PreOrderPurchased /> },
  { path: "/image-shop", element: <ImageShop />, errorElement: <ErrorPage /> },
  { path: "/checkout", element: <Checkout /> },
  {
    path: "/checkout-outcome",
    element: <CheckoutOutcome />,
    errorElement: <ErrorPage />,
  },
  //Conferma dell email post acquisto
  {
    path: "/mail-confirmation",
    element: <MailConfirmation />,
  },
  //pagina di ringraziamenti
  {
    path: "/thank-you",
    element: <ThankYou />,
  },
  {
    path: "/purchased",
    element: <Purchased /> /*, errorElement: <ErrorPage />*/,
  },
  { path: "/processing-photos", element: <ProcessingPhotos /> },
  { path: "/content-error", element: <ContentError /> },
  {
    path: "/admin",
    element: <AdminPanel />,
    loader: adminLoader,
  },
  {
    path: "/admin/create-event",
    element: <CreateEvent />,
    loader: createEventLoader,
  },
]);

function App() {
  return (
    <LanguageProvider>
      <TranslationProvider>
        <RouterProvider router={router} />
      </TranslationProvider>
    </LanguageProvider>
  );
}

export default App;
