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
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useSearchParams, useNavigate } from "react-router-dom";

import BGImg from "../assets/authImg.jpg";

import { AuthContext } from "../contexts/AuthContext";

const defaultTheme = createTheme();

export default function Authentication() {
  const [fullname, setfullname] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
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

      let message = err?.response?.data?.message || "Something went wrong";

      setErr(message);
    }
  };

  const clearInput = () => {
    setfullname("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
    setErr("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          minHeight: "100vh",
          flexWrap: "nowrap",
        }}
      >
        <CssBaseline />

        <Grid
          item
          xs={false}
          sm={5}
          md={7}
          sx={{
            display: { xs: "none", sm: "block" },
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
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 10,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Apna Video Call
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={7}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              px: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: "secondary.main",
                }}
              >
                <LockOutlinedIcon />
              </Avatar>

              <Typography component="h1" variant="h5">
                {formState === 0 ? "Sign In" : "Sign Up"}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 2,
                }}
              >
                <Button
                  variant={formState === 0 ? "contained" : "outlined"}
                  onClick={() => {
                    clearInput();
                    setFormState(0);
                  }}
                >
                  Sign In
                </Button>

                <Button
                  variant={formState === 1 ? "contained" : "outlined"}
                  onClick={() => {
                    clearInput();
                    setFormState(1);
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                mt: 3,
              }}
            >
              {formState === 1 && (
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
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* ERROR */}
              {err && (
                <Typography
                  sx={{
                    color: "red",
                    mt: 1,
                    fontSize: "14px",
                  }}
                >
                  {err}
                </Typography>
              )}

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.2,
                }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Sign In" : "Sign Up"}
              </Button>

              {/* LINKS */}
              <Grid
                container
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
                  {formState === 0 ? (
                    <Link
                      href="#"
                      variant="body2"
                      onClick={() => setFormState(1)}
                    >
                      Don't have an account? Sign Up
                    </Link>
                  ) : (
                    <Link
                      href="#"
                      variant="body2"
                      onClick={() => setFormState(0)}
                    >
                      Already have an account? Sign In
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
