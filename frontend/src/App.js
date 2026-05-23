import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        {/* ── Guest pages (with hotel navbar/footer) ── */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/buchen" element={<Layout><Booking /></Layout>} />
        <Route path="/anfahrt" element={<Layout><Direction /></Layout>} />
        <Route path="/hotelzimmer" element={<Layout><Zimmer /></Layout>} />
        <Route path="/Radebeul" element={<Layout><Radebeul /></Layout>} />
        <Route path="/hotelzimmer/:roomId" element={<Layout><RoomDetail /></Layout>} />

        {/* ── Admin pages (NO Layout wrapper) ── */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<BookingsPage />} />
        <Route path="/admin/availability" element={<AvailabilityPage />} />
        <Route path="/admin/rooms" element={<RoomsAndPricesPage />} />
        <Route path="/admin/sync" element={<SyncStatusPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;