import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import { LoadScript } from "@react-google-maps/api";

import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThreeDot } from "react-loading-indicators";

// Lazy-loaded components
const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const ResponsiveNavbar = lazy(() => import("./components/ResponsiveNavbar"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const EventCreationForm = lazy(() => import("./components/EventCreationForm"));
const EventList = lazy(() => import("./components/EventList"));
const EventDetails = lazy(() => import("./components/EventDetails"));
const FeedbackForm = lazy(() => import("./components/FeedbackForm"));
const NotFoundPage = lazy(() => import("./components/NotFoundPage"));

function App() {
  const API_KEY = import.meta.env.VITE_GMAP_API_KEY;

  return (
    <ErrorBoundary>
      <LoadScript googleMapsApiKey={API_KEY}>
        <ToastContainer />
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <ThreeDot size={30} color="#712681" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<ResponsiveNavbar />}>
              <Route index element={<Home />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="eventcreation"
                element={
                  <ProtectedRoute>
                    <EventCreationForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="feedback"
                element={
                  <ProtectedRoute>
                    <FeedbackForm />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="events" element={<EventList />} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </LoadScript>
    </ErrorBoundary>
  );
}

export default App;
