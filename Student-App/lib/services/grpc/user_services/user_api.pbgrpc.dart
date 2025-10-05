//
//  Generated code. Do not modify.
//  source: user_api.proto
//
// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:async' as $async;
import 'dart:core' as $core;

import 'package:grpc/service_api.dart' as $grpc;
import 'package:protobuf/protobuf.dart' as $pb;

import 'user_api.pb.dart' as $0;

export 'user_api.pb.dart';

@$pb.GrpcServiceName('userAPI.Authentication')
class AuthenticationClient extends $grpc.Client {
  static final _$signUp = $grpc.ClientMethod<$0.SignUpRequest, $0.SignUpResponse>(
      '/userAPI.Authentication/SignUp',
      ($0.SignUpRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $0.SignUpResponse.fromBuffer(value));
  static final _$login = $grpc.ClientMethod<$0.LoginRequest, $0.LoginResponse>(
      '/userAPI.Authentication/Login',
      ($0.LoginRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $0.LoginResponse.fromBuffer(value));
  static final _$refreshToken = $grpc.ClientMethod<$0.RefreshTokenRequest, $0.RefreshTokenResponse>(
      '/userAPI.Authentication/RefreshToken',
      ($0.RefreshTokenRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $0.RefreshTokenResponse.fromBuffer(value));
  static final _$validateToken = $grpc.ClientMethod<$0.ValidateTokenRequest, $0.ValidateTokenResponse>(
      '/userAPI.Authentication/ValidateToken',
      ($0.ValidateTokenRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $0.ValidateTokenResponse.fromBuffer(value));

  AuthenticationClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options,
        interceptors: interceptors);

  $grpc.ResponseFuture<$0.SignUpResponse> signUp($0.SignUpRequest request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$signUp, request, options: options);
  }

  $grpc.ResponseFuture<$0.LoginResponse> login($0.LoginRequest request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$login, request, options: options);
  }

  $grpc.ResponseFuture<$0.RefreshTokenResponse> refreshToken($0.RefreshTokenRequest request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$refreshToken, request, options: options);
  }

  $grpc.ResponseFuture<$0.ValidateTokenResponse> validateToken($0.ValidateTokenRequest request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$validateToken, request, options: options);
  }
}

@$pb.GrpcServiceName('userAPI.Authentication')
abstract class AuthenticationServiceBase extends $grpc.Service {
  $core.String get $name => 'userAPI.Authentication';

  AuthenticationServiceBase() {
    $addMethod($grpc.ServiceMethod<$0.SignUpRequest, $0.SignUpResponse>(
        'SignUp',
        signUp_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.SignUpRequest.fromBuffer(value),
        ($0.SignUpResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$0.LoginRequest, $0.LoginResponse>(
        'Login',
        login_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.LoginRequest.fromBuffer(value),
        ($0.LoginResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$0.RefreshTokenRequest, $0.RefreshTokenResponse>(
        'RefreshToken',
        refreshToken_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.RefreshTokenRequest.fromBuffer(value),
        ($0.RefreshTokenResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$0.ValidateTokenRequest, $0.ValidateTokenResponse>(
        'ValidateToken',
        validateToken_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.ValidateTokenRequest.fromBuffer(value),
        ($0.ValidateTokenResponse value) => value.writeToBuffer()));
  }

  $async.Future<$0.SignUpResponse> signUp_Pre($grpc.ServiceCall $call, $async.Future<$0.SignUpRequest> $request) async {
    return signUp($call, await $request);
  }

  $async.Future<$0.LoginResponse> login_Pre($grpc.ServiceCall $call, $async.Future<$0.LoginRequest> $request) async {
    return login($call, await $request);
  }

  $async.Future<$0.RefreshTokenResponse> refreshToken_Pre($grpc.ServiceCall $call, $async.Future<$0.RefreshTokenRequest> $request) async {
    return refreshToken($call, await $request);
  }

  $async.Future<$0.ValidateTokenResponse> validateToken_Pre($grpc.ServiceCall $call, $async.Future<$0.ValidateTokenRequest> $request) async {
    return validateToken($call, await $request);
  }

  $async.Future<$0.SignUpResponse> signUp($grpc.ServiceCall call, $0.SignUpRequest request);
  $async.Future<$0.LoginResponse> login($grpc.ServiceCall call, $0.LoginRequest request);
  $async.Future<$0.RefreshTokenResponse> refreshToken($grpc.ServiceCall call, $0.RefreshTokenRequest request);
  $async.Future<$0.ValidateTokenResponse> validateToken($grpc.ServiceCall call, $0.ValidateTokenRequest request);
}
@$pb.GrpcServiceName('userAPI.CourseManager')
class CourseManagerClient extends $grpc.Client {
  static final _$getCourses = $grpc.ClientMethod<$0.GetCoursesRequest, $0.GetCoursesResponse>(
      '/userAPI.CourseManager/GetCourses',
      ($0.GetCoursesRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $0.GetCoursesResponse.fromBuffer(value));

  CourseManagerClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options,
        interceptors: interceptors);

  $grpc.ResponseFuture<$0.GetCoursesResponse> getCourses($0.GetCoursesRequest request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$getCourses, request, options: options);
  }
}

@$pb.GrpcServiceName('userAPI.CourseManager')
abstract class CourseManagerServiceBase extends $grpc.Service {
  $core.String get $name => 'userAPI.CourseManager';

  CourseManagerServiceBase() {
    $addMethod($grpc.ServiceMethod<$0.GetCoursesRequest, $0.GetCoursesResponse>(
        'GetCourses',
        getCourses_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.GetCoursesRequest.fromBuffer(value),
        ($0.GetCoursesResponse value) => value.writeToBuffer()));
  }

  $async.Future<$0.GetCoursesResponse> getCourses_Pre($grpc.ServiceCall $call, $async.Future<$0.GetCoursesRequest> $request) async {
    return getCourses($call, await $request);
  }

  $async.Future<$0.GetCoursesResponse> getCourses($grpc.ServiceCall call, $0.GetCoursesRequest request);
}
@$pb.GrpcServiceName('userAPI.NotificationManager')
class NotificationManagerClient extends $grpc.Client {
  static final _$getNotifications = $grpc.ClientMethod<$0.GetNotificationsRequest, $0.GetNotificationsResponse>(
      '/userAPI.NotificationManager/GetNotifications',
      ($0.GetNotificationsRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $0.GetNotificationsResponse.fromBuffer(value));

  NotificationManagerClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options,
        interceptors: interceptors);

  $grpc.ResponseFuture<$0.GetNotificationsResponse> getNotifications($0.GetNotificationsRequest request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$getNotifications, request, options: options);
  }
}

@$pb.GrpcServiceName('userAPI.NotificationManager')
abstract class NotificationManagerServiceBase extends $grpc.Service {
  $core.String get $name => 'userAPI.NotificationManager';

  NotificationManagerServiceBase() {
    $addMethod($grpc.ServiceMethod<$0.GetNotificationsRequest, $0.GetNotificationsResponse>(
        'GetNotifications',
        getNotifications_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.GetNotificationsRequest.fromBuffer(value),
        ($0.GetNotificationsResponse value) => value.writeToBuffer()));
  }

  $async.Future<$0.GetNotificationsResponse> getNotifications_Pre($grpc.ServiceCall $call, $async.Future<$0.GetNotificationsRequest> $request) async {
    return getNotifications($call, await $request);
  }

  $async.Future<$0.GetNotificationsResponse> getNotifications($grpc.ServiceCall call, $0.GetNotificationsRequest request);
}
