import {
  AuthenticationClientImpl,
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  GrpcWebImpl
} from "./grpc/user_services/user_api";

const GRPC_URL = "http://localhost:3000";

const grpcWebImpl = new GrpcWebImpl(GRPC_URL, {
  debug: false
});

const authClient = new AuthenticationClientImpl(grpcWebImpl);

export function signUp(
  username: string,
  email: string,
  password: string,
  role: string
): Promise<SignUpResponse> {
  const request: SignUpRequest = {
    username,
    email,
    password,
    role
  };

  return authClient.SignUp(request);
}

export function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const request: LoginRequest = {
    email,
    password
  };

  return authClient.Login(request);
}

export function refreshToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const request: RefreshTokenRequest = {
    refreshToken
  };

  return authClient.RefreshToken(request);
}

export function validateToken(
  token: string
): Promise<ValidateTokenResponse> {
  const request: ValidateTokenRequest = {
    token
  };

  return authClient.ValidateToken(request);
}
