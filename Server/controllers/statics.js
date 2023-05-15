import Bins from "../models/Bins.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import axios from "axios";

export const adminStatics = async (req, res) => {
  try {
    const Data = [];

    // BINS PART
    const Bins = await BinsAdminStat();
    Data.push(Bins);
    const BinPerDis = await BinsPerDis();
    Data.push(BinPerDis);

    // TASKS PART
    const TotalTasks = await AdminTotalTasks();
    Data.push(TotalTasks);
    const TaskPerWorkers = await TaskPerWorker();
    Data.push(TaskPerWorkers);

    res.status(200).json(Data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const BinsPerDis = async () => {
  const callBinApi = await axios.get(`${process.env.My_domain}/Gateway/Data`, {
    headers: {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    },
  });

  const DataAPI = callBinApi.data;

  const allBins = await Bins.find();
  let binsPerDis = {};

  allBins.map((bin) => {
    if (binsPerDis[bin.neighborhood] === undefined) {
      binsPerDis[bin.neighborhood] = { Full: 0, Not_Full: 0 };
    }

    if (DataAPI[String(bin.id)] >= 70) {
      binsPerDis[bin.neighborhood].Full += 1;
    } else {
      binsPerDis[bin.neighborhood].Not_Full += 1;
    }
  });

  let Data = [];

  Object.entries(binsPerDis).forEach(([key, value]) => {
    Data.push({
      District: key,
      Full: value.Full,
      Not_Full: value.Not_Full,
    });
  });

  return Data;
};

const BinsAdminStat = async () => {
  const callBinApi = await axios.get(`${process.env.My_domain}/Gateway/Data`, {
    headers: {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    },
  });

  const DataAPI = callBinApi.data;
  let Data = [
    {
      id: "Full",
      label: "Filled",
      value: 0,
      color: "hsl(10, 97%, 62%)",
    },

    {
      id: "Not Full",
      label: "Filled",
      value: 0,
      color: "hsl(145, 97%, 53%)",
    },
  ];

  let full = 0;
  let not_full = 0;

  Object.entries(DataAPI).forEach(([key, value]) => {
    if (value >= 70) {
      full += 1;
    } else {
      not_full += 1;
    }
  });

  Data[0].value = full;
  Data[1].value = not_full;

  return Data;
};

const AdminTotalTasks = async () => {
  const TaskDone = await Task.find({ Status: 1 });
  const All_Task = await Task.find();

  const DATA = [
    {
      id: "Done",
      label: "Completed",
      value: 250,
      color: "hsl(159, 97%, 62%)",
    },

    {
      id: "Pending",
      label: "Pending",
      value: 500,
      color: "hsl(35, 97%, 62%)",
    },
  ];

  DATA[0].value = TaskDone.length;
  DATA[1].value = All_Task.length - TaskDone.length;

  return DATA;
};
const TaskPerWorker = async () => {
  const all_tasks = await Task.find();

  let Found_worker = {};

  for (let i = 0; i < all_tasks.length; i++) {
    if (Found_worker[all_tasks[i].Worker_id] === undefined) {
      const worker_name = await User.find({ id: all_tasks[i].Worker_id });
      Found_worker[all_tasks[i].Worker_id] = {
        Worker: worker_name[0].name,
        DoneTasks: 0,
        PendingTasks: 0,
      };
    }

    if (all_tasks[i].Status === 1) {
      Found_worker[all_tasks[i].Worker_id].DoneTasks += 1;
    } else {
      Found_worker[all_tasks[i].Worker_id].PendingTasks += 1;
    }
  }

  console.log(Found_worker);

  let Data = [];

  Object.entries(Found_worker).forEach(([key, value]) => {
    Data.push({
      Worker: value.Worker,
      DoneTasks: value.DoneTasks,
      PendingTasks: value.PendingTasks,
    });
  });

  return Data;
};
