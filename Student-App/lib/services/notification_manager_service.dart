import 'package:grpc/grpc.dart';

import '../services/app_session.dart';
import 'grpc/user_services/user_api.pbgrpc.dart';

class NotificationManagerService {
  late final NotificationManagerClient _stub;
  late final ClientChannel _channel;

  NotificationManagerService() {
    _channel = ClientChannel(
      '10.0.2.2',
      port: 3001,
      options: const ChannelOptions(
        credentials: ChannelCredentials.insecure(),
        connectionTimeout: Duration(seconds: 5),
      ),
    );
    _stub = NotificationManagerClient(_channel);
  }

  Future<GetNotificationsResponse> getNotifications(String userId) async {
    try {
      final token = AppSession().currentUser?.token;

      if (token == null) {
        return GetNotificationsResponse();
      }

      final metadata = {
        'authorization': 'Bearer $token',
      };

      final response = await _stub.getNotifications(
        GetNotificationsRequest()..userId = userId,
        options: CallOptions(
          metadata: metadata,
          timeout: Duration(seconds: 10),
        ),
      );

      return response;
    } catch (e) {
      return GetNotificationsResponse();
    }
  }

  Future<void> shutdown() async {
    await _channel.shutdown();
  }
}
