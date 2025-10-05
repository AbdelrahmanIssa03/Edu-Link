import { createContext, useContext, useState, ReactNode } from "react";
import {
  startSession as grpcStartSession,
  endSession as grpcEndSession,
  sendAudio as grpcSendAudio,
} from "../services/SessionManagerClient";
import { Session } from "../types/Session";

interface SessionContextProps {
  currentClassId: string | null;
  currentSessionId: string | null;
  isSessionActive: boolean;
  audioBuffer: Uint8Array | null;
  startSession: (
    userId: string,
    classId: string,
    title: string
  ) => Promise<void>;
  endSession: (
    userId: string,
    classId: string,
    sessionId: string
  ) => Promise<void>;
  sendAudio: (className: string) => Promise<void>;
  setAudioBuffer: (buffer: Uint8Array) => void;
  clearAudioBuffer: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [audioBuffer, setAudioBufferState] = useState<Uint8Array | null>(null);

  const startSession = async (
    userId: string,
    classId: string,
    title: string
  ) => {
    const response = await grpcStartSession(userId, classId, title);
    const session = Session.fromGrpc(response.session);
    if (session) {
      setCurrentClassId(classId);
      setCurrentSessionId(session.id);
      setIsSessionActive(true);
    }
  };

  const endSession = async (
    userId: string,
    classId: string,
    sessionId: string
  ) => {
    await grpcEndSession(userId, classId, sessionId);
    setCurrentClassId(null);
    setCurrentSessionId(null);
    setIsSessionActive(false);
    setAudioBufferState(null);
  };

  const sendAudio = async (className: string) => {
    if (!audioBuffer) return;
    await grpcSendAudio(className, audioBuffer);
    setAudioBufferState(null);
  };

  const setAudioBuffer = (buffer: Uint8Array) => {
    setAudioBufferState(buffer);
  };

  const clearAudioBuffer = () => {
    setAudioBufferState(null);
  };

  return (
    <SessionContext.Provider
      value={{
        currentClassId,
        currentSessionId,
        isSessionActive,
        audioBuffer,
        startSession,
        endSession,
        sendAudio,
        setAudioBuffer,
        clearAudioBuffer,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
