import {
  ClassManagerClientImpl as AIClassManagerClientImpl,
  UploadFilesRequest,
  UploadFilesResponse,
  File,
  GrpcWebImpl as AIGrpcWebImpl
} from "./grpc/ai_services/ai_api";
import {
  ClassManagerClientImpl as UserClassManagerClientImpl,
  CreateClassRequest,
  CreateClassResponse,
  GetClassesRequest,
  GetClassesResponse,
  UpdateClassRequest,
  UpdateClassResponse,
  DeleteClassRequest,
  DeleteClassResponse,
  Class,
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
  if (!token) return undefined;
  
  const metadata = new grpc.Metadata();
  metadata.append("authorization", `Bearer ${token}`);
  return metadata;
};


const aiGrpcWebImpl = new AIGrpcWebImpl(AI_GRPC_URL, {
  debug: false
});

const userGrpcWebImpl = new UserGrpcWebImpl(USER_GRPC_URL, {
  debug: false,
  metadata: createAuthMetadata()
});

const aiClassManagerClient = new AIClassManagerClientImpl(aiGrpcWebImpl);
const userClassManagerClient = new UserClassManagerClientImpl(userGrpcWebImpl);

export function uploadFiles(
  className: string,
  files: File[]
): Promise<UploadFilesResponse> {
  const request: UploadFilesRequest = {
    className,
    files
  };

  return aiClassManagerClient.UploadFiles(request);
}

export function createClass(
  userId: string,
  name: string,
  files: string[],
  students: string[],
  startTime: string,
  endTime: string
): Promise<CreateClassResponse> {
  const request: CreateClassRequest = {
    userId,
    name,
    files,
    students,
    startTime,
    endTime
  };

  return userClassManagerClient.CreateClass(request, createAuthMetadata());
}

export function getClasses(userId: string): Promise<GetClassesResponse> {
  const request: GetClassesRequest = {
    userId
  };

  return userClassManagerClient.GetClasses(request, createAuthMetadata());
}

export function updateClass(
  userId: string,
  classroom: Class
): Promise<UpdateClassResponse> {
  const request: UpdateClassRequest = {
    userId,
    classroom
  };

  return userClassManagerClient.UpdateClass(request, createAuthMetadata());
}

export function deleteClass(
  userId: string,
  classroomId: string
): Promise<DeleteClassResponse> {
  const request: DeleteClassRequest = {
    userId,
    classroomId
  };

  return userClassManagerClient.DeleteClass(request, createAuthMetadata());
}
