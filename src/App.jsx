import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useMemo } from "react";
import { isAuthenticated, isAdmin } from "./utils/auth";

import Login from "./pages/Login";
import WorkInProgress from "./pages/WorkInProgress";
import EmailSent from "./pages/EmailSent";
import PinVerification from "./pages/PinVerification";
import PersonalArea from "./pages/PersonalArea";
import { loader as personalLoader } from "./pages/PersonalArea.loader";
import PersonalEventDetail from "./pages/PersonalEventDetail";
import UploadSelfie from "./pages/UploadSelfie";
import { loader as updateSelfieLoader } from "./pages/UploadSelfie.loader";
import ErrorPage from "./pages/ErrorPage";
import ProcessingSelfie from "./pages/ProcessingSelfie";
import ContentUnavailable from "./pages/ContentUnavailable";

import PreOrder from "./pages/PreOrder";
import PreOrderPurchased from "./pages/PreOrderPurchased";
import ImageShop from "./pages/ImageShop";
import Purchased from "./pages/Purchased";
import Checkout from "./pages/Checkout";
import CheckoutOutcome from "./pages/CheckoutOutcome";
import ProcessingPhotos from "./pages/ProcessingPhotos";
import AdminPanel from "./pages/AdminPanel";
import { loader as adminLoader } from "./pages/AdminPanel.loader";
import CreateEvent from "./pages/CreateEvent";
import { loader as createEventLoader } from "./pages/CreateEvent/CreateEvent.loader";
import ContentError from "./pages/ContentError";
import MailConfirmation from "./pages/MailConfirmation";
import ThankYou from "./pages/ThankYou";
import { LanguageProvider } from "./features/LanguageContext";
import { TranslationProvider } from "./features/TranslationProvider";
import RouterWrapper from "./components/RouterWrapper";
import ChoosePayment from "./pages/ChoosePayment";
import PayAtCounter from "./pages/PayAtCounter";

function App() {
  const router = useMemo(() => {
    const getRedirectRoute = () => {
      if (isAdmin()) {
        return "/admin";
      } else if (isAuthenticated()) {
        return "/personal";
      }
      return "/";
    };

    return createBrowserRouter([
      {
        element: <RouterWrapper />,
        children: [
          { path: "/work-in-progress", element: <WorkInProgress /> },
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
          //   //{ path: "/personal", loader: checkAuthLoader, element: <Personal /> },
          {
            path: "/personal",
            element: <PersonalArea />,
            loader: personalLoader,
          },
          {
            path: "/personal/:slug",
            element: <PersonalEventDetail />,
            loader: personalLoader,
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
          {
            path: "/pre-order",
            element: <PreOrder />,
            errorElement: <ErrorPage />,
          },
          { path: "/pre-order", element: <PreOrder /> },
          { path: "/pre-order-purchased", element: <PreOrderPurchased /> },
          {
            path: "/image-shop",
            element: <ImageShop />,
            errorElement: <ErrorPage />,
          },
          { path: "/choose-payment", element: <ChoosePayment /> },
          { path: "/pay-at-counter", element: <PayAtCounter /> },
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
            path: "/admin/event/:eventId",
            element: <CreateEvent />,
            loader: createEventLoader,
          },
          {
            path: "/admin/create-event",
            element: <CreateEvent />,
            loader: createEventLoader,
          },
          {
            path: "/admin",
            element: <AdminPanel />,
            loader: adminLoader,
          },
        ],
      },
    ]);
  }, []);

  return (
    <LanguageProvider>
      <TranslationProvider>
        <RouterProvider router={router} />
      </TranslationProvider>
    </LanguageProvider>
  );
}

export default App;
