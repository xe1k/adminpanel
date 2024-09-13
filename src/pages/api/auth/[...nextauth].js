import NextAuth, { getServerSession } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '../../../lib/mongodb';
import GoogleProvider from 'next-auth/providers/google';

const adminEmails = ['g.astargo84@gmail.com','xeikonly.wow@gmail.com'];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    async signIn({ user, account, profile }) {
      // Verifica si el correo del usuario está en adminEmails
      if (!adminEmails.includes(user.email)) {
        console.log(`Acceso denegado para ${user.email}`);
        return false; // Deniega el inicio de sesión
      }

      const existingUser = await client.db().collection('users').findOne({ email: user.email });
  
      if (existingUser && existingUser.provider !== account.provider) {
        // Si el usuario ya existe pero con otro proveedor, actualiza el proveedor
        console.log('Unificando cuenta con diferentes proveedores');
        await client.db().collection('users').updateOne(
          { email: user.email },
          { $set: { provider: account.provider } }
        );
      }
  
      return true; // Permite que el inicio de sesión continúe si es administrador
    },
    async session({ session, token, user }) {
      if (session?.user?.email && adminEmails.includes(session.user.email)) {
        session.isAdmin = true; // Marca el usuario como administrador
      } else {
        session.isAdmin = false; // No es administrador
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'No es administrador';
  }
}
