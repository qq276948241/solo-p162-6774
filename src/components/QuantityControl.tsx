import { Minus, Plus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md";
}

export default function QuantityControl({
  quantity,
  max,
  onIncrease,
  onDecrease,
  size = "md",
}: QuantityControlProps) {
  const btnSize =
    size === "sm"
      ? "w-7 h-7"
      : "w-9 h-9";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="inline-flex items-center border border-caramel-100 rounded-lg overflow-hidden bg-white">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className={`${btnSize} flex items-center justify-center text-caramel-600
          hover:bg-caramel-50 disabled:text-stone-300 disabled:hover:bg-transparent
          transition-colors active:scale-95`}
      >
        <Minus className={iconSize} />
      </button>
      <span
        className={`${textSize} font-semibold text-stone-700 w-10 text-center select-none`}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`${btnSize} flex items-center justify-center text-caramel-600
          hover:bg-caramel-50 disabled:text-stone-300 disabled:hover:bg-transparent
          transition-colors active:scale-95`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
