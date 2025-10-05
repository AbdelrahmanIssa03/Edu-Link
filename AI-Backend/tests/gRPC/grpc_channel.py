import grpc
from app.gRPC import service_pb2_grpc

channel = grpc.insecure_channel(
    "localhost:3002",
    options=[
        ("grpc.max_send_message_length", 50 * 1024 * 1024),
        ("grpc.max_receive_message_length", 50 * 1024 * 1024),
    ],
)

class_stub = service_pb2_grpc.ClassManagerStub(channel)
session_stub = service_pb2_grpc.SessionManagerStub(channel)
