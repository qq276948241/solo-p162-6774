import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, CheckCircle, Home } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useBakeryStore } from "@/store/useBakeryStore";
import { BREADS } from "@/data/breads";

export default function Order() {
  const navigate = useNavigate();
  const {
    cart,
    pickupTime,
    phone,
    remark,
    orderSubmitted,
    setPhone,
    setRemark,
    submitOrder,
    getCartTotal,
    resetOrder,
  } = useBakeryStore();

  const total = getCartTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitOrder()) {
    }
  };

  const isValid =
    cart.length > 0 &&
    pickupTime !== null &&
    /^1\d{10}$/.test(phone.trim());

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-cream-100">
        <NavBar />
        <main className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-sm text-center mt-12">
            <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-forest" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">
              预订提交成功！
            </h1>
            <p className="text-stone-500 mb-6">
              明早 <span className="text-forest font-semibold">{pickupTime}</span>{" "}
              到店取货即可
            </p>

            <div className="bg-cream-50 rounded-xl p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">取货手机号</span>
                <span className="text-stone-700 font-medium">{phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">合计金额</span>
                <span className="text-caramel-700 font-bold">¥{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">商品数量</span>
                <span className="text-stone-700">
                  {cart.reduce((n, i) => n + i.quantity, 0)} 件
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                resetOrder();
                navigate("/");
              }}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              返回首页
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100">
        <NavBar />
        <main className="container mx-auto px-4 lg:px-8 py-8 text-center">
          <p className="text-stone-500 mb-4">购物车是空的</p>
          <Link to="/" className="btn-primary">
            去选购
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <NavBar />
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1 text-stone-500 hover:text-caramel transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回购物车
        </Link>

        <h1 className="text-2xl font-bold text-stone-800 mb-6">确认订单</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
              <h2 className="font-semibold text-stone-800 flex items-center gap-2">
                <Phone className="w-4 h-4 text-forest" />
                取货信息
              </h2>

              <div className="space-y-1">
                <label className="text-sm text-stone-500">手机号</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="请输入 11 位手机号"
                  className="input-field text-lg"
                  maxLength={11}
                />
                {phone && !/^1\d{10}$/.test(phone) && (
                  <p className="text-xs text-red-400 mt-1">请输入正确的手机号</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-stone-500 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  备注（选填）
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value.slice(0, 100))}
                  placeholder="如切片要求、过敏原提示等"
                  rows={3}
                  className="input-field resize-none text-base"
                />
                <p className="text-xs text-stone-400 text-right">
                  {remark.length}/100
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold text-stone-800 mb-4">商品清单</h2>
              <div className="space-y-3">
                {cart.map((item) => {
                  const bread = BREADS.find((b) => b.id === item.breadId);
                  if (!bread) return null;
                  return (
                    <div key={item.breadId} className="flex items-center gap-3">
                      <img
                        src={bread.image}
                        alt={bread.name}
                        className="w-14 h-14 rounded-lg object-cover bg-cream-200"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-stone-700">{bread.name}</div>
                        <div className="text-xs text-stone-400">¥{bread.price} × {item.quantity}</div>
                      </div>
                      <div className="text-caramel-700 font-semibold">
                        ¥{bread.price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-stone-800">订单摘要</h2>

              <div className="flex justify-between text-sm text-stone-600">
                <span>取货时段</span>
                <span className="text-forest font-medium">{pickupTime ?? "未选择"}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>商品件数</span>
                <span>{cart.reduce((n, i) => n + i.quantity, 0)} 件</span>
              </div>
              <div className="border-t border-cream-200 pt-3 flex justify-between items-baseline">
                <span className="text-stone-700 font-medium">应付金额</span>
                <span className="text-2xl font-bold text-caramel-700">¥{total}</span>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="btn-primary w-full py-3.5 text-base mt-3 disabled:bg-stone-300"
              >
                提交预订
              </button>
              <p className="text-xs text-stone-400 text-center">
                到店后凭手机号取货
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
