import express from "express";
import { getBins, getStatus , postStatus , getWorkers ,postDelete , postTasks , getAllWorkers , getTasks } from "./controllers/API.js";
import {getWorkerTasks , setCompleteTask , getAllTasks} from "./controllers/workers.js"
import {checkLogin ,  ChangeStatus , SignUp } from "./controllers/auth.js";
import {adminStatics } from "./controllers/statics.js"

import Task from "./models/Task.js";

const router = express.Router();


//Login and Register
router.post("/login",checkLogin )
router.post("/changeStatus" , ChangeStatus)
router.post("/signup" , SignUp)


//Admin Dashboard
router.get("/bins", getBins);
router.get("/binStatus" , getStatus)
router.post("/binStatus" , postStatus)
router.get("/workers",getWorkers)
router.post("/deleteTask" , postDelete)
router.post("/submitTasks" , postTasks)
router.get("/allWorkers" , getAllWorkers);
router.get("/allTaska" , getTasks);



//Worker Dashboard
router.get("/WorkerTasks/:id/:lng/:lat", getWorkerTasks);
router.post("/taskcomp", setCompleteTask);
router.get("/alltasks/:id" , getAllTasks);


// Statics Dashboards
router.get("/StaticsAdmin" , adminStatics)

export default router;
