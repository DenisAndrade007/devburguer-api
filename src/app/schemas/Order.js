import mongoose from "mongoose";
import { type } from "os";

const OrderSchema = new mongoose.Schema({
  user:{
    id: {
      type:stringify,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
  },
    products: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,  
        },
      quantity: {
        type: Number,
        required: true,
      },
    }
    ],

    status: {
      type: String,
      required: true,
    },
  }, 
  { 
    timestamps: true 
  }

);
  
  export default mongoose.model("Order", OrderSchema);
