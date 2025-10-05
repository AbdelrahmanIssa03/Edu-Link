
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
