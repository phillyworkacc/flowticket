import { connectToDatabase } from "@/db/db";
import { hashPassword } from "@/utils/hash";
import { NextAuthOptions } from "next-auth";
import UsersDb from "@/db/user";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
   session: {
      strategy: "jwt"
   },
   providers: [
      CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {},
				password: {}
			},
         async authorize (credentials, req) {
            if (credentials?.email == "" || credentials?.password == "") {
               return null;
            } else {
               await connectToDatabase();
               const result = await UsersDb.findOne({
                  email: credentials?.email,
                  password: hashPassword(credentials?.password!)
               })
               if (result !== false && typeof result !== "boolean") {
                  return {
                     id: result.userid,
                     email: result.email,
                     name: result.name,
                  }	
               } else {
                  return null;
               }
            }
         }
      }) 
   ],
	callbacks: {
		jwt: async ({ user, token, trigger, session }) => {
			if (trigger == "update") {
				return {
					...token,
					...session.user
				}
			}
			return { ...token, ...user }
		}
	}
}