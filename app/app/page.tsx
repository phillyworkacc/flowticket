import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import AppClient from "./AppClient";

export default async function AppPage () {
   const session = await getServerSession(authOptions);

   if (!session?.user) {
      redirect("/login");
   }

   return <AppClient />
}
