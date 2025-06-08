'use client';
import "./Features.css"
import Spacing from "@/components/Spacing/Spacing";
import { Link, Palette, CircleCheck, ScanLine } from 'lucide-react';

const features = [
   {
      icon: <Link size={24} />,
      title: 'Instant Event Link',
      description: 'Create and share your own unique event link in seconds.',
   },
   {
      icon: <Palette size={24} />,
      title: 'Personalized Tickets',
      description: 'Let guests customize their ticket look and feel — make it personal and fun.',
   },
   {
      icon: <CircleCheck size={24} />,
      title: 'Ticket Approval Control',
      description: 'Manually approve or deny ticket requests for exclusive or invite-only events.',
   },
   {
      icon: <ScanLine size={24} />,
      title: 'Ticket Scanner',
      description: 'Scan and validate guest tickets at the door — fast, easy, secure.',
   },
];

export default function Features() {
   return (
      <section className="features-section" id="features">
         <h2>Features</h2>
         <div className="features-grid">
         {features.map((feature, index) => (
            <div key={index} className="feature-card">
               <div className="icon">
                  <div className="icon-wrapper">{feature.icon}</div>
               </div>
               <div>
                  <div className="text-xs bold-700 pd-05">{feature.title}</div>
                  <p>{feature.description}</p>
               </div>
            </div>
         ))}
         </div>
         <Spacing size={2} />
      </section>
   );
}
