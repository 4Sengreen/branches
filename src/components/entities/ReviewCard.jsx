import DOMPurify from 'dompurify';
import Rating from '../UI/Stars.jsx';
import { useNavigate } from 'react-router-dom';
function ReviewCard({ reviews, className }) {
  //Initialisation ---------------------------------
  const navigate = useNavigate();
  //State ------------------------------------------
  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <div className={className}>
      {reviews.map((review) => (
        <div
          key={review.review_id}
          className='bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col'
        >
          <div className='flex justify-between items-center mb-2'>
            <p className='text-sm text-gray-500'>@{review.users.user_name}</p>

            <Rating rating={review.review_rating} uid={review.review_id} />
          </div>

          <h2 className='text-lg font-serif font-semibold text-gray-900 mb-1'>Book: {review.books.title}</h2>

          {review.review_title && <h3 className='text-sm font-medium text-gray-700 mb-2'>{review.review_title}</h3>}

          <div
            className='text-sm text-gray-600 line-clamp-3 mb-4'
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(review.review_text),
            }}
          />

          <div className='flex justify-between items-center mt-auto'>
            <p className='text-xs text-gray-400'>ID: {review.review_id}</p>

            <button
              onClick={() => navigate(`/review-page/${review.review_id}`)}
              className='flex mt-3 text-indigo-600 font-medium'
            >
              Read Full Review
              <svg
                viewBox='0 0 64 64'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                stroke='currentColor'
                className='w-8 h-8 text-indigo-600 stroke-2'
              >
                <polyline points='44 40 52 32 44 24' />
                <line x1='52' y1='32' x2='12' y2='32' />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default ReviewCard;
