import { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useClasses } from "../contexts/ClassContext";


import Header from "../components/dashboard/Header";
import VirtualClassrooms from "../components/dashboard/VirtualClassrooms";
import UpcomingSession from "../components/dashboard/UpcomingSession";
import ClassSessions from "../components/dashboard/ClassSessions";
import { Class } from "../types/Class";
import { Session } from "../types/Session";

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { classes, loading, error, fetchClasses } = useClasses();
  
  const [selectedClassIndex, setSelectedClassIndex] = useState<number>(0);
  const [classroomNames, setClassroomNames] = useState<string[]>([]);
  const [currentSessions, setCurrentSessions] = useState<Session[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  
  
  useEffect(() => {
    if (user?.id && !hasFetched) {
      fetchClasses(user.id);
      setHasFetched(true);
    }
  }, [user?.id, fetchClasses, hasFetched]);
  
  
  useEffect(() => {
    if (classes.length > 0) {
      const names = classes.map(c => c.name);
      setClassroomNames(names);
      
      
      if (selectedClassIndex >= classes.length) {
        setSelectedClassIndex(0);
      }
      
      
      updateSessionsForSelectedClass();
    }
  }, [classes]);
  
  
  useEffect(() => {
    updateSessionsForSelectedClass();
  }, [selectedClassIndex]);
  
  const updateSessionsForSelectedClass = () => {
    if (classes.length > 0 && selectedClassIndex < classes.length) {
      setCurrentSessions(classes[selectedClassIndex].sessions);
    } else {
      setCurrentSessions([]);
    }
  };
  
  const handleSelectClassroom = (classroom: string) => {
    const index = classroomNames.indexOf(classroom);
    if (index !== -1) {
      setSelectedClassIndex(index);
    }
  };
  
  const getSelectedClass = (): Class | null => {
    if (classes.length > 0 && selectedClassIndex < classes.length) {
      return classes[selectedClassIndex];
    }
    return null;
  };
  
  const selectedClass = getSelectedClass();
  
  
  if (loading && !hasFetched) {
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

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column",
      height: "96%", 
      p: { xs: 1.5, md: 2 },
      backgroundColor: "#f5f7fa",
      overflow: "hidden"
    }}>
      {/* Header Section */}
      <Header user={user} />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left and Center Column */}
        <Box sx={{ flex: 1, mr: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Main Content Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 2, 
            flex: 1,
            overflow: 'hidden'
          }}>
            {/* Virtual Classrooms */}
            <VirtualClassrooms 
              classrooms={classroomNames} 
              onSelectClassroom={handleSelectClassroom} 
              selectedClassroom={classroomNames[selectedClassIndex] || ''}
            />

            {/* Right area - Next Session */}
            <Box sx={{ height: '100%' }}>
              {selectedClass && (
                <UpcomingSession 
                  title={selectedClass.name} 
                  date={new Date(selectedClass.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} 
                  time={`${new Date(selectedClass.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(selectedClass.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`} 
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Right Column - Current Class */}
        <Box sx={{ width: '270px', overflow: 'hidden' }}>
          {selectedClass && (
            <ClassSessions 
              className={selectedClass.name}
              sessions={currentSessions}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
