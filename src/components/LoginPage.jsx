import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/useAuth';

export default function LoginPage() {
  const { loggedInUser, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (loggedInUser) {
      navigate('/profile');
    }
  }, [loggedInUser]);

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate('/profile');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white p-6'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6'>
        <div className='text-center space-y-1'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900'>branches</h1>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-gray-700 font-medium'>Username</label>
          <input
            className='p-3 border rounded-lg w-full'
            placeholder='cookie_monster'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-gray-700 font-medium'>Password</label>
          <input
            type='password'
            className='p-3 border rounded-lg w-full'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className='w-full bg-black text-white p-3 rounded-lg text-lg font-medium hover:bg-gray-900 transition'
        >
          Get Started
        </button>

        <div className='flex items-center gap-4'>
          <div className='h-px bg-gray-300 flex-1' />
          <span className='text-gray-500 text-sm'>or</span>
          <div className='h-px bg-gray-300 flex-1' />
        </div>

        <div className='flex justify-center gap-4'>
          <button onClick={() => navigate('/sign-up')}>Sign up</button>
        </div>
      </div>
    </main>
  );
}
