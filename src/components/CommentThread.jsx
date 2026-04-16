import { useState } from 'react';
import API from './API/API.js';

function CommentThread({ comment, getChildren, reviewId, book_id, loggedInUser, onCommentPosted }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const children = getChildren(comment.conversation_id);
  const isOwner = comment.user_id === loggedInUser?.profile?.user_id;
  const handleReply = async () => {
    if (!replyText.trim()) return;

    const response = await API.post('conversations', {
      review_id: reviewId,
      book_id: book_id,
      parent_conversation_id: comment.conversation_id,
      conversation_text: replyText,
      user_id: loggedInUser?.profile.user_id,
    });

    if (!response.isSuccess) {
      console.error('Failed to post comment');
      return;
    }

    setReplyText('');
    setShowReplyBox(false);
    onCommentPosted?.();
  };

  return (
    <div className='space-y-4'>
      <div
        className={`shadow-sm rounded-xl p-4 flex gap-4 border-l-2 ${
          comment.parent_conversation_id ? 'ml-6 lg:ml-12 border-gray-300' : 'border-transparent'
        } ${isOwner ? 'bg-blue-50' : 'bg-white'}
`}
      >
        {comment.users?.avatar_url ? (
          <img src={comment.users.avatar_url} className='w-10 h-10 rounded-full' alt='' />
        ) : (
          <div className='w-10 h-10 rounded-full bg-gray-200' />
        )}

        <div className='flex-1'>
          <div className='flex justify-between'>
            <p className='font-semibold text-gray-900'>{comment.users?.user_name}</p>
            <p className='text-gray-400 text-xs'>{new Date(comment.conversation_date).toLocaleString()}</p>
          </div>
          <p className='text-gray-700 mt-1'>{comment.conversation_text}</p>

          <button className='text-sm text-indigo-600 mt-2' onClick={() => setShowReplyBox(!showReplyBox)}>
            Reply
          </button>

          {showReplyBox && (
            <div className='mt-2 flex gap-2'>
              <input
                type='text'
                className='flex-1 p-2 border rounded'
                placeholder='Write a reply...'
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button className='px-4 py-2 bg-indigo-600 text-white rounded' onClick={handleReply}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='space-y-4 ml-6 lg:ml-12'>
        {children.map((child) => (
          <CommentThread
            key={child.conversation_id}
            comment={child}
            getChildren={getChildren}
            reviewId={reviewId}
            book_id={book_id}
            loggedInUser={loggedInUser}
            onCommentPosted={onCommentPosted}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentThread;
