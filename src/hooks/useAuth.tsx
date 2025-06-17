import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/database.types';
import toast from 'react-hot-toast';

type User = Tables['users']['Row'] & {
  business?: Tables['businesses']['Row'] | null;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // First fetch basic user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name, avatar_url, role, business_id, is_active')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      if (!userData) throw new Error('User not found');

      // Then fetch business data if user has a business_id
      let businessData = null;
      if (userData.business_id) {
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', userData.business_id)
          .single();
        
        if (businessError) {
          console.error('Error fetching business data:', businessError);
        } else {
          businessData = business;
        }
      }

      if (mounted) {
        setUser({
          ...userData,
          business: businessData
        });
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      if (mounted) setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          // Check if the error is related to invalid refresh token
          if (sessionError.message?.includes('Invalid Refresh Token') || 
              sessionError.message?.includes('refresh_token_not_found')) {
            // Clear the invalid session and reset auth state
            await supabase.auth.signOut();
            if (mounted) {
              setUser(null);
              setLoading(false);
            }
            return;
          }
          throw sessionError;
        }
        
        if (session?.user && mounted) {
          await fetchUserData(session.user.id);
        } else if (mounted) {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setUser(null);
          // Clear any potentially corrupted auth state
          await supabase.auth.signOut();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true);
          try {
            await fetchUserData(session.user.id);
          } catch (error) {
            console.error('Error handling auth state change:', error);
            setUser(null);
          } finally {
            if (mounted) setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Handle successful token refresh
          if (session?.user && mounted) {
            try {
              await fetchUserData(session.user.id);
            } catch (error) {
              console.error('Error after token refresh:', error);
              setUser(null);
            }
          }
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [mounted]);
  
  const signIn = async (email: string, password: string) => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (signInError) {
        throw new Error(signInError.message === 'Invalid login credentials' 
          ? 'Correo o contraseña incorrectos'
          : signInError.message
        );
      }

      if (signInData.user) {
        await fetchUserData(signInData.user.id);
        if (mounted) toast.success('¡Bienvenido de nuevo!');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      if (mounted) {
        setUser(null);
        throw error;
      }
    } finally {
      if (mounted) setLoading(false);
    }
  };
  
  const signOut = async () => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast.success('Sesión cerrada correctamente');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error al cerrar sesión');
    } finally {
      if (mounted) setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);