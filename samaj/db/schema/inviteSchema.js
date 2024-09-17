import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Code is required"],
  },
  status: {
    type: String,
  },
});

const Invite = (db) => {
  return db.model("invites", inviteSchema);
};

export default Invite;
