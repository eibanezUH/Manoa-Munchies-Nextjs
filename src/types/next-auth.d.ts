/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      randomKey: string;
    };
  }

  interface User {
    id: string;
    email: string;
    randomKey: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    randomKey: string;
  }
}
