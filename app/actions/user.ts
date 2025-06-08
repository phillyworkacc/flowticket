'use server'
import crypto from 'crypto'
import UsersDb from "@/db/user"
import { connectToDatabase } from "@/db/db";
import { hashPassword } from "@/utils/hash";

export async function checkUserExists (email: string): Promise<boolean> {
   try {
      await connectToDatabase();
      const user = await UsersDb.findOne({ email });
      return user ? true : false;
   } catch (er) { return false };
}

export async function createUserAccount (user: Omit<User, 'userid'>): Promise<boolean> {
   try {
      await connectToDatabase();
      await UsersDb.create({
         userid: crypto.randomUUID(),
         name: user.name,
         email: user.email,
         password: hashPassword(user.password)
      })
      return true;
   } catch (er) { return false };
}