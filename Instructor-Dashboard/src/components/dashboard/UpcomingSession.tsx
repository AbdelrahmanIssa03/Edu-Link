import { Box, Typography, Paper } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface UpcomingSessionProps {
  title: string;
  date: string;
  time: string;
}

export default function UpcomingSession({ title, date, time }: UpcomingSessionProps) {
  return (
    <Paper elevation={0} sx={{ p: 0, borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1, bgcolor: '#0F1323', color: 'white' }}>
        <Typography variant="subtitle2" fontWeight="bold" fontSize="0.8rem">
          Next Upcoming Session
        </Typography>
      </Box>
      <Box sx={{ p: 1.5, flex: 1 }}>
        <Typography variant="body1" fontWeight="bold" fontSize="0.9rem">
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.75 }}>
          <CalendarTodayIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '0.7rem' }} />
          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
            {date}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <AccessTimeIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '0.7rem' }} />
          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
            {time}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
} 