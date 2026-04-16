import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import CreateReviewPage from './components/CreateReviewPage.jsx';
import Profile from './components/Profile.jsx';
import LoginPage from './components/LoginPage.jsx';
import { AuthProvider } from './components/auth/useAuth.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import AllReviews from './components/AllReviews.jsx';
import EditProfile from './components/EditProfile.jsx';
import SearchPage from './components/SearchPage.jsx';
import ReviewPage from './components/ReviewPage.jsx';
import BookPage from './components/BookPage.jsx';
import LatestBooks from './components/LatestBooks.jsx';

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
