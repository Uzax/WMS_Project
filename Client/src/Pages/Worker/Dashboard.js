import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Piecharts from "../Shared/Piecharts";
import { tokens } from "../../theme";
import Header from "../Shared/Header";
import BarChart from "../Shared/BarChart";
const Data22 = [
  {
    District: "KFUPM",
    Full: 10,
    Not_Full: 40,
  },
  {
    District: "Al Dawhah",
    Full: 50,
    Not_Full: 10,
  },
  {
    District: "Al Aqrabiyah",
    Full: 10,
    Not_Full: 40,
  },
  {
    District: "Al Andalus",
    Full: 30,
    Not_Full: 30,
  },
  {
    District: "Al Olaya",
    Full: 10,
    Not_Full: 40,
  },
  {
    District: "Al Qusur",
    Full: 10,
    Not_Full: 20,
  },
];

const Data33 = [
  {
    Worker: "Worker 1",
    DoneTasks: 10,
    PendingTasks: 20,
  },
  {
    Worker: "Worker 2",
    DoneTasks: 20,
    PendingTasks: 10,
  },
  {
    Worker: "Worker 3",
    DoneTasks: 30,
    PendingTasks: 0,
  },
  {
    Worker: "Worker 4",
    DoneTasks: 40,
    PendingTasks: 10,
  },
  {
    Worker: "Worker 10",
    DoneTasks: 10,
    PendingTasks: 20,
  },
  {
    Worker: "Worker 22",
    DoneTasks: 20,
    PendingTasks: 10,
  },
  {
    Worker: "Worker 122",
    DoneTasks: 20,
    PendingTasks: 10,
  },
  {
    Worker: "Worker 0",
    DoneTasks: 20,
    PendingTasks: 10,
  },

  {
    Worker: "Worker 110",
    DoneTasks: 20,
    PendingTasks: 10,
  },
  {
    Worker: "Worker 011",
    DoneTasks: 20,
    PendingTasks: 10,
  },
];

const Data = [
  {
    id: "Full",
    label: "Filled",
    value: 20,
    color: "hsl(10, 97%, 62%)",
  },

  {
    id: "Not Full",
    label: "Filled",
    value: 40,
    color: "hsl(145, 97%, 53%)",
  },
];

const Data444 = [
  {
    id: "Done",
    label: "Completed",
    value: 250,
    color: "hsl(35, 97%, 62%",
  },

  {
    id: "Pending",
    label: "Pending",
    value: 500,
    color: "hsl(159, 97%, 62%)",
  },
];
const Dashboard = ({ name }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={name} subtitle="Welcome to your dashboard" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        m="20px"
      >
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Bins Per District
          </Typography>
          <Box
            height="290px"
            width="760px"
            top={"-30px"}
            left={"-40px"}
            position="relative"
          >
            <BarChart
              data={Data22}
              Col={["hsl(145, 97%, 53%)", "hsl(10, 97%, 62%)"]}
              X="District"
              Y="Status"
              Keys={["Full", "Not_Full"]}
            />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Total Bins
          </Typography>
          <Box height="250px" mt="-20px">
            <Piecharts useColor={true} Data={Data} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Total Tasks
          </Typography>
          <Box height="280px">
            <Piecharts useColor={true} Data={Data444} />
          </Box>
        </Box>

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Tasks per Worker
          </Typography>
          <Box
            height="290px"
            width="100%"
            top={"-30px"}
            left={"-40px"}
            position="relative"
          >
            <BarChart
              data={Data33}
              Col={["hsl(159, 97%, 62%)", "hsl(35, 97%, 62%)"]}
              X="Worker"
              Y="Tasks"
              Keys={["DoneTasks", "PendingTasks"]}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
