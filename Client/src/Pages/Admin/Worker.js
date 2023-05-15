import { React, useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Header from "../Shared/Header";
import { Link } from "react-router-dom";
import Tables from "../Shared/Tables";
import Button from "@mui/material/Button";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import axios from "axios";

const Worker = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [Data , setData] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/allworkers`).then((res) => { 
      setData(res.data);
    });
  }, []);



  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "tasks",
      headerName: "Total Tasks",
      type: "number",
      headerAlign: "center",
      // align: "left",
      flex: 1,
      renderCell: ({ row: { tasks } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
             colors.primary[100]
            }
            borderRadius="4px"
          >
          
            <Typography color={colors.grey[900]} sx={{ ml: "5px" }} variant="h5">
              {tasks}
            </Typography>
          </Box>

        );
      },
    
    },
    {
      field: "active_tasks",
      headerName: "Active Tasks",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row: { active_tasks } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              Number(active_tasks) === 0 ? colors.greenAccent[400] : colors.redAccent[400]
            }
            borderRadius="4px"
          >
          
            <Typography color={colors.grey[900]} sx={{ ml: "5px" }} variant="h5">
              {active_tasks}
            </Typography>
          </Box>

        );
      },
    },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.blueAccent[500]
                : access === "manager"
                ? colors.blueAccent[700]
                : colors.blueAccent[800]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "USER" && <SecurityOutlinedIcon />}
            {access === "worker" && <LocalShippingOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }} >
              {access === "admin" && "ADMIN"}
              {access === "USER" && "WORKER"}
              {access === "worker" && "WORKER"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "online",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { online } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              online === 1 ? colors.greenAccent[600] : colors.redAccent[600]
            }
            borderRadius="4px"
          >
            {online === 1 ? <CheckOutlinedIcon /> : <ClearOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {online === 1 ? "Online" : "Offline"}
            </Typography>
          </Box>

        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Moniroting Team Member" />
      <Box m="30px 0 0 0">
        {/* <Button  variant="outlined" color="error" component={Link} to="/workerRequests">Reject</Button> */}
        {/* <Button
          variant="outlined"
          color="success"
          startIcon={<LocalShippingOutlinedIcon />}
          component={Link}
          to="/workerRequests"
        >
          Workers Requests
        </Button> */}
        <Tables Coulmns={columns} Rows={Data}   rowsPerPageOptions={[10, 25, 50]}/>
      </Box>
    </Box>
  );
};

export default Worker;
