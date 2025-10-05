from app.gRPC import service_pb2_grpc, service_pb2

def send_question(
    stub: service_pb2_grpc.SessionManagerStub, class_name: str, question: str
):
    request = service_pb2.SendQuestionRequest(
        question=question,
        className=class_name,
    )
    response = stub.SendQuestion(request, timeout=3000)
    print(response.answer)
    return response
