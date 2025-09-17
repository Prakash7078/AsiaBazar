const express=require('express');
const isAuth=require('../middleware/auth');
const { getAllProducts, getSingleProduct, getCartItems, addProductCart, deleteCartItem, updateCartItem, deleteCart } = require('../controllers/categoryController');
const { addCustomerOrder, getUserOrders } = require('../controllers/checkoutController');
const router=express.Router();
router.get("/getProducts", getAllProducts);
router.get("/getSingleProduct/:id",getSingleProduct);
router.get("/getCartItems/:userId",isAuth,getCartItems);
router.delete("/deleteCart/:user_id",isAuth,deleteCart);
router.post("/addProductCart",isAuth,addProductCart);
router.delete("/deleteCartItem/:user_id/:cart_item_id",isAuth,deleteCartItem);
router.put("/updateCartItem/:user_id/:cart_item_id",isAuth,updateCartItem);
router.post("/placeOrder",isAuth,addCustomerOrder);
router.get("/getOrders/:user_id",isAuth,getUserOrders);

module.exports=router;