import { User } from '@prisma/client';

const usersUrlEndpoint = '/api/users';

export const getUser = async (id: string) => {
  try {
    const response = await fetch(`${usersUrlEndpoint}/${id}`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to get user');

    const { user }: { user: User } = await response.json();
    if (!user) return null;

    return user;
  } catch (err) {
    console.error(err);
  }
};
