import supertest from 'supertest';
import app from '../src/app';
import { mockSongs } from '../__mocks__/data';
import { parseDeleteRequest, parsePostRequest } from '../src/utils/parseRequestBody';
import { downloadMp3 } from '../src/utils/downloadMp3';
import { prismaMock } from '../__mocks__/singleton';

jest.mock('../src/utils/downloadMp3');

const api = supertest(app);
const API_ENDPOINT = '/api/customHeardle';

describe(`Test ${API_ENDPOINT}`, () => {
  it('GET: pings Custom Heardle api endpoint', async () => {
    const res = await api.get(API_ENDPOINT);

    expect(res.statusCode).toBe(200);
  });

  describe('POST requests:', () => {
    describe('parsing the request body', () => {
      it('expects an error on an object with missing fields', () => {
        expect(() => {
          parsePostRequest({
            song: mockSongs[0],
            startTime: 0
            // missing userId
          });
        }).toThrow(/some fields are missing/i);
      });

      it('expects an error on an object with properties of invalid types', () => {
        expect(() => {
          parsePostRequest({
            song: 'not-a-song',
            startTime: 'not-a-number',
            userId: 'not-an-id'
          });
        }).toThrow(/incorrect or missing data/i);
      });

      it('expects an error on an empty object', () => {
        expect(() => {
          parsePostRequest({});
        }).toThrow(/some fields are missing/i);
      });

      it('expects an error if not given an object', () => {
        expect(() => {
          parsePostRequest('not-an-object');
        }).toThrow(/incorrect or missing data/i);
      });
    });

    describe('with a valid request body', () => {
      it('expects status code 200', async () => {
        (downloadMp3 as jest.Mock).mockImplementation(() => {
          return 'shareablelink';
        });

        const response = await api.post(API_ENDPOINT).send({
          song: mockSongs[0],
          startTime: 0,
          userId: 'fakeid'
        });

        expect(downloadMp3).toHaveBeenCalledWith(
          {
            id: '1',
            name: 'End Credits',
            album: 'End Credits',
            cover: 'https://i1.sndcdn.com/artworks-000125721149-whx70j-t500x500.jpg',
            duration: 241,
            link: 'https://youtu.be/0pVABElms84'
          },
          0,
          'fakeid'
        );
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          message: 'Successfully created Custom Heardle',
          link: 'shareablelink'
        });
      });
    });

    describe('with an invalid request body', () => {
      it('expects status code 400', async () => {
        const response = await api.post(API_ENDPOINT).send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Failed to create Custom Heardle');
      });
    });
  });

  describe('DELETE requests:', () => {
    describe('parsing the request body', () => {
      it('expects an error on an object with missing fields', () => {
        expect(() => {
          parseDeleteRequest({
            heardleId: 'fakeid'
            // missing userId
          });
        }).toThrow(/some fields are missing/i);
      });

      it('expects an error on an object with properties of invalid types', () => {
        expect(() => {
          parseDeleteRequest({
            heardleId: 0,
            userId: 1
          });
        }).toThrow(/incorrect or missing string value/i);
      });

      it('expects an error on an empty object', () => {
        expect(() => {
          parseDeleteRequest({});
        }).toThrow(/some fields are missing/i);
      });

      it('expects an error if not given an object', () => {
        expect(() => {
          parsePostRequest('not-an-object');
        }).toThrow(/incorrect or missing data/i);
      });
    });

    describe('with a valid request body', () => {
      it('expects status code 200', async () => {
        prismaMock.customHeardle.delete.mockImplementation();

        const response = await api.delete(API_ENDPOINT).send({ heardleId: 'fakeHeardleId', userId: 'fakeUserId' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Successfully deleted Custom Heardle');
      });
    });

    describe('with an invalid request body', () => {
      it('expects status code 400', async () => {
        const response = await api.delete(API_ENDPOINT).send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Failed to delete Custom Heardle');
      });
    });
  });
});
