import React, { createContext, useContext, useState, ReactNode } from "react";
import { Class } from "../types/Class";
import { FileData } from "../types/File";
import {
  getClasses as grpcGetClasses,
  createClass as grpcCreateClass,
  updateClass as grpcUpdateClass,
  deleteClass as grpcDeleteClass,
  uploadFiles as grpcUploadFiles,
} from "../services/ClassManagerClient";
import { Session } from "../types/Session";

interface ClassContextProps {
  classes: Class[];
  loading: boolean;
  error: string | null;
  fetchClasses: (userId: string) => Promise<void>;
  addClass: (
    userId: string,
    name: string,
    files: FileData[],
    students: string[],
    startTime: string,
    endTime: string
  ) => Promise<void>;
  updateClass: (userId: string, classroom: Class) => Promise<void>;
  deleteClass: (userId: string, classroomId: string) => Promise<void>;
}

const ClassContext = createContext<ClassContextProps | undefined>(undefined);

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await grpcGetClasses(userId);
      const fetched = response.classrooms
        .map((c) => Class.fromGrpc(c))
        .filter(Boolean) as Class[];
      setClasses(fetched);
    } catch (err) {
      console.error("Fetch classes failed", err);
      setError("Failed to load classes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addClass = async (
    userId: string,
    name: string,
    files: FileData[],
    students: string[],
    startTime: string,
    endTime: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      
      /* await grpcUploadFiles(
        name,
        files.map((f) => ({
          fileName: f.fileName,
          data: f.data,
        }))
      ); */

      
      const response = await grpcCreateClass(
        userId,
        name,
        files.map((f) => f.fileName),
        students,
        startTime,
        endTime
      );

      if (!response) {
        throw new Error("No response from server");
      }

      if (!response.success) {
        throw new Error(response.errorMessages?.join(", ") || "Failed to create class");
      }

      if (!response.classroom) {
        throw new Error("No classroom data received");
      }

      const newClass = Class.fromGrpc(response.classroom);
      if (!newClass) {
        throw new Error("Failed to parse classroom data");
      }

      setClasses([...classes, newClass]);
    } catch (err: any) {
      console.error("Add class failed", err);
      setError(err.message || "Failed to add class. Please try again.");
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (userId: string, classroom: Class) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await grpcUpdateClass(userId, classroom.toGrpc());
      
      if (response.classroom) {
        
        const updatedClass = Class.fromGrpc(response.classroom);
        if (updatedClass) {
          setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
        }
      } else {
        throw new Error("Failed to update class: No response from server");
      }
    } catch (err: any) {
      console.error("Update class failed", err);
      setError(err.message || "Failed to update class. Please try again.");
      
      
      await fetchClasses(userId);
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (userId: string, classroomId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await grpcDeleteClass(userId, classroomId);
      
      if (response.success) {
        
        setClasses(classes.filter(c => c.id !== classroomId));
      } else if (response.errorMessages.length > 0) {
        throw new Error(response.errorMessages.join(", "));
      } else {
        throw new Error("Failed to delete class: Unknown error");
      }
    } catch (err: any) {
      console.error("Delete class failed", err);
      setError(err.message || "Failed to delete class. Please try again.");
      
      
      await fetchClasses(userId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClassContext.Provider
      value={{
        classes,
        loading,
        error,
        fetchClasses,
        addClass,
        updateClass,
        deleteClass,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClasses must be used within a ClassProvider");
  }
  return context;
};
