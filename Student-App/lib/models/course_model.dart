import 'package:edu_link/services/grpc/user_services/user_api.pbgrpc.dart'
    as message;

import 'session_model.dart';

class Course {
  final String id;
  final String name;
  final List<Session> sessions;

  Course({
    required this.id,
    required this.name,
    required this.sessions,
  });

  factory Course.fromGrpc(message.Course grpcCourse) {
    return Course(
      id: grpcCourse.id,
      name: grpcCourse.name,
      sessions:
          grpcCourse.sessions.map<Session>((s) => Session.fromGrpc(s)).toList(),
    );
  }

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'],
      name: json['name'],
      sessions: (json['sessions'] as List)
          .map((session) => Session.fromJson(session))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'sessions': sessions.map((s) => s.toJson()).toList(),
    };
  }

  List<Session> get liveSessions =>
      sessions.where((session) => session.isLive).toList();

  List<Session> get archivedSessions =>
      sessions.where((session) => !session.isLive).toList();
}
