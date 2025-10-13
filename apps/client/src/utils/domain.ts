import { clientEnv } from '@/utils/env';

export const rootDomain = clientEnv.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
export const rootDomainExists = clientEnv.NEXT_PUBLIC_ROOT_DOMAIN !== undefined;

export const protocol = process.env.NODE_ENV === 'production' || rootDomainExists ? 'https' : 'http';

export const rootURL = `${protocol}://${rootDomain}` as const;

export const serverURL = clientEnv.NEXT_PUBLIC_EXPRESS_URL;
