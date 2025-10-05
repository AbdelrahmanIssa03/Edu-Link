import { Box, Typography, Paper, Avatar } from "@mui/material";
import { User } from "../../types/User";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 1.5, 
        mb: 1.5, 
        borderRadius: 2,
        background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            width: 35, 
            height: 35, 
            bgcolor: 'primary.light',
            mr: 2,
            border: '2px solid white'
          }}
        >
          {user?.username?.[0]?.toUpperCase() || 'I'}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
            Welcome back, {user?.username || 'Instructor'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
} 