import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useMemo, lazy, Suspense } from "react";
import { isAuthenticated, isAdmin } from "@common/utils/auth";

// Loaders — statici (eseguono prima del render, devono essere sempre disponibili)
import { loader as personalLoader } from "@features/user/pages/PersonalArea.loader";
import { loader as updateSelfieLoader } from "@features/shop/pages/UploadSelfie.loader";
import { loader as adminLoader } from "@features/admin/pages/AdminPanel.loader";
import { loader as adminReadersLoader } from "@features/admin/pages/AdminReaders.loader";
import { loader as adminReaderDetailLoader } from "@features/admin/pages/AdminReaderDetail.loader";
import { loader as createEventLoader } from "@features/admin/pages/CreateEvent/CreateEvent.loader";
import { loader as defaultPriceListLoader } from "@features/admin/pages/AdminDefaultPriceList.loader";

// Pagine piccole/core — statiche
import Login from "@features/user/pages/Login";
import WorkInProgress from "@common/pages/WorkInProgress";
import EmailSent from "@features/user/pages/EmailSent";
import PinVerification from "@features/user/pages/PinVerification";
import ContentUnavailable from "@common/pages/ContentUnavailable";
import ContentError from "@common/pages/ContentError";
import NewErrorPage from "./common/pages/NewErrorPage";
import EventNotFoundPage from "@common/pages/EventNotFoundPage";
import { LanguageProvider } from "@common/i18n/LanguageContext";
import { TranslationProvider } from "@common/i18n/TranslationProvider";
import RouterWrapper from "@common/components/RouterWrapper";
import { ROUTES } from "./routes";

// Feature user — lazy
const PersonalArea = lazy(() => import("@features/user/pages/PersonalArea"));
const PersonalEventDetail = lazy(() => import("@features/user/pages/PersonalEventDetail"));

// Feature shop — lazy
const ShopLayout = lazy(() => import("@features/shop/components/ShopLayout"));
const EventLanding = lazy(() => import("@features/shop/pages/EventLanding"));
const PreOrderSelfie = lazy(() => import("@features/shop/pages/PreOrderSelfie"));
const ProcessingSelfie = lazy(() => import("@features/shop/pages/ProcessingSelfie"));
const PreOrderPurchased = lazy(() => import("@features/shop/pages/PreOrderPurchased"));
const ImageShop = lazy(() => import("@features/shop/pages/ImageShop"));
const Purchased = lazy(() => import("@features/shop/pages/Purchased"));
const Checkout = lazy(() => import("@features/shop/pages/Checkout"));
const CheckoutOutcome = lazy(() => import("@features/shop/pages/CheckoutOutcome"));
const ProcessingPhotos = lazy(() => import("@features/shop/pages/ProcessingPhotos"));
const MailConfirmation = lazy(() => import("@features/shop/pages/MailConfirmation"));
const ThankYou = lazy(() => import("@features/shop/pages/ThankYou"));
const ThankYouCash = lazy(() => import("./features/shop/pages/ThankYouCash"));
const ChoosePayment = lazy(() => import("@features/shop/pages/ChoosePayment"));
const PayAtCounter = lazy(() => import("@features/shop/pages/PayAtCounter"));

// Feature admin — lazy
const AdminLayout = lazy(() => import("@features/admin/components/AdminLayout"));
const AdminDashboard = lazy(() => import("@features/admin/pages/AdminDashboard"));
const AdminEvents = lazy(() => import("@features/admin/pages/AdminEvents"));
const AdminReaders = lazy(() => import("@features/admin/pages/AdminReaders"));
const AdminReaderDetail = lazy(() => import("@features/admin/pages/AdminReaderDetail"));
const CreateEvent = lazy(() => import("@features/admin/pages/CreateEvent"));
const AdminDefaultPriceList = lazy(() => import("@features/admin/pages/AdminDefaultPriceList"));

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
        errorElement: <NewErrorPage />,
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
            element: <ShopLayout />,
            children: [
              {
                path: ROUTES.EVENT(":eventSlug"),
                element: <EventLanding />,
                loader: updateSelfieLoader,
                errorElement: <EventNotFoundPage />,
              },
              {
                path: ROUTES.EVENT_WITH_HASH(":eventSlug", ":userHash"),
                element: <EventLanding />,
                loader: updateSelfieLoader,
                errorElement: <EventNotFoundPage />,
              },
              { path: ROUTES.PREORDER_SELFIE, element: <PreOrderSelfie /> },
              { path: ROUTES.PROCESSING_SELFIE, element: <ProcessingSelfie /> },
              {
                path: ROUTES.CONTENT_UNAVAILABLE,
                element: <ContentUnavailable />,
              },
              {
                path: ROUTES.PRE_ORDER_PURCHASED,
                element: <PreOrderPurchased />,
              },
              {
                path: ROUTES.IMAGE_SHOP,
                element: <ImageShop />,
              },
              { path: ROUTES.CHOOSE_PAYMENT, element: <ChoosePayment /> },
              { path: ROUTES.PAY_AT_COUNTER, element: <PayAtCounter /> },
              { path: ROUTES.CHECKOUT, element: <Checkout /> },
              {
                path: ROUTES.CHECKOUT_OUTCOME,
                element: <CheckoutOutcome />,
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
              //pagina di ringraziamenti per pagamento in cassa
              {
                path: ROUTES.THANK_YOU_CASH,
                element: <ThankYouCash />,
              },
              {
                path: ROUTES.PURCHASED,
                element: <Purchased />,
              },
              { path: ROUTES.PROCESSING_PHOTOS, element: <ProcessingPhotos /> },
              { path: ROUTES.CONTENT_ERROR, element: <ContentError /> },
            ],
          },
          {
            element: <AdminLayout />,
            children: [
              {
                path: ROUTES.ADMIN,
                element: <AdminDashboard />,
                loader: adminLoader,
              },
              {
                path: ROUTES.ADMIN_EVENTS,
                element: <AdminEvents />,
                loader: adminLoader,
              },
              {
                path: ROUTES.ADMIN_READERS,
                element: <AdminReaders />,
                loader: adminReadersLoader,
              },
              {
                path: ROUTES.ADMIN_READER(":readerId"),
                element: <AdminReaderDetail />,
                loader: adminReaderDetailLoader,
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
              {
                path: ROUTES.ADMIN_DEFAULT_PRICE_LIST,
                element: <AdminDefaultPriceList />,
                loader: defaultPriceListLoader,
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
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </TranslationProvider>
    </LanguageProvider>
  );
}

export default App;
