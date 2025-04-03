const express = require("express");
const { signup, getUsers, deleteUser,login,verifyEmail } = require("../controllers/userController");
const router = express.Router();
const authMiddleware  = require('../middleware/authMiddleware');

router.post("/signup", signup);
router.get("/verify-Email" ,verifyEmail);
router.get("/login",login);
router.get("/getUser",authMiddleware, getUsers);
router.delete("/delete/:id",authMiddleware, deleteUser);

module.exports = router;