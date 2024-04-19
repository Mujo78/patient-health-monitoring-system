import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import HomeLayout from "./components/Layout/HomeLayout";
import Authorized from "./helpers/Authorized";
import UserRequired from "./helpers/UserRequired";
import ErrorPage from "./pages/ErrorPage";
import patientRoutes from "./routes/patient";
import doctorRoutes from "./routes/doctor";
import pharmacyRoutes from "./routes/pharmacy";
import { lazy } from "react";

const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const VerificationPage = lazy(() => import("./pages/auth/VerificationPage"));
const ForgotPasswordRes = lazy(() => import("./pages/auth/ForgotPasswordRes"));
const VerificationPageRes = lazy(
  () => import("./pages/auth/VerificationPageRes"),
);

const routes = {
  element: <AppLayout />,
  path: "/",
  children: [
    {
      path: "",
      element: <LandingPage />,
      loader: Authorized,
    },
    {
      path: "/",
      element: <HomeLayout />,
      loader: UserRequired,
      children: [patientRoutes, doctorRoutes, pharmacyRoutes],
    },
    {
      path: "api/v1/user/reset-password/:token",
      element: <ForgotPassword />,
    },
    {
      path: "api/v1/user/reset-password-result",
      element: <ForgotPasswordRes />,
    },
    {
      path: "api/v1/user/verify/:verificationToken",
      element: <VerificationPage />,
    },
    {
      path: "api/v1/user/verify-result",
      element: <VerificationPageRes />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ],
};

const router = createBrowserRouter([routes]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
