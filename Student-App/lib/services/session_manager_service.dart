import 'package:grpc/grpc.dart';

import '../services/app_session.dart';
import 'grpc/ai_services/ai_api.pbgrpc.dart';

class SessionManagerService {
  late final SessionManagerClient _stub;
  late final ClientChannel _channel;

  SessionManagerService() {
    _channel = ClientChannel(
      '10.0.2.2', // Fixed IP address format
      port: 3002, // Updated to consistent port 3001
      options: const ChannelOptions(
        credentials: ChannelCredentials.insecure(),
        connectionTimeout: Duration(seconds: 5),
      ),
    );

    _stub = SessionManagerClient(_channel);
  }

  Future<SendQuestionResponse> sendQuestion(
    String question,
    String className,
  ) async {
    final request = SendQuestionRequest()
      ..question = question
      ..className = className;

    try {
      final token = AppSession().currentUser?.token;

      if (token == null) {
        return SendQuestionResponse()
          ..success = false
          ..errorMessages.add('Authentication token missing');
      }

      final response = await _stub.sendQuestion(
        request
      );

      return response;
    } catch (e) {
      return SendQuestionResponse()
        ..success = false
        ..errorMessages.add('gRPC error: $e');
    }
  }

  Future<void> shutdown() async {
    await _channel.shutdown();
  }
}
