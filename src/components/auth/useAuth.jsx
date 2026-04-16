import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../supabase-client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const login = async (username, password) => {
    const { data: userRow, error: userError } = await supabase
      .from('users')
      .select('user_email, userauth_id')
      .eq('user_name', username)
      .single();

    if (userError || !userRow) throw new Error('Invalid username');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userRow.user_email,
      password,
    });

    if (authError) throw new Error(authError.message);

    const authUser = authData.user;

    // Ensure the session is fetched and awaited
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error('Session could not be established');
    }

    const { data: profileRow } = await supabase.from('users').select('*').eq('userauth_id', authUser.id).single();
    const avatarUrl = loadAvatarUrl(profileRow.userauth_id);
    setLoggedInUser({
      auth: authUser,
      profile: {
        ...profileRow,
        avatar_url: avatarUrl,
      },
    });

    return authUser;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setLoggedInUser(null);
  };

  const loadAvatarUrl = (userauth_id) => {
    const filePath = `${userauth_id}/avatar.png`;
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data?.publicUrl || null;
  };

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoggedInUser(null);
        return;
      }

      const authUser = session.user;

      const { data: profileRow } = await supabase.from('users').select('*').eq('userauth_id', authUser.id).single();
      const avatarUrl = loadAvatarUrl(profileRow.userauth_id);
      setLoggedInUser({
        auth: authUser,
        profile: {
          ...profileRow,
          avatar_url: avatarUrl,
        },
      });
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) {
        setLoggedInUser(null);
        return;
      }
      setLoggedInUser((prev) => {
        if (!prev?.profile) return prev;

        const avatarUrl = loadAvatarUrl(prev.profile.userauth_id);

        return {
          ...prev,
          auth: session.user,
          profile: {
            ...prev.profile,
            avatar_url: avatarUrl,
          },
        };
      });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout, setLoggedInUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
