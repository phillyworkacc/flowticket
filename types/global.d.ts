type User = {
   userid: string;
   name: string;
   email: string;
   password: string;
}

type Guest = {
   name: string;
   ticketCode: string;
   requestAt: number;
   approvedAt: number;
}

type UserEvent = {
   userid: string;
   eventid: string;
   name: string;
   description: string;
   eventDate: number;
   maxGuests: number;
   allowControl: boolean;
   eventCode: string;
   guests: Guest[];
   createdAt: number;
}

type UserEventFilteredForGuest = {
   eventid: string;
   name: string;
   description: string;
   eventDate: number;
   maxGuests: number;
   allowControl: boolean;
   eventCode: string;
}