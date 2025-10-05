import 'package:grpc/grpc.dart';

import '../services/app_session.dart';
import 'grpc/user_services/user_api.pbgrpc.dart';

class CourseManagerService {
  late final CourseManagerClient _stub;
  late final ClientChannel _channel;

  CourseManagerService() {
    _channel = ClientChannel(
      '10.0.2.2',
      port: 3001,
      options: const ChannelOptions(
        credentials: ChannelCredentials.insecure(),
        connectionTimeout: Duration(seconds: 5),
      ),
    );
    _stub = CourseManagerClient(_channel);
  }

  Future<GetCoursesResponse> getCourses(String userId) async {
    print("Requesting courses for userId: $userId");

    try {
      final token = AppSession().currentUser?.token;

      if (token == null) {
        print("Authentication token is missing!");
        return GetCoursesResponse();
      }

      print("Sending courses request with auth token");

      final metadata = {
        'authorization': 'Bearer $token',
      };

      final response = await _stub.getCourses(
        GetCoursesRequest()..userId = userId,
        options: CallOptions(
          metadata: metadata,
          timeout: Duration(seconds: 10),
        ),
      );

      print(
          "Received courses response with ${response.courses.length} courses");
      return response;
    } catch (e) {
      print("Error getting courses: $e");
      return GetCoursesResponse();
    }
  }

  Future<void> shutdown() async {
    await _channel.shutdown();
  }
}
