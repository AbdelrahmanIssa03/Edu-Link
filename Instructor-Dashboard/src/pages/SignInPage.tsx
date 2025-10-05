import { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import "@fontsource/inria-sans";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface SignInPageProps {
  switchToSignUp: () => void;
}

export default function SignInPage({ switchToSignUp }: SignInPageProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const textFieldStyling = {
    "& .MuiInput-underline:before": { borderBottomColor: "gray" },
    "& .MuiInput-underline:after": { borderBottomColor: "black" },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "darkgray",
    },
    "& input::placeholder": { fontWeight: "bold" },
  };

  const handleLogIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const user = await login(email, password);
      if (user) {
        navigate("/home");
      } else {
        setError("Login failed - please check your credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed - please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "80%",
        maxWidth: "400px",
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "10px",
      }}
    >
      <img
        src="src/assets/open-book (1).png"
        alt="Book"
        style={{ maxWidth: "50px", marginBottom: "20px" }}
      />
      <Typography variant="h4" fontFamily="Inria Sans" fontWeight="bold">
        Welcome Back!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          {error}
        </Alert>
      )}

      <TextField
        variant="standard"
        placeholder="Email"
        sx={{ ...textFieldStyling, mt: 4, width: "100%" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        variant="standard"
        placeholder="Password"
        type="password"
        sx={{ ...textFieldStyling, mt: 4, width: "100%" }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Box sx={{ width: "100%", textAlign: "right", mt: 2 }}>
        <Typography
          variant="body2"
          color="gray"
          fontWeight="bold"
          sx={{ cursor: "pointer" }}
          onClick={() => console.log("Forgot Password clicked")}
        >
          Forgot Password?
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={handleLogIn}
        disabled={loading}
        sx={{
          mt: 4,
          width: "60%",
          height: 45,
          borderRadius: "1000px",
          backgroundColor: "#2D2D2D",
          textTransform: "none",
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
      </Button>

      <Box sx={{ display: "flex", mt: 4 }}>
        <Typography color="gray" fontWeight="bold" fontFamily="Inria Sans">
          Don't have an account?
        </Typography>
        <Typography
          sx={{ ml: 1, cursor: "pointer" }}
          fontWeight="bold"
          onClick={switchToSignUp}
        >
          Sign Up
        </Typography>
      </Box>
    </Box>
  );
}
