import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import useLoad from './API/useLoad.js';
import ReviewCard from './entities/ReviewCard.jsx';
import MainPages from './MainPages.jsx';

function BookPage() {
  const { bookId } = useParams();
  const shouldLoad = !!bookId;
  const [books, , isLoadingBook] = shouldLoad
    ? useLoad('books', '*', [{ column: 'book_id', type: 'eq', value: bookId }])
    : null;
  const book = books?.[0] || null;
  const [bookAuthors] = useLoad('book_authors', 'author_id, authors (author_id, author_name)', [
    { column: 'book_id', type: 'eq', value: bookId },
  ]);

  const authors = useMemo(() => bookAuthors?.map((a) => a.authors) || [], [bookAuthors]);

  const [reviews] = useLoad(
    'reviews',
    `
      review_id,
      review_text,
      review_title,
      review_rating,
      review_date,
      users (user_name),
      books (title)
    `,
    [{ column: 'book_id', type: 'eq', value: bookId }],
  );

  if (isLoadingBook || !book) {
    return <div className='p-6 text-gray-700'>Loading book...</div>;
  }

  return (
    <MainPages>
      <main className='min-h-screen bg-indigo-50'>
        <div className='max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-10'>
          <div className='flex-1 space-y-8'>
            <div className='flex gap-4'>
              <img
                src={book.cover_url || '/default-book.png'}
                alt={book.title}
                className='w-28 h-40 object-cover rounded shadow'
              />

              <div className='flex flex-col justify-between'>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>{book.title}</h1>

                  <p className='text-gray-600 italic'>
                    {authors.length > 0 ? `by ${authors.map((a) => a.author_name).join(', ')}` : 'Unknown author'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className='font-semibold text-lg'>Synopsis</h2>
              <p className='text-gray-700 mt-1 whitespace-pre-line'>
                {book.description || 'No description available.'}
              </p>
            </div>

            <div className='flex gap-6 text-gray-700'>
              <div>
                <span className='font-semibold'>Publisher:</span> {book.publisher || 'Unknown'}
              </div>
              <div>
                <span className='font-semibold'>Published:</span> {book.publish_date || 'Unknown'}
              </div>
            </div>
          </div>

          <div
            className='h-px bg-gray-500 my-6 
                      lg:my-0 lg:w-px lg:h-auto lg:bg-gray-300'
          />

          <aside className='flex-1 space-y-6'>
            <h2 className='font-semibold text-lg mb-2'>Reviews</h2>

            {reviews?.length > 0 ? (
              <ReviewCard reviews={reviews} className='space-y-4' />
            ) : (
              <p className='text-gray-500'>No reviews yet.</p>
            )}
          </aside>
        </div>
      </main>
    </MainPages>
  );
}

export default BookPage;
