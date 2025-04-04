import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from 'react-toastify';

import "./Admin.css";
import "./App.css";
import App from "./App.jsx";

import { store } from "./repositories/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
);
