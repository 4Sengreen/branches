import { useState } from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Sidebar from './Sidebar.jsx';
import FloatingReviewButton from './FloatingReviewButton.jsx';

function MainPages({ children }) {
  //Initialisation ---------------------------------
  //State ------------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <div className='flex flex-col min-h-screen bg-white text-black overflow-x-hidden overflow-y-auto relative'>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Sidebar isOpen={isOpen} onPress={() => setIsOpen(false)} />
      <div className='flex-1'>
        {children}
        <FloatingReviewButton />
      </div>

      <Footer />
    </div>
  );
}
export default MainPages;
