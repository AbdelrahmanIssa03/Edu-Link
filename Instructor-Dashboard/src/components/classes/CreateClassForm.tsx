import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  IconButton, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Alert,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../contexts/AuthContext';
import { useClasses } from '../../contexts/ClassContext';
import { FileData } from '../../types/File';

export default function CreateClassForm() {
  const { user } = useAuth();
  const { addClass, loading, error } = useClasses();

  const [formData, setFormData] = useState({
    name: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000), 
  });

  const [students, setStudents] = useState<string[]>([]);
  const [studentInput, setStudentInput] = useState('');
  const [files, setFiles] = useState<FileData[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStartTimeChange = (newTime: Date | null) => {
    if (newTime) {
      setFormData({
        ...formData,
        startTime: newTime
      });
    }
  };

  const handleEndTimeChange = (newTime: Date | null) => {
    if (newTime) {
      setFormData({
        ...formData,
        endTime: newTime
      });
    }
  };

  const handleAddStudent = () => {
    if (studentInput.trim() && !students.includes(studentInput.trim())) {
      setStudents([...students, studentInput.trim()]);
      setStudentInput('');
    }
  };

  const handleRemoveStudent = (studentToRemove: string) => {
    setStudents(students.filter(student => student !== studentToRemove));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const fileArray = Array.from(e.target.files);
    const fileDataPromises = fileArray.map(file => FileData.fromNativeFile(file));
    const fileDataArray = await Promise.all(fileDataPromises);
    
    setFiles([...files, ...fileDataArray]);
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter(file => file.fileName !== fileName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('You must be logged in to create a class');
      return;
    }

    
    const startTimeStr = format(formData.startTime, "yyyy-MM-dd'T'HH:mm:ss");
    const endTimeStr = format(formData.endTime, "yyyy-MM-dd'T'HH:mm:ss");

    try {
      await addClass(
        user.id,
        formData.name,
        files,
        students,
        startTimeStr,
        endTimeStr
      );
      
      
      setSuccessMessage('Class created successfully!');
      setShowDialog(false);
      
      
      setFormData({
        name: '',
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
      });
      setStudents([]);
      setFiles([]);
      
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error("Failed to create class:", err);
      
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
        onClick={() => setShowDialog(true)}
        sx={{ 
          backgroundColor: '#0F1323',
          '&:hover': {
            backgroundColor: '#1a2347'
          }
        }}
      >
        Create New Class
      </Button>

      <Dialog 
        open={showDialog} 
        onClose={() => setShowDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Create New Class
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Box sx={{ display: 'grid', gap: 3 }}>
              <Box>
                <TextField
                  name="name"
                  label="Class Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3
              }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Start Time"
                    value={formData.startTime}
                    onChange={handleStartTimeChange}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="End Time"
                    value={formData.endTime}
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
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
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
                  {students.map((student, index) => (
                    <Chip
                      key={index}
                      label={student}
                      onDelete={() => handleRemoveStudent(student)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Class Materials
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Upload Files
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>

                {files.length > 0 && (
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    {files.map((file, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center', 
                          mb: 1,
                          p: 1,
                          backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'transparent',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2">{file.fileName}</Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveFile(file.fileName)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setShowDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || formData.name === ''}
            sx={{ 
              backgroundColor: '#0F1323',
              '&:hover': {
                backgroundColor: '#1a2347'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 