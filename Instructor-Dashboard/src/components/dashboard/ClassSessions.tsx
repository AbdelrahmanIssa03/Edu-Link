import { Box, Typography, Paper } from "@mui/material";
import { Session } from "../../types/Session";

interface ClassSessionsProps {
  className: string;
  sessions: Session[];
}

export default function ClassSessions({ className, sessions }: ClassSessionsProps) {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Class Sessions
      </Typography>
      <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
        {className}
      </Typography>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflowY: 'auto', pr: 0.5 }}>
          {sessions.slice(0, 5).map((session, index) => (
            <Paper 
              key={session.id}
              elevation={0} 
              sx={{ 
                p: 1.5, 
                mb: 1, 
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: index === 0 ? '#f0f4fa' : 'white'
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                {session.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {new Date(session.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Paper>
  );
} 