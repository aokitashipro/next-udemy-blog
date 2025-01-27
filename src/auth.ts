import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma'; 
import bcryptjs from 'bcryptjs';

async function getUser(email: string) { // ユーザー取得関数
    return await prisma.user.findUnique({
      where: { email: email }})}
  

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
            .object({ email: z.string().email(), 
                password: z.string().min(8) })
            .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email); // ユーザー取得
                if (!user) return null;
                const passwordsMatch = await bcryptjs.compare(password, user.password); // パスワード比較
                if (passwordsMatch) return user;
            }
            return null;

        },
      }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub || '') as string;
        session.user.name = token.name ?? '';
        session.user.email = token.email ?? '';
      }
      return session;
    }
  }
});