import { AdsContext } from '@/context/AdsProvider';
import { useContext } from 'react';

const useAds = () => {
  const context = useContext(AdsContext);

  if (!context) {
    throw new Error('Please use AdsProvider in parent component');
  }

  return context;
};
export default useAds;
