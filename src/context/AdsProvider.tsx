'use client';

import { Dispatch, PropsWithChildren, SetStateAction, createContext, useEffect, useState } from 'react';

interface AdsContextProps {
  prefersAds: boolean;
  setPrefersAds: Dispatch<SetStateAction<boolean>>;
}

export const AdsContext = createContext<AdsContextProps>({ prefersAds: false, setPrefersAds: () => null });
const LOCAL_STORAGE_KEY = 'eden_heardle_ads_preference';

export const AdsProvider = (props: PropsWithChildren) => {
  const [prefersAds, setPrefersAds] = useState<boolean>(false);

  useEffect(() => {
    const preference = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
    setPrefersAds(preference);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, prefersAds.toString());
  }, [prefersAds]);

  return <AdsContext.Provider value={{ prefersAds, setPrefersAds }}>{props.children}</AdsContext.Provider>;
};
