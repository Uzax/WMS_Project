import { React, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from "@mui/material/Alert";
import axios from "axios";

const theme = createTheme({palette:{background:{default: "#dbf5ee"},primary:{main:"#3da58a"}}});

export default function SignUp() {
    const [errorMessages, setErrorMessages] = useState(false);


 const renderErrorMessage = (err) =>
    err === true && (
      <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
        Username Already Exists
      </Alert>
    );





  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    

    var fullname = data.get('fullname')
    var username =  data.get('username')
    var password = data.get('password')

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/signup`, {
        name: fullname,
        username: username,
        password: password,
        })
        .then((res) => {
            if (res.status === 200) {
                console.log("HEREE");
                setErrorMessages(false);
                window.location.href = "/";
            }

            if (res.status === 409) {
                console.log("HEREE");
                setErrorMessages(true);
            }

        }
        )
        .catch((err) => {
            console.log(err);
            setErrorMessages(true);
        }
        );
   
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#3da58a' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="#3da58a">
            Sign up
          </Typography>
          {renderErrorMessage(errorMessages)}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="fullname"
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Go to Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}