import mongoose from "mongoose";
import * as yup from "yup";

// Define Yup schema for friend validation
const friendValidationSchema = yup.object().shape({
  followRequestBy: yup
    .string()
    .required("Follow request by user ID is required"),
  followRequestTo: yup
    .string()
    .required("Follow request to user ID is required"),
});

const friendSchema = mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Friend = mongoose.model("Friend", friendSchema);

// Validate function
const validateFriend = (friendData) => {
  return friendValidationSchema.validate(friendData, { abortEarly: false });
};

export { Friend, validateFriend };
