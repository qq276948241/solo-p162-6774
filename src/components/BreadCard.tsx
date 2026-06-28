import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { BreadItem } from "@/types";
import { useBakeryStore } from "@/store/useBakeryStore";

interface BreadCardProps {
  bread: BreadItem;
}

export default function BreadCard({ bread }: BreadCardProps) {
  const { addToCart, getRemainingStock } = useBakeryStore();
  const [bouncing, setBouncing] = useState(false);

  const remaining = getRemainingStock(bread.id);
  const soldOut = remaining <= 0;

  const handleAdd = () => {
    if (soldOut) return;
    addToCart(bread.id);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 300);
  };

  return (
    <div
      className={`card card-hover group ${
        soldOut ? "opacity-60 grayscale card-hover" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-cream-200">
        <img
          src={bread.image}
          alt={bread.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            soldOut ? "" : "group-hover:scale-105"
          }`}
          loading="lazy"
        />
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-stone-800 leading-tight">
            {bread.name}
          </h3>
          {!soldOut && (
            <span className="text-xs text-stone-400 whitespace-nowrap mt-0.5">
              剩 {remaining}
            </span>
          )}
        </div>

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
            <button
              disabled
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-stone-200 text-stone-400 text-sm font-medium cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              已售完
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1 px-3.5 py-2 rounded-lg bg-caramel text-white text-sm font-medium
                hover:bg-caramel-600 transition-colors
                ${bouncing ? "animate-bounce-sm" : ""}`}
            >
              <Plus className="w-4 h-4" />
              加购
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
