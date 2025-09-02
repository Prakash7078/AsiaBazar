const express=require('express');
const isAuth=require('../middleware/auth');
const { getAllProducts, getSingleProduct, getCartItems, addProductCart, deleteCartItem, updateCartItem } = require('../controllers/categoryController');
const { addCustomerOrder } = require('../controllers/checkoutController');
const router=express.Router();
router.get("/getProducts", getAllProducts);
router.get("/getSingleProduct/:id",getSingleProduct);
router.get("/getCartItems/:userId",isAuth,getCartItems);
router.post("/addProductCart",isAuth,addProductCart);
router.delete("/deleteCartItem/:user_id/:cart_item_id",isAuth,deleteCartItem);
router.put("/updateCartItem/:user_id/:cart_item_id",isAuth,updateCartItem);
router.post("/placeOrder",isAuth,addCustomerOrder);

module.exports=router;