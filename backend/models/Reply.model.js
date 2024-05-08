import mongoose from "mongoose";
import * as Yup from "yup";

const replySchema = mongoose.Schema(
  {
    postId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Post"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  userId: Yup.string(),
  text: Yup.string().required("Text is required"),
});

const validateReply = (replyData) => {
  return replySchemaValidation.validate(replyData, { abortEarly: false });
};

export { Reply, validateReply };
