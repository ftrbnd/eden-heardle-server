import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import prisma from '@/lib/db';

async function getUser() {
  const session = await getServerSession(options);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id
    }
  });

  return user;
}

export default async function Home() {
  const user = await getUser();
  console.log('USER: ', user);

  return (
    <div>
      <h1>EDEN Heardle</h1>
      {user && <h2>Hello {user?.name}!</h2>}
      <Link href="/play">
        <button className="btn btn-secondary">Play</button>
      </Link>
    </div>
  );
}
