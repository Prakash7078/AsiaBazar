const express = require("express");
const router = express.Router();


const isAuth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const { addProduct, updateProduct, deleteProduct, updateOrder, getAllOrders, getAllUsers } = require("../controllers/adminControllers");
// router.get("/", isAuth, getDetails);
// router.post("/addAdmin", isAuth, addAdmin);
router.use(isAuth, requireAdmin);
router.get("/getUsers",getAllUsers)
router.get("/getOrders",getAllOrders)
router.put("/updateOrder/:orderId",updateOrder)
router.post("/addProduct", addProduct);
// router.get("/getProduct/:id", isAuth, getSingleProduct); // optional
router.patch("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
