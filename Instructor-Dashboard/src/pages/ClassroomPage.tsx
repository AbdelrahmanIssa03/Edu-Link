import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';

import { useAuth } from '../contexts/AuthContext';
import { useClasses } from '../contexts/ClassContext';
import { Class } from '../types/Class';

export default function ClassroomPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, loading, error } = useClasses();
  const [classroom, setClassroom] = useState<Class | null>(null);

  useEffect(() => {
    if (classes.length > 0 && id) {
      const foundClass = classes.find(c => c.id === id);
      if (foundClass) {
        setClassroom(foundClass);
      } else {
        
        navigate('/classes');
      }
    }
  }, [classes, id, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!classroom) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Class not found.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #ddd', 
        backgroundColor: '#0F1323',
        color: 'white',
        display: 'flex',
        alignItems: 'center'
      }}>
        <IconButton onClick={() => navigate('/classes')} sx={{ mr: 2, color: 'white' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          {classroom.name} - Live Session
        </Typography>
      </Box>

      {/* Main content area */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Main video area */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
          <Paper 
            sx={{ 
              height: 'calc(100vh - 180px)', 
              backgroundColor: '#222', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Your virtual classroom is ready
              </Typography>
              <Typography variant="body1" color="rgba(255,255,255,0.7)" sx={{ mb: 3 }}>
                This is a placeholder for the video conferencing feature
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<VideocamIcon />}
              >
                Start Camera
              </Button>
            </Box>
          </Paper>

          {/* Controls */}
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'center',
            gap: 2
          }}>
            <Button 
              variant="contained" 
              startIcon={<MicIcon />}
              sx={{ borderRadius: 8, px: 3 }}
            >
              Mic
            </Button>
            <Button 
              variant="contained" 
              startIcon={<VideocamIcon />}
              sx={{ borderRadius: 8, px: 3 }}
            >
              Camera
            </Button>
            <Button 
              variant="contained" 
              startIcon={<ScreenShareIcon />}
              sx={{ borderRadius: 8, px: 3 }}
            >
              Share
            </Button>
            <Button 
              variant="contained" 
              color="error"
              sx={{ borderRadius: 8, px: 3 }}
            >
              End
            </Button>
          </Box>
        </Box>

        {/* Sidebar - could be used for chat, participants, etc. */}
        <Box sx={{ 
          width: 300, 
          borderLeft: '1px solid #ddd',
          backgroundColor: '#f5f7fa',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Participants ({classroom.students.length + 1})
            </Typography>
          </Box>
          <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
            <Box sx={{ 
              p: 1.5, 
              backgroundColor: '#e3f2fd', 
              borderRadius: 1,
              mb: 1
            }}>
              <Typography variant="body2" fontWeight="medium">
                You (Instructor)
              </Typography>
            </Box>
            
            {classroom.students.map((student, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 1.5, 
                  backgroundColor: 'white', 
                  borderRadius: 1,
                  mb: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <Typography variant="body2">
                  {student}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 