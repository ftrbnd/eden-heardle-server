import { LocalUserContext } from '@/context/LocalUserProvider';
import { LocalUserState } from '@/utils/types';
import { useContext } from 'react';

const useLocalUser = (): LocalUserState => {
  const context = useContext(LocalUserContext);

  if (!context) {
    throw new Error('Please use LocalUserProvider in parent component');
  }

  return context;
};
export default useLocalUser;
