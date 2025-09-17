import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { AiFillDelete } from "react-icons/ai";
import { deleteCartItem, getCartItems, updateCartItem } from '../redux/productSlice';
import { Button } from '@material-tailwind/react';
import {
  Drawer,
} from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
function CartPage() {
  const cartItems = useSelector((state) => state.product.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const[disableminicon,setDisableminicon]=useState('');
  const navigate=useNavigate();
  // const[disablemaxicon,setDisablemaxicon]=useState(false);
  const dispatch=useDispatch();
  const handleDelete=async(cartItemId)=>{
    await dispatch(deleteCartItem({
        user_id: userInfo?.user_id,
        cart_item_id: parseInt(cartItemId),
    }))
    await dispatch(getCartItems({user_id:userInfo?.user_id}));
  }
  const handleUpdate=async(sym,cartItemId,quantity)=>{
    if(sym==='less'){
      if(quantity<=1){
        setDisableminicon(cartItemId)
        quantity=1;
        return;
      }
      quantity=quantity-1;
    }else{
      quantity=quantity+1;
      setDisableminicon('');

    }
    await dispatch(updateCartItem({user_id: userInfo?.user_id,
      cart_item_id: parseInt(cartItemId),
      quantity,
      }))
    await dispatch(getCartItems({user_id:userInfo?.user_id}));
  }
  const totalCartPrice = () => {
    return cartItems?.reduce((total, item) => {
      return total + (item.product_price * item.quantity);
    }, 0);
  };
  
  return (
    <div className="mt-32 px-6 md:px-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className='lg:col-span-2 space-y-4'>

      <h1 className="text-3xl font-bold mb-6 text-[#9C1137]">🛒 My Cart</h1>
      {cartItems?.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 mb-48  ">
          {cartItems.map((item) => {
            const product = item; // assuming item itself contains full product details
            let images = [];

            try {
              images = JSON.parse(product.product_image);
            } catch (err) {
              console.error("Invalid image format");
            }

            return (
              <div
                key={product.cart_item_id}
                className="flex flex-col md:flex-row gap-6 items-center bg-white rounded-lg shadow-md p-4 border"
              >
                <img
                  src={images[0]}
                  alt="product"
                  className="w-40 h-40 rounded-md object-cover border"
                />

                <div className="flex-1 space-y-2">
                  <p className="text-gray-600 text-sm">🛍️ Cart Item </p>
                  <h2 className="text-xl font-bold text-gray-800">{product.product_name}</h2>
                  <p className="text-sm text-gray-600">{product.product_description}</p>
                  <p className="text-sm">
                    <span className="font-semibold">Category:</span> {product.product_category}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Quantity:</span>{' '}
                    {product.product_quantity}
                    {product.quantity_measure}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Price:</span> ${product.product_price}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <button  onClick={()=>handleUpdate('less',product?.cart_item_id,product?.quantity)}  disabled={disableminicon===product?.cart_item_id} className={` ${disableminicon===product?.cart_item_id
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-300 bg-gray-200 cursor-pointer'
                      }  p-2 rounded-full`}>
                      <FaMinus size={12}  />
                    </button>
                    <span className="px-3 py-1 border rounded">{product.quantity}</span>
                    <button onClick={()=>handleUpdate('more',product?.cart_item_id,product?.quantity)} className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
                      <FaPlus size={12}  />
                    </button>
                    <AiFillDelete color='red' size={28} onClick={()=>handleDelete(product?.cart_item_id)} />
                  </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
      {cartItems?.length>0 && <div className="bg-white rounded-lg shadow-md p-6 h-fit">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${(totalCartPrice()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${(totalCartPrice()*0.01).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-green-600">${(totalCartPrice()+(totalCartPrice()*0.01)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Proceed to Checkout
          </button>

          <Link
            to="/allitems"
            className="block text-center text-green-600 hover:text-green-700 mt-4 font-medium"
          >
            Continue Shopping
          </Link>
        </div>}
      </div>
  );
}

export default CartPage;
