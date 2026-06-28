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
  const isWishlisted = useBakeryStore((s) => s.isWishlisted);

  const wishlisted = isWishlisted(breadId);

  const triggerBounce = useCallback((setter: (v: boolean) => void) => {
    setter(true);
    window.setTimeout(() => setter(false), 300);
  }, []);

  const handleAddClick = useCallback(() => {
    if (soldOut || remaining <= 0) return;
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
