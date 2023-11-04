// models/shareDetailModel.js
import mongoose from "mongoose";

const shareDetailSchema = new mongoose.Schema({
  shareholder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shareholder",
  },
  duration: Number,
  annualAmount: Number,
  installmentType: String,
  startDate: String,
  installmentAmount: Number,
  installments: [
    {
      installmentNumber: Number,
      installmentDate: Date,
      amount: Number,
    },
  ],
  totalInstallmentAmount: Number,
  // other fields...
});

export const ShareDetail = mongoose.model("ShareDetail", shareDetailSchema);
