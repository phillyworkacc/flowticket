'use server'
import { connectToDatabase } from "@/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { generateRandomCode } from '@/utils/hash';
import crypto from 'crypto'
import UsersDb from "@/db/user"
import UserEventsDb from '@/db/event';

export async function createUserEvent (userEvent: Omit<UserEvent, 'userid' | 'eventid' | 'guests' | 'eventCode'>): Promise<string | false> {
   try {
      await connectToDatabase();
      const session = await getServerSession(authOptions);
      if (!session?.user) return false;

      const user = await UsersDb.findOne({ email: session.user.email! })
      if (!user) return false;

      const { name, description, eventDate, maxGuests, allowControl, createdAt } = userEvent;
      const eventId = crypto.randomUUID().replaceAll('-','');
      await UserEventsDb.create({
         userid: user.userid,
         eventid: eventId,
         name,
         description,
         eventDate,
         maxGuests,
         allowControl,
         eventCode: generateRandomCode(6),
         guests: [],
         createdAt
      })
      return eventId;
   } catch (er) { return false };
}

export async function getAllUserEvents (): Promise<UserEvent[] | false> {
   try {
      await connectToDatabase();
      const session = await getServerSession(authOptions);
      if (!session?.user) return false;

      const user = await UsersDb.findOne({ email: session.user.email! })
      if (!user) return false;

      const results = await UserEventsDb.find({ userid: user.userid })
      return JSON.parse(JSON.stringify(results));
   } catch (er) { return false };
}

export async function getAllUserEvent (eventid: string): Promise<UserEvent | false> {
   try {
      await connectToDatabase();
      const session = await getServerSession(authOptions);
      if (!session?.user) return false;

      const user = await UsersDb.findOne({ email: session.user.email! })
      if (!user) return false;

      const result = await UserEventsDb.findOne({ userid: user.userid, eventid: eventid })
      return JSON.parse(JSON.stringify(result));
   } catch (er) { return false };
}

export async function checkIfGuestCanJoinEvent (eventid: string): Promise<boolean> {
   try {
      await connectToDatabase();
      const result = await UserEventsDb.findOne({ eventid: eventid });
      if (!result) return false;

      return (result.guests.length < result.maxGuests);
   } catch (er) { return false };
}

export async function addGuest (guestInfo: Guest, eventid: string): Promise<boolean> {
   try {
      await connectToDatabase();
      const result = await UserEventsDb.findOne({ eventid: eventid });
      if (!result) return false;

      result.guests.push(guestInfo);
      await result.save();

      return true;
   } catch (er) { return false };
}

export async function deleteGuest (guestTicketCode: string, eventid: string): Promise<boolean> {
   try {
      await connectToDatabase();
      const session = await getServerSession(authOptions);
      if (!session?.user) return false;

      const user = await UsersDb.findOne({ email: session.user.email! })
      if (!user) return false;

      const result = await UserEventsDb.findOne({ eventid: eventid, userid: user.userid });
      if (!result) return false;

      result.guests = [...result.guests.filter((guest: any) => guest.ticketCode !== guestTicketCode)];
      await result.save();

      return true;
   } catch (er) { return false };
}

export async function approveGuest (guestIndex: number, eventid: string): Promise<boolean> {
   try {
      await connectToDatabase();
      const session = await getServerSession(authOptions);
      if (!session?.user) return false;

      const user = await UsersDb.findOne({ email: session.user.email! })
      if (!user) return false;

      const result = await UserEventsDb.findOne({ eventid: eventid, userid: user.userid });
      if (!result) return false;

      result.guests[guestIndex].approvedAt = Date.now();
      await result.save();

      return true;
   } catch (er) { return false };
}