import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useMemo } from "react";
import { isAuthenticated, isAdmin } from "@common/utils/auth";

import Login from "@features/user/pages/Login";
import WorkInProgress from "@common/pages/WorkInProgress";
import EmailSent from "@features/user/pages/EmailSent";
import PinVerification from "@features/user/pages/PinVerification";
import PersonalArea from "@features/user/pages/PersonalArea";
import { loader as personalLoader } from "@features/user/pages/PersonalArea.loader";
import PersonalEventDetail from "@features/user/pages/PersonalEventDetail";
import UploadSelfie from "@features/user/pages/UploadSelfie";
import { loader as updateSelfieLoader } from "@features/user/pages/UploadSelfie.loader";
import ErrorPage from "@common/pages/ErrorPage";
import ProcessingSelfie from "@features/user/pages/ProcessingSelfie";
import ContentUnavailable from "@common/pages/ContentUnavailable";

import PreOrder from "@features/shop/pages/PreOrder";
import PreOrderPurchased from "@features/shop/pages/PreOrderPurchased";
import ImageShop from "@features/shop/pages/ImageShop";
import Purchased from "@features/shop/pages/Purchased";
import Checkout from "@features/shop/pages/Checkout";
import CheckoutOutcome from "@features/shop/pages/CheckoutOutcome";
import ProcessingPhotos from "@features/user/pages/ProcessingPhotos";
import AdminLayout from "@features/admin/components/AdminLayout";
import AdminPanel from "@features/admin/pages/AdminPanel";
import { loader as adminLoader } from "@features/admin/pages/AdminPanel.loader";
import AdminReaders from "@features/admin/pages/AdminReaders";
import { loader as adminReadersLoader } from "@features/admin/pages/AdminReaders.loader";
import CreateEvent from "@features/admin/pages/CreateEvent";
import { loader as createEventLoader } from "@features/admin/pages/CreateEvent/CreateEvent.loader";
import ContentError from "@common/pages/ContentError";
import MailConfirmation from "@features/shop/pages/MailConfirmation";
import ThankYou from "@features/shop/pages/ThankYou";
import { LanguageProvider } from "@common/i18n/LanguageContext";
import { TranslationProvider } from "@common/i18n/TranslationProvider";
import RouterWrapper from "@common/components/RouterWrapper";
import ChoosePayment from "@features/shop/pages/ChoosePayment";
import PayAtCounter from "@features/shop/pages/PayAtCounter";
import { ROUTES } from "./routes";

function HomeRoute() {
  if (isAdmin()) return <Navigate to={ROUTES.ADMIN} replace />;
  if (isAuthenticated()) return <Navigate to={ROUTES.PERSONAL} replace />;
  return <Login />;
}

function App() {
  const router = useMemo(() => {
    return createBrowserRouter([
      {
        element: <RouterWrapper />,
        children: [
          { path: ROUTES.WORK_IN_PROGRESS, element: <WorkInProgress /> },
          {
            path: ROUTES.HOME,
            element: <HomeRoute />,
          },
          {
            path: ROUTES.EMAIL_SENT,
            element: <EmailSent />,
          },
          {
            path: ROUTES.PIN_VERIFICATION(":userPin"),
            element: <PinVerification />,
          },
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
            element: <AdminLayout />,
            children: [
              {
                path: ROUTES.ADMIN,
                element: <AdminPanel />,
                loader: adminLoader,
              },
              {
                path: ROUTES.ADMIN_READERS,
                element: <AdminReaders />,
                loader: adminReadersLoader,
              },
              {
                path: ROUTES.ADMIN_CREATE_EVENT,
                element: <CreateEvent />,
                loader: createEventLoader,
              },
              {
                path: ROUTES.ADMIN_EVENT(":eventId"),
                element: <CreateEvent />,
                loader: createEventLoader,
              },
            ],
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
