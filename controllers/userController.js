const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const sendEmail = require("../utils/sendEmail");
dotenv.config();



exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = jwt.sign({ email }, "your-secret-key", { expiresIn: process.env.JWT_EXPIRES_IN });

    user = new User({ name, email, password : hashedPassword , isVerified: false,verificationToken });
    await user.save();

    const verificationLink = `http://localhost:5000/verify-email?token=${verificationToken}`;
        const emailHtml = `
            <h2>Welcome to Our App, ${name}!</h2>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email</a>
            <p>This link will expire in 1 hour.</p>
        `;
          console.log("EmailHtml",emailHtml);
        await sendEmail(email, "Verify Your Email", emailHtml);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmail = async(req,res) =>{
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Invalid verification token" });

    const decoded = jwt.verify(token, "your-secret-key");
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "Email is already verified" });

    user.isVerified = true;
    user.verificationToken = null; 
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in!" });
} catch (err) {
    res.status(500).json({ message: "Invalid or expired token" });
}

}

exports.updateUser = async (req,res) =>{
  try{
    let user = await User.findByIdAndUpdate(req.params.id,req.body ,{useFindAndModify: false});
    if(!user) return res.status (404).json({message: "User not found"});
    res.status(200).json({ message: "User Updated successfully" });
  }catch(err){
    res.status(500).json({ message: "server error"});
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Account does not exist",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h", 
    });

    res.status(200).json({ token, message: "User login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};