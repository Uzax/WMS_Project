// Worker ALL TASKS . Worker Dashboard .. 
import React from "react";
import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../Shared/Header";
import Tables from "../Shared/Tables";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Alert from "@mui/material/Alert";
import axios from "axios";

const TaskWorker = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const CurrentUser = localStorage.getItem("id");

  const [tasks, setTasks] = useState([]);

  const [isError, setisError] = useState(false);


  const handleRowSelection = () => {
  }

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/alltasks/${CurrentUser}`)
      .then((res) => {
        console.log(res.data);
        setTasks(res.data);
      })
      .catch((err) => {
        console.log(err);
        setisError(true);
      });
  }, []);
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "bid", headerName: "BIN ID", flex: 1 },
    {
      field: "by",
      headerName: "By ",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "Status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { Status } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              Status === 1 ? colors.greenAccent[600] : colors.redAccent[600]
            }
            borderRadius="4px"
          >
            {Status === 1 ? <CheckOutlinedIcon /> : <ClearOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {Status === 1 ? "Completed" : "Not Completed"}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {isError === true ? (
        <>
          <Alert variant="filled" severity="error">
            Error in fetching data from the server
          </Alert>
        </>
      ) : (
        <>
          <Box m="20px">
            <Header title="Tasks" subtitle="All Tasks Active and Completed" />
            <Box m="30px 0 0 0">
              {/* <Button  variant="outlined" color="error" component={Link} to="/workerRequests">Reject</Button> */}

              <Tables
                Coulmns={columns}
                Rows={tasks}
                rowsPerPageOptions={[10, 25, 50]}
                setRow={handleRowSelection}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default TaskWorker;
