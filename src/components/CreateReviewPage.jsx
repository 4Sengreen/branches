import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import API from './API/API';
import useLoad from './API/useLoad.js';
import { useAuth } from './auth/useAuth.jsx';

function CreateReviewPage() {
  //Initialisation ---------------------------------
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

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

    clipboard: {
      matchVisual: false,
    },

    history: {
      delay: 1000,
      maxStack: 500,
      userOnly: true,
    },
  };

  const makeTempId = () => 'temp_' + crypto.randomUUID();
  //State ------------------------------------------
  const [rating, setRating] = useState(0);
  const [mainText, setMainText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');

  const [bookTitle, setBookTitle] = useState('');
  const [debouncedTitle, setDebouncedTitle] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);

  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookAuthor, setNewBookAuthor] = useState('');

  const [results, setResults] = useLoad(
    'books',
    '*',
    debouncedTitle && debouncedTitle.length >= 2
      ? [
          {
            type: 'ilike',
            column: 'title',
            value: debouncedTitle,
          },
        ]
      : [],
  );
  //Handlers ---------------------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedTitle(bookTitle);
    }, 500);
    return () => clearTimeout(timeout);
  }, [bookTitle]);

  const handleAddBook = async () => {
    if (!newBookAuthor.trim()) {
      alert('Please enter an author name');
      return;
    }
    const payload = {
      p_title: bookTitle,
      p_external_id: makeTempId(),
      p_authors: [
        {
          author_name: newBookAuthor,
          external_id: makeTempId(),
        },
      ],
    };

    const res = await API.rpc('create_book_with_authors', payload);

    if (!res.isSuccess) {
      alert('Failed to create book');
      return;
    }

    const newBookId = res.data.book_id;
    setSelectedBookId(newBookId);
    setShowAddBookModal(false);

    setBookTitle('');
    setDebouncedTitle('');
    setResults([]);
    setNewBookAuthor('');
  };

  const handleSubmit = async () => {
    if (!selectedBookId) {
      alert('Please select a book from the list');
      return;
    }
    if (!mainText.trim()) {
      alert('Please write a review');
      return;
    }
    const payload = {
      user_id: loggedInUser.profile.user_id,
      book_id: selectedBookId,
      review_text: mainText,
      review_rating: rating,
      review_title: reviewTitle || null,
    };
    const response = await API.post('reviews', payload);

    if (response.isSuccess) {
      navigate('/');
    } else {
      alert('Failed to post review');
    }
  };

  //View -------------------------------------------
  return (
    <main className='h-full bg-white p-4 space-y-6'>
      <button onClick={() => navigate('/')} className='flex text-gray-700 text-lg'>
        <img src='arrow-back-basic.svg' alt='back' className='w-6 h-7 rounded-full pr-1' /> Back
      </button>

      <div className='flex flex-col space-y-1'>
        <label className='text-gray-700 font-medium'>Review Title</label>
        <input
          className='p-3 border rounded-lg'
          placeholder='Enter Title...'
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
        />
      </div>

      <div className='flex flex-col space-y-1'>
        <label className='text-gray-700 font-medium'>Book Title</label>
        <span className='text-gray-500 text-sm'>Enter name of the book</span>
        <div className='relative'>
          <input
            className='p-3 border rounded-lg w-full'
            placeholder='Enter Book Title...'
            value={bookTitle}
            onChange={(e) => {
              const value = e.target.value;
              setBookTitle(value);

              if (selectedBookId && value !== bookTitle) {
                setSelectedBookId(null);
              }
            }}
          />

          {!selectedBookId && debouncedTitle.length >= 2 && (
            <div className='absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-10'>
              {results.length > 0 &&
                results.map((book) => (
                  <button
                    key={book.book_id ?? book.id}
                    className='w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg'
                    onClick={() => {
                      setBookTitle(book.title);
                      setSelectedBookId(book.book_id ?? book.id);
                      setResults([]);
                    }}
                  >
                    {book.title}
                  </button>
                ))}

              <button
                className='w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg'
                onClick={() => setShowAddBookModal(true)}
              >
                <div className='flex'>
                  <img src='/plus.svg' className='w-6 h-6 mx-2' />
                  Add “{debouncedTitle}”
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col space-y-1'>
        <label className='text-gray-700 font-medium'>Rating:</label>

        <div className='flex flex-col space-y-1'>
          <input
            type='range'
            min='0'
            max='5'
            step='0.1'
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            className='w-full'
          />

          <span className='text-gray-600 text-lg'>{rating.toFixed(1)} / 5</span>
        </div>
      </div>

      <div className='flex flex-col space-y-1'>
        <label className='text-gray-700 font-medium'>Main Text</label>

        <ReactQuill theme='snow' value={mainText} onChange={setMainText} modules={modules} className='bg-white' />
      </div>

      <div className='flex flex-col space-y-1'>
        <label className='text-gray-700 font-medium'>Tags</label>
        <span className='text-gray-500 text-sm'>Add Tags (optional)</span>
        <input className='p-3 border rounded-lg' placeholder='Enter Tags...' />
      </div>

      <button className='w-full bg-indigo-600 text-white p-3 rounded-lg text-lg font-medium' onClick={handleSubmit}>
        Post
      </button>
      {showAddBookModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20'>
          <div className='bg-white p-6 rounded-lg w-96 space-y-4'>
            <h2 className='text-xl font-semibold'>Add New Book</h2>

            <div>
              <label className='text-gray-700'>Title</label>
              <input className='p-2 border rounded-lg w-full' value={bookTitle} readOnly />
            </div>

            <div>
              <label className='text-gray-700'>Author</label>
              <input
                className='p-2 border rounded-lg w-full'
                placeholder='Enter author...'
                value={newBookAuthor}
                onChange={(e) => setNewBookAuthor(e.target.value)}
              />
            </div>

            <div className='flex justify-end space-x-3'>
              <button className='px-4 py-2 bg-gray-300 rounded-lg' onClick={() => setShowAddBookModal(false)}>
                Cancel
              </button>
              <button className='px-4 py-2 bg-indigo-600 text-white rounded-lg' onClick={handleAddBook}>
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CreateReviewPage;
