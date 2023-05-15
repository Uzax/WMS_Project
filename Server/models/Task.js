import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        Task_id: {
            type: Number,
            required : true,
            unique : true,
        },
        Status:{
            type : Number,
            required : true,
            min: 0,
            max: 1
        },
        date :{
            type : Date,
            required : true,
        },

        Bin_id : {
            type: String,
            required: true,
        },

        Worker_id : {
            type : Number,
            required : true,
            min : 1,
            max : 50,

        },
        By: {
            type: String,
            default: "Admin",
        }

        
    }
);

const Task = mongoose.model("Task",TaskSchema);
export default Task;