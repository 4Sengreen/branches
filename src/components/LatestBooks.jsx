import { useNavigate } from 'react-router-dom';
import useLoad from './API/useLoad.js';
import BookCard from './entities/BookCard.jsx';
import MainPages from './MainPages.jsx';

function LatestBooks() {
  const navigate = useNavigate();

  const [books, , isLoadingBooks] = useLoad('books', '*', [], {
    orderBy: { column: 'created_at', ascending: false },
    limit: 12,
  });

  if (isLoadingBooks) {
    return <p className='text-center text-gray-500 mt-10'>Loading your latest books…</p>;
  }

  return (
    <MainPages>
      <div className='px-6 py-8'>
        <h1 className='text-3xl font-serif font-bold text-gray-900 mb-6'>Latest Books</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {books?.map((book) => (
            <BookCard key={book.book_id} book={book} className='cursor-pointer' />
          ))}
        </div>
      </div>
    </MainPages>
  );
}

export default LatestBooks;
