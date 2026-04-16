function Footer({}) {
  //Initialisation ---------------------------------
  //State ------------------------------------------
  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <footer className='w-full bg-green-100/20 backdrop-blur-sm border-t border-green-200/30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-2 cursor-pointer'>
            <img src='/simple branch.svg' alt='branches' className='w-6 h-6 sm:w-7 sm:h-7' />
            <span className='text-lg sm:text-xl font-medium'>Branches</span>
          </div>
          <div>
            <a className='text-gray-700 hover:text-gray-900 text-sm sm:text-base transition'>branches@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
