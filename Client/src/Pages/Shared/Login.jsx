import { React, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import axios from "axios";


const theme = createTheme({
  palette: { background: { default: "#dbf5ee" }, primary: { main: "#3da58a" } },
});

export default function Login(props) {
  const [errorMessages, setErrorMessages] = useState(false);
  const { setSumbitted } = props;
  // const { SetuserDataa } = props;
  

  // Generate JSX code for error message
  const renderErrorMessage = (err) =>
    err === true && (
      <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
        Wrong Username or Password
      </Alert>
    );

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    var uname = data.get("username");
    var pass = data.get("password");

    // Find user login info
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/login`, {
        username: uname,
        password: pass,
      })
      .then((res) => {
        console.log(res.data);
        console.log(res.status === 200);
        if (res.status === 200) {
          console.log("HEREE");
          const UserData = res.data.userData;
          // SetuserDataa(UserData);
          setSumbitted(true);
          // Setting locsal Stoarge 
          localStorage.setItem("id" , UserData.id);
          localStorage.setItem("username", UserData.email); //Tobe Edited 
          localStorage.setItem("name", UserData.name);
          localStorage.setItem("access", UserData.access);
          localStorage.setItem("status", UserData.online);
        } else {
          setErrorMessages(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessages(true);
      });


  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#3da58a" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="#3da58a">
            Log in to your profile
          </Typography>
          {renderErrorMessage(errorMessages)}
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="user name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Register a new pofile"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>

     
      </Container>
  
    </ThemeProvider>
  );
}
