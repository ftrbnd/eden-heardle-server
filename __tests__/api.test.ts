import supertest from 'supertest';
import app from '../src/app';
import { mockSongs } from '../__mocks__/data';
import { downloadMp3 } from '../src/helpers/downloadMp3';
import { prismaMock } from '../__mocks__/singleton';
import { Heardle } from '../src/utils/logger';
import { deleteSchema, postSchema } from '../src/utils/schema';

jest.mock('../src/helpers/downloadMp3');

const api = supertest(app);
const API_ENDPOINT = '/api/heardles/custom';

describe(`Test ${API_ENDPOINT}`, () => {
  describe('POST requests:', () => {
    describe('parsing the request body', () => {
      it('expects an error on an object with missing fields', () => {
        expect(() => {
          postSchema.parse({
            song: mockSongs[0],
            startTime: 0
            // missing userId
          });
        }).toThrow();
      });

      it('expects an error on an object with properties of invalid types', () => {
        expect(() => {
          postSchema.parse({
            song: 'not-a-song',
            startTime: 'not-a-number',
            userId: 'not-an-id'
          });
        }).toThrow();
      });

      it('expects an error on an empty object', () => {
        expect(() => {
          postSchema.parse({});
        }).toThrow();
      });

      it('expects an error if not given an object', () => {
        expect(() => {
          postSchema.parse('not-an-object');
        }).toThrow();
      });
    });

    describe('with a valid request body', () => {
      it('expects status code 200', async () => {
        (downloadMp3 as jest.Mock).mockImplementation(() => {
          return {
            ...mockSongs[0],
            startTime: 0,
            userId: 'fakeid'
          };
        });

        const response = await api.post(API_ENDPOINT).set('Origin', 'http://localhost:3000').send({
          song: mockSongs[0],
          startTime: 0,
          userId: 'fakeid'
        });

        expect(downloadMp3).toHaveBeenCalledWith(mockSongs[0], 0, Heardle.Custom, 'fakeid');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Successfully created Custom Heardle');
      });
    });

    describe('with an invalid request body', () => {
      it('expects status code 400', async () => {
        const response = await api.post(API_ENDPOINT).set('Origin', 'http://localhost:3000').send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Failed to create Custom Heardle');
      });
    });
  });

  describe('DELETE requests:', () => {
    describe('parsing the request body', () => {
      it('expects an error on an object with missing fields', () => {
        expect(() => {
          deleteSchema.parse({
            heardleId: 'fakeid'
            // missing userId
          });
        }).toThrow();
      });

      it('expects an error on an object with properties of invalid types', () => {
        expect(() => {
          deleteSchema.parse({
            heardleId: 0,
            userId: 1
          });
        }).toThrow();
      });

      it('expects an error on an empty object', () => {
        expect(() => {
          deleteSchema.parse({});
        }).toThrow();
      });

      it('expects an error if not given an object', () => {
        expect(() => {
          deleteSchema.parse('not-an-object');
        }).toThrow();
      });
    });

    describe('with a valid request body', () => {
      it('expects status code 200', async () => {
        prismaMock.customHeardle.delete.mockImplementation();

        const response = await api.delete(API_ENDPOINT).set('Origin', 'http://localhost:3000').send({ heardleId: 'fakeHeardleId', userId: 'fakeUserId' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Successfully deleted Custom Heardle');
      });
    });

    describe('with an invalid request body', () => {
      it('expects status code 400', async () => {
        const response = await api.delete(API_ENDPOINT).set('Origin', 'http://localhost:3000').send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Failed to delete Custom Heardle');
      });
    });
  });
});
