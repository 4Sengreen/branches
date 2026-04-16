import { useNavigate } from 'react-router-dom';
import useLoad from '../API/useLoad.js';

function BookCard({ book, className }) {
  const navigation = useNavigate();
  const initialAuthors = book.authors || [];
  const shouldLoadAuthors = !!book?.book_id;

  const [loadedAuthors, , isLoadingAuthors] = shouldLoadAuthors
    ? useLoad('book_authors', `author_id, authors (author_id, author_name)`, [
        { column: 'book_id', type: 'eq', value: book.book_id },
      ])
    : [[], null, false];

  const authors = initialAuthors.length > 0 ? initialAuthors : loadedAuthors.map((a) => a.authors);

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition flex gap-4 ${className}`}>
      <img
        src={book.cover_url || '/default-book.png'}
        alt={book.title}
        className='w-16 h-24 object-cover rounded-md shadow'
      />

      <div className='flex flex-col'>
        <h2 className='text-lg font-serif font-semibold text-gray-900 break-words'>{book.title}</h2>

        <p className='text-sm text-gray-600 italic mb-2'>
          {authors.length > 0 ? `by ${authors.map((a) => a.author_name || a.name).join(', ')}` : 'Unknown author'}
        </p>

        {book.description && <p className='text-sm text-gray-600 line-clamp-3'>{book.description}</p>}

        <button
          className='mt-auto text-indigo-600 font-medium flex items-center'
          onClick={() => navigation(`/books/${book.book_id}`)}
        >
          View Book
          <svg
            viewBox='0 0 64 64'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            stroke='currentColor'
            className='w-6 h-6 ml-1 stroke-2'
          >
            <polyline points='44 40 52 32 44 24' />
            <line x1='52' y1='32' x2='12' y2='32' />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default BookCard;
