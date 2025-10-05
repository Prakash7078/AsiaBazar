import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../config/url";
import { toast } from "react-toastify";

// Get all products
export const getProducts = createAsyncThunk("api/getProducts", async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/products/getProducts`);
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
});

// Add a new product
export const addProduct = createAsyncThunk("api/addProduct", async (productData) => {
  try {
    const result = await axios.post(`${BASE_URL}/api/admin/addProduct`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success(result.data.message);
    return result.data;
  } catch (err) {
    toast.error("Failed to add product");
    console.log(err);
  }
});

// Update a product
export const updateProduct = createAsyncThunk("api/updateProduct", async ({formData,productId}) => {
  try {
    const result = await axios.patch(`${BASE_URL}/api/admin/updateProduct/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success(result.data.message);
    return result.data;
  } catch (err) {
    toast.error("Failed to update product");
    console.log(err);
  }
});
export const getProduct=createAsyncThunk("api/getSingleProduct",async(id)=>{
  try{
    const result=await axios.get(`${BASE_URL}/api/products/getSingleProduct/${id}`);
    return result.data;
  }catch(err){
    console.log(err);
  }
})
// Delete a product
export const deleteProduct = createAsyncThunk("api/deleteProduct", async (id) => {
  try {
    const result = await axios.delete(`${BASE_URL}/api/admin/deleteProduct/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success(result.data.message);
    return id;
  } catch (err) {
    toast.error("Failed to delete product");
    console.log(err);
  }
});
export const getCartItems=createAsyncThunk("api/getCartItems", async ({user_id}) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/products/getCartItems/${user_id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }}
    );
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
});
export const deleteCartItem=createAsyncThunk("api/deleteCartItem", async ({user_id,cart_item_id}) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/products/deleteCartItem/${user_id}/${cart_item_id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }}
    );
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
});

export const updateCartItem=createAsyncThunk("api/updateCartItem", async({user_id,cart_item_id,quantity})=>{
  try{
    const res=await axios.put(`${BASE_URL}/api/products/updateCartItem/${user_id}/${cart_item_id}`,{quantity},{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`,
      }
    });
    return res.data;
  }catch(err){
    console.log(err);
  }

})

export const addproducttoCart=createAsyncThunk("api/addProductCart",async({ user_id, product_id, quantity })=>{
  try{
    console.log(product_id,quantity,"scscs")
    const result=await axios.post(`${BASE_URL}/api/products/addProductCart`,{user_id,product_id,quantity},{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }}
    )
    toast.success(result.data.message);
  }catch(err){
    toast.warn(err.response.data.message);    
    console.log(err);
  }
})
export const placeCustomerOrder=createAsyncThunk("api/placeOrder",async({formData,cartItems})=>{
  try{
    const result=await axios.post(`${BASE_URL}/api/products/placeOrder`,{formData,cartItems},{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }}
    )
    toast.success(result.data.message);
  }catch(err){
    toast.warn(err.response.data.message);    
    console.log(err);
  }
})

export const getCustomerOrders=createAsyncThunk("api/getOrders",async(user_id)=>{
  try{
    const result=await axios.get(`${BASE_URL}/api/products/getOrders/${user_id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }}
    )
    return result.data;
  }catch(err){
    console.log(err);
  }
})

export const deleteCart=createAsyncThunk("api/deleteCart",async(user_id)=>{
  try{
    console.log("user_id",user_id);
    const result=await axios.delete(`${BASE_URL}/api/products/deleteCart/${user_id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }}
    )
    toast.success(result?.data?.message);
    return result.data;
  }catch(err){
    console.log(err);
  }
})

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    cartItems:[],
    customer_orders:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = payload;
      })
      .addCase(getProducts.rejected, (state) => {
        state.loading = false;
        toast.error("Network error while fetching products");
      });
    builder
      .addCase(getCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartItems.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.cartItems = payload;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.loading = false;
        toast.error("Network error while fetching products");
      });

    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products.push(payload.product); // assuming returned data has { product }
      })
      .addCase(addProduct.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = state.products.map((product) =>
          product._id === payload.product._id ? payload.product : product
        );
      })
      .addCase(updateProduct.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = state.products.filter((product) => product._id !== payload);
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
      })
      .addCase(deleteCart.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(placeCustomerOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeCustomerOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        toast.success(payload?.message);
      })
      .addCase(placeCustomerOrder.rejected, (state) => {
        state.loading = false;
      });
      builder
      .addCase(getCustomerOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.customer_orders = payload;
      })
      .addCase(getCustomerOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
