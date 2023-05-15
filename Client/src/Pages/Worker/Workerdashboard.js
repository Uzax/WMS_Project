import React from "react";
import { Routes, Route } from "react-router-dom";
//Importing the Pages
import TaskWorker from "./TaskWorker";
import ActiveTasks from "./ActiveTasks";
import Dashboard from "./Dashboard";
import Logout  from "../Shared/Logout";

function WorkerDashboard() {
  return (
    <>
      <main className="content">
        <Routes>
         {/* <Route path="/" element={<Dashboard  name= "Worker"/>} /> */}
          <Route path="/activeTasks" element={<ActiveTasks />} />
          <Route path="/" element={<ActiveTasks />} />
          <Route path="/tasks" element={<TaskWorker />} />
          <Route path="/logout" element={<Logout/>} />
        </Routes>
      </main>
    </>
  );
}

export default WorkerDashboard;
