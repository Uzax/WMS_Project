import { useState } from "react";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import WorkerDashboard from "./Pages/Worker/Workerdashboard";
import Login from "./Pages/Shared/Login";
import SignUp from "./Pages/Shared/SignUp";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./Pages/Shared/Topbar";

import { Routes, Route } from "react-router-dom";





const converting = (value) => {
  return value === "true";
};

function App() {
  const [theme, colorMode] = useMode();

  // tobe
  let condtion = false;
  {
    localStorage.getItem("LogedIn") !== null
      ? (condtion = converting(localStorage.getItem("LogedIn")))
      : (condtion = false);
  }
  const [isLogged, setIsLogged] = useState(condtion);

  const handleSubmitted = (value) => {
    console.log("value", value);
    console.log("TRUEUE");
    localStorage.setItem("LogedIn", value);

    setIsLogged(value);
  };


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isLogged ? (
            localStorage.getItem("access") === "admin" ? (
              <>
             
                  <Topbar  adminbar={true}/>
                  <AdminDashboard />
              </>
            ) : (
              <>
              <Topbar  adminbar={false}/>
              <WorkerDashboard />
              </>
            )
          ) : (
            <>
            <Routes>
           <Route path="/" element={ <Login setSumbitted={handleSubmitted} />} />
            <Route path="/signup" element={<SignUp />} />
           </Routes>            
            </>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
