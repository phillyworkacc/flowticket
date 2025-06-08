import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import EventInfo from "./EventInfo";

type EventInfoProps = {
   params: Promise<{
      eventid: string;
   }>
}

export default async function EventInfoPage ({ params }: EventInfoProps) {
   const { eventid } = await params;
   const session = await getServerSession(authOptions);

   if (!session?.user) {
      redirect("/login");
   }

   return <EventInfo eventid={eventid} />
}
