import { useState } from 'react';
import { supabase } from '../supabase-client.js';
import { useNavigate } from 'react-router-dom';

function SignUpPage({}) {
  console.log('Signup component mounted');

  //Initialisation ---------------------------------
  const navigate = useNavigate();

  //State ------------------------------------------
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  //Handlers ---------------------------------------
  const handleSignup = async () => {
    try {
      console.log('Signup clicked');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('Auth result:', data, error);

      if (error) {
        alert(error.message);
        return;
      }

      await supabase.auth.refreshSession();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('Session after refresh:', session);

      if (!session?.user) {
        alert('Signup succeeded but session not ready. Try logging in.');
        return;
      }

      const user = session.user;

      const { error: insertError } = await supabase.from('users').insert({
        userauth_id: user.id,
        user_name: username,
        user_email: email,
      });

      console.log('Insert error:', insertError);

      if (insertError) {
        alert('Failed to create profile');
        return;
      }

      console.log('Signup reached navigation');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Signup crashed:', err);
      alert('Unexpected error: ' + err.message);
    }
  };

  //View -------------------------------------------
  return (
    <div className='relative min-h-screen'>
      {success && (
        <div
          className='absolute top-4 left-1/2 -translate-x-1/2 
                    bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg'
        >
          Account created! Redirecting…
        </div>
      )}

      <main className='min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white p-6'>
        <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6'>
          <div className='text-center space-y-1'>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900'>branches</h1>
            <p className='text-gray-500 text-sm'>Create your account</p>
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
            <label className='text-gray-700 font-medium'>Email</label>
            <input
              className='p-3 border rounded-lg w-full'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            type='button'
            onClick={handleSignup}
            className='w-full bg-black text-white p-3 rounded-lg text-lg font-medium hover:bg-gray-900 transition'
          >
            Create Account
          </button>
        </div>
      </main>
    </div>
  );
}
export default SignUpPage;
