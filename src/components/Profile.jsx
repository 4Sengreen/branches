import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import { supabase } from '../supabase-client.js';
import useLoad from './API/useLoad.js';
import AvatarUploader from './entities/AvatarUploader.jsx';
import ReviewCard from './entities/ReviewCard.jsx';
import BookCard from './entities/BookCard.jsx';
import DOMPurify from 'dompurify';

function Profile({}) {
  //Initialisation ---------------------------------
  const navigate = useNavigate();
  const { loggedInUser, logout } = useAuth();
  //State ------------------------------------------
  const userId = loggedInUser?.auth?.id;

  const reviewFilters = useMemo(() => {
    return userId ? [{ column: 'user_id', value: userId }] : [];
  }, [userId]);

  const reviewColumns = useMemo(
    () => `
    review_id,
    review_text,
    review_date,
    review_rating,
    review_title,
    books ( title ),
    users ( user_name )
  `,
    [],
  );
  const [reviews, setReviews, isLoadingReviews] = useLoad('reviews', reviewColumns, reviewFilters);
  const [avatarUrl, setAvatarUrl] = useState(loggedInUser?.profile.avatar_url);

  const readingFilters = useMemo(() => {
    return loggedInUser?.profile.user_id
      ? [
          { column: 'user_id', type: 'eq', value: loggedInUser?.profile.user_id },
          { column: 'status', type: 'eq', value: 'reading' },
        ]
      : [];
  }, [loggedInUser?.profile.user_id]);

  const readingColumns = `
  id,
  status,
  books ( book_id, title )
`;

  const [readingNow, , isLoadingReading] = useLoad('user_books', readingColumns, readingFilters);

  const completedFilters = useMemo(() => {
    return loggedInUser?.profile.user_id
      ? [
          { column: 'user_id', type: 'eq', value: loggedInUser?.profile.user_id },
          { column: 'status', type: 'eq', value: 'completed' },
        ]
      : [];
  }, [loggedInUser?.profile.user_id]);

  const completedColumns = `
  id,
  status,
  books ( book_id, title )
`;

  const [completedBooks, , isLoadingCompleted] = useLoad('user_books', completedColumns, completedFilters);

  //Handlers ---------------------------------------
  useEffect(() => {
    if (!loggedInUser?.auth) navigate('/login');
  }, [loggedInUser]);

  if (!loggedInUser?.profile || !loggedInUser?.auth) {
    return <div className='p-6'>Loading profile…</div>;
  }

  if (!loggedInUser?.auth) return null;

  //View -------------------------------------------
  return (
    <main className='p-6 space-y-6'>
      <div className='flex justify-between'>
        <button onClick={() => navigate('/')} className='flex text-gray-700 text-lg'>
          <img src='arrow-back-basic.svg' alt='back' className='w-6 h-7 rounded-full pr-1' /> Back
        </button>
        <button onClick={() => navigate('/edit-profile')} className='text-blue-600 underline text-sm'>
          <img src='settings.svg' alt='Edit Profile' className='w-6 h-7 rounded-full pr-1' />
        </button>
      </div>

      <div className='flex flex-col items-center space-y-2'>
        {userId && <AvatarUploader userId={userId} currentAvatar={avatarUrl} onUpload={(url) => setAvatarUrl(url)} />}

        <h1 className='text-2xl font-bold'>{loggedInUser.profile.user_email}</h1>
        <span className='text-sm text-gray-500'>{loggedInUser.profile.user_name}</span>
        <button onClick={logout} className='mt-2 text-red-500 underline text-sm'>
          Log out
        </button>
      </div>

      <section>
        <h2 className='font-semibold'>Bio</h2>
        <div
          className='text-gray-500'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(loggedInUser.profile.bio?.trim() || 'Empty'),
          }}
        />
      </section>

      <section className='space-y-2'>
        <label className='text-gray-700 font-medium text-lg'>Reading Now</label>

        <div className='flex gap-4 overflow-x-auto py-2 scrollbar-hide'>
          {isLoadingReading && <p className='text-gray-500'>Loading…</p>}

          {!isLoadingReading && readingNow.length === 0 && <p className='text-gray-500'>Empty</p>}

          {!isLoadingReading &&
            readingNow.length > 0 &&
            readingNow.map((row) => (
              <div key={row.id} className='flex-none'>
                <BookCard book={row.books} className='max-w-[350px] w-full' />
              </div>
            ))}
        </div>
      </section>

      <section className='space-y-2'>
        <label className='text-gray-700 font-medium text-lg'>Completed</label>

        <div className='flex gap-4 overflow-x-auto py-2 scrollbar-hide'>
          {isLoadingCompleted && <p className='text-gray-500'>Loading…</p>}

          {!isLoadingCompleted && completedBooks.length === 0 && <p className='text-gray-500'>Empty</p>}

          {!isLoadingCompleted &&
            completedBooks.length > 0 &&
            completedBooks.map((row) => (
              <div key={row.id} className='flex-none'>
                <BookCard book={row.books} className='max-w-[350px] w-full' />
              </div>
            ))}
        </div>
      </section>

      <section>
        <h2 className='font-bold'>Recent Reviews</h2>

        {isLoadingReviews && <p className='text-gray-500'>Loading...</p>}
        {!isLoadingReviews && reviews.length === 0 && <p className='text-gray-500'>No reviews yet</p>}

        <div className='flex flex-col gap-4'>
          {reviews.length > 3 && (
            <button onClick={() => navigate('/reviews')} className='text-blue-600 underline text-sm mt-2 self-start'>
              See all reviews
            </button>
          )}

          {!isLoadingReviews && reviews.length > 0 && (
            <ReviewCard reviews={reviews.slice(0, 3)} className='grid grid-cols-1 gap-4' />
          )}
        </div>
      </section>
    </main>
  );
}
export default Profile;
