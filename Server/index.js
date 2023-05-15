import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
// Imports js 
import generalRoutes from "./general.js"
import APIRoutes from "./API.js"

import https from 'https';
import fs from 'fs';



//User Scheme imports 

// import User from "./models/User.js";
// import Bins from './models/Bins.js';
// import Task from "./models/Task.js";
// import Counter from "./models/Counter.js";
// import {Workers} from "./data/mockData.js"


/* Cetificate */
const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/wms-kfupm.com/privkey.pem'), 
    cert: fs.readFileSync('/etc/letsencrypt/live/wms-kfupm.com/fullchain.pem')
  };

/* Configuration */


const corsOptions = {
    origin: '*', // Replace with the actual origin of your frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  };


dotenv.config();
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));


/* Routes */
app.use("/api" ,APIRoutes )
app.use("/Gateway" , generalRoutes);






/* MONGO DB */
const PORT = process.env.PORT;
mongoose.connect(process.env.MONGO_URL , { 
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    // app.listen(PORT , ()=> (console.log(`Server Port: ${PORT}`)));

    https.createServer(httpsOptions, app).listen(PORT, () => { console.log(`Server Port: ${PORT}`)});

    // User.insertMany(Workers);
    // Bins.insertMany(BINS2);
    // Task.insertMany(Tasks1111);
    // Counter.insertMany([{_id : "Task_id" , seq : 21}])

    

}).catch((error) => console.log(`${error} Didn't Connect`))
