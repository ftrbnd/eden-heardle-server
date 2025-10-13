import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="flex gap-2 justify-center items-center h-3/5">
            <Image src={'/icon.png'} alt="EDEN logo" height={50} width={50} />
            <h1 className="text-4xl md:text-5xl font-bold text-error">EDEN Heardle</h1>
          </div>
          <p className="py-6">This page does not exist.</p>
          <div className="flex justify-center gap-2">
            <button className="btn btn-primary">
              <Link href={'/'}>Home</Link>
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
