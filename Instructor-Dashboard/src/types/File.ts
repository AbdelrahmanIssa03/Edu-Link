import { File as GrpcFile } from "../services/grpc/ai_services/ai_api";

export class FileData {
  fileName: string;
  data: Uint8Array;

  constructor(fileName: string, data: Uint8Array) {
    this.fileName = fileName;
    this.data = data;
  }

  static async fromNativeFile(file: File): Promise<FileData> {
    const arrayBuffer = await file.arrayBuffer();
    return new FileData(file.name, new Uint8Array(arrayBuffer));
  }

  static fromGrpc(grpcFile: GrpcFile | undefined): FileData | null {
    if (!grpcFile) return null;
    return new FileData(grpcFile.fileName, grpcFile.data);
  }

  toGrpc(): GrpcFile {
    return {
      fileName: this.fileName,
      data: this.data
    };
  }
}
