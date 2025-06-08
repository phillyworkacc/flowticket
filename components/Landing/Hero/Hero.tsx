'use client'
import "./Hero.css"
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroTag from "./HeroTag"

export default function Hero () {
   const { data: session } = useSession();
   const router = useRouter();

   return (
      <div className="hero">
         <HeroTag />

         <div className="headline text-xxl bold-600 mb-1 text-center pdx-3">Tickets That Flow With You</div>

         <div className="sub-headline text-xs mb-2 text-center pdx-1">
            Create, customize, and control your event tickets — with an experience your guests will feel.
         </div>

         <div className="call-to-action text-xxs dfb align-center justify-center gap-10">
            {session?.user ? <>
               <button className="xxs" onClick={() => router.push('/app')}>Go to dashboard <ArrowRight size={17} /></button>
            </> : <>
               <button className="xxs" onClick={() => router.push('/login')}>Get Started</button>
            </>}
         </div>
      </div>
   )
}
