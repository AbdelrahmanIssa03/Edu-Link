import { Box, Typography, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ClassIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fontsource/inria-sans";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  selectedIcon: string;
}

export default function Navbar({ selectedIcon }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavigate = (path: string) => {
    if (path === "/logout") {
      logout();
      navigate("/");
      return;
    }
    
    
    if (path === "/settings") {
      return;
    }
    
    navigate(path);
  };

  const items = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/home" },
    { label: "Classes", icon: <ClassIcon />, path: "/classes" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings", disabled: true },
    { label: "Logout", icon: <LogoutIcon />, path: "/logout" },
  ];

  return (
    <Box
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      sx={{
        width: isOpen ? "220px" : "60px",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #F8F9FA 0%, #E9ECEF 100%)",
        height: "100%",
        transition: "width 0.3s ease",
        overflowX: "hidden",
        overflowY: "auto",
        pt: 2,
        pl: 1,
        pr: 1,
        borderRight: "1px solid #E0E0E0",
        boxShadow: "1px 0px 10px rgba(0,0,0,0.05)",
        zIndex: 10
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 3,
          transition: 'padding 0.3s'
        }}
      >
        {isOpen ? (
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: "Inria Sans", 
              fontWeight: "bold",
              color: "#0F1323",
              fontSize: "1.2rem",
              letterSpacing: "0.5px"
            }}
          >
            Instructor
          </Typography>
        ) : (
          <Box 
            sx={{ 
              width: 35, 
              height: 35, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#0F1323',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            I
          </Box>
        )}
      </Box>

      {items.map((item) => (
        <Tooltip title={!isOpen ? item.label : ""} placement="right" key={item.label}>
          <Box
            onClick={() => handleNavigate(item.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: item.disabled ? "not-allowed" : "pointer",
              backgroundColor: selectedIcon.includes(item.path)
                ? "#0F1323"
                : "transparent",
              color: item.disabled
                ? "rgba(0,0,0,0.38)" 
                : (selectedIcon.includes(item.path) ? "white" : "#555"),
              paddingY: 1.2,
              paddingX: 1.5,
              borderRadius: 1.5,
              mb: 0.8,
              transition: "all 0.2s",
              opacity: item.disabled ? 0.6 : 1,
              "&:hover": {
                backgroundColor: item.disabled 
                  ? "transparent" 
                  : (selectedIcon.includes(item.path) ? "#0F1323" : "rgba(15, 19, 35, 0.08)"),
              },
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minWidth: '28px'
            }}>
              {item.icon}
            </Box>
            {isOpen && (
              <Typography
                sx={{
                  fontFamily: "Inria Sans",
                  fontWeight: "500",
                  ml: 1.5,
                  fontSize: "0.9rem"
                }}
              >
                {item.label}
              </Typography>
            )}
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}
