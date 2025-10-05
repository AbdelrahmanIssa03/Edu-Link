import 'package:grpc/grpc.dart';

import 'grpc/user_services/user_api.pbgrpc.dart';

class AuthenticationService {
  late final ClientChannel _channel;
  late final AuthenticationClient _client;

  AuthenticationService() {
    _channel = ClientChannel(
      '10.0.2.2',
      port: 3001,
      options: const ChannelOptions(
        credentials: ChannelCredentials.insecure(),
        connectionTimeout: Duration(seconds: 5),
      ),
    );
    _client = AuthenticationClient(_channel);
  }

  Future<LoginResponse?> login(String email, String password) async {
    try {
      return await _client.login(LoginRequest()
        ..email = email
        ..password = password);
    } catch (e) {
      return null;
    }
  }

  Future<SignUpResponse?> signUp(
    String username,
    String email,
    String password,
  ) async {
    try {
      return await _client.signUp(SignUpRequest()
        ..username = username
        ..email = email
        ..password = password
        ..role = "student");
    } catch (e) {
      return null;
    }
  }

  Future<ValidateTokenResponse?> validateToken(String token) async {
    try {
      final metadata = {
        'authorization': 'Bearer $token',
      };

      return await _client.validateToken(
        ValidateTokenRequest()..token = token,
        options: CallOptions(
          metadata: metadata,
          timeout: Duration(seconds: 10),
        ),
      );
    } catch (e) {
      return null;
    }
  }

  Future<RefreshTokenResponse?> refreshToken(String refreshToken) async {
    try {
      final metadata = {
        'authorization': 'Bearer $refreshToken',
      };

      return await _client.refreshToken(
        RefreshTokenRequest()..refreshToken = refreshToken,
        options: CallOptions(
          metadata: metadata,
          timeout: Duration(seconds: 10),
        ),
      );
    } catch (e) {
      return null;
    }
  }

  Future<void> shutdown() async {
    await _channel.shutdown();
  }
}
