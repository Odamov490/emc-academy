import { createContext, useContext, useEffect, useState } from 'react';
import { authService, userService } from '../firebase';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [toast, setToast] = useState([]);

  useEffect(() => {
    return authService.onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        let profile = await userService.getUser(user.uid);
        if (!profile) {
          await userService.createUser(user.uid, {
            displayName: user.displayName || 'Talaba',
            email: user.email,
            photoURL: user.photoURL || '',
          });
          profile = await userService.getUser(user.uid);
        }
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });
  }, []);

  const showToast = (msg, type = 'info') => {
    const id = Date.now();
    setToast(p => [...p, { id, msg, type }]);
    setTimeout(() => setToast(p => p.filter(t => t.id !== id)), 3500);
  };

  const refreshProfile = async () => {
    if (!currentUser) return;
    const p = await userService.getUser(currentUser.uid);
    setUserProfile(p);
  };

  const isAdmin = userProfile?.role === 'admin';
  const isTeacher = userProfile?.role === 'teacher' || isAdmin;

  return (
    <AppContext.Provider value={{
      currentUser, userProfile, authLoading,
      toast, showToast, refreshProfile,
      isAdmin, isTeacher,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
