import 'authentication_service.dart';
import 'course_manager_service.dart';
import 'notification_manager_service.dart';
import 'session_manager_service.dart';

class GrpcApiManager {
  static final GrpcApiManager _instance = GrpcApiManager._internal();

  factory GrpcApiManager() => _instance;

  GrpcApiManager._internal();

  late final AuthenticationService authenticationService;
  late final CourseManagerService courseManagerService;
  late final NotificationManagerService notificationManagerService;
  late final SessionManagerService sessionManagerService;

  Future<void> init() async {
    authenticationService = AuthenticationService();
    courseManagerService = CourseManagerService();
    notificationManagerService = NotificationManagerService();
    sessionManagerService = SessionManagerService();
  }

  Future<void> shutdown() async {
    await authenticationService.shutdown();
    await courseManagerService.shutdown();
    await notificationManagerService.shutdown();
    await sessionManagerService.shutdown();
  }
}
