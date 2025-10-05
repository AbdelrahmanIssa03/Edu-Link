//
//  Generated code. Do not modify.
//  source: ai_api.proto
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

import 'ai_api.pb.dart' as $0;

export 'ai_api.pb.dart';

@$pb.GrpcServiceName('aiAPI.SessionManager')
class SessionManagerClient extends $grpc.Client {
  static final _$sendQuestion = $grpc.ClientMethod<$0.SendQuestionRequest, $0.SendQuestionResponse>(
      '/aiAPI.SessionManager/SendQuestion',
      ($0.SendQuestionRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $0.SendQuestionResponse.fromBuffer(value));

  SessionManagerClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options,
        interceptors: interceptors);

  $grpc.ResponseFuture<$0.SendQuestionResponse> sendQuestion($0.SendQuestionRequest request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$sendQuestion, request, options: options);
  }
}

@$pb.GrpcServiceName('aiAPI.SessionManager')
abstract class SessionManagerServiceBase extends $grpc.Service {
  $core.String get $name => 'aiAPI.SessionManager';

  SessionManagerServiceBase() {
    $addMethod($grpc.ServiceMethod<$0.SendQuestionRequest, $0.SendQuestionResponse>(
        'SendQuestion',
        sendQuestion_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.SendQuestionRequest.fromBuffer(value),
        ($0.SendQuestionResponse value) => value.writeToBuffer()));
  }

  $async.Future<$0.SendQuestionResponse> sendQuestion_Pre($grpc.ServiceCall $call, $async.Future<$0.SendQuestionRequest> $request) async {
    return sendQuestion($call, await $request);
  }

  $async.Future<$0.SendQuestionResponse> sendQuestion($grpc.ServiceCall call, $0.SendQuestionRequest request);
}
