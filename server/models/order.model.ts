import mongoose, { Model, Schema } from "mongoose";
import { IOrder } from "../interfaces/order.interface";

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: { type: String, required: true },
    payment_info: { type: Object },
  },
  { timestamps: true }
);

const orderModel: Model<IOrder> = mongoose.model("Order", orderSchema);
export default orderModel;
