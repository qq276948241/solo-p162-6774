import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import NavBar from "@/components/NavBar";
import QuantityControl from "@/components/QuantityControl";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { useBakeryStore } from "@/store/useBakeryStore";
import { BREADS } from "@/data/breads";
import type { PickupTimeSlot } from "@/types";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    pickupTime,
    updateQuantity,
    removeFromCart,
    setPickupTime,
    getCartTotal,
    getRemainingStock,
  } = useBakeryStore();

  const total = getCartTotal();
  const canCheckout = cart.length > 0 && pickupTime !== null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100">
        <NavBar />
        <main className="container mx-auto px-4 lg:px-8 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-stone-500 hover:text-caramel transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>

          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-caramel-50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-caramel/50" />
            </div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">购物车还是空的</h2>
            <p className="text-stone-400 mb-6">去首页挑几款喜欢的面包吧～</p>
            <Link to="/" className="btn-primary">
              去选购
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <NavBar />
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-stone-500 hover:text-caramel transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          继续选购
        </Link>

        <h1 className="text-2xl font-bold text-stone-800 mb-6">我的购物车</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const bread = BREADS.find((b) => b.id === item.breadId);
              if (!bread) return null;
              const remaining = getRemainingStock(item.breadId) + item.quantity;

              return (
                <div
                  key={item.breadId}
                  className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm"
                >
                  <img
                    src={bread.image}
                    alt={bread.name}
                    className="w-24 h-24 rounded-xl object-cover bg-cream-200 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-stone-800">{bread.name}</h3>
                        <p className="text-sm text-stone-400 mt-0.5">
                          单价 ¥{bread.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.breadId)}
                        className="text-stone-300 hover:text-red-400 p-1 transition-colors"
                        aria-label="移除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <QuantityControl
                        quantity={item.quantity}
                        max={remaining}
                        onIncrease={() =>
                          updateQuantity(item.breadId, item.quantity + 1)
                        }
                        onDecrease={() =>
                          updateQuantity(item.breadId, item.quantity - 1)
                        }
                      />
                      <span className="text-lg font-bold text-caramel-700">
                        ¥{bread.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <TimeSlotPicker
                value={pickupTime}
                onChange={(slot: PickupTimeSlot) => setPickupTime(slot)}
              />
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between text-stone-600">
                <span>商品数量</span>
                <span>
                  {cart.reduce((n, i) => n + i.quantity, 0)} 件
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>取货时段</span>
                <span className={pickupTime ? "text-forest font-medium" : "text-stone-400"}>
                  {pickupTime ?? "未选择"}
                </span>
              </div>
              <div className="border-t border-cream-200 pt-3 flex justify-between items-baseline">
                <span className="text-stone-700 font-medium">合计</span>
                <span className="text-2xl font-bold text-caramel-700">
                  ¥{total}
                </span>
              </div>

              <button
                onClick={() => navigate("/order")}
                disabled={!canCheckout}
                className="btn-primary w-full py-3 text-base mt-2 disabled:bg-stone-300"
              >
                去结算
              </button>
              {!pickupTime && cart.length > 0 && (
                <p className="text-xs text-stone-400 text-center">
                  请先选择取货时段
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
