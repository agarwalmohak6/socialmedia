import mongoose from "mongoose";
import * as yup from "yup";

const postValidationSchema = yup.object().shape({
  postedBy: yup.string().required("Posted by user ID is required"),
  text: yup.string().max(500, "Text cannot exceed 500 characters"),
  img: yup.string().url("Invalid image URL format"),
  likes: yup.array(),
});

const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxlength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

// Validate function
const validatePost = (postData) => {
  return postValidationSchema.validate(postData, { abortEarly: false });
};

export { Post, validatePost };
