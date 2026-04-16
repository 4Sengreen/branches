import { useId } from 'react';

function Star({ value, index, gradId }) {
  const isFull = value >= index + 1;
  const isHalf = value >= index + 0.5 && value < index + 1;

  return (
    <svg viewBox='0 0 24 24' className='w-5 h-5 text-yellow-400'>
      {isHalf ? (
        <path
          fill={`url(#${gradId})`}
          d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
             9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
        />
      ) : (
        <path
          fill={isFull ? '#facc15' : 'none'}
          stroke='#facc15'
          d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
             9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
        />
      )}
    </svg>
  );
}

export default function Rating({ rating }) {
  const id = useId();

  return (
    <div className='flex gap-1'>
      <svg width='0' height='0' className='absolute'>
        <defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <linearGradient key={i} id={`half-${id}-${i}`} gradientUnits='objectBoundingBox'>
              <stop offset='0%' stopColor='#facc15' />
              <stop offset='50%' stopColor='#facc15' />
              <stop offset='50%' stopColor='#d1d5db' />
              <stop offset='100%' stopColor='#d1d5db' />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} value={rating} index={i} gradId={`half-${id}-${i}`} />
      ))}
    </div>
  );
}
