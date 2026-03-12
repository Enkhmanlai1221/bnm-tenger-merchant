import { IconStarFilled, IconStarHalfFilled } from "@tabler/icons-react";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({
  rating,
  className,
}: StarRatingProps): JSX.Element {
  const stars: JSX.Element[] = [];
  const fullStars: number = Math.floor(rating);
  const hasHalfStar: boolean = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <IconStarFilled key={`full-${i}`} className="text-yellow-400 w-4 h-4" />,
    );
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <IconStarHalfFilled key="half" className="text-yellow-400 w-4 h-4" />,
    );
  }

  // Add empty stars
  const emptyStars: number = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <IconStarFilled
        key={`empty-${i}`}
        className="text-white stroke-gray-300 w-4 h-4"
      />,
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>{stars}</div>
  );
}
