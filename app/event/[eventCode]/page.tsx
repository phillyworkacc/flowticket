import { redirect } from "next/navigation";
import GuestRequestPage from "./GuestRequestPage";
import UserEventsDb from "@/db/event";
import { connectToDatabase } from "@/db/db";

type GuestPageProps = {
   params: Promise<{
      eventCode: string;
   }>
}

export default async function GuestPage ({ params }: GuestPageProps) {
   await connectToDatabase();
   const { eventCode } = await params;
   const eventDetails = await UserEventsDb.findOne({ eventCode });
   if (!eventDetails) redirect("/");

   return <GuestRequestPage eventInfo={JSON.parse(JSON.stringify({
      eventid: eventDetails.eventid,
      name: eventDetails.name,
      description: eventDetails.description,
      eventDate: eventDetails.eventDate,
      maxGuests: eventDetails.maxGuests,
      allowControl: eventDetails.allowControl,
      eventCode: eventDetails.eventCode
   }))} />
}
