import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
    {
        id:{
            type: Number,
            required: true,
            validate : {
                validator : Number.isInteger,
                message   : '{VALUE} is not an integer value'
              },
            unique : true
        },
        name:{
            type: String,
            required: true,
            min:2,
            max: 30
        },
        username :{
            type: String,
            required: true,
            unique : true,
            min:2,
            max: 40,
        },
        access:{
            type: String,
            required: true,
            max:10,

        },
        password: {
            type: String,
            required: true,
            min: 5,
          },
          online:{
            type: Number,
            min: 0,
            max: 1,
            default: 0,
            
          }
    },
    { timestamps: true }
);


const User = mongoose.model("User", UserSchema);
export default User;