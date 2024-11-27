'use client';

import { PropsWithChildren, createContext, useState } from 'react';

interface AdsContextProps {
  preference: boolean;
  setPreference: (p: boolean) => void;
}

export const AdsContext = createContext<AdsContextProps | null>(null);
const LOCAL_STORAGE_KEY = 'eden_heardle_ads_preference';

const getLocalStoragePreference = () => {
  if (global?.window === undefined) return false;

  const preference = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  return preference === 'true';
};

export const AdsProvider = (props: PropsWithChildren) => {
  const [prefersAds, setPrefersAds] = useState<boolean>(getLocalStoragePreference());

  const setPreference = (preference: boolean) => {
    setPrefersAds(preference);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, `${preference}`);
  };

  return <AdsContext.Provider value={{ preference: prefersAds, setPreference }}>{props.children}</AdsContext.Provider>;
};
