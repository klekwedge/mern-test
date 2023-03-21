import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Ok");
  })
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
  const errors = validationResult(req);

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash,
  });

  const user = await doc.save();

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  res.json(user);
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
});
