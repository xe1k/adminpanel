import NextAuth, { getServerSession } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '../../../lib/mongodb'
import GoogleProvider from 'next-auth/providers/google'


const adminEmails = ['xeikonly.wow@gmail.com'];

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    session: async ({ session, token, user }) => {
      console.log('Session object:', session);
      console.log('User object:', user);
      console.log('Token object:', token);

      if (session?.user?.email && adminEmails.includes(session.user.email)) {
        return session;
      } else {
        console.log('User email is not in adminEmails.');
        return null;
      }
    },
  }

}

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'No es administrador'
  }
}