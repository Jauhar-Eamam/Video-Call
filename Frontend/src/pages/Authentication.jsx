import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BGImg from "../assets/authImg.jpg";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";

import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Authentication() {
  const [fullname, setfullname] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode");

  const [formState, setFormState] = React.useState(mode === "signup" ? 1 : 0);

  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
    try {
      setErr("");
      setMessage("");
      if (formState === 0) {
        let result = await handleLogin(username, password);
        setMessage(result);
        setOpen(true);
      }
      if (formState === 1) {
        let result = await handleRegister(fullname, username, password);
        setMessage(result);
        setOpen(true);
        setFormState(0);
      }

      setfullname("");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.log(err);
      let message = err.response.data.message;
      setErr(message);
    }
  };

  let clearInput = () => {
    setfullname("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        direction="row"
        wrap="nowrap"
        sx={{
          height: "100vh",
        }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={BGImg}
            alt="Auth Image"
            sx={{
              width: "100%",
              height: "100vh",
              objectFit: "cover",
              display: "block",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 2,
              color: "white",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
              }} onClick={() => navigate('/')}
            >
              Apna Video Call
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            width: "50%",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <div>
              <Button
                variant={formState === 0 ? "contained" : ""}
                onClick={() => {
                  clearInput();
                  setFormState(0);
                }}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : ""}
                onClick={() => {
                  clearInput();
                  setFormState(1);
                }}
              >
                Sign UP
              </Button>
            </div>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                mt: 1,
                width: "100%",
                maxWidth: "400px",
              }}
            >
              {formState === 1 ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  autoFocus
                  value={fullname}
                  onChange={(e) => setfullname(e.target.value)}
                />
              ) : (
                <></>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <p style={{ color: "red" }}>{err}</p>

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
              >
                {formState === 0 ? <p>Sign In</p> : <p>Sign Up</p>}
              </Button>
              <Grid
                container
                className="authPagecontainer"
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  {" "}
                  {formState === 0 ? (
                    <Link
                      href="#"
                      onClick={() => setFormState(1)}
                      variant="body2"
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  ) : (
                    <Link
                      href="#"
                      onClick={() => setFormState(0)}
                      variant="body2"
                    >
                      {"I have an account? Sign In"}
                    </Link>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </ThemeProvider>
  );
}
