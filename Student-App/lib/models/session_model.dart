import 'package:edu_link/services/grpc/user_services/user_api.pbgrpc.dart'
    as message;

class Session {
  final String id;
  final String title;
  final String date;
  final bool isLive;

  Session({
    required this.id,
    required this.title,
    required this.date,
    this.isLive = false,
  });

  factory Session.fromGrpc(message.Session session) {
    return Session(
      id: session.id,
      title: session.title,
      date: session.date,
      isLive: session.isLive,
    );
  }

  factory Session.fromJson(Map<String, dynamic> json) {
    return Session(
      id: json['id'],
      title: json['title'],
      date: json['date'],
      isLive: json['isLive'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'date': date,
      'isLive': isLive,
    };
  }
}
