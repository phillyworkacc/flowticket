'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, Lock, Palette, PartyPopper, Sparkles, Zap } from 'lucide-react';

const tagSize = 15
const tagStrokeWidth = 3
const tags = [
  <><Sparkles size={tagSize} color='#FF69B4' strokeWidth={tagStrokeWidth} /> Personalized Tickets</>,
  <><Lock size={tagSize} color='#5C6AC4' strokeWidth={tagStrokeWidth} /> Private & Public Events</>,
  <><Camera size={tagSize} color='#00BFA6' strokeWidth={tagStrokeWidth} /> Live Ticket Scanning</>,
  <><Palette size={tagSize} color='#FFB400' strokeWidth={tagStrokeWidth} /> Custom Event Links</>,
  <><CheckCircle size={tagSize} color='#FF6B6B' strokeWidth={tagStrokeWidth} /> Approval-Based Entry</>,
  <><PartyPopper size={tagSize} color='#9C27B0' strokeWidth={tagStrokeWidth} /> Designed for Parties & Creators</>,
  <><Zap size={tagSize} color='#4CAF50' strokeWidth={tagStrokeWidth} /> Instant Event Setup</>
];

const tagsColors = [
   "#FF69B4",
   "#5C6AC4",
   "#00BFA6",
   "#FFB400",
   "#FF6B6B",
   "#9C27B0",
   "#4CAF50"
]

export default function HeroTag() {
   const [index, setIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setIndex(prev => (prev + 1) % tags.length);
      }, 2000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="tag text-xxxs fit mb-2 pd-05 pdx-15" style={{ borderColor: tagsColors[index] }}>
         <AnimatePresence mode="wait">
            <motion.div
               key={tags.indexOf(tags[index])}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.3 }}
            >
               <div className='text-xxxs bold-600 dfb align-center justify-center gap-4' style={{ whiteSpace: "nowrap" }}>{tags[index]}</div>
            </motion.div>
         </AnimatePresence>
      </div>
   );
}