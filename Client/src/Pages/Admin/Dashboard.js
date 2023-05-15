import React , {useState , useEffect} from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Piecharts from "../Shared/Piecharts";
import { tokens } from "../../theme";
import Header from "../Shared/Header";
import BarChart from "../Shared/BarChart";
import axios from "axios";



const Dashboard = ({ name }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [bins , setBins] = useState([])
  const [tasks , setTasks] = useState([])
  const [binsDist , setbinsDist] = useState([])
  const [tasksWorker , setTasksWorker] = useState([])





  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/StaticsAdmin`)
    .then(res => {
      setBins(res.data[0])
      setbinsDist(res.data[1])
      setTasks(res.data[2])
      setTasksWorker(res.data[3])
    })
    .catch(err => console.log(err))
  }, [])



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
              data={binsDist}
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
            <Piecharts useColor={true} Data={bins} />
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
            <Piecharts useColor={true} Data={tasks} />
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
              data={tasksWorker}
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
