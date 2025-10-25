const express=require("express");
const router = express.Router();
const isAuth=require('../middleware/auth');
const { login,signup, updateProfile, forgotPassword, resetPassword}=require("../controllers/authController.js");

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:id/:token", resetPassword);
router.patch("/profile/:user_id",isAuth,updateProfile);

module.exports=router;