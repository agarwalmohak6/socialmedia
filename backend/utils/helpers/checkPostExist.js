import StatusCodes from "../statusCodes.js";
const checkPostExist = (post) => {
  if (!post) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Post not found" });
  }
};

export default checkPostExist;
