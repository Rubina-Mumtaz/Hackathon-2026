import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, readOnly = false, size = 20 }) {
  const handleClick = (nextValue) => {
    if (!readOnly && onChange) {
      onChange(nextValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={readOnly}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-110`}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
            />
          </button>
        );
      })}
    </div>
  );
}
