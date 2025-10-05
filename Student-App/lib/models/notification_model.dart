import 'package:edu_link/services/grpc/user_services/user_api.pbgrpc.dart';

class NotificationItem {
  final String id;
  final String title;
  final String subtitle;
  final String time;

  factory NotificationItem.fromGrpc(Notification notification) {
    return NotificationItem(
      id: notification.id,
      title: notification.title,
      subtitle: notification.subtitle,
      time: notification.time,
    );
  }

  NotificationItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.time,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'subtitle': subtitle,
      'time': time,
    };
  }

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      id: json['id'],
      title: json['title'],
      subtitle: json['subtitle'],
      time: json['time'],
    );
  }
}
