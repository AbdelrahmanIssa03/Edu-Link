import grpc
from concurrent import futures
from app.services import SessionManagerServicer
from app.services import ClassManagerServicer
from app.gRPC import service_pb2_grpc


def create_grpc_server():
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=10),
        options=[
            ("grpc.max_send_message_length", 50 * 1024 * 1024),
            ("grpc.max_receive_message_length", 50 * 1024 * 1024),
        ],
    )

    service_pb2_grpc.add_SessionManagerServicer_to_server(
        SessionManagerServicer(), server
    )
    service_pb2_grpc.add_ClassManagerServicer_to_server(
        ClassManagerServicer(), server
    )

    server.add_insecure_port("[::]:3002")
    return server
