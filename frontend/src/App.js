import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Home from "./pages/home/HomePage";
import Booking from "./pages/booking/BuchenPage";
import Direction from "./pages/anfahrtpage/AnfahrtPage";
import Zimmer from "./pages/rooms/ZimmerPage";
import RoomDetail from "./pages/rooms/RoomDetailPage";
import Layout from "./components/Layout";
import Radebeul from "./pages/radebeul/RadebulPage";

import AdminLogin from "./pages/adminpage/adminLogin/adminLogin";
import AdminDashboard from "./pages/adminpage/Dashboard/AdminDashboard";
import BookingsPage from "./pages/adminpage/Bookings/BookingsPage";
import AvailabilityPage from "./pages/adminpage/Availability/AvailabilityPage";
import RoomsAndPricesPage from "./pages/adminpage/RoomsAndPrices/RoomsAndPricesPage";
import SyncStatusPage from "./pages/adminpage/SyncStatus/SyncStatusPage";
import SettingsPage from "./pages/adminpage/Settings/SettingsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Guest pages (with hotel navbar/footer) ── */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/buchen"
            element={
              <Layout>
                <Booking />
              </Layout>
            }
          />
          <Route
            path="/anfahrt"
            element={
              <Layout>
                <Direction />
              </Layout>
            }
          />
          <Route
            path="/hotelzimmer"
            element={
              <Layout>
                <Zimmer />
              </Layout>
            }
          />
          <Route
            path="/Radebeul"
            element={
              <Layout>
                <Radebeul />
              </Layout>
            }
          />
          <Route
            path="/hotelzimmer/:roomId"
            element={
              <Layout>
                <RoomDetail />
              </Layout>
            }
          />

          {/* ── Admin login (public) ── */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* ── Admin pages (protected) ── */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/availability"
            element={
              <ProtectedRoute>
                <AvailabilityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute>
                <RoomsAndPricesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sync"
            element={
              <ProtectedRoute>
                <SyncStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
