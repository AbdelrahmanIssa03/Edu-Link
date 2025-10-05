import { Box, Typography, Paper } from "@mui/material";

interface StatsCardProps {
  title: string;
  value: number;
}

interface StatsSectionProps {
  stats: {
    totalClasses: number;
    activeSessions: number;
    upcomingSessions: number;
    totalStudents: number;
  };
}

function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        height: '100%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: 'white'
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <Box sx={{ mb: 1.5, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
      <StatsCard title="Classes" value={stats.totalClasses} />
      <StatsCard title="Active Sessions" value={stats.activeSessions} />
      <StatsCard title="Upcoming" value={stats.upcomingSessions} />
      <StatsCard title="Students" value={stats.totalStudents} />
    </Box>
  );
} 