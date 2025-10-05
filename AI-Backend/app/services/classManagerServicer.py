from app.gRPC import service_pb2
from app.gRPC import service_pb2_grpc
from app.services import FileUploader

class ClassManagerServicer(service_pb2_grpc.ClassManagerServicer):
    def UploadFiles(self, request, context):
        error_messages = []
        file_uploader = FileUploader()

        try:
            qdrant_errors = file_uploader._upload_to_qdrant(request, context)
            if qdrant_errors:
                error_messages.extend(qdrant_errors)
                
            success = len(error_messages) == 0
            
            return service_pb2.UploadFilesResponse(
                errorMessages=error_messages, success=success
            )
        except Exception as e:
            error_messages.append(f"Server error: {str(e)}")
            return service_pb2.UploadFilesResponse(
                errorMessages=error_messages, success=False
            )
