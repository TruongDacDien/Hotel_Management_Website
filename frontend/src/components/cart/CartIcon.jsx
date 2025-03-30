import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useCart } from "../../hooks/use-cart";

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="relative cursor-pointer"
        aria-label="Shopping cart"
      >
        <span>
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
              aria-live="polite"
            >
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </span>
      </Button>
    </Link>
  );
}
