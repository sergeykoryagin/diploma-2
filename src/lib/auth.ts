import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from './db/prisma';
import NextAuth from 'next-auth';
import YandexProvider from "next-auth/providers/yandex";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    YandexProvider({
      clientId: process.env.NEXT_PUBLIC_YANDEX_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_YANDEX_OAUTH_CLIENT_SECRET || "",
      redirectProxyUrl: process.env.NEXT_PUBLIC_YANDEX_OAUTH_REDIRECT_URI || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "yandex") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email || "" },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email || "",
                name: user.name || "",              
                image: user.image || "",
                tags: [],
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
  },
});