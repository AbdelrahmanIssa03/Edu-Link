import { Class as GrpcClass } from "../services/grpc/user_services/user_api";
import { Session } from "./Session";

export class Class {
  constructor(
    public id: string,
    public name: string,
    public files: string[],
    public students: string[],
    public startTime: string,
    public endTime: string,
    public sessions: Session[]
  ) {}

  static fromGrpc(grpcClass: GrpcClass | undefined): Class | null {
    if (!grpcClass) return null;

    const sessions = grpcClass.sessions
      .map((s) => Session.fromGrpc(s))
      .filter(Boolean) as Session[];

    return new Class(
      grpcClass.id,
      grpcClass.name,
      grpcClass.files,
      grpcClass.students,
      grpcClass.startTime,
      grpcClass.endTime,
      sessions
    );
  }

  toGrpc(): GrpcClass {
    return {
      id: this.id,
      name: this.name,
      files: this.files,
      students: this.students,
      startTime: this.startTime,
      endTime: this.endTime,
      sessions: this.sessions.map((s) => s.toGrpc())
    };
  }
}
