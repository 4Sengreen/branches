import useLoad from './API/useLoad.js';
import { useAuth } from './auth/useAuth.jsx';

function AllReviews({}) {
  //Initialisation ---------------------------------
  const { loggedInUser } = useAuth();
  const userId = loggedInUser?.auth?.id;
  //State ------------------------------------------
  const [reviews] = useLoad(
    'reviews',
    `
      review_id,
      review_text,
      review_date,
      books ( title )
    `,
    [{ column: 'user_id', value: userId }],
  );
  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>All Reviews</h1>

      <ul className='space-y-3'>
        {reviews.map((review) => (
          <li key={review.id}>
            <h2 className='pr-5 font-semibold'>{review.books?.title}</h2>: {review.review_text}
          </li>
        ))}
      </ul>
    </main>
  );
}
export default AllReviews;
