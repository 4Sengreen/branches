import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateReviewPage from './components/CreateReviewPage';
import Profile from './components/Profile';
import LoginPage from './components/LoginPage';
import { AuthProvider } from './components/auth/useAuth';
import SignUpPage from './components/SignUpPage';
import AllReviews from './components/AllReviews';
import EditProfile from './components/EditProfile';
import SearchPage from './components/SearchPage';
import ReviewPage from './components/ReviewPage';
import BookPage from './components/BookPage';
import LatestBooks from './components/LatestBooks';

function App({}) {
  //Initialisation ---------------------------------
  //State ------------------------------------------
  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/reviews' element={<AllReviews />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/create-review' element={<CreateReviewPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/review-page/:reviewId' element={<ReviewPage />} />
          <Route path='/books/:bookId' element={<BookPage />} />
          <Route path='/latest-books' element={<LatestBooks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
