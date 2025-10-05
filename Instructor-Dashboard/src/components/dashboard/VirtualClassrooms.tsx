import { Box, Typography, Paper } from "@mui/material";

interface VirtualClassroomsProps {
  classrooms: string[];
  selectedClassroom: string;
  onSelectClassroom: (classroom: string) => void;
}

export default function VirtualClassrooms({ 
  classrooms, 
  selectedClassroom, 
  onSelectClassroom 
}: VirtualClassroomsProps) {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Your Virtual Classrooms
      </Typography>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%', overflowY: 'auto' }}>
          {classrooms.map((name) => (
            <Paper 
              key={name}
              elevation={1} 
              onClick={() => onSelectClassroom(name)}
              sx={{ 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                borderRadius: 1.5,
                backgroundColor: name === selectedClassroom ? '#0F1323' : 'white',
                color: name === selectedClassroom ? 'white' : 'inherit',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                {name}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Paper>
  );
} 