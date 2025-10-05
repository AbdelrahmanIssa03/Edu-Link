from dotenv import load_dotenv
load_dotenv()

from app import create_grpc_server


def start_grpc_server():
    server = create_grpc_server()
    server.start()
    print("gRPC Server started on port 3002...")
    server.wait_for_termination()


def main():
    start_grpc_server()


if __name__ == "__main__":
    main()
