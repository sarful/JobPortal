import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Loader from "./components/common/Loader";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/authStore";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const initialized = useAuthStore(
    (state) => state.initialized
  );

  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!initialized) {
    return (
      <Loader
        fullScreen
        label="Initializing JobPortal..."
      />
    );
  }

  return (
    <>
      <AppRoutes />

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}