import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Personal from "./pages/Personal";
import UploadSelfie from "./pages/UploadSelfie";
import ProcessingSelfie from "./pages/ProcessingSelfie";
import ImageShop from "./pages/ImageShop";
import Purchased from "./pages/Purchased";
import AdminPanel from "./pages/AdminPanel";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/personal", element: <Personal /> },
  { path: "/event/:eventName", element: <UploadSelfie /> },
  { path: "/processing-selfie", element: <ProcessingSelfie /> },
  { path: "/image-shop", element: <ImageShop /> },
  { path: "/purchased", element: <Purchased /> },
  { path: "/admin", element: <AdminPanel /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
