import mongoose from "mongoose";

const broucherSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    fileurl: {
        type: String,
    }
})

export const Broucher = mongoose.model('Broucher', broucherSchema);