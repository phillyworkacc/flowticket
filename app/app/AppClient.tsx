'use client'
import '@/styles/app.css'
import Card from '@/components/Card/Card';
import Footer from '@/components/Landing/Footer/Footer';
import { Calendar, CirclePlus, CircleUser, Globe, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllUserEvents } from '../actions/userEvents';
import { formatMilliseconds } from '@/utils/date';

export default function AppClient() {
   const router = useRouter();
   const { data: session } = useSession();
   const [userEvents, setUserEvents] = useState<UserEvent[] | null>(null);

   useEffect(() => {
      const loadAllEvents = async () => {
         const results = await getAllUserEvents();
         setUserEvents(results ? results : []);
      }
      loadAllEvents()
   }, [])

   if (userEvents == null) return <>Loading</>

   return (
      <div className='app-wrapper'>
         <header>
            <div className="header-container">
               <div className="app-msg">Hello {session?.user?.name}</div>
               <div className="account">
                  <button className="transparent xs" onClick={() => router.push('/create-event')}>
                     <CirclePlus size={20} />
                  </button>
                  <button className="transparent xs" onClick={() => router.push('/account')}>
                     <CircleUser size={20} />
                  </button>
               </div>
            </div>
         </header>

         <main>
            <div className="app-container">
               {userEvents.length > 0 ? <>
                  <div className="text-sm bold-600 mb-2">Events</div>
                  <div className="list gap-10">
                     {userEvents.map((userEvent, index) => {
                        return <Card key={index} padding='10px' cursor onClick={() => router.push(`/events/${userEvent.eventid}`)}>
                           <div className="text-s bold-600">{userEvent.name}</div>
                           <div className="text-xxs grey-4 mb-1">{userEvent.description}</div>
                           <div className="text-xxs grey-4 mb-05">{formatMilliseconds(userEvent.eventDate)}</div>
                           <div className="text-s dfb gap-15">
                              <div className="text-xxs dfb align-center gap-3 grey-4 fit">
                                 {userEvent.guests.length}/{userEvent.maxGuests} guests
                              </div>
                              <div className="text-xxs dfb align-center gap-3 grey-4 fit">
                                 {userEvent.allowControl ? <Lock size={14} /> : <Globe size={14} />}
                                 {userEvent.allowControl ? ('Private') : ('Public')}
                              </div>
                           </div>
                        </Card>
                     })}
                  </div>
               </> : <>
                  <div className="text-sm dfb column align-center text-center gap-10 full pd-1">
                     <span>You have no events, create one so you can have all your friends at your party</span>
                     <button className='xs' onClick={() => router.push('/create-event')}>Create Event <Calendar size={17} /></button>
                  </div>
               </>}
            </div>
         </main>

         <Footer />
      </div>
   )
}
