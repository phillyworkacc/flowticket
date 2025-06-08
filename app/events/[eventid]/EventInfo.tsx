'use client'
import '@/styles/app.css'
import { Calendar, CircleCheck, CircleUser, Copy, Dot, Home, Link2, QrCode, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { approveGuest, deleteGuest, getAllUserEvent } from '@/app/actions/userEvents';
import { formatMilliseconds } from '@/utils/date';
import { toast } from 'sonner';
import { appUrl } from '@/utils/constants';
import Card from '@/components/Card/Card';
import Footer from '@/components/Landing/Footer/Footer';
import Spacing from '@/components/Spacing/Spacing';
import Link from 'next/link';
import Select from '@/components/Select/Select';

export default function EventInfo ({ eventid }: { eventid: string }) {
   const router = useRouter();
   const { data: session } = useSession();
   const [userEvent, setUserEvent] = useState<UserEvent | null>(null);

   useEffect(() => {
      const loadAllEvent = async () => {
         const results = await getAllUserEvent(eventid);
         setUserEvent(results ? results : null);
      }
      loadAllEvent()
   }, [])

   function copyToClipboard(text: string): void {
      if (navigator.clipboard && window.isSecureContext) {
         // Preferred method for modern browsers
         navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      } else {
         // Fallback for iOS/Safari
         fallbackCopy(text);
      }
   }

   function fallbackCopy(text: string) {
      const textarea = document.createElement('textarea');
      textarea.value = text;

      // Prevent scrolling to bottom on iOS
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
         document.execCommand('copy');
      } catch (err) {
         console.warn('Fallback: Copy failed', err);
      }

      document.body.removeChild(textarea);
   }

   const copyEventLink = () => {
      try {
         copyToClipboard(`${appUrl}/event/${userEvent?.eventCode}`);
         toast.success("Copied");
      } catch (e) {}
   }

   const handleAction = async (optionIndex: number, guestIndex: number) => {
      if (optionIndex == 1) {
         // approve guest
         const res = await approveGuest(guestIndex, eventid);
         if (res) {
            if (!userEvent) return;
            setUserEvent((prev) => ({
               ...prev!,
               guests: prev!.guests.map((guest, index) => {
                  if (index == guestIndex) {
                     return { ...guest, approvedAt: Date.now() }
                  } else {
                     return guest;
                  }
               })
            }))
         }
      } else if (optionIndex == 2) {
         // delete guest
         const res = await deleteGuest(userEvent?.guests[guestIndex].ticketCode!, eventid);
         if (res) {
            if (!userEvent) return;
            setUserEvent((prev) => ({
               ...prev!,
               guests: prev!.guests.filter((guest,index) => index !== guestIndex),
            }))  
         }
      }
   }

   if (userEvent == null) return <>Loading</>

   return (
      <div className='app-wrapper'>
         <header>
            <div className="header-container">
               <div className="app-msg">Hello {session?.user?.name}</div>
               <div className="account">
                  <button className="transparent xs" onClick={() => router.push('/app')}>
                     <Home size={20} />
                  </button>
                  <button className="transparent xs" onClick={() => router.push('/account')}>
                     <CircleUser size={20} />
                  </button>
               </div>
            </div>
         </header>

         <main>
            <div className="app-container">
               <div className="text-sm bold-600 mb-05"><Calendar size={17} /> {userEvent.name}</div>
               <div className="text-xxs grey-4 mb-1">{userEvent.description}</div>

               <div className="horizontal-convertible gap-10 align-stretch">
                  <Card padding='10px'>
                     <div className="text-s bold-600">Guests</div>
                     <div className="text-xxb grey-5 bold-700 dfb align-end gap-4">
                        <span>{userEvent.guests.length}</span><span className='text-xxs pd-1'>/{userEvent.maxGuests}</span>
                     </div>
                  </Card>
                  <Card padding='10px'>
                     <div className="text-s bold-600">Event Info</div>
                     <div className="text-xs grey-5 mt-1">{formatMilliseconds(userEvent.eventDate).split(',')[0]}</div>
                     <div className="text-xxs grey-5 mb-15">{formatMilliseconds(userEvent.eventDate).split(',')[1]}</div>
                  </Card>
               </div>

               <Spacing size={1} />

               <div className="text-s dfb gap-10 wrap">
                  <button className='xxs pd-1 pdx-2' onClick={copyEventLink}><Copy size={16} /> Copy Link</button>
                  <Link href={`${appUrl}/event/${userEvent?.eventCode}`} target="_blank">
                     <button className='xxs pd-1 pdx-2 outline-black'><Link2 size={16} /> Open Link</button>
                  </Link>
                  <button 
                     className='xxs pd-1 pdx-2 green'
                     onClick={() => router.push(`/events/${eventid}/verify-guests`)}
                  ><QrCode size={16} /> Verify Ticket</button>
               </div>

               <Spacing size={1} />

               <div className="text-sm bold-600 mb-1">Guests</div>
               <div className="list gap-10">
                  {userEvent.guests.map((guest, index) => {
                     return <Card key={index} padding='15px'>
                        <div className="text-s dfb gap-5 align-center">
                           <div className="text-s bold-600 fit">{guest.name}</div>
                           <CircleUser size={17} />
                           {(guest.approvedAt > guest.requestAt) && <CircleCheck color='#fff' fill='#26c000' />}
                        </div>
                        <div className="horizontal-convertible gap-5">
                           <div className="text-xxs grey-4 fit">{guest.ticketCode}</div>
                           <div className="text-xxs grey-4 fit mb-1">{formatMilliseconds(guest.requestAt)}</div>
                        </div>
                        {userEvent.allowControl && <>
                           <div className="text-s dfb align-center justify-end">
                              <Select 
                                 style={{ fontSize: '1rem' }}
                                 options={[
                                    'Action',
                                    <><CircleCheck size={15} /> Approve</>,
                                    <><Trash2 size={15} /> Delete</>
                                 ]}
                                 onSelect={(option, optionIndex) => handleAction(optionIndex!, index)}
                              />
                           </div>
                        </>}
                     </Card>
                  })}
               </div>
            </div>
         </main>
         <Footer />
      </div>
   )
}
