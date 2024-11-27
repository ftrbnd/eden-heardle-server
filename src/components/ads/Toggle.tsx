'use client';

import useAds from '@/hooks/useAds';
import { ChangeEvent } from 'react';

export default function Toggle() {
  const { prefersAds, setPrefersAds } = useAds();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrefersAds(e.target.checked);
  };

  return (
    <div className="flex justify-between">
      <p>Show ads</p>
      <input type="checkbox" className="toggle toggle-success" onChange={handleChange} checked={prefersAds} />
    </div>
  );
}
