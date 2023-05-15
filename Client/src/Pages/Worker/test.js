import React, { useEffect, useState }  from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Tables from "../Shared/Tables";
import Button from "@mui/material/Button";
import axios from "axios";
import Loading from "../Shared/Loading";
import Alert from "@mui/material/Alert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Snackbar from "@mui/material/Snackbar";



const converting = (value) => {
    return value === "true";
  };
  
  
  const buttonGroupStyle = {
    // backgroundColor: "rgb(52 91 86)",
    // position: "absolute",
    top: "40%",
    left: "40%",
    width: "250px",
    height: "25px",
    //position:"absolute",
    // float: "right",
    right:"10px",
    bottom:"35px",
    transition: "0.5s",
  };



const ActiveTasks = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const [CurrentLocation, setCurrentLocation] = useState(null);
  
    const CurrentUser = localStorage.getItem("id");
  
    const [isError, setisError] = useState(false);
  
    const [isnotTasks, setisnotTasks] = useState(false);


  // Save Current Tasks state
  let CurrentTaskstmp = [];
  {
    localStorage.getItem("CurrentTasks") !== null
      ? (CurrentTaskstmp = JSON.parse(localStorage.getItem("CurrentTasks")))
      : (CurrentTaskstmp = []);
  }
  const [CurrentTasks, setCurrentTasks] = useState(CurrentTaskstmp);

  // Save Source Link state
  let SourceLinktmp = null;
  {
    localStorage.getItem("SourceLink") !== null
      ? (SourceLinktmp = localStorage.getItem("SourceLink"))
      : (SourceLinktmp = null);
  }
  const [SourceLink, setSourceLink] = useState(SourceLinktmp);


  let openSnackCondtion = false;
  {
    localStorage.getItem("openSnack") !== null
      ? (openSnackCondtion = converting(localStorage.getItem("openSnack")))
      : (openSnackCondtion = false);
  }
  const [openSnack, setOpenSnack] = useState(openSnackCondtion);
 

  useEffect(() => {
    console.log("IN USE EFFECT");
    navigator.geolocation.getCurrentPosition((position) => {
        //get location of the user
        const { latitude, longitude } = position.coords;
        setCurrentLocation(`${latitude},${longitude}`);
  
        //get the tasks of the current user
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/WorkerTasks/${CurrentUser}/${longitude}/${latitude}`
          )
          .then((res) => {
            if (res.data.message === "have current tasks") {
              setCurrentTasks(res.data.array);
              setSourceLink(res.data.link);
              localStorage.setItem(
                "CurrentTasks",
                JSON.stringify(res.data.array)
              );
              localStorage.setItem("SourceLink", res.data.link);
              localStorage.setItem("NaviLink", res.data.navigate);
            } else {
              setisnotTasks(true);
            }
          })
          .catch((err) => {
            console.log(err);
            setisError(true);
          });
      } , 
      function (e) {
        console.log("ERROR WITH GEOLOCATION")
        console.log(e);
        setisError(true);
    }, {
        enableHighAccuracy: true,
        timeout: 40000
    });
    }, []);



  const handleNavigate = () => {
    window.open(localStorage.getItem("NaviLink"), "_blank");
  };

  const handleCloseSnack = () => {
    setOpenSnack(false);
    localStorage.removeItem("openSnack");
  };

  const handleCollected = (id) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/taskcomp`, {
        tid: id,
        by: CurrentUser,
      })
      .then((res) => {
        if (res.data.message === "task completed") {
          console.log("task completed");
          window.location.reload(false);
          localStorage.setItem("openSnack", true);
          localStorage.removeItem("CurrentTasks");
          localStorage.removeItem("SourceLink");
          localStorage.removeItem("NaviLink");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "bid", headerName: "Bin ID", flex: 1 },

    {
      field: "by",
      headerName: "Assigned BY",
      flex: 1,
    },
    { field: "city", headerName: "City", flex: 1 },
    { field: "neighborhood", headerName: "District", width: 200, flex: 1 },
    { field: "street", headerName: "Street", width: 200, flex: 1 },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row: { id } }) => {
        return (
          <Box>
            <Button
              id={id}
              variant="contained"
              color="success"
              onClick={() => handleCollected(id)}
            >
              Collected
            </Button>
          </Box>
        );
      },
    },
  ];


  const action = (
    <Snackbar
      open={openSnack}
      autoHideDuration={5000}
      onClose={handleCloseSnack}
    >
      <Alert
        onClose={handleCloseSnack}
        severity="success"
        sx={{ width: "100%" }}
      >
        The Task is Completed
      </Alert>
    </Snackbar>
  );


  return (
    <>
      {CurrentTasks.length > 0 && SourceLink !== null ? (
       <>
          {/* <Box id="parent"> */}
            <iframe
              src={SourceLink}
              style={{  width:"100%",
                height:"45vh",
                border:"0px", }}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>


            <Button
              variant="contained"
              color="success"
              style={buttonGroupStyle}
              onClick={handleNavigate}
              // className="button-iframe"
            >
              GO !
            </Button>
   
          {/* </Box> */}

          
            <Tables
              Coulmns={columns}
              Rows={CurrentTasks}
              rowsPerPageOptions={[10, 25, 50]}
              binsize={true}
              setRow={() => {}} //dummy function
            />
        
          {/* </Box> */}

          {action}
          </>
      ) : isError ? (
        <>
          <Alert variant="filled" severity="error">
            Error in fetching data from the server
          </Alert>
        </>
      ) : isnotTasks ? (
        <>
          <div
            style={{
              // height: "50%",
              width: "50%",
              position: "relative",
              top: "33%",
              left: "33%",
            }}
          >
            <ThumbUpIcon
              sx={{ fontSize: 150, position: "relative", left: "15%" }}
            />
            <Typography variant="h3">
              You Don't Have any Active Tasks
            </Typography>
          </div>
        </>
      ) : (
        <>
          {/* <div>LOAdING</div> */}
          <div
            style={{
              height: "50%",
              width: "50%",
              position: "relative",
              top: "50%",
              left: "50%",
            }}
          >
            <Loading />
          </div>
        </>
      )}
    </>
  );
};

export default ActiveTasks;
