import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ isOpen, onPress }) {
  //Initialisation ---------------------------------
  const navigate = useNavigate();
  //State ------------------------------------------
  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <aside
      className={`fixed h-screen right-0 w-64 z-50 bg-white shadow-lg transform transition-transform duration-300 md:hidden
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <nav className='h-full bg-white border-l shadow-sm'>
        <div className='flex items-center gap-3 mx-4'>
          <button
            className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 mr-5 mt-4'
            onClick={onPress}
          >
            <ArrowLeft className='w-10 h-10' />
          </button>
          <div className='flex flex-col items-center gap-1'>
            <button onClick={() => navigate('/profile')}>
              <img src='/profile-circle.svg' alt='profile' className='w-16 h-16 rounded-full mt-2' />
            </button>
            <h4 className='font-semibold text-lg'>Username</h4>
          </div>
        </div>
        <div className='border-t mt-4'></div>
        <div className='flex flex-col justify-between gap-5 p-5'>
          <button onClick={() => navigate('/latest-books')}>
            <a className='text-gray text-lg hover:text-white'>Latest Books</a>
          </button>
          <button onClick={() => navigate('/edit-profile')}>
            <a className='text-gray hover:text-white text-lg'>Reading List</a>
          </button>
          <button onClick={() => navigate('/')}>
            <a className='text-gray hover:text-white text-lg'>Reviews By Date</a>
          </button>
          <button onClick={() => navigate('/')}>
            <a className='text-gray hover:text-white text-lg'>Most Discussed Books</a>
          </button>
          <a href='Support' className='text-gray hover:text-white text-lg'>
            Support
          </a>
        </div>
      </nav>
    </aside>
  );
}
export default Sidebar;
