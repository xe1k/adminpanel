import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '../../../lib/mongodb'
import GoogleProvider from 'next-auth/providers/google'


export default NextAuth({
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(client),
})