import React, { useEffect, useState } from "react";
import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Link } from "react-router-dom";

import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

import axios from "axios";

const Item = ({ title, to, icon }) => {
  
  return (
    <Box display="flex">
      <Link to={to}>
        <IconButton>
          {icon}
          <Typography>{title}</Typography>
        </IconButton>
      </Link>
    </Box>
  );
};

const Topbar = ({ adminbar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);


  const [Status, setStatus] = useState("0");

  useEffect(() => {
    setStatus(localStorage.getItem("status"));
  }, []);

  const ChangeStatus = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/changeStatus`, {
        id: localStorage.getItem("id"),
        status: localStorage.getItem("status"),
      })
      .then((res) => {
        localStorage.setItem("status", Status === "0" ? "1" : "0");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const active = () => {

    const Col  = localStorage.getItem("status") === "0" ? colors.redAccent[400] : colors.greenAccent[400];
    const icon = localStorage.getItem("status") === "0" ? <ThumbDownOffAltIcon /> : <ThumbUpOffAltIcon />;
    const text = localStorage.getItem("status") === "0" ? "Offline" : "Online";
    return (
      <>
        <Box display="flex" bgcolor={Col} onClick={ChangeStatus} >
              <IconButton>
                {icon}
                <Typography> {text} </Typography>
              </IconButton>
            </Box>
      </>


    )
  }

  return (
    <>
      {adminbar ? (
        <Box
          display="flex"
          justifyContent="space-between"
          p={1}
          bgcolor={colors.primary[400]}
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="h4"
              color={colors.greenAccent[100]}
              fontWeight="bold"
              fontSize="x-large"
            >
              WMS
            </Typography>
          </Box>

          <Item title="Dashboard" to="/" icon={<HomeOutlinedIcon />} />
          <Item title="Bins" to="/bins" icon={<AutoDeleteOutlinedIcon />} />
          <Item title="Team" to="/worker" icon={<PeopleOutlinedIcon />} />
          <Item title="Tasks" to="/tasks" icon={<AssignmentIcon />} />

          <Box display="flex" justifyContent="space-between" gap={2}>

            <Item title="" to="/logout" icon={<LoginOutlinedIcon />} />
          </Box>
        </Box>
      ) : (
        // USER

        <Box
          display="flex"
          justifyContent="space-between"
          p={1}
          bgcolor={colors.primary[400]}
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="h4"
              color={colors.greenAccent[100]}
              fontWeight="bold"
              fontSize="x-large"
            >
              WMS
            </Typography>
          </Box>
          <Item
            title="Active Tasks"
            to="/activeTasks"
            icon={<AssignmentIcon />}
          />
          <Item title="All Tasks" to="/tasks" icon={<TaskAltIcon />} />

          <Box display="flex" justifyContent="space-between" gap={2}>

            {active()}

            <Item title="" to="/logout" icon={<LoginOutlinedIcon />} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Topbar;
