import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import Account from "./Account";

export default async function AccountPage () {
   const session = await getServerSession(authOptions);

   if (!session?.user) {
      redirect("/login");
   }

   return <Account />
}
