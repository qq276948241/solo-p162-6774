import { useState } from "react";
import { Plus, X, Heart } from "lucide-react";
import type { BreadItem } from "@/types";
import { useCardInteraction } from "@/hooks/useCardInteraction";
import { useBakeryStore } from "@/store/useBakeryStore";

interface BreadCardProps {
  bread: BreadItem;
}

interface CardImageProps {
  bread: BreadItem;
  soldOut: boolean;
  remaining: number;
  onHeartClick: (e: React.MouseEvent) => void;
  heartBouncing: boolean;
  wishlisted: boolean;
}

function CardImage({
  bread,
  soldOut,
  remaining,
  onHeartClick,
  heartBouncing,
  wishlisted,
}: CardImageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative aspect-square overflow-hidden bg-cream-200">
      {imgError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-cream-200 text-caramel/70">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            className="mb-2 opacity-60"
          >
            <ellipse cx="28" cy="36" rx="22" ry="10" fill="currentColor" />
            <path
              d="M10 30C10 20 18 14 28 14C38 14 46 20 46 30"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M18 24C18 20 22 18 28 18C34 18 38 20 38 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="text-xs font-medium">{bread.name}</span>
        </div>
      ) : (
        <img
          src={bread.image}
          alt={bread.name}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            soldOut ? "" : "group-hover:scale-105"
          }`}
          loading="lazy"
        />
      )}

      <button
        onClick={onHeartClick}
        onMouseEnter={(e) => e.stopPropagation()}
        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
          bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200
          hover:bg-white hover:scale-110
          ${heartBouncing ? "animate-bounce-sm" : ""}
          ${wishlisted ? "text-red-500" : "text-stone-400 hover:text-red-400"}`}
        aria-label={wishlisted ? "取消收藏" : "加入心愿单"}
      >
        <Heart
          className={`w-4.5 h-4.5 transition-all duration-200 ${
            wishlisted ? "fill-current" : ""
          }`}
        />
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
  );
}

interface CardMetaProps {
  bread: BreadItem;
  soldOut: boolean;
  remaining: number;
}

function CardMeta({ bread, soldOut, remaining }: CardMetaProps) {
  return (
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
    </div>
  );
}

interface CardFooterProps {
  price: number;
  soldOut: boolean;
  onAddClick: () => void;
  addBouncing: boolean;
}

function CardFooter({ price, soldOut, onAddClick, addBouncing }: CardFooterProps) {
  return (
    <div className="px-4 pb-4 flex items-center justify-between">
      <div className="flex items-baseline gap-0.5">
        <span className="text-xs text-caramel">¥</span>
        <span className="text-xl font-bold text-caramel-700">{price}</span>
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
          onClick={onAddClick}
          className={`flex items-center gap-1 px-3.5 py-2 rounded-lg bg-caramel text-white text-sm font-medium
            hover:bg-caramel-600 transition-colors
            ${addBouncing ? "animate-bounce-sm" : ""}`}
        >
          <Plus className="w-4 h-4" />
          加购
        </button>
      )}
    </div>
  );
}

export default function BreadCard({ bread }: BreadCardProps) {
  // 直接订阅调用结果，而非函数引用 — store 更新后自动触发 re-render
  const remaining = useBakeryStore((s) => s.getRemainingStock(bread.id));
  const soldOut = remaining <= 0;

  const {
    addBouncing,
    heartBouncing,
    wishlisted,
    handleAddClick,
    handleHeartClick,
  } = useCardInteraction({ breadId: bread.id, soldOut, remaining });

  return (
    <div
      className={`card card-hover group flex flex-col ${
        soldOut ? "opacity-60 grayscale" : ""
      }`}
    >
      <CardImage
        bread={bread}
        soldOut={soldOut}
        remaining={remaining}
        onHeartClick={handleHeartClick}
        heartBouncing={heartBouncing}
        wishlisted={wishlisted}
      />
      <CardMeta bread={bread} soldOut={soldOut} remaining={remaining} />
      <CardFooter
        price={bread.price}
        soldOut={soldOut}
        onAddClick={handleAddClick}
        addBouncing={addBouncing}
      />
    </div>
  );
}
