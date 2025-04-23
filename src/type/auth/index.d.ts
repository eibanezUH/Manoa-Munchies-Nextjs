/* eslint-disable @typescript-eslint/no-unused-vars */
// src/type/auth/index.d.ts
import { Session as NextAuthSession, User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      id: string;
      randomKey: string;
    };
  }

  interface User {
    id: string;
    randomKey: string;
  }
}
