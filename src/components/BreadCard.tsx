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
  return (
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
  const getRemainingStock = useBakeryStore((s) => s.getRemainingStock);
  const remaining = getRemainingStock(bread.id);
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
