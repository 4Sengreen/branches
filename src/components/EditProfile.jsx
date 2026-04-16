import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '../supabase-client.js';
import { useAuth } from './auth/useAuth.jsx';
import useLoad from './API/useLoad.js';
import BookCard from './entities/BookCard.jsx';

function EditBooksPage() {
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useAuth();
  const userId = loggedInUser?.profile.user_id;

  const [bio, setBio] = useState('');

  const [bookTitle, setBookTitle] = useState('');
  const [debouncedTitle, setDebouncedTitle] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState('reading');

  const [results] = useLoad(
    'books',
    '*',
    debouncedTitle.length >= 2 ? [{ type: 'ilike', column: 'title', value: debouncedTitle }] : [],
  );

  const [readingNow, setReadingNow] = useState([]);
  const [completed, setCompleted] = useState([]);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('users').select('bio').eq('user_id', userId).single();

      if (data?.bio) setBio(data.bio);

      const { data: books } = await supabase.from('user_books').select('status, books(*)').eq('user_id', userId);

      if (books) {
        setReadingNow(books.filter((b) => b.status === 'reading').map((b) => b.books));
        setCompleted(books.filter((b) => b.status === 'completed').map((b) => b.books));
      }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTitle(bookTitle), 400);
    return () => clearTimeout(t);
  }, [bookTitle]);

  const addBook = async () => {
    if (!selectedBookId) return alert('Select a book first');

    await supabase.from('user_books').insert({
      user_id: userId,
      book_id: selectedBookId,
      status: selectedStatus,
    });

    const addedBook = results.find((b) => b.book_id === selectedBookId);
    if (!addedBook) return;

    if (selectedStatus === 'reading') {
      setReadingNow((prev) => [...prev, addedBook]);
    } else {
      setCompleted((prev) => [...prev, addedBook]);
    }

    setBookTitle('');
    setSelectedBookId(null);
    setDebouncedTitle('');
  };

  const saveAll = async () => {
    await supabase.from('users').update({ bio }).eq('user_id', userId);

    setLoggedInUser({
      ...loggedInUser,
      profile: {
        ...loggedInUser?.profile,
        bio,
      },
    });

    navigate('/profile');
  };

  useEffect(() => {
    if (!loggedInUser?.profile) {
      navigate('/profile');
    }
  }, [loggedInUser]);

  return (
    <main className='h-full bg-white p-4 space-y-6'>
      <button onClick={() => navigate('/profile')} className='flex text-gray-700 text-lg'>
        <img src='/arrow-back-basic.svg' className='w-6 h-7 pr-1' />
        Back
      </button>

      <h1 className='text-2xl font-bold text-gray-800'>Edit Profile</h1>

      <div className='flex flex-col space-y-1'>
        <label className='text-gray-700 font-medium'>Bio</label>
        <span className='text-gray-500 text-sm'>Write something about yourself</span>

        <ReactQuill theme='snow' value={bio} onChange={setBio} modules={modules} />
      </div>

      <section className='space-y-2'>
        <label className='text-gray-700 font-medium text-lg'>Reading Now</label>

        <div className='flex gap-4 overflow-x-auto py-2 scrollbar-hide'>
          {readingNow.map((book) => (
            <div key={book.book_id} className='flex-none'>
              <BookCard book={book} className='max-w-[350px] w-full' />
            </div>
          ))}
        </div>
      </section>

      <section className='space-y-2'>
        <label className='text-gray-700 font-medium text-lg'>Completed</label>

        <div className='flex gap-4 overflow-x-auto py-2 scrollbar-hide'>
          {completed.map((book) => (
            <div key={book.book_id} className='flex-none'>
              <BookCard book={book} className='max-w-[350px] w-full' />
            </div>
          ))}
        </div>
      </section>

      <div className='space-y-6 pt-4'>
        <div className='flex flex-col space-y-1'>
          <label className='text-gray-700 font-medium'>Book Title</label>
          <span className='text-gray-500 text-sm'>Search for an existing book</span>

          <div className='relative'>
            <input
              className='p-3 border rounded-lg w-full'
              placeholder='Enter Book Title...'
              value={bookTitle}
              onChange={(e) => {
                setBookTitle(e.target.value);
                setSelectedBookId(null);
              }}
            />

            {!selectedBookId && debouncedTitle.length >= 2 && (
              <div className='absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-10'>
                {results.map((book) => (
                  <button
                    key={book.book_id}
                    className='w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg'
                    onClick={() => {
                      setBookTitle(book.title);
                      setSelectedBookId(book.book_id);
                    }}
                  >
                    {book.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-gray-700 font-medium'>Add To</label>
          <select
            className='p-3 border rounded-lg'
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value='reading'>Reading Now</option>
            <option value='completed'>Completed</option>
          </select>
        </div>

        <button onClick={addBook} className='w-full bg-indigo-600 text-white p-3 rounded-lg text-lg font-medium'>
          Add Book
        </button>
      </div>

      <button onClick={saveAll} className='w-full bg-indigo-600 text-white p-3 rounded-lg text-lg font-medium'>
        Save
      </button>
    </main>
  );
}

export default EditBooksPage;
