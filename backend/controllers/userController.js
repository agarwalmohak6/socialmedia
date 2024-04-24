import User from "../models/User.model.js";
import Friend from "../models/Friend.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import StatusCodes from "../utils/statusCodes.js";

const signUpUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ email } || { username });
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(StatusCodes.CREATED).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid user data" });
    }
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
    console.log("Error in signUpUser: ", err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPassCorrect = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPassCorrect) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid login credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(StatusCodes.OK).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    console.log("Error in login user", error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 1 });
    res
      .status(StatusCodes.OK)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    console.log("Error while logout", error.message);
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id); // user to follow or unfollow
    const currentUser = await User.findById(req.user._id); // logged in user
    if (!userToModify || !currentUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    if (userToModify._id.equals(currentUser._id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "You can't follow / unfollow yourself" });
    }
    const existingFriendship = await Friend.findOne({
      followRequestBy: currentUser._id,
      followRequestTo: userToModify._id,
    });
    if (existingFriendship) {
      await Friend.deleteOne(existingFriendship); // Fix: Use deleteOne instead of remove
      res
        .status(StatusCodes.OK)
        .json({ message: "User unfollowed successfully" });
    } else {
      const newFriendship = new Friend({
        followRequestBy: currentUser._id,
        followRequestTo: userToModify._id,
      });
      await newFriendship.save();
      res
        .status(StatusCodes.OK)
        .json({ message: "User followed successfully" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    console.log("Error while following/unfollowing user:", error.message);
  }
};


const updateUser = async (req, res) => {
  const { name, username, email, password, profilePic, bio } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (req.params.id !== userId.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You cannot update other user's profile" });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in update user:", error.message);
  }
};

const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    let user = await User.findOne({ username })
      .select("-password")
      .select("-updatedAt");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in userProfile", error.message);
  }
};

const getFriends = async (req, res) => {
  const { id } = req.params;
  try {
    const friendRequests = await Friend.find({
      $or: [{ followRequestBy: id }, { followRequestTo: id }],
    });
    const friendIds = friendRequests.map((friendRequest) => {
      if (friendRequest.followRequestBy.toString() === id) {
        return friendRequest.followRequestTo;
      } else {
        return friendRequest.followRequestBy;
      }
    });
    const friends = await User.find({ _id: { $in: friendIds } });
    const friendNames = friends.map((friend) => ({
      username: friend.username,
      name: friend.name,
    }));
    return res.status(StatusCodes.OK).json({ friends: friendNames });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in getFriends", error.message);
  }
};

export {
  signUpUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getFriends,
};
