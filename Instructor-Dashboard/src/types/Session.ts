import { Session as GrpcSession } from "../services/grpc/user_services/user_api";

export class Session {
  constructor(
    public id: string,
    public title: string,
    public date: string,
    public isLive: boolean
  ) {}

  static fromGrpc(grpcSession: GrpcSession | undefined): Session | null {
    if (!grpcSession) return null;

    return new Session(
      grpcSession.id,
      grpcSession.title,
      grpcSession.date,
      grpcSession.isLive
    );
  }

  toGrpc(): GrpcSession {
    return {
      id: this.id,
      title: this.title,
      date: this.date,
      isLive: this.isLive
    };
  }
}
