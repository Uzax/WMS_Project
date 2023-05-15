import { React, useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import mapStyles from "../Shared/mapStyles";
import Tables from "../Shared/Tables";
import { tokens } from "../../theme";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import renderProgress from "../Shared/renderProgress";
import axios from "axios";
import Loading from "../Shared/Loading";
import Alert from "@mui/material/Alert";

const mapContainerStyle = {
  height: "50vh",
  width: "100%",
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const tablestyle = {
  // backgroundColor: "rgb(52 91 86)",
  borderradius: "20px",
  height: "44vh",
  padding: "0 0px 0px 0px",
  overflow: "scroll",
};

const buttonGroupStyle = {
  // backgroundColor: "rgb(52 91 86)",
  left: "33%",
  height: "50px",
  width: "300px",
};

const Bins = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // For Map puposes
  const [bins, setBins] = useState(null);
  const [SelectedBin, setSelectedBin] = useState();

  //Auto Completed Change :

  const [SelectedWorkers, setSelectedWorkers] = useState([]);

  //Center
  const [center, setCenter] = useState({ lat: 26.314056, lng: 50.14391 });

  // names of the workers
  const [names, setNames] = useState(null);
  const [WorkerDetails, setWorkerDetails] = useState(null);

  const [Error, setError] = useState(false);

  const handleworkersSelction = (newValue, id) => {
    setSelectedWorkers((prevSelectedWorkers) => {
      // create a copy of the previous selected workers array
      const newSelectedWorkers = prevSelectedWorkers
        ? [...prevSelectedWorkers]
        : [];
      // find the index of the worker with the same id in the array
      const index = newSelectedWorkers.findIndex((worker) => worker[0] === id);
      // if the worker is already selected and the name is null, remove the record
      if (index !== -1 && newValue === null) {
        newSelectedWorkers.splice(index, 1);
      } else if (index !== -1) {
        // if the worker is already selected, update the name
        newSelectedWorkers[index][1] = WorkerDetails[newValue];
      } else if (newValue !== null) {
        // add the new worker to the array
        newSelectedWorkers.push([id, WorkerDetails[newValue]]);
      }
      return newSelectedWorkers;
    });
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
          // window.location.reload(false);
          window.location = window.location;
        }
        console.log("Succfule");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlesubmit = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/submitTasks`, {
        data: SelectedWorkers,
        by : localStorage.getItem("name")
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
          // window.location = window.location;
        }
        console.log("Succfule ");
      })
      .catch((error) => {
        console.log("error");
      });
  };

  const handleRowSelection = (value) => {
    setSelectedBin(bins.find((bin) => bin.id === value));

    setCenter({
      lat: SelectedBin?.lat ?? 26.314056,
      lng: SelectedBin?.lng ?? 50.14391,
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/bins`)
      .then((res) => {
        setBins(res.data);
      })
      .catch((error) => {
        console.log("ERROR IN GETTING BINS");
        console.log(error);
        setError(true);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/workers`)
      .then((res) => {
        // setNames(res.data);
        setWorkerDetails(res.data);
        setNames(Object.keys(res.data));
      })
      .catch((error) => {
        console.log(`${process.env.REACT_APP_BASE_URL}/api/workers`);
        console.log("ERROR IN GETTING WORKERS");
        console.log(error);
        setError(true);
      });
  }, []);

  const coulmns = [
    { field: "id", headerName: "Bin ID", flex: 1 },
    {
      field: "Fill",
      headerName: "Filled Level",
      renderCell: renderProgress,
      type: "number",
      width: 200,
      headerAlign: "left",
    },
    {
      field: "Assigned_to",
      headerName: "Assigned TO",
      width: 200,
      headerAlign: "left",
      cellClassName: "name-column--cell",
    },
    {
      filed: "Assign",
      headerName: "Assign",
      flex: 1,
      renderCell: ({ row: { Assigned_to, id, Task_id } }) => {
        return (
          <Box>
            {Assigned_to !== null ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancelation(Task_id)}
              >
                Cancel {Assigned_to}
              </Button>
            ) : (
              <Autocomplete
                onChange={(event, newValue) => {
                  handleworkersSelction(newValue, id);
                }}
                id="controllable-states-demo"
                options={names}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Workers" />
                )}
              />
            )}
          </Box>
        );
      },
    },
  ];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (loadError)
    return (
      <>
        <Alert variant="filled" severity="error">
          Google Map Error
        </Alert>
      </>
    );
  if (!isLoaded) return <Loading />;

  if (bins) {
    return (
      <>
        <div>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={center}
            options={options}
          >
            {/* Markers */}

            {bins.map((bin) => (
              <MarkerF
                key={bin.id}
                position={{ lat: bin.lat, lng: bin.lng }}
                icon={{
                  url:
                    bin.Fill >= 80
                      ? `${process.env.PUBLIC_URL}/trash-red.svg`
                      : bin.Fill >= 50
                      ? `${process.env.PUBLIC_URL}/trash-yellow.svg`
                      : `${process.env.PUBLIC_URL}/trash.svg`,

                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                onClick={() => {
                  setSelectedBin(bin);
                }}
              />
              // </Marker>
            ))}

            {SelectedBin ? (
              <InfoWindowF
                position={{ lat: SelectedBin.lat, lng: SelectedBin.lng }}
                onCloseClick={() => {
                  setSelectedBin(null);
                }}
              >
                <div style={{ color: "black" }}>
                  <h2> Bin ID : {SelectedBin.id}</h2>
                  <p> Fill Level : {SelectedBin.Fill} % </p>
                </div>
              </InfoWindowF>
            ) : null}
          </GoogleMap>

          {/* "rgb(52 91 86)" */}

          {SelectedWorkers.length > 0 ? (
            <Box sx={{ backgroundColor: colors.primary[400] }}>
              <Button
                variant="contained"
                color="success"
                style={buttonGroupStyle}
                onClick={() => handlesubmit()}
              >
                Submit
              </Button>
            </Box>
          ) : null}

          <div style={tablestyle}>
            <Tables
              Coulmns={coulmns}
              Rows={bins}
              setRow={handleRowSelection}
              rowsPerPageOptions={[5, 10, 20]}
              binsize={true}
            />
          </div>
        </div>
      </>
    );
  }
  //ELSE :

  if (Error) {
    return (
      <>
        <Alert variant="filled" severity="error">
          Error in fetching data from the server
        </Alert>
      </>
    );
  }
  return (
    <>
      <Loading />
    </>
  );
};

export default Bins;

// //TOBE DELTED :
// //Selected value of Worker :
// const [selectedWorker, setSelectedWorker] = useState(null);
// //Selected bins from Table :
// const [SelectedTableBins, setSelectedTableBins] = useState(null);

// const handleBinsChange = (value) => {
//   setSelectedTableBins(value);
//   // console.log(value);
// };

// const handleSelectedWorkerChange = (value) => {
//   setSelectedWorker(value);
// };
