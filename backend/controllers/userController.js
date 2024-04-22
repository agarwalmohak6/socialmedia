import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

const signUpUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ email } || { username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
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
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in signUpUser: ", err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPassCorrect = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPassCorrect) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in login user", error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error while logout", error.message);
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id); // user to follow or unfollow
    const currentUser = await User.findById(req.user._id); // logged in user

    if (!userToModify || !currentUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (userToModify._id.equals(currentUser._id)) {
      return res
        .status(400)
        .json({ message: "You can't follow / unfollow yourself" });
    }

    const isFollowing = currentUser.following.includes(userToModify._id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(userToModify._id, {
        $pull: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: userToModify._id },
      });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow
      await User.findByIdAndUpdate(userToModify._id, {
        $push: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: userToModify._id },
      });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error while following/unfollowing user:", error.message);
  }
};

const updateUser = async (req, res) => {
  const { name, username, email, password, profilePic, bio } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
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
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in update user:", error.message);
  }
};

export { signUpUser, loginUser, logoutUser, followUnfollowUser, updateUser };
