import { Star } from "lucide-react";

interface StarsProps {
  rating: number; // 1-5
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Stars({
  rating,
  editable = false,
  onRatingChange,
  size = "md",
  className = "",
}: StarsProps) {
  // Calculate the star size based on the size prop
  const getStarSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "md":
        return 20;
      case "lg":
        return 24;
      default:
        return 20;
    }
  };

  // Calculate star color - filled or outline
  const getStarFill = (starPosition: number) => {
    return starPosition <= rating ? "text-yellow-500 fill-yellow-500" : "text-yellow-500";
  };

  // Handle click on a star (for editable mode)
  const handleStarClick = (starPosition: number) => {
    if (editable && onRatingChange) {
      onRatingChange(starPosition);
    }
  };

  // Handle mouse enter on a star (for editable mode with hover effect)
  const handleStarHover = (starPosition: number) => {
    if (editable && onRatingChange) {
      onRatingChange(starPosition);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((starPosition) => (
        <Star
          key={starPosition}
          size={getStarSize()}
          className={`${getStarFill(starPosition)} ${
            editable ? "cursor-pointer transition-all duration-100 hover:scale-110" : ""
          } mr-1`}
          onClick={() => handleStarClick(starPosition)}
          onMouseEnter={() => handleStarHover(starPosition)}
        />
      ))}
    </div>
  );
}