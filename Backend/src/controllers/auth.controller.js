import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { meetingModel } from "../models/meeting.model.js";

async function userRegister(req, res) {
  const { fullname, username, password } = req.body;

  const isUser = await userModel.findOne({ username });

  if (isUser) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "user already exist!",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await userModel.create({
      fullname,
      username,
      password: hash,
    });

    const token = await JWT.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    return res.status(StatusCodes.CREATED).json({
      message: "user registered successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error in backend",
    });
  }
}

async function userLogin(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "username invalid!",
    });
  }

  const isUserAuthenticated = await bcrypt.compare(password, user.password);

  if (!isUserAuthenticated) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Password is wrong",
    });
  }

  try {
    const token = await JWT.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    user.token = token;

    await user.save();

    return res.status(StatusCodes.OK).json({
      message: "user logged in successfully",
      token,
      user: {
        fullname: user.fullname,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "error in backend",
    });
  }
}

async function userLogout(req, res) {
  res.clearCookie("token");

  return res.status(StatusCodes.OK).json({
    message: "user logged out successfully.",
  });
}

async function getUserHistory(req, res) {
  const { token } = req.query;

  try {
    const user = await userModel.findOne({ token: token });
    const meetings = await meetingModel.find({ user_id: user.username });
    res.json(meetings);
  } catch (err) {
    res.json({ message: `somthing went wrong ${err}` });
  }
}

async function addToHistory(req, res) {
  const { token, meeting_code } = req.body;

  try {
    const user = await userModel.findOne({ token: token });
    

    const newMeeting = new meetingModel({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(StatusCodes.CREATED).json({ message: "Added code to history" });
  } catch (err) {
    res.json({ message: `Somthing went wrong ${err}` });
  }
}

export { userRegister, userLogin, userLogout, getUserHistory, addToHistory };
