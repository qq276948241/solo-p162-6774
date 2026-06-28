import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useBakeryStore } from "@/store/useBakeryStore";
import { BREADS } from "@/data/breads";

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 rounded-full bg-caramel-50 flex items-center justify-center mb-5">
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26 44C26 44 6 32 6 18C6 12 10 8 15 8C19 8 22 10 26 14C30 10 33 8 37 8C42 8 46 12 46 18C46 32 26 44 26 44Z"
            stroke="#A0522D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
            fill="none"
          />
          <path
            d="M18 22L22 26L30 18"
            stroke="#2F5D4B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-stone-700 mb-2">
        心愿单还是空的
      </h2>
      <p className="text-stone-400 mb-6 text-center max-w-xs">
        看到喜欢的面包，点一下小爱心就能收藏起来，下次再来也不怕忘记啦
      </p>
      <Link to="/" className="btn-primary">
        去逛逛
      </Link>
    </div>
  );
}

interface WishlistCardProps {
  breadId: string;
}

function WishlistCard({ breadId }: WishlistCardProps) {
  const { addToCart, removeWishlist, getRemainingStock } = useBakeryStore();
  const bread = BREADS.find((b) => b.id === breadId);
  if (!bread) return null;

  const remaining = getRemainingStock(breadId);
  const soldOut = remaining <= 0;

  return (
    <div className={`card group ${soldOut ? "opacity-60 grayscale" : "card-hover"}`}>
      <div className="relative aspect-square overflow-hidden bg-cream-200">
        <img
          src={bread.image}
          alt={bread.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            soldOut ? "" : "group-hover:scale-105"
          }`}
          loading="lazy"
        />
        <button
          onClick={() => removeWishlist(breadId)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
            bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200
            hover:bg-red-50 hover:text-red-500 text-stone-400 hover:scale-110"
          aria-label="移除收藏"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {soldOut && (
          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
            <span className="bg-white text-stone-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider">
              已售完
            </span>
          </div>
        )}
        {!soldOut && remaining <= 3 && (
          <div className="absolute top-3 left-3 bg-forest text-white text-xs font-medium px-2.5 py-1 rounded-full">
            仅剩 {remaining} 个
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-stone-800 leading-tight">
          {bread.name}
        </h3>
        <p className="text-sm text-stone-500 line-clamp-2 min-h-[2.5em]">
          {bread.description}
        </p>

        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs text-caramel">¥</span>
            <span className="text-xl font-bold text-caramel-700">
              {bread.price}
            </span>
          </div>

          {soldOut ? (
            <span className="text-sm text-stone-400">暂不可购</span>
          ) : (
            <button
              onClick={() => addToCart(breadId)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-caramel text-white text-sm font-medium
                hover:bg-caramel-600 transition-colors active:animate-bounce-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              加购
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Wishlist() {
  const { wishlistItems, addAllWishlistToCart } = useBakeryStore();

  const availableItems = wishlistItems.filter((id) => {
    const bread = BREADS.find((b) => b.id === id);
    return bread && bread.stock > 0;
  });

  const hasAvailable = availableItems.length > 0;

  return (
    <div className="min-h-screen bg-cream-100">
      <NavBar />
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-stone-500 hover:text-caramel transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            我的心愿单
          </h1>
          {hasAvailable && (
            <button
              onClick={addAllWishlistToCart}
              className="btn-primary flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              全部加购
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlistItems.map((id) => (
              <WishlistCard key={id} breadId={id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
