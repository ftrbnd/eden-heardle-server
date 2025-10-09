'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="flex gap-2 justify-center items-center h-3/5">
            <Image src={'/icon.png'} alt="EDEN logo" height={50} width={50} />
            <h1 className="text-4xl md:text-5xl font-bold text-error">EDEN Heardle</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold">Something went wrong!</h2>
          <p className="py-6">{error.message}</p>
          <div className="flex justify-center gap-2">
            <button className="btn btn-error" onClick={() => reset()}>
              Try again
            </button>
          </div>
          <div className="flex flex-col py-6">
            <h4 className="text-sm font-semibold">
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h4>
            <h6 className="text-sm font-light">Created by giosalad</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
