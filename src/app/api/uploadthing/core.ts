import { getServerSession } from 'next-auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { options } from '../auth/[...nextauth]/options';

const f = createUploadthing();

export const ourFileRouter = {
  dailySong: f({ audio: { maxFileSize: '8MB' } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(options);
      if (!session) throw new Error('Unauthorized');

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId: ', metadata.userId);
      console.log('File url: ', file.url);
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
