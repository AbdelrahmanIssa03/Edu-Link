import { useState } from "react";
import { Box, Paper } from "@mui/material";
import SignInForm from "../pages/SignInPage";
import SignUpForm from "../pages/SignUpPage";

export default function AuthPanelSwitcher() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "500px"
        }}
      >
        {isSignIn ? (
          <SignInForm switchToSignUp={() => setIsSignIn(false)} />
        ) : (
          <SignUpForm switchToSignIn={() => setIsSignIn(true)} />
        )}
      </Paper>
    </Box>
  );
}
