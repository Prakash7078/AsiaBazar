import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../config/url";
import { toast } from "react-toastify";

export const getUsers = createAsyncThunk("api/getUsers", async (data) => {
  try {
    console.log(data);
    const res = await axios.get(`${BASE_URL}/api/admin/getUsers`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
});

export const addAdmin = createAsyncThunk("api/addAdmin", async (data) => {
  try {
    console.log(data);
    const res = await axios.post(`${BASE_URL}/api/admin/addAdmin`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
});


export const updateOrder= createAsyncThunk("api/updateOrder",async({orderId,orderdata})=>{
  try{
    const res=await axios.put(`${BASE_URL}/api/admin/updateOrder/${orderId}`,orderdata,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  }catch(error){
    throw new Error(error.message);
  }
});
export const getAllOrders = createAsyncThunk("api/getAllOrders",async()=>{
  try{
    const res=await axios.get(`${BASE_URL}/api/admin/getOrders`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  }catch(error){
    throw new Error(error.message);
  }
});
//createSlice(name,state,reducers,extrareducers)
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    orders:[],
    users: [],
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        state.users = payload;
        state.loading = false;

      })
      .addCase(getUsers.rejected, () => {
        toast.error("Network Issue");
      });
    builder
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
        
      })
      .addCase(addAdmin.fulfilled, (state) => {
        toast.success("admin added succesfully");
        state.loading = false;
      })
      .addCase(addAdmin.rejected, () => {
        toast.error("Add admin failed");
      });
    
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, {payload}) => {
        state.orders = payload;
        state.loading = false;

      })
      .addCase(getAllOrders.rejected, () => {
        toast.error("Getting Reviews failed");
      });
   
  },
});
export default adminSlice.reducer;
