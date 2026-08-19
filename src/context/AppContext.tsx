import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { t as translate } from '../i18n';
import * as auth from '../services/auth';
import { initStore, subscribe } from '../services/store';
import type { AppLanguage, User } from '../types';

type Banner = { text: string; tone?: 'ok' | 'warn' } | null;

type Ctx = {
  ready: boolean;
  bootError: string | null;
  user: User | null;
  lang: AppLanguage;
  t: (key: string) => string;
  refresh: () => void;
  banner: Banner;
  showBanner: (text: string, tone?: 'ok' | 'warn') => void;
  retry: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tick, setTick] = useState(0);
  const [banner, setBanner] = useState<Banner>(null);

  const hydrate = useCallback(() => {
    setUser(auth.currentUser());
    setTick((n) => n + 1);
  }, []);

  const boot = useCallback(async () => {
    try {
      setBootError(null);
      await initStore();
      hydrate();
      setReady(true);
    } catch (e) {
      setBootError(e instanceof Error ? e.message : 'boot');
      setReady(true);
    }
  }, [hydrate]);

  useEffect(() => {
    void boot();
    return subscribe(() => hydrate());
  }, [boot, hydrate]);

  const lang: AppLanguage = user?.language ?? 'en';

  const showBanner = useCallback((text: string, tone: 'ok' | 'warn' = 'ok') => {
    setBanner({ text, tone });
    setTimeout(() => setBanner(null), 3200);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      bootError,
      user,
      lang,
      t: (key) => translate(lang, key),
      refresh: hydrate,
      banner,
      showBanner,
      retry: () => void boot(),
    }),
    [ready, bootError, user, lang, hydrate, banner, showBanner, boot, tick],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}
