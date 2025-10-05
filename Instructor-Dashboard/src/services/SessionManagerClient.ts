import {
  SessionManagerClientImpl as AISessionManagerClientImpl,
  SendAudioRequest,
  SendAudioResponse,
  GrpcWebImpl as AIGrpcWebImpl
} from "./grpc/ai_services/ai_api";
import {
  SessionManagerClientImpl as UserSessionManagerClientImpl,
  StartSessionRequest,
  StartSessionResponse,
  EndSessionRequest,
  EndSessionResponse,
  GrpcWebImpl as UserGrpcWebImpl
} from "./grpc/user_services/user_api";
import { grpc } from "@improbable-eng/grpc-web";

const AI_GRPC_URL = "http://localhost:3000";
const USER_GRPC_URL = "http://localhost:3000";

const getAuthToken = () => {
  return localStorage.getItem("userToken");
};

const createAuthMetadata = () => {
  const token = getAuthToken();
  const metadata = new grpc.Metadata();
  if (token) {
    metadata.append("Authorization", `Bearer ${token}`);
  }
  return metadata;
};

const aiGrpcWebImpl = new AIGrpcWebImpl(AI_GRPC_URL, {
  debug: false
});

const userGrpcWebImpl = new UserGrpcWebImpl(USER_GRPC_URL, {
  debug: false
});

const sessionManagerClient_AI = new AISessionManagerClientImpl(aiGrpcWebImpl);
const sessionManagerClient_USER = new UserSessionManagerClientImpl(userGrpcWebImpl);

export function sendAudio(
  className: string,
  audioData: Uint8Array
): Promise<SendAudioResponse> {
  const request: SendAudioRequest = {
    className,
    audioData
  };

  return sessionManagerClient_AI.SendAudio(request, createAuthMetadata());
}

export function startSession(
  userId: string,
  classroomId: string,
  name: string
): Promise<StartSessionResponse> {
  const request: StartSessionRequest = {
    userId,
    classroomId,
    name
  };

  return sessionManagerClient_USER.StartSession(request, createAuthMetadata());
}

export function endSession(
  userId: string,
  classroomId: string,
  sessionId: string
): Promise<EndSessionResponse> {
  const request: EndSessionRequest = {
    userId,
    classroomId,
    sessionId
  };

  return sessionManagerClient_USER.EndSession(request, createAuthMetadata());
}
