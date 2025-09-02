const express = require("express");
const router = express.Router();


const isAuth = require('../middleware/auth');
const { addProduct, updateProduct, deleteProduct, getAllUsers } = require("../controllers/adminControllers.js");

// router.get("/", isAuth, getDetails);
// router.post("/addAdmin", isAuth, addAdmin);
router.get("/getUsers",isAuth,getAllUsers)
router.post("/addProduct", isAuth, addProduct);
// router.get("/getProduct/:id", isAuth, getSingleProduct); // optional
router.patch("/updateProduct/:id", isAuth, updateProduct);
router.delete("/deleteProduct/:id", isAuth, deleteProduct);

module.exports = router;
