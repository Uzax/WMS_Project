import { React, useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../Shared/Header";
import Tables from "../Shared/Tables";
import Button from "@mui/material/Button";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import axios from "axios";

const Tasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [Data, setData] = useState([]);


  const handleRowSelection = () => {
    
  };


  const handleCancelation = (Task_id) => {
    // console.log(id, Assigned_to , Task_id);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/deleteTask`, {
        task_id: Task_id,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.body);
          window.location.reload(false);
        }
        console.log("Succfule");
      })
      .catch((error) => {
        console.log(error);
      });
  };


  

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/allTaska`).then((res) => {
      setData(res.data);
    });
  }, []);

  const columns = [
    { field: "id", headerName: "Task ID" },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      cellClassName: "name-column--cell",
    }
    ,

    { field: "bid", headerName: "Bin ID"  ,flex: 1,
      cellClassName: "name-column--cell",},

    {
      field: "to",
      headerName: "Assigned TO",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "by",
      headerName: "Assigned BY",
      flex: 1,
      cellClassName: "name-column--cell",
    }
    ,
   
    {
      field: "status",
      headerName: "Task Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              status === true ? colors.greenAccent[600] : colors.redAccent[600]
            }
            borderRadius="4px"
          >
            {status === true ? <CheckOutlinedIcon /> : <ClearOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {status === true ? "Collected" : "Not Collected"}
            </Typography>
          </Box>
        );
      },
    },
    {
      filed: "Assign",
      headerName: "Assign",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { to, id, status } }) => {
        return (
          <Box>
            {status === true ? (
              <></>
            ) : (
              <Button
                id={"Cancel_button"}
                value={id + "_" + to}
                variant="contained"
                color="error"
                onClick={() => handleCancelation(id)}
              >
                Cancel {to}
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Tasks" subtitle="View All Tasks" />
      <Box m="30px 0 0 0">
        <Tables
          Coulmns={columns}
          Rows={Data}
          rowsPerPageOptions={[10, 25, 50]}
          setRow={handleRowSelection}
        />
      </Box>
    </Box>
  );
};

export default Tasks;
