import * as db from '@packages/database/queries';
import { prisma } from '@packages/database/client';
import { serverEnv } from '@/utils/env';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const options: NextAuthOptions = {
  // @ts-ignore Property 'id' is missing in type 'Omit<AdapterUser, "id">' but required in type 'AdapterUser'
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: '/',
    error: '/'
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  events: {
    async createUser(message) {
      await db.createDefaultUserStatistics(message.user.id);
      await db.createDefaultUserGuesses(message.user.id);
    }
  }
};
