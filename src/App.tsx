import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Cart from "@/pages/Cart";
import Order from "@/pages/Order";
import Wishlist from "@/pages/Wishlist";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
