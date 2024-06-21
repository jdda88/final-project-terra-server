import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import isAdmin from "../middleware/admin.middleware.js";
import isAuth from "../middleware/authentication.middleware.js";

const router = express.Router();

// SIGN UP (USERNAME, EMAIL, PASSWORD REQUIRED)
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email and password" });
    }

    const foundUser = await User.findOne({ $or: [{ email }, { username }] });

    if (foundUser) {
      return res.status(400).json({
        message:
          "The email or username already exists, please provide a new one",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ message: "Please provide a valid email address." });
      return;
    }
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase, one uppercase letter and a special character.",
      });
      return;
    }
    const salts = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salts);
    const createdUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created succesfully", createdUser });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


//LOG IN (PASSWORD REQUIRED, USERNAME OR EMAIL REQUIRED)
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    if (!(email || username) || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email or user name and password" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status.json({
        message: "Email/Username or password incorrect",
      });
    }

    delete user._doc.password;

    const jwtToken = jwt.sign(
      { payload: user },
      process.env.TOKEN_SIGN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "24H",
      }
    );

    res.json({ user, authToken: jwtToken });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


//CHECKS TOKEN AND AUTH USER
router.get("/verify", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ message: "User is logged in.", user });
  } catch (error) {
    console.log("error in verify", error);
    res.status(500).json(error);
  }
});


//CHECKS IF ITS ADMIN
router.get("/admin", isAuth, isAdmin, async (req, res) => {
  try {
    res.json({ message: "Addmin is logged in and verified", user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
