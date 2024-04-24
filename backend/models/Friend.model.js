import mongoose from "mongoose";

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
});

const Friend = mongoose.model("Friend", friendSchema);
export default Friend;
