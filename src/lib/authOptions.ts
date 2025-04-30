/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
import { compare } from 'bcrypt';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@foo.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorize called with credentials:', credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Email and password are required');
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
          });
          console.log('User lookup result:', user ? { id: user.id, email: user.email, role: user.role } : 'No user found');

          if (!user) {
            console.log('User not found');
            throw new Error('User not found');
          }

          const isPasswordValid = await compare(credentials.password, user.password);
          console.log('Password validation result:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password');
            throw new Error('Invalid password');
          }

          console.log('Authentication successful:', { id: user.id, email: user.email, role: user.role });
          return {
            id: user.id.toString(),
            email: user.email,
            randomKey: user.role,
          };
        } catch (error) {
          const err = error as Error; // Assert that error is an Error object
          console.error('Authorize error:', err.message);
          throw new Error(`Authentication failed: ${err.message}`);
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    session: ({ session, token }) => {
      console.log('Session Callback:', { session, token });
      if (token?.id && token?.randomKey) {
        session.user = {
          ...session.user,
          id: token.id as string,
          randomKey: token.randomKey as string,
        };
        console.log('Updated session:', session);
        return session;
      }
      console.log('Session callback: Token missing id or randomKey', { token });
      return session;
    },
    jwt: ({ token, user }) => {
      console.log('JWT Callback:', { token, user });
      if (user) {
        return {
          ...token,
          id: user.id,
          randomKey: user.randomKey,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
