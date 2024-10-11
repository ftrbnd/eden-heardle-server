import ytdl from '@distube/ytdl-core';
import { env } from '../utils/env';

const proxies = env.PROXY_URIS;

const getRandomProxy = () => {
  const index = Math.floor(Math.random() * proxies.length);
  const proxy = proxies[index];

  console.log({ proxy });

  return `http://${proxy}`;
};

export const ytdlProxyAgent = env.ENABLE_PROXY === 'true' ? ytdl.createProxyAgent({ uri: getRandomProxy() }) : undefined;
