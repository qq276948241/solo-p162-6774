import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Croissant, Home } from "lucide-react";
import { useBakeryStore } from "@/store/useBakeryStore";

export default function NavBar() {
  const cartCount = useBakeryStore((s) => s.getCartCount());
  const location = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? "text-caramel bg-caramel-50"
        : "text-stone-600 hover:text-caramel hover:bg-cream-50"
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-caramel-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-caramel flex items-center justify-center">
              <Croissant className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-caramel-700 tracking-wide">
              麦香面包
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/" className={linkClass("/")}>
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">首页</span>
            </Link>

            <Link to="/cart" className={linkClass("/cart")}>
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-forest text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">购物车</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
