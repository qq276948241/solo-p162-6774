import { useState, useCallback } from "react";
import { useBakeryStore } from "@/store/useBakeryStore";

interface UseCardInteractionOptions {
  breadId: string;
  soldOut: boolean;
  remaining: number;
}

interface UseCardInteractionReturn {
  addBouncing: boolean;
  heartBouncing: boolean;
  wishlisted: boolean;
  handleAddClick: () => void;
  handleHeartClick: (e: React.MouseEvent) => void;
}

export function useCardInteraction({
  breadId,
  soldOut,
  remaining,
}: UseCardInteractionOptions): UseCardInteractionReturn {
  const [addBouncing, setAddBouncing] = useState(false);
  const [heartBouncing, setHeartBouncing] = useState(false);

  const addToCart = useBakeryStore((s) => s.addToCart);
  const toggleWishlist = useBakeryStore((s) => s.toggleWishlist);
  // 直接订阅调用结果，而非函数引用 — 这样 store 更新后组件会自动 re-render
  const wishlisted = useBakeryStore((s) => s.isWishlisted(breadId));

  const triggerBounce = useCallback((setter: (v: boolean) => void) => {
    setter(true);
    window.setTimeout(() => setter(false), 300);
  }, []);

  const handleAddClick = useCallback(() => {
    // 双重校验：先看外部传入的状态，再直接读一次 store 确保最新
    // 彻底阻止售罄时的微弹动画
    const latestRemaining = useBakeryStore
      .getState()
      .getRemainingStock(breadId);
    if (soldOut || remaining <= 0 || latestRemaining <= 0) return;

    addToCart(breadId);
    triggerBounce(setAddBouncing);
  }, [breadId, soldOut, remaining, addToCart, triggerBounce]);

  const handleHeartClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      toggleWishlist(breadId);
      triggerBounce(setHeartBouncing);
    },
    [breadId, toggleWishlist, triggerBounce]
  );

  return {
    addBouncing,
    heartBouncing,
    wishlisted,
    handleAddClick,
    handleHeartClick,
  };
}
