import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminSlice from "./adminSlice";
import productSlice from './productSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        admin:adminSlice,
        product: productSlice,
    },
  });
  
  export default store;