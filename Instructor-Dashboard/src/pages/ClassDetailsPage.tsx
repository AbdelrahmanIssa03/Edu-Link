import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AddIcon from '@mui/icons-material/Add';

import { useAuth } from '../contexts/AuthContext';
import { useClasses } from '../contexts/ClassContext';
import { Class } from '../types/Class';

export default function ClassDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classes, loading, error, updateClass, deleteClass } = useClasses();
  
  const [classroom, setClassroom] = useState<Class | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    startTime: new Date(),
    endTime: new Date(),
  });
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [editStudents, setEditStudents] = useState<string[]>([]);

  useEffect(() => {
    if (classes.length > 0 && id) {
      const foundClass = classes.find(c => c.id === id);
      if (foundClass) {
        setClassroom(foundClass);
        
        setEditForm({
          name: foundClass.name,
          startTime: new Date(foundClass.startTime),
          endTime: new Date(foundClass.endTime),
        });
        setEditStudents([...foundClass.students]);
      } else {
        
        navigate('/classes');
      }
    }
  }, [classes, id, navigate]);

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  const handleStartTimeChange = (newTime: Date | null) => {
    if (newTime) {
      setEditForm({
        ...editForm,
        startTime: newTime
      });
    }
  };

  const handleEndTimeChange = (newTime: Date | null) => {
    if (newTime) {
      setEditForm({
        ...editForm,
        endTime: newTime
      });
    }
  };

  const handleAddStudent = () => {
    if (newStudentEmail.trim() && !editStudents.includes(newStudentEmail.trim())) {
      setEditStudents([...editStudents, newStudentEmail.trim()]);
      setNewStudentEmail('');
    }
  };

  const handleRemoveStudent = (email: string) => {
    setEditStudents(editStudents.filter(s => s !== email));
  };

  const handleSaveChanges = async () => {
    if (!user?.id || !classroom) return;

    const updatedClass = new Class(
      classroom.id,
      editForm.name,
      classroom.files,
      editStudents,
      format(editForm.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      format(editForm.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
      classroom.sessions
    );

    await updateClass(user.id, updatedClass);
    setIsEditing(false);
  };

  const handleDeleteClass = async () => {
    if (!user?.id || !classroom) return;
    
    await deleteClass(user.id, classroom.id);
    setDeleteConfirmOpen(false);
    navigate('/classes');
  };

  const handleGoToClassroom = () => {
    if (classroom) {
      navigate(`/classroom/${classroom.id}`);
    }
  };

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
    <Box sx={{ p: 3, height: '100%', overflow: 'auto', backgroundColor: '#f5f7fa' }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/classes')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" color="#0F1323">
          {classroom.name}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />} 
          onClick={() => setIsEditing(true)}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteConfirmOpen(true)}
        >
          Delete
        </Button>
      </Box>

      {/* Main content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Left column - Class info */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Class Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography>
              {formatTime(classroom.startTime)} - {formatTime(classroom.endTime)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <PeopleIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {classroom.students.length} Students
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {classroom.students.map((student, index) => (
                  <Chip key={index} label={student} size="small" />
                ))}
              </Box>
            </Box>
          </Box>

          {classroom.files.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <AttachFileIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {classroom.files.length} Files
                </Typography>
                <List dense disablePadding>
                  {classroom.files.map((file, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                      <ListItemText primary={file} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained"
              onClick={handleGoToClassroom}
              sx={{ 
                backgroundColor: '#0F1323',
                '&:hover': {
                  backgroundColor: '#1a2347'
                }
              }}
            >
              Enter Classroom
            </Button>
          </Box>
        </Paper>

        {/* Sessions section */}
        {classroom.sessions.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sessions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'grid', gap: 2 }}>
              {classroom.sessions.map(session => (
                <Card key={session.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {session.title}
                      </Typography>
                      {session.isLive && (
                        <Chip 
                          label="Live Now" 
                          size="small" 
                          color="error"
                        />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <ScheduleIcon sx={{ fontSize: '0.9rem', mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(session.date).toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        )}
      </Box>

      {/* Edit Class Dialog */}
      <Dialog 
        open={isEditing} 
        onClose={() => setIsEditing(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Class</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'grid', gap: 3 }}>
            <TextField
              label="Class Name"
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3
            }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time"
                  value={editForm.startTime}
                  onChange={handleStartTimeChange}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={editForm.endTime}
                  onChange={handleEndTimeChange}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Students
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Student Email"
                  fullWidth
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <Button 
                  onClick={handleAddStudent}
                  variant="contained"
                  sx={{ 
                    minWidth: '40px', 
                    height: '40px',
                    backgroundColor: '#0F1323',
                    '&:hover': {
                      backgroundColor: '#1a2347'
                    }
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {editStudents.map((student, index) => (
                  <Chip
                    key={index}
                    label={student}
                    onDelete={() => handleRemoveStudent(student)}
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveChanges}
            variant="contained"
            sx={{ 
              backgroundColor: '#0F1323',
              '&:hover': {
                backgroundColor: '#1a2347'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the class "{classroom.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteClass} color="error">
            Delete Class
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 