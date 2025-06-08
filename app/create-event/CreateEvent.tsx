'use client'
import '@/styles/app.css'
import Footer from '@/components/Landing/Footer/Footer';
import { Calendar, CircleUser, Home } from 'lucide-react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Switch from '@/components/Switch/Switch';
import Select from '@/components/Select/Select';
import { toast } from 'sonner';
import { convertToMilliseconds } from '@/utils/date';
import { createUserEvent } from '../actions/userEvents';

function Spinner () {
   return <span className="spinner" />;
}

export default function CreateEvent () {
   const today = new Date();
   const yyyy = today.getFullYear();
   const mm = String(today.getMonth() + 1).padStart(2, '0');
   const dd = String(today.getDate()).padStart(2, '0');

   const router = useRouter();
   const { data: session } = useSession();
   
   const [eventName, setEventName] = useState('')
   const [eventDesc, setEventDesc] = useState('')
   const [isPrivateEvent, setIsPrivateEvent] = useState(false);
   const [date, setDate] = useState(`${yyyy}-${mm}-${dd}`);
   const [eventHour, setEventHour] = useState('0');
   const [eventMinutes, setEventMinutes] = useState('00');
   const [eventAmPm, setEventAmPm] = useState<'am' | 'pm'>('am');
   const [eventMaxGuests, setEventMaxGuests] = useState('0');

   const [buttonLoading, setButtonLoading] = useState(false);

   async function createEventSubmit () {
      const eventDate = convertToMilliseconds(date, parseInt(eventHour), parseInt(eventMinutes), eventAmPm);
      if (eventDate < Date.now()) {
         toast.error("Your event date cannot be in the past");
         return;
      }
      if (eventName == '') {
         toast.error("Please enter the name of your event");
         return;
      }
      if (eventDesc == '') {
         toast.error("Please enter a description for your event");
         return;
      }
      let maxGuests = 0;
      try {
         maxGuests = parseInt(eventMaxGuests);
      } catch (e) {
         toast.error("Please enter a valid number of maximum guests")
         return;
      }
      if (maxGuests < 1) {
         toast.error("Please enter more than 1 maximum guests");
         return;
      }

      setButtonLoading(true);
      const response = await createUserEvent({
         name: eventName,
         description: eventDesc,
         eventDate: eventDate,
         maxGuests: maxGuests,
         allowControl: isPrivateEvent,
         createdAt: Date.now()
      })

      if (response === false) {
         setButtonLoading(false);
         toast.error("Failed to create event. Please try again later.");
      } else {
         router.push(`/events/${response}`);
      }
   }

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
               <div className="text-m dfb align-center gap-5 mb-3 bold-600"><Calendar size={21} /> Create your event</div>

               <div className="form">
                  <div className="form-content">
                     <div className="text-s bold-500 pd-05">Event Name</div>
                     <input type="text" className='s' value={eventName} onChange={(e) => setEventName(e.target.value)} />
                  </div>
                  
                  <div className="form-content">
                     <div className="text-s bold-500 pd-05">Event Description</div>
                     <textarea className='full s' value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
                  </div>

                  <div className="form-content">
                     <div className="text-s bold-500 pd-05">Event Date</div>
                     <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                           padding: '0.5rem',
                           fontSize: '1rem',
                           borderRadius: '0.5rem',
                           border: '1px solid #ccc',
                           appearance: 'none',
                           backgroundColor: '#f9f9f9',
                        }}
                     />
                  </div>

                  <div className="form-content">
                     <div className="text-s bold-500 pd-05">Event Time</div>
                     <div className="text-s dfb align-center gap-7">
                        <Select style={{ width:'100px'}} options={Array.from({ length:12 }, (_,i) => i+1)} defaultOptionIndex={11} onSelect={(option) => setEventHour(option)} />
                        <Select style={{ width:'100px'}} options={['00','30']} onSelect={(option) => setEventMinutes(option)} />
                        <Select style={{ width:'100px'}} options={['am','pm']} onSelect={(option) => setEventAmPm(option)} />
                     </div>
                  </div>
                  
                  <div className="form-content">
                     <div className="text-s bold-500 pd-05">Max Guests</div>
                     <input type="number" className='s' value={eventMaxGuests} onChange={(e) => setEventMaxGuests(e.target.value)} />
                  </div>
                  
                  <div className="form-content">
                     <div className="text-s bold-500 pd-05">Private Event</div>
                     <div className="text-xs grey-4 mb-05">This means you must approve each guest when they request a ticket to your event</div>
                     <Switch value={isPrivateEvent} onSwitch={() => setIsPrivateEvent(prev => !prev)} />
                  </div>

                  <div className="form-content">
                     <button className='s' onClick={createEventSubmit} disabled={buttonLoading}>
                        {buttonLoading ? <Spinner /> : ('Create Event')}
                     </button>
                  </div>
               </div>
               
            </div>
         </main>

         <Footer />
      </div>
   )
}
