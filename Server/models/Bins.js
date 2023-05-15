import mongoose from "mongoose";


const BinsSchema = new mongoose.Schema(
    {
        id:{
            type: String,
            required: true,
            unique : true
        },
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: false,
        },
        neighborhood: {
            type: String,
            required: false,
        },
        street: {
            type: String,
            required: false,
        },
    }
);


const Bins = mongoose.model("Bins", BinsSchema);
export default Bins;