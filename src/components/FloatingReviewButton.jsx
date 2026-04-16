import { useNavigate } from 'react-router-dom';

function FloatingReviewButton({}) {
  //Initialisation ---------------------------------
  const navigate = useNavigate();
  //State ------------------------------------------
  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <div className='sticky bottom-6 flex justify-end bg-green-100/20'>
      <button
        onClick={() => navigate('/create-review')}
        className='w-14 h-14 border hover:bg-white rounded-full shadow-lg flex items-center justify-center'
      >
        <img src='/pen-tool.svg' alt='+' className='w-7 h-7' />
      </button>
    </div>
  );
}
export default FloatingReviewButton;
