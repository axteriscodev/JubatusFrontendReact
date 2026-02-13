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
import { ROUTES } from "./routes";

function App() {
  const router = useMemo(() => {
    const getRedirectRoute = () => {
      if (isAdmin()) {
        return ROUTES.ADMIN;
      } else if (isAuthenticated()) {
        return ROUTES.PERSONAL;
      }
      return ROUTES.HOME;
    };

    return createBrowserRouter([
      {
        element: <RouterWrapper />,
        children: [
          { path: ROUTES.WORK_IN_PROGRESS, element: <WorkInProgress /> },
          {
            path: ROUTES.HOME,
            element: isAuthenticated() ? (
              <Navigate to={getRedirectRoute()} replace />
            ) : (
              <Login />
            ),
          },
          {
            path: ROUTES.EMAIL_SENT,
            element: <EmailSent />,
          },
          { path: ROUTES.PIN_VERIFICATION(":userPin"), element: <PinVerification /> },
          //   //{ path: ROUTES.PERSONAL, loader: checkAuthLoader, element: <Personal /> },
          {
            path: ROUTES.PERSONAL,
            element: <PersonalArea />,
            loader: personalLoader,
          },
          {
            path: ROUTES.PERSONAL_EVENT(":slug"),
            element: <PersonalEventDetail />,
            loader: personalLoader,
          },
          {
            path: ROUTES.EVENT(":eventSlug"),
            element: <UploadSelfie />,
            loader: updateSelfieLoader,
            errorElement: <ErrorPage />,
          },
          {
            path: ROUTES.EVENT_WITH_HASH(":eventSlug", ":userHash"),
            element: <UploadSelfie />,
            loader: updateSelfieLoader,
            errorElement: <ErrorPage />,
          },
          { path: ROUTES.PROCESSING_SELFIE, element: <ProcessingSelfie /> },
          { path: ROUTES.CONTENT_UNAVAILABLE, element: <ContentUnavailable /> },
          {
            path: ROUTES.PRE_ORDER,
            element: <PreOrder />,
            errorElement: <ErrorPage />,
          },
          { path: ROUTES.PRE_ORDER_PURCHASED, element: <PreOrderPurchased /> },
          {
            path: ROUTES.IMAGE_SHOP,
            element: <ImageShop />,
            errorElement: <ErrorPage />,
          },
          { path: ROUTES.CHOOSE_PAYMENT, element: <ChoosePayment /> },
          { path: ROUTES.PAY_AT_COUNTER, element: <PayAtCounter /> },
          { path: ROUTES.CHECKOUT, element: <Checkout /> },
          {
            path: ROUTES.CHECKOUT_OUTCOME,
            element: <CheckoutOutcome />,
            errorElement: <ErrorPage />,
          },
          //Conferma dell email post acquisto
          {
            path: ROUTES.MAIL_CONFIRMATION,
            element: <MailConfirmation />,
          },
          //pagina di ringraziamenti
          {
            path: ROUTES.THANK_YOU,
            element: <ThankYou />,
          },
          {
            path: ROUTES.PURCHASED,
            element: <Purchased /> /*, errorElement: <ErrorPage />*/,
          },
          { path: ROUTES.PROCESSING_PHOTOS, element: <ProcessingPhotos /> },
          { path: ROUTES.CONTENT_ERROR, element: <ContentError /> },

          {
            path: ROUTES.ADMIN_EVENT(":eventId"),
            element: <CreateEvent />,
            loader: createEventLoader,
          },
          {
            path: ROUTES.ADMIN_CREATE_EVENT,
            element: <CreateEvent />,
            loader: createEventLoader,
          },
          {
            path: ROUTES.ADMIN,
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
