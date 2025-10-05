import { User as UserMessage } from "../services/grpc/user_services/user_api";

export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public token: string,
    public refreshToken: string
  ) {}

  static fromGrpc(grpcUser: UserMessage | undefined): User | null {
    if (!grpcUser) return null;

    return new User(
      grpcUser.id,
      grpcUser.username,
      grpcUser.email,
      grpcUser.token,
      grpcUser.refreshToken
    );
  }
}
