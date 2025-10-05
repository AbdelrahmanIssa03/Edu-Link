from pathlib import Path
from app.gRPC import service_pb2_grpc, service_pb2


def upload_single_file(
    stub: service_pb2_grpc.ClassManagerStub, class_name: str, file_path: str
):
    with open(file_path, "rb") as file:
        file_data = file.read()

    file_proto = service_pb2.File(
        data=file_data,
        fileName=Path(file_path).name,
    )
    request = service_pb2.UploadFilesRequest(files=[file_proto], className=class_name)
    response = stub.UploadFiles(request, timeout=3000)

    if response.success:
        print("✅ File uploaded successfully.")
    else:
        print("❌ File upload failed. Errors:")
        for error in response.errorMessages:
            print(f"   - {error}")
