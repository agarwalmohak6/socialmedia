import StatusCodes from "../statusCodes.js";
const checkUserExist = (user) => {
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }
};

export default checkUserExist;
