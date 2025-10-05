import { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import "@fontsource/inria-sans";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface SignUpPageProps {
  switchToSignIn: () => void;
}

export default function SignUpPage({ switchToSignIn }: SignUpPageProps) {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
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

  const handleSignUp = async () => {
    
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill out all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const user = await signUp(username, email, password, "instructor");
      if (user) {
        navigate("/home");
      } else {
        setError("Sign up failed - please try again");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("Sign up failed - please try again later");
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
        Create Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          {error}
        </Alert>
      )}

      <TextField
        variant="standard"
        placeholder="Username"
        sx={{ ...textFieldStyling, mt: 4, width: "100%" }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        variant="standard"
        placeholder="Email"
        sx={{ ...textFieldStyling, mt: 3, width: "100%" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        variant="standard"
        placeholder="Password"
        type="password"
        sx={{ ...textFieldStyling, mt: 3, width: "100%" }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        variant="standard"
        placeholder="Confirm Password"
        type="password"
        sx={{ ...textFieldStyling, mt: 3, width: "100%" }}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        variant="contained"
        onClick={handleSignUp}
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
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
      </Button>

      <Box sx={{ display: "flex", mt: 4 }}>
        <Typography color="gray" fontWeight="bold" fontFamily="Inria Sans">
          Already have an account?
        </Typography>
        <Typography
          sx={{ ml: 1, cursor: "pointer" }}
          fontWeight="bold"
          onClick={switchToSignIn}
        >
          Sign In
        </Typography>
      </Box>
    </Box>
  );
}
