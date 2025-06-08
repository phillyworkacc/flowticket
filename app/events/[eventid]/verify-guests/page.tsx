import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import QrCodeScannerVerifier from "./Verifier";

type EventInfoProps = {
   params: Promise<{
      eventid: string;
   }>
}

export default async function QrCodeScannerVerifierPage ({ params }: EventInfoProps) {
   const { eventid } = await params;
   const session = await getServerSession(authOptions);

   if (!session?.user) {
      redirect("/login");
   }

   return <QrCodeScannerVerifier eventid={eventid} />
}
