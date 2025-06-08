import { model, models, Schema } from "mongoose";

const UsersSchema = new Schema<User>({
   userid: { type: String, unique: true },
   name: { type: String },
   email: { type: String, unique: true },
   password: { type: String }
})

const UsersDb = models.Users || model("Users", UsersSchema)
export default UsersDb;