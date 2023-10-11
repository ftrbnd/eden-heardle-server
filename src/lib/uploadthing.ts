import { createUploadthing, type FileRouter } from 'uploadthing/express';
import { UTApi } from 'uploadthing/server';

const f = createUploadthing();

export const utapi = new UTApi();

export const uploadRouter = {
  dailySong: f({
    audio: {
      maxFileSize: '8MB',
      maxFileCount: 1
    }
  }).onUploadComplete((data) => {
    console.log('Upload completed: ', data);
  })
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
