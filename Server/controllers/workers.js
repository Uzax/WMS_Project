import Bins from "../models/Bins.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import axios from "axios";

const bins_demo = {
  1: 95,
  2: 84,
  3: 53,
  4: 20,
  5: 95,
  6: 84,
  7: 53,
  8: 20,
};

export const getAllTasks = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const tasks = await Task.find({ Worker_id: id });
    const ALLTASKS = await Promise.all(
      tasks.map(async (task) => {
        return {
          ...{
            id: task.Task_id,
            bid: task.Bin_id,
            Status: task.Status,
            by: task.By,
            to: task.Worker_id,
          },
        };
      })
    );

    res.status(200).json(ALLTASKS);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getWorkerTasks = async (req, res) => {
  try {
    const { id, lng, lat } = req.params;
    console.log(id, lng, lat);
    const tasks = await Task.find({ Worker_id: id, Status: 0 });
    const TasksWithBinsLocation = await Promise.all(
      tasks.map(async (task) => {
        const bin = await Bins.find({ id: task.Bin_id });
        return {
          ...{
            id: task.Task_id,
            bid: task.Bin_id,
            Status: task.Status,
            lng: bin[0].lng,
            lat: bin[0].lat,
            city: bin[0].city,
            neighborhood: bin[0].neighborhood,
            street: bin[0].street,
            Fill: bins_demo[task.Bin_id],
            to: task.Worker_id,
            by : task.By
          },
        };
      })
    );

    //Sort the bins in the order of the distance from the worker
    const sortingArray = await generateSortingArray1(TasksWithBinsLocation, {
      lng: lng,
      lat: lat,
    });

    let Msg = "";
    sortingArray.length > 0
      ? (Msg = "have current tasks")
      : (Msg = "Does Not have tasks!");

    res.status(200).json({
      message: Msg,
      array: sortingArray,
      link: Map_Link(sortingArray, lng, lat),
      navigate : Map_Link3(sortingArray)
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const Map_Link = (array, Userlng, Userlat) => {
  const CurrentLocation = `${Userlat},${Userlng}`;

  let locofBinsString = "";

  //array.push({ lat: Userlat, lng: Userlng });

  array.forEach((bin, index) => {
    {
      index === array.length - 1
        ? (locofBinsString += `&destination=${bin.lat},${bin.lng}`)
        : index === 0
        ? (locofBinsString += `waypoints=${bin.lat},${bin.lng}`)
        : (locofBinsString += `|${bin.lat},${bin.lng}`);
    }
  });



  // array.pop();
  return `https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&origin=${CurrentLocation}&mode=driving&${locofBinsString}`; // ${markersString}`
};



const Map_Link3 = (array) => {
  

  let locofBinsString = "";

  //array.push({ lat: Userlat, lng: Userlng });

  array.forEach((bin, index) => {
    {
      index === array.length - 1
        ? (locofBinsString += `&destination=${bin.lat},${bin.lng}`)
        : index === 0
        ? (locofBinsString += `waypoints=${bin.lat},${bin.lng}`)
        : (locofBinsString += `|${bin.lat},${bin.lng}`);
    }
  });



  // array.pop();
  return `https://www.google.com/maps/dir/?api=1&origin=&${locofBinsString}`; // ${markersString}`
};

          //https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=26.315738,50.163780&waypoints=26.312738,50.161780|26.318738,50.169780
// generate a sorting array depends on the langtude and latitude of the bins and current location of the worker
// the sorting array will be used to sort the bins in the order of the distance from the worker

const generateSortingArray1 = async (array, current) => {
  if (array.length == 0) return array;

  const sortingArray = [];

  const Link = Map_Link2(array, current.lng, current.lat);

  await axios.get(Link).then((res) => {
  
    const order = res.data.routes[0].waypoint_order;
    console.log(order);

    order.forEach((number) => {
      sortingArray.push(array[Number(number)]);
    });
  });

  return sortingArray;
};

const Map_Link2 = (array, Userlng, Userlat) => {
  const CurrentLocation = `${Userlat},${Userlng}`;

  let locofBinsString = "";

  array.forEach((bin) => {
    {
      locofBinsString += `|${bin.lat},${bin.lng}`;
    }
  });

  // array.pop();
  return `https://maps.googleapis.com/maps/api/directions/json?origin=${CurrentLocation}&destination=${CurrentLocation}&waypoints=optimize:true${locofBinsString}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
};


export const setCompleteTask = async (req, res) => {
  try {
    const task_id = req.body.tid;
    const by = req.body.by;

    console.log(task_id, by);

    const UpdatedTask = await Task.updateOne(
      { Task_id: task_id, Worker_id: by },
      { $set: { Status: 1 } }
    );

    if (UpdatedTask.modifiedCount == 0) {
      res.status(404).json({ message: "Task Not Found" });
    }

    res.status(200).json({ message: "task completed", Details: UpdatedTask });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



//https://www.google.com/maps/dir/?api=1&origin=&destination=26.315738,50.163780&waypoints=26.312738,50.161780|26.318738,50.169780