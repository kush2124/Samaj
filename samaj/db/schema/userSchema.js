import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  name: {
    first: { type: String },
    last: { type: String },
  },
  education: {
    level: { type: Number },
    value: { type: String },
  },
  status: {
    type: String,
    enum: ["DRAFT", "PENDING", "APPROVED", "REJECTED"],
    default: "DRAFT",
  },
  approvedBy: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Users = (db) => {
  return db.model("users", userSchema);
};

export default Users;
