import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase-client.js';

function Navbar({ isOpen, setIsOpen }) {
  //Initialisation ---------------------------------
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  //State ------------------------------------------
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [previewResults, setPreviewResults] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  //Handler ----------------------------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() !== '') {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        setLoadingPreview(true);

        const { data, error } = await supabase.rpc('search_all', {
          search_query: query,
          search_category: category,
          limit_count: 6,
          offset_count: 0,
        });

        if (!error) {
          setPreviewResults(data);
          setShowDropdown(true);
        }

        setLoadingPreview(false);
      }, 300);
    }
  }, [category]);

  useEffect(() => {
    if (query.trim() === '') {
      setPreviewResults([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoadingPreview(true);

      const { data, error } = await supabase.rpc('search_all', {
        search_query: query,
        search_category: category,
        limit_count: 6,
        offset_count: 0,
      });

      if (!error) {
        setPreviewResults(data);
        setShowDropdown(true);
      }

      setLoadingPreview(false);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, category]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(query)}&cat=${category}&page=1`);
      setShowDropdown(false);
    }
  };
  const handleSelect = (item) => {
    navigate(`/search?q=${encodeURIComponent(item.title)}&cat=${category}&page=1`);
    setShowDropdown(false);
  };

  //View -------------------------------------------
  return (
    <nav className='w-full transition-all duration-300 bg-green-100/20 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='relative flex justify-between items-center h-14 sm:h-16 md:h-20'>
          <button onClick={() => navigate('/')}>
            <div className='flex-1 flex justify-left items-center px-3 space-x-1 group cursor-pointer'>
              <div>
                <img src='/simple-branch.svg' alt='branches' className='w-6 h-6 sm:w-8 sm:h-8' />
              </div>
              <span className='text-lg sm:text-xl md:text-2xl font-medium'>
                <span>Branches</span>
              </span>
            </div>
          </button>
          <div className='hidden md:flex items-center space-x-7 lg:space-x-8 lg:pl-5'>
            <button onClick={() => navigate('/latest-books')}>
              <a className='text-gray text-sm hover:text-white'>Latest Books</a>
            </button>
            <button onClick={() => navigate('/edit-profile')}>
              <a className='text-gray hover:text-white text-sm'>Reading List</a>
            </button>
            <button onClick={() => navigate('/')}>
              <a className='text-gray hover:text-white text-sm'>Reviews By Date</a>
            </button>
            <button onClick={() => navigate('/')}>
              <a className='text-gray hover:text-white text-sm'>Most Discussed Books</a>
            </button>
            <button onClick={() => navigate('/')}>
              <a className='text-gray hover:text-white text-sm'>Support</a>
            </button>
            <button onClick={() => navigate('/profile')}>
              <img src='/profile-circle.svg' alt='profile' className='w-8 h-8 rounded-full' />
            </button>
          </div>
          <button className='md:hidden text-2xl cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
            <Menu className='w-5 h-5 sm:2-6 sm:h-6' />
          </button>
        </div>
        <div className='flex justify-center mb-4 sm:mb-2 relative'>
          <div className='flex flex-1 items-center pl-3 pr-2 py-2 max-w-2md rounded-full bg-gray-100 relative shadow-sm'>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='bg-gray-200/80 text-sm px-3 py-1 rounded-l-full border-none focus:outline-none appearance-none'
            >
              <option value='all'>All</option>
              <option value='books'>Books</option>
              <option value='reviews'>Reviews</option>
              <option value='authors'>Authors</option>
            </select>
            <img src='/search.svg' className='w-6 h-6 sm:w-8 sm:h-8 mx-2' />
            <input
              ref={inputRef}
              type='text'
              placeholder='Search…'
              className='flex-1 text-sm bg-gray-100 focus:outline-none rounded-r-full px-2 py-1'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() !== '' && setShowDropdown(true)}
              onKeyDown={handleSearch}
            />
          </div>

          {showDropdown && previewResults.length > 0 && (
            <div
              ref={dropdownRef}
              className='absolute top-full mt-2 w-full max-w-2md bg-white shadow-lg rounded-lg z-50 p-2'
            >
              {previewResults.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className='p-2 hover:bg-gray-100 cursor-pointer rounded'
                  onClick={() => handleSelect(item)}
                >
                  <p className='text-xs uppercase text-gray-500'>{item.type}</p>
                  <p className='text-sm font-medium'>{item.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
