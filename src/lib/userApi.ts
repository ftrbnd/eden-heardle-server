import { User } from '@prisma/client';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const usersUrlEndpoint = '/users';

export const getUser = async (id: string) => {
  const response = await api.get<User>(usersUrlEndpoint, {
    params: {
      id
    }
  });
  return response.data;
};

export const updateUser = async (user: User) => {
  const response = await api.patch(`${usersUrlEndpoint}/${user.id}`, user);
  return response.data;
};
