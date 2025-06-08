'use client'
import './TicketCard.css'
import { formatMilliseconds } from '@/utils/date';
import { QRCodeCanvas } from 'qrcode.react';

type TicketCardProps = {
   ticketId: string;
   name: string;
   bgColor: string;
   eventInfo: UserEventFilteredForGuest;
   ref: any;
}

export default function TicketCard({ ticketId, name, eventInfo, bgColor, ref }: TicketCardProps) {
   return (
      <div className='ticket-card-container'>
         <div className="ticket-card" style={{ background: bgColor }} ref={ref}>
            <div className="ticket-qr-code">
               <div className="qr-code">
                  <QRCodeCanvas 
                     value={ticketId}
                     size={100}
                     bgColor="#ffffff"
                     fgColor="#000000"
                     level="H"
                     includeMargin={true}
                  />
               </div>
            </div>

            <div className="event-info" style={{ color: 'white' }}>
               <div className="time text-xxxs bold-300" style={{ opacity: 0.7 }}>{formatMilliseconds(eventInfo.eventDate)}</div>
               <div className="title text-s bold-600">{eventInfo.name}</div>
            </div>

            <div className="ticket-id">Ticket # {ticketId.split(name)[1].substring(0,10)}</div>
            
            <div className="guest-info" style={{ color: 'white' }}>
               <div className="guest-name text-xxl bold-700">{name}</div>
            </div>
         </div>
      </div>
   )
}
