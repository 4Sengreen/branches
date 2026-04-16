import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Rating from './UI/Stars.jsx';
import DOMPurify from 'dompurify';
import CommentThread from './CommentThread.jsx';
import MainPages from './MainPages.jsx';
import { useAuth } from './auth/useAuth.jsx';
import supabase from '../supabase-client.js';
import TopLevelCommentBox from './entities/TopLevelCommentBox.jsx';

function ReviewPage() {
  const { reviewId } = useParams();
  const { loggedInUser } = useAuth();

  const [review, setReview] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [loadingReview, setLoadingReview] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    if (!reviewId) return;

    const loadReview = async () => {
      setLoadingReview(true);

      const { data, error } = await supabase
        .from('reviews')
        .select(
          `
          review_id,
          review_text,
          review_rating,
          review_date,
          review_title,
          book_id,
          books(title, cover_url),
          users(user_name, avatar_url)
        `,
        )
        .eq('review_id', Number(reviewId));

      if (!error && data?.length > 0) {
        const correct = data.find((r) => r.review_id === Number(reviewId));
        setReview(correct || null);
      } else {
        setReview(null);
      }

      setLoadingReview(false);
    };

    loadReview();
  }, [reviewId]);

  const reloadComments = async () => {
    const { data } = await supabase
      .from('conversations')
      .select(
        `
      conversation_id,
      parent_conversation_id,
      review_id,
      user_id,
      conversation_text,
      conversation_date,
      users(user_name, avatar_url)
    `,
      )
      .eq('review_id', Number(reviewId));

    setConversations(data || []);
  };

  useEffect(() => {
    if (!reviewId) return;

    setLoadingComments(true);

    reloadComments().then(() => {
      setLoadingComments(false);
    });
  }, [reviewId]);

  if (loadingReview) return <div className='p-6'>Loading...</div>;
  if (!review) return <div className='p-6'>Review not found.</div>;

  const rootReplies = conversations.filter((c) => c.parent_conversation_id === null);
  const getChildren = (parentId) => conversations.filter((c) => c.parent_conversation_id === parentId);

  const bookCover = review.books?.cover_url || '/default-book.png';
  const userName = review.users?.user_name || 'Anonymous';
  const bookTitle = review.books?.title || 'Untitled Book';

  return (
    <MainPages>
      <main className='min-h-screen bg-indigo-50'>
        <div className='max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-6'>
          <div className='flex-1 space-y-6'>
            <div className='flex gap-4'>
              <img src={bookCover} className='w-28 h-40 object-cover rounded-lg shadow-lg' />

              <div>
                <h2 className='text-2xl font-semibold'>{bookTitle}</h2>
                <div className='flex border bg-blue-200 rounded shadow-lg'>
                  {review.users?.avatar_url ? (
                    <img src={review.users.avatar_url} className='w-7 h-7 ' />
                  ) : (
                    <div className='w-7 h-7 bg-gray-200' />
                  )}
                  <p className='pl-1 text-gray-600'>@{userName}</p>
                </div>
                <p className='pt-2 text-gray-500 text-sm'>{new Date(review.review_date).toLocaleString()}</p>
                <div className='pt-2'></div>
                <Rating rating={review.review_rating || 0} uid={review.review_id} />
              </div>
            </div>

            <h3 className='text-xl font-semibold'>{review.review_title || `Review #${review.review_id}`}</h3>

            <article
              className='prose'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(review.review_text || ''),
              }}
            />
          </div>
          <div className='h-px bg-gray-500 my-6 lg:my-0 lg:w-px lg:h-auto lg:bg-gray-300' />
          <aside className='flex-1 space-y-6'>
            {loadingComments ? (
              <p>Loading comments...</p>
            ) : rootReplies.length > 0 ? (
              rootReplies.map((reply) => (
                <CommentThread
                  key={reply.conversation_id}
                  comment={reply}
                  getChildren={getChildren}
                  reviewId={review.review_id}
                  book_id={review.book_id}
                  loggedInUser={loggedInUser}
                  onCommentPosted={reloadComments}
                />
              ))
            ) : (
              <>
                <p className='text-gray-500'>No comments yet.</p>
              </>
            )}
            <div className='mb-4'>
              <TopLevelCommentBox
                reviewId={review.review_id}
                book_id={review.book_id}
                loggedInUser={loggedInUser}
                onCommentPosted={reloadComments}
              />
            </div>
          </aside>
        </div>
      </main>
    </MainPages>
  );
}

export default ReviewPage;
