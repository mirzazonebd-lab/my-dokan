import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export default function StarRating({
  rating,
  size = 14,
  showCount = false,
  count,
}: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-200 fill-gray-200'
            }
          />
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-gray-400 ml-0.5">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
