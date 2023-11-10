import prisma from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!
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
      await prisma.statistics.create({
        data: {
          currentStreak: 0,
          maxStreak: 0,
          gamesPlayed: 0,
          gamesWon: 0,
          accuracy: 0,
          userId: message.user.id
        }
      });

      await prisma.guesses.create({
        data: {
          userId: message.user.id
        }
      });
    }
  }
};
