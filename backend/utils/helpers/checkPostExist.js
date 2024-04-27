import StatusCodes from "../statusCodes";
export default checkPostExist = (post) => {
  if (!post) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Post not found" });
  }
};
