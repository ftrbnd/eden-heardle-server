import { Song } from '@prisma/client';

interface GetRequest {
  song: Song;
  startTime: number;
  customId: string;
  userId: string;
}

interface DeleteRequest {
  heardleId: string;
  userId: string;
}

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (str: unknown): string => {
  if (!isString(str)) {
    throw new Error('Incorrect or missing string value');
  }

  return str;
};

const isNumber = (num: unknown): num is number => {
  return typeof num === 'number' || num instanceof Number;
};

const parseNumber = (num: unknown): number => {
  if (!isNumber(num)) {
    throw new Error('Incorrect or missing number value');
  }

  return num;
};

const isSong = (song: unknown): song is Song => {
  if (!song || typeof song !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  return 'id' in song && 'name' in song && 'album' in song && 'cover' in song && 'link' in song && 'duration' in song;
};

const parseSong = (song: unknown): Song => {
  if (!isSong(song)) {
    throw new Error('Incorrect or missing number value');
  }
  return song;
};

function parseGetRequest(body: unknown): GetRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('song' in body && 'startTime' in body && 'userId' in body && 'customId' in body) {
    const request: GetRequest = {
      song: parseSong(body.song),
      startTime: parseNumber(body.startTime),
      customId: parseString(body.customId),
      userId: parseString(body.userId)
    };

    return request;
  }

  throw new Error('Incorrect data: some fields are missing');
}

function parseDeleteRequest(body: unknown): DeleteRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('heardleId' in body && 'userId' in body) {
    const request: DeleteRequest = {
      heardleId: parseString(body.heardleId),
      userId: parseString(body.userId)
    };

    return request;
  }

  throw new Error('Incorrect data: some fields are missing');
}

export { parseGetRequest, parseDeleteRequest };
