import { model, models, Schema } from "mongoose";

const EventsSchema = new Schema<UserEvent>({
   userid: { type: String },
   eventid: { type: String, unique: true },
   name: { type: String },
   description: { type: String },
   eventDate: { type: Number },
   maxGuests: { type: Number },
   allowControl: { type: Boolean },
   eventCode: { type: String, unique: true },
   guests: { type: [{
      name: { type: String },
      ticketCode: { type: String },
      requestAt: { type: Number },
      approvedAt: { type: Number }
   }] },
   createdAt: { type: Number },
})

const UserEventsDb = models.UserEvents || model("UserEvents", EventsSchema)
export default UserEventsDb;