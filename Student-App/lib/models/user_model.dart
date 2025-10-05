import 'package:edu_link/services/grpc/user_services/user_api.pbgrpc.dart';

class UserModel {
  final String userId;
  final String username;
  final String email;
  final String token;
  final String refreshToken;

  UserModel({
    required this.userId,
    required this.username,
    required this.email,
    required this.token,
    required this.refreshToken,
  });

  factory UserModel.fromGrpc(User user) {
    return UserModel(
      userId: user.id,
      username: user.username,
      email: user.email,
      token: user.token,
      refreshToken: user.refreshToken,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'username': username,
      'email': email,
      'token': token,
      'refreshToken': refreshToken,
    };
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['userId'],
      username: json['username'],
      email: json['email'],
      token: json['token'],
      refreshToken: json['refreshToken'],
    );
  }
}
