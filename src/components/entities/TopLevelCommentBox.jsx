import { useState } from 'react';
import API from '../API/API.js';

function TopLevelCommentBox({ reviewId, book_id, loggedInUser, onCommentPosted }) {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) return;

    const response = await API.post('conversations', {
      review_id: reviewId,
      book_id: book_id,
      parent_conversation_id: null,
      conversation_text: text,
      user_id: loggedInUser?.profile.user_id,
    });

    if (!response.isSuccess) {
      console.error('Failed to post comment');
      return;
    }

    setText('');
    if (onCommentPosted) onCommentPosted();
  };

  return (
    <div className='bg-white p-4 rounded-xl shadow-sm space-y-2'>
      <input
        type='text'
        className='w-full p-2 border rounded'
        placeholder='Write a comment...'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className='px-4 py-2 bg-indigo-600 text-white rounded' onClick={handleSubmit}>
        Post Comment
      </button>
    </div>
  );
}

export default TopLevelCommentBox;
