import { Box } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#f5f7fa"
      }}
    >
      <Navbar selectedIcon={currentPath} />
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: "hidden", 
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
