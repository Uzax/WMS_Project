import Bins from "../models/Bins.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Counter from "../models/Counter.js";
import axios from "axios";

const bins_demo = {
  1: 95,
  2: 84,
  3: 53,
  4: 20,
  5: 95,
  6: 84,
  7: 53,
};

export const getBins = async (req, res) => {
  try {
    const DB_Bins = await Bins.find();
    const callBinApi = await axios.get(`${process.env.My_domain}/Gateway/Data` , { headers: {
      'Accept' : "*/*",
      "User-Agent" : "Thunder Client (https://www.thunderclient.com)"
    }}); // Same as http://127.0.0.1:5001/Gateway/Data but with https 
    const currentstatus = callBinApi.data;
    const BinsWithLocation = await Promise.all(
      DB_Bins.map(async (bin) => {
        let assigned_to = await Task.find({
          Bin_id: bin.id,
          Status: 0,
        });
        let Task_id = null ;
        if (assigned_to.length > 0) {
          Task_id = assigned_to[0].Task_id;
          assigned_to = await User.find({ id: assigned_to[0].Worker_id });
          assigned_to = assigned_to[0].name;

        } else {
          assigned_to = null;
        }
        let current_Fill = currentstatus[String(bin.id) || bin.id];
        return {
          ...{
            id: bin.id,
            lng: bin.lng,
            lat: bin.lat,
            city: bin.city,
            neighborhood: bin.neighborhood,
            street: bin.street,
            Fill: current_Fill || null,
            Assigned_to: assigned_to, // tobe : added
            Task_id: Task_id,
          },
        };
      })
    );
    res.status(200).json(BinsWithLocation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    res.status(200).json(bins_demo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postStatus = async (req, res) => {
  try {
    const bin = req.query;
    if (bin.id !== undefined && bin !== {}) {
      bins_demo[bin.id] = parseInt(bin.Fill);
    }
    res.status(200).json(bins_demo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ access: "worker" });
    if (workers.length > 0) {
      const allworkers = workers.reduce((acc, worker) => {
        acc[worker.name] = worker.id;
        return acc;
      }, {});

      console.log(Object.keys(allworkers));

      res.status(200).json(allworkers);
    } else {
      res.status(200).json({ message: "No Workers Found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postDelete = async (req, res) => {
  try {
    const TASK_ID = req.body.task_id;
    console.log("Delete TASK ID -- ");
    console.log(TASK_ID);
    await Task.deleteOne({ Task_id: TASK_ID });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postTasks = async (req, res) => {
  try {
    const data = req.body.data;
    const by = req.body.by;
    //getNextSequence("Task_id")
    for (let i = 0; i < data.length; i++) {
      const task = data[i];

      let idd = await getNextSequence("Task_id");
      await Task.insertMany({
        Task_id: idd,
        Bin_id: task[0],
        Worker_id: task[1],
        Status: 0,
        date : new Date().getTime(),
        By:by
      });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

async function getNextSequence(name) {
  var ret = await Counter.find({ _id: name });
  console.log(ret);
  await Counter.updateOne({ _id: name }, { $inc: { seq: 1 } });

  return ret[0].seq;
}



export const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ access: "worker" });
    const Tasks = await Task.find();
    const Active_Tasks = await Task.find({ Status: 0 });

    if (workers.length > 0) {
      const allworkers = await Promise.all( workers.map((worker) => {
        let assigned_to = Tasks.filter((task) => task.Worker_id === worker.id);
        let active_task = Active_Tasks.filter((task) => task.Worker_id === worker.id);
        return {
          id: worker.id,
          name: worker.name,
          tasks: assigned_to.length ,
          active_tasks : active_task.length,
          access: worker.access,
          online: worker.online,
        };
      }) );


      res.status(200).json(allworkers);
    } else {
      res.status(200).json({ message: "No Workers Found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    const TasksWithNames = await Promise.all(
      tasks.map(async (task) => {
        let assigned_to = await User.find({ id: task.Worker_id });
        assigned_to = assigned_to[0].name;

    
        const date = new Date(task.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it is zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}`;

        return {
          ...{
            id: task.Task_id,
            bid: task.Bin_id,
            to: assigned_to,
            by: task.By, // tobe : added 
            status: task.Status === 1 ? true : false,
            date :formattedDateString,
          },
        };
      })
    );
    res.status(200).json(TasksWithNames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


