'use client'
import '@/styles/guest.css'
import TicketCard from '@/components/TicketCard/TicketCard';
import { addGuest, checkIfGuestCanJoinEvent } from '@/app/actions/userEvents';
import { formatMilliseconds } from '@/utils/date';
import { wait } from '@/utils/wait';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import ColorSelector from '@/components/ColorSelector/ColorSelector';
import { generateRandomCode } from '@/utils/hash';
import html2canvas from 'html2canvas';


function Spinner () {
   return <span className="spinner" />;
}

export default function GuestRequestPage ({ eventInfo }: { eventInfo: UserEventFilteredForGuest }) {
   const router = useRouter();
   const [step, setStep] = useState(1);
   const [guestName, setGuestName] = useState('');
	const captureRef = useRef<HTMLDivElement | null>(null);
   
   const [index, setIndex] = useState(0);
   const waitingTexts = ['Grabbing Event Info', 'Checking for available spaces']
   
   const [ticketId, setTicketId] = useState('');
   const [ticketBgColor, setTicketBgColor] = useState('linear-gradient(150deg,rgba(28, 100, 255, 1) 0%, rgba(201, 83, 237, 1) 100%)');
   const [buttonLoading, setButtonLoading] = useState(false)

   const finalizeTicketAddGuest = async () => {
      const res = await addGuest({
         name: guestName,
         ticketCode: ticketId,
         requestAt: Date.now(),
         approvedAt: 0
      }, eventInfo.eventid);
      setStep(res ? 6 : 7);
      setButtonLoading(false);
   }

   const createImage = async () => {
		if (!captureRef.current) return;
		const canvas = await html2canvas(captureRef.current, { scale: 2 });
		return canvas.toDataURL();
	}

	const saveImage = async () => {
      setButtonLoading(true);
		const imgUrl = await createImage();
		if (!imgUrl) return;
		const link = document.createElement('a');
		link.download = `ticket-${generateRandomCode()}.png`;
		link.href = imgUrl;
		link.click();
      await finalizeTicketAddGuest();
	};

   const checkSpaceAvailable = async () => {
      setStep(3);
      await wait(4);
      const res = await checkIfGuestCanJoinEvent(eventInfo.eventid);
      setStep(res ? 5 : 4);
      if (res) setTicketId(`${guestName}0${generateRandomCode(16)}`);
   }

   useEffect(() => {
      const interval = setInterval(() => {
         setIndex(prev => (prev + 1) % waitingTexts.length);
      }, 1000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className='guest-page-container'>

         {(step == 1) && <div className="event-details">
            <div className="text-xxb bold-900 pd-1 text-center">{eventInfo.name}</div>
            <div className="text-sm grey-3 text-center pd-1">{eventInfo.description}</div>
            <div className="text-ml grey-1 text-center pd-1 mc">{formatMilliseconds(eventInfo.eventDate)}</div>
            <br />
            <div className="text-sm text-center pd-1 dfb justify-center">
               <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.05 }}
                  className='l pdx-4 pd-15'
                  onClick={() => setStep(2)}
               >
                  {eventInfo.allowControl ? ('Request Ticket') : ('Get Ticket')}
               </motion.button>
            </div>
         </div>}

         {(step == 2) && <div className="guest-details">
            <input type="text" className='xxxl' placeholder="Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            {(guestName !== '') && <>
               <div className="text-sm text-center pd-2 dfb justify-center">
                  <motion.button 
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.85 }}
                     transition={{ duration: 0.05 }}
                     className='m pdx-4 pd-15'
                     onClick={checkSpaceAvailable}
                  >Continue</motion.button>
               </div>
            </>}
         </div>}

         {(step == 3) && <div className="guest-details">
            <div className="guest-space-checking">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={waitingTexts.indexOf(waitingTexts[index])}
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: -20, opacity: 0 }}
                     transition={{ duration: 0.5}}
                  >
                     <div className='text-l bold-700 dfb align-center text-center justify-center gap-4' style={{ whiteSpace:"wrap"}}>{waitingTexts[index]}</div>
                  </motion.div>
               </AnimatePresence>
            </div>
         </div>}

         {(step == 4) && <div className="guest-details">
            <div className='text-l bold-700 dfb align-center justify-center text-center  gap-4'>
               Sorry {guestName} 🥲, there aren't any spaces left for this event.
            </div>
            <div className="text-sm text-center pd-2 dfb justify-center">
               <button className='m pd-1 pdx-2' onClick={() => router.push('/')}>
                  Make your own event
               </button>
            </div>
         </div>}

         {(step == 5) && <div className='ticket-customizer'>
            <div className="text-xxl bold-600 text-center pd-15 mb-1">Customize your ticket</div>
            {/* <input type="text" maxLength={1} className='xxxl' placeholder="Emoji" value={ticketEmoji} onChange={(e) => setTicketEmoji(e.target.value)} /> */}
            <ColorSelector 
               options={[
                  'linear-gradient(150deg,rgba(28, 100, 255, 1) 0%, rgba(201, 83, 237, 1) 100%)',
                  'linear-gradient(150deg,rgba(255, 28, 236, 1) 0%, rgba(237, 150, 83, 1) 100%)',
                  'linear-gradient(150deg,rgba(28, 100, 255, 1) 0%, rgba(237, 155, 83, 1) 100%)',
                  'linear-gradient(150deg,rgba(209, 194, 23, 1) 0%, rgba(237, 83, 83, 1) 100%)',
                  'linear-gradient(150deg,rgba(101, 209, 23, 1) 0%, rgba(83, 219, 237, 1) 100%)',
                  'linear-gradient(150deg,rgb(230, 0, 255) 0%, rgb(209, 30, 30) 100%)',
                  'linear-gradient(150deg,rgba(255, 167, 84, 1) 0%, rgba(217, 207, 20, 1) 100%)',
               ]}
               onSelect={(option) => setTicketBgColor(option)}
               defaultOptionIndex={0}
            />
            <TicketCard
               ref={captureRef}
               ticketId={ticketId}
               name={guestName}
               bgColor={ticketBgColor}
               eventInfo={eventInfo}
            />
            <div className="text-sm text-center pd-2 dfb justify-center">
               <button className='m pd-1 pdx-2' onClick={saveImage} disabled={buttonLoading}>
                  {buttonLoading ? <Spinner /> : <><Lock /> Save your Ticket</>}
               </button>
            </div>
         </div>}

         {(step == 6) && <div className="guest-details">
            <div className='text-ml bold-500 dfb align-center justify-center text-center gap-4'>
               Congrats {guestName} 🥳🎉, you have requested to attend {eventInfo.name}
            </div>
            <div className='text-l bold-700 dfb align-center justify-center text-center gap-4'>
               Make sure you have your ticket saved !
            </div>
            <div className="text-sm text-center pd-2 dfb justify-center">
               <button className='sm pd-1 pdx-2' onClick={() => router.push('/')}>
                  Make your own event
               </button>
            </div>
         </div>}

         {(step == 7) && <div className="guest-details">
            <div className='text-l bold-700 dfb align-center justify-center text-center  gap-4'>
               Sorry {guestName} 🥲, we could not process your request to the event. Please try again later.
            </div>
            <div className="text-sm text-center pd-2 dfb justify-center">
               <button className='sm pd-1 pdx-2' onClick={() => router.push('/')}>
                  Make your own event
               </button>
            </div>
         </div>}

      </div>
   )
}
