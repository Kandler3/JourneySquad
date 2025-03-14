import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import {Navigate, Route, Routes, BrowserRouter} from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import {NavBar} from "@/components/NavBar/NavBar.tsx";
import {UserContext} from "@/contexts/UserContext.ts";
import {User} from "@/models/User.ts";
import {useEffect, useState} from "react";
import {fetchCurrentUser} from "@/services/travelPlanService.ts";

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    })();
  }, []);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <BrowserRouter>
        <UserContext.Provider value={{currentUser: user, setCurrentUser: setUser}}>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
        <NavBar/>
        </UserContext.Provider>
      </BrowserRouter>
    </AppRoot>
  );
}
