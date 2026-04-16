import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase-client.js';
import MainPages from './MainPages.jsx';
import BookCard from './entities/BookCard.jsx';
import AuthorCard from './entities/AuthorCard.jsx';
import ReviewCard from './entities/ReviewCard.jsx';

function SearchPage({}) {
  //Initialisation ---------------------------------
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const cat = params.get('cat') || 'all';

  const page = parseInt(params.get('page') || '1', 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  //State ------------------------------------------
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  //Handlers ---------------------------------------
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);

      const { data, error } = await supabase.rpc('search_all', {
        search_query: q,
        search_category: cat,
        limit_count: limit,
        offset_count: offset,
      });

      if (error) console.error(error);
      else setResults(data);

      setLoading(false);
    }

    fetchResults();
  }, [q, cat, page]);

  const nextPage = `/search?q=${encodeURIComponent(q)}&cat=${cat}&page=${page + 1}`;
  const prevPage = `/search?q=${encodeURIComponent(q)}&cat=${cat}&page=${page - 1}`;

  //View -------------------------------------------
  return (
    <MainPages>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-semibold mb-4'>
          Results for <span className='text-green-600'>{q}</span> in <span className='text-green-600'>{cat}</span>
        </h1>

        {loading && <p>Loading…</p>}
        {!loading && results.length === 0 && <p>No results found.</p>}

        <div className='space-y-4'>
          {results.map((item) => {
            if (item.type === 'review') {
              return <ReviewCard key={`review-${item.id}`} reviews={[item.review]} className='space-y-4' />;
            }

            if (item.type === 'book') {
              return <BookCard key={`book-${item.id}`} book={item} />;
            }

            if (item.type === 'author') {
              return <AuthorCard key={`author-${item.id}`} author={item} />;
            }

            return (
              <div key={`${item.type}-${item.id}`} className='p-4 border rounded-lg bg-white shadow-sm'>
                <p className='text-xs uppercase text-gray-500'>{item.type}</p>
                <h2 className='text-lg font-medium'>{item.title}</h2>
              </div>
            );
          })}
        </div>

        <div className='flex justify-between mt-8'>
          {page > 1 ? (
            <a href={prevPage} className='px-4 py-2 bg-gray-200 rounded'>
              Previous
            </a>
          ) : (
            <div />
          )}

          {results.length === limit && (
            <a href={nextPage} className='px-4 py-2 bg-gray-200 rounded'>
              Next
            </a>
          )}
        </div>
      </div>
    </MainPages>
  );
}
export default SearchPage;
