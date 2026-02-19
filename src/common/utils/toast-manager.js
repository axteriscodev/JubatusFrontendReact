import { toast, Bounce } from "react-toastify";

export function successToast(message, autoClose = 3000) {
  toast.success(message, {
    position: "top-right",
    autoClose: autoClose ?? 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
}

export function errorToast(message, autoClose = 3000) {
  toast.error(message, {
    position: "top-right",
    autoClose: autoClose ?? 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
}
