import StatusCodes from "../statusCodes";
export default checkUserExist = (user) => {
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }
};
