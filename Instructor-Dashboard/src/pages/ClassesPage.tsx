import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClasses } from '../contexts/ClassContext';
import CreateClassForm from '../components/classes/CreateClassForm';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AddIcon from '@mui/icons-material/Add';
import MicIcon from '@mui/icons-material/Mic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Class } from '../types/Class';
import { Session } from '../types/Session';
import { startSession, endSession, sendAudio } from '../services/SessionManagerClient';

export default function ClassesPage() {
  const { user } = useAuth();
  const { classes, loading, error, fetchClasses, deleteClass, updateClass } = useClasses();
  const navigate = useNavigate();
  
  const [hasFetched, setHasFetched] = useState(false);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string>('');
  
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<typeof classes[0] | null>(null);

  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    startTime: new Date(),
    endTime: new Date(),
  });
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [editStudents, setEditStudents] = useState<string[]>([]);

  
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionClass, setSessionClass] = useState<typeof classes[0] | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  
  const loadClasses = useCallback(() => {
    if (user?.id && !hasFetched) {
      fetchClasses(user.id);
      setHasFetched(true);
    }
  }, [user, fetchClasses, hasFetched]);

  useEffect(() => {
    loadClasses();
    
    return () => {};
  }, [loadClasses]);

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  const handleViewDetails = (classroom: typeof classes[0]) => {
    setSelectedClass(classroom);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (classId: string, className: string) => {
    setDeleteClassId(classId);
    setClassToDelete(className);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (user?.id && deleteClassId) {
      await deleteClass(user.id, deleteClassId);
      setDeleteConfirmOpen(false);
      setDeleteClassId(null);
    }
  };

  const handleOpenEditDialog = (classroom: typeof classes[0]) => {
    setSelectedClass(classroom);
    setEditForm({
      name: classroom.name,
      startTime: new Date(classroom.startTime),
      endTime: new Date(classroom.endTime),
    });
    setEditStudents([...classroom.students]);
    setIsEditing(true);
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
    if (!user?.id || !selectedClass) return;

    const updatedClass = new Class(
      selectedClass.id,
      editForm.name,
      selectedClass.files,
      editStudents,
      format(editForm.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      format(editForm.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
      selectedClass.sessions
    );

    await updateClass(user.id, updatedClass);
    setIsEditing(false);
    if (user?.id) {
      fetchClasses(user.id);
    }
  };

  const handleStartSession = (classroom: typeof classes[0]) => {
    setSessionClass(classroom);
    setSessionName(`${classroom.name} Session - ${new Date().toLocaleDateString()}`);
    setSessionDialogOpen(true);
  };

  const handleStartRecording = async () => {
    if (!user?.id || !sessionClass) return;

    try {
      console.log("Requesting microphone access...");
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log("Microphone access granted:", stream.getAudioTracks()[0].label);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      const audioChunks: Blob[] = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
          console.log("Audio chunk received:", event.data.size, "bytes");
        }
      });
      
      mediaRecorder.addEventListener('stop', async () => {
        console.log("Recording stopped, processing audio data...");
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioData = new Uint8Array(arrayBuffer);
        
        console.log(`Recorded ${audioData.byteLength} bytes of audio`);
        
        try {
          await sendAudio(sessionClass.name, audioData);
          console.log("Audio data sent successfully");
        } catch (error) {
          console.error("Error sending audio data:", error);
        }
      });
      
      const response = await startSession(
        user.id,
        sessionClass.id,
        sessionName
      );

      if (response.success && response.session) {
        const newSession = Session.fromGrpc(response.session);
        if (newSession && sessionClass) {
          const updatedClass = new Class(
            sessionClass.id,
            sessionClass.name,
            sessionClass.files,
            sessionClass.students,
            sessionClass.startTime,
            sessionClass.endTime,
            [...sessionClass.sessions, newSession]
          );
          
          setSessionClass(updatedClass);
          
          mediaRecorder.start(1000);
          console.log("MediaRecorder started");
          
          (window as any)._mediaRecorder = mediaRecorder;
          setIsRecording(true);
        }
      } else {
        console.error("Failed to start session:", response.errorMessages);
        alert("Failed to start session: " + response.errorMessages.join(", "));
        setIsRecording(false);

        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    } catch (error) {
      console.error("Error starting session:", error);
      let errorMessage = "Error starting session. ";
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += "Please allow microphone access in your browser settings.";
        } else if (error.name === 'NotFoundError') {
          errorMessage += "No microphone found. Please connect a microphone and try again.";
        } else if (error.name === 'NotReadableError') {
          errorMessage += "Your microphone is busy or not working properly. Please check your microphone settings.";
        } else {
          errorMessage += error.message;
        }
      }
      
      alert(errorMessage);
      setIsRecording(false);
    }
  };

  const handleEndSession = async () => {
    if (!user?.id || !sessionClass) return;

    try {
      
      const mediaRecorder = (window as any)._mediaRecorder;
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        
        
        mediaRecorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        
        
        delete (window as any)._mediaRecorder;
      }
      
      
      const currentSession = sessionClass.sessions[sessionClass.sessions.length - 1];
      
      if (currentSession) {
        
        const response = await endSession(
          user.id,
          sessionClass.id,
          currentSession.id
        );

        if (response.success) {
          
          console.log("Session ended successfully");
        } else {
          console.error("Failed to end session:", response.errorMessages);
          alert("Failed to end session: " + response.errorMessages.join(", "));
        }
      }
    } catch (error) {
      console.error("Error ending session:", error);
      alert("Error ending session. Your recording might not be saved.");
    } finally {
      setIsRecording(false);
      setSessionDialogOpen(false);
      
      loadClasses();
    }
  };

  return (
    <Box sx={{ 
      p: 3,
      height: '100%',
      overflow: 'auto',
      backgroundColor: '#f5f7fa'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4" fontWeight="bold" color="#0F1323">
          My Classes
        </Typography>
        <CreateClassForm />
      </Box>

      {loading && !hasFetched && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && classes.length === 0 && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2
          }}
        >
          <SchoolIcon sx={{ fontSize: 60, color: '#0F1323', opacity: 0.7, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Classes Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create your first class to get started with your virtual classroom.
          </Typography>
        </Paper>
      )}

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {classes.map((classroom) => (
          <Card 
            key={classroom.id}
            elevation={1}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <Box 
              sx={{ 
                p: 2, 
                backgroundColor: '#0F1323', 
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {classroom.name}
              </Typography>
              <IconButton 
                size="small" 
                sx={{ color: 'rgba(255,255,255,0.7)' }}
                onClick={() => handleDeleteClick(classroom.id, classroom.name)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '0.9rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(classroom.startTime)} - {formatTime(classroom.endTime)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '0.9rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {classroom.students.length} Students
                  </Typography>
                </Box>
                
                {classroom.files.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachFileIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '0.9rem' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classroom.files.length} Files
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {classroom.sessions.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
                    Recent Sessions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {classroom.sessions.slice(0, 2).map((session) => (
                      <Box 
                        key={session.id}
                        sx={{ 
                          p: 1, 
                          backgroundColor: 'rgba(0, 0, 0, 0.03)', 
                          borderRadius: 1 
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {session.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(session.date).toLocaleDateString()}
                          {session.isLive && (
                            <Chip 
                              label="Live" 
                              size="small"
                              color="error"
                              sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                            />
                          )}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                size="small"
                onClick={() => handleViewDetails(classroom)}
              >
                View Details
              </Button>
              <Button
                size="small"
                startIcon={<PlayArrowIcon />}
                onClick={() => handleStartSession(classroom)}
                color="error"
                variant="outlined"
                sx={{ ml: 1 }}
              >
                Start Session
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the class "{classToDelete}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete Class
          </Button>
        </DialogActions>
      </Dialog>

      {/* Class Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        fullWidth
        maxWidth="md"
      >
        {selectedClass && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedClass.name}</Typography>
              <IconButton onClick={() => setDetailsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 3
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Class Information</Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        {formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                      <PeopleIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {selectedClass.students.length} Students
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedClass.students.map((student, index) => (
                            <Chip key={index} label={student} size="small" />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {selectedClass.files.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                        <AttachFileIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            {selectedClass.files.length} Files
                          </Typography>
                          <List dense disablePadding>
                            {selectedClass.files.map((file, index) => (
                              <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                <ListItemText primary={file} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box>
                  {selectedClass.sessions.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Sessions</Typography>
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        {selectedClass.sessions.map(session => (
                          <Paper key={session.id} variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight="medium">
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
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button 
                variant="contained"
                onClick={() => {
                  setDetailsOpen(false);
                  handleOpenEditDialog(selectedClass);
                }}
                sx={{ 
                  backgroundColor: '#0F1323',
                  '&:hover': {
                    backgroundColor: '#1a2347'
                  }
                }}
              >
                Edit Class
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog 
        open={isEditing} 
        onClose={() => setIsEditing(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Class</Typography>
          <IconButton onClick={() => setIsEditing(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
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

      {/* Session Start Dialog */}
      <Dialog
        open={sessionDialogOpen}
        onClose={() => !isRecording && setSessionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Start Class Session</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              {sessionClass?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Starting a new live session. Audio will be recorded for students.
            </Typography>
          </Box>
          
          <TextField
            label="Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            disabled={isRecording}
          />
          
          {isRecording ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              py: 2 
            }}>
              <Box 
                sx={{ 
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  animation: 'pulse 1.5s infinite'
                }}
              >
                <MicIcon color="error" sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Recording in progress...
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Audio is being captured
              </Typography>
              
              <Box sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
                <Button 
                  variant="contained"
                  color="error"
                  onClick={handleEndSession}
                >
                  End Session
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleStartRecording}
                startIcon={<MicIcon />}
                sx={{
                  backgroundColor: '#0F1323',
                  '&:hover': {
                    backgroundColor: '#1a2347'
                  }
                }}
              >
                Start Recording
              </Button>
            </Box>
          )}
        </DialogContent>
        {!isRecording && (
          <DialogActions>
            <Button onClick={() => setSessionDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
} 