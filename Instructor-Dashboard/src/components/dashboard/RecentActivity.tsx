import { Box, Typography, Paper, Divider } from "@mui/material";

interface Activity {
  type: string;
  title: string;
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.75, fontSize: "0.8rem" }}>
        Recent Activity
      </Typography>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
          {activities.slice(0, 2).map((activity, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', py: 0.75 }}>
                <Box 
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 0.7,
                    mr: 1.25
                  }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="medium" fontSize="0.75rem">
                    {activity.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    {activity.date}
                  </Typography>
                </Box>
              </Box>
              {index < activities.slice(0, 2).length - 1 && <Divider sx={{ my: 0.25 }} />}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
} 