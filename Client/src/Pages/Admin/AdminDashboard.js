// Dashboard.js

import React from "react";
import { Routes, Route } from "react-router-dom";
//Importing the Pages 
import Worker from "./Worker";
import Bins from "./Bins";
import Tasks from "./Tasks";
import Dashboard from "./Dashboard";
import Logout  from "../Shared/Logout";


function AdminDashboard() {


  return (
    <>
      {}{" "}
     
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard  name= {localStorage.getItem("name")}/>} />
          <Route path="/worker" element={<Worker />} />
          <Route path="/bins" element={<Bins />} />
          {/* <Route path="/workerRequests" element={<WorkerRequests />} /> */}
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/logout" element={<Logout  />} />
        </Routes>

      </main>
    </>
  );
}

export default AdminDashboard;
