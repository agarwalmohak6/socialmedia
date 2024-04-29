import mongoose from "mongoose";
import * as Yup from "yup";

const replySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Reply = mongoose.model("Reply", replySchema);

const replySchemaValidation = Yup.object().shape({
  userId: Yup.string().required("User ID is required"),
  text: Yup.string().required("Text is required"),
});

const validateReply = async (replyData) => {
  return replySchemaValidation.validate(replyData, { abortEarly: false });
};

export { Reply, validateReply };
