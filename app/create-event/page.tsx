import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import CreateEvent from "./CreateEvent";

export default async function CreateEventPage () {
   const session = await getServerSession(authOptions);

   if (!session?.user) {
      redirect("/login");
   }

   return <CreateEvent />
}
