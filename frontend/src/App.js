import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/HomePage";
import Booking from "./pages/booking/BuchenPage";
import Direction from "./pages/anfahrtpage/AnfahrtPage";
import Zimmer from "./pages/rooms/ZimmerPage";
import RoomDetail from "./pages/rooms/RoomDetailPage";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buchen" element={<Booking />} />
          <Route path="/anfahrt" element={<Direction />} />
          <Route path="/hotelzimmer" element={<Zimmer />} />
          <Route path="/hotelzimmer/:roomId" element={<RoomDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
