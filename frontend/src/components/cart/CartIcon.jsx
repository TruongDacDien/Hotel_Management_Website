import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useCart } from "../../hooks/use-cart";

export function CartIcon() {
  const { items, totalItems } = useCart();

  return (
    <Link to="/cart">
      <div className="relative inline-block">
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </div>
    </Link>
  );
}
