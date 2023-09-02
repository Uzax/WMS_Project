import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import generalRoutes from "./general.js"
import APIRoutes from "./API.js"
import https from 'https';
import fs from 'fs';



/* Cetificate */
const httpsOptions = {
    key: fs.readFileSync(process.env.httpsprivkey ), 
    cert: fs.readFileSync(process.env.httpsfullchain)
  };

/* Configuration */
const corsOptions = {
    origin: process.env.FrontEndURL,
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
}).catch((error) => console.log(`${error} Didn't Connect`))
