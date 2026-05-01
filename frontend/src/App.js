import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home      from './pages/home/HomePage';
import Booking   from './pages/booking/BuchenPage';
import Direction from './pages/anfahrtpage/AnfahrtPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />}      />
        <Route path="/buchen"  element={<Booking />}   />
        <Route path="/anfahrt" element={<Direction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;