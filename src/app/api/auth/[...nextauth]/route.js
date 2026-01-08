import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectToDatabase();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },
    async session({ session, token }) {
      await connectToDatabase();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.xp = dbUser.xp;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
