import mongoose from "mongoose";
import { PENDING, ACCEPTED, REJECTED } from "../utils/constants.js";

const friendSchema = mongoose.Schema({
  followRequestBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followRequestTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: [PENDING, ACCEPTED, REJECTED],
    default: PENDING,
  },
});

export default friendSchema;