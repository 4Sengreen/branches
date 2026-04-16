import useLoad from './API/useLoad.js';
import ReviewCard from './entities/ReviewCard.jsx';
import MainPages from './MainPages.jsx';

function HomePage() {
  //Initialisation ---------------------------------
  //State ------------------------------------------
  const [reviews] = useLoad('reviews', `*,books (*),users (user_id,user_name)`);

  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <MainPages>
      <main className='min-h-screen bg-indigo-50 py-10'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Recent Reviews</h2>

          <ReviewCard reviews={reviews} className='space-y-4 md:hidden' />

          <ReviewCard reviews={reviews} className='hidden md:grid md:grid-cols-3 md:gap-6' />
        </div>
      </main>
    </MainPages>
  );
}

export default HomePage;
