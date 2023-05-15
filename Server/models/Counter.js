import mongoose from "mongoose";

const CounterSch = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        seq: {
            type: Number,
        },
    });

  
const Counter = mongoose.model("Counter",CounterSch);
export default Counter;