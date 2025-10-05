//
//  Generated code. Do not modify.
//  source: ai_api.proto
//
// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

class SendQuestionRequest extends $pb.GeneratedMessage {
  factory SendQuestionRequest({
    $core.String? question,
    $core.String? className,
  }) {
    final $result = create();
    if (question != null) {
      $result.question = question;
    }
    if (className != null) {
      $result.className = className;
    }
    return $result;
  }
  SendQuestionRequest._() : super();
  factory SendQuestionRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory SendQuestionRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'SendQuestionRequest', package: const $pb.PackageName(_omitMessageNames ? '' : 'aiAPI'), createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'question')
    ..aOS(2, _omitFieldNames ? '' : 'className', protoName: 'className')
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  SendQuestionRequest clone() => SendQuestionRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  SendQuestionRequest copyWith(void Function(SendQuestionRequest) updates) => super.copyWith((message) => updates(message as SendQuestionRequest)) as SendQuestionRequest;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static SendQuestionRequest create() => SendQuestionRequest._();
  SendQuestionRequest createEmptyInstance() => create();
  static $pb.PbList<SendQuestionRequest> createRepeated() => $pb.PbList<SendQuestionRequest>();
  @$core.pragma('dart2js:noInline')
  static SendQuestionRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<SendQuestionRequest>(create);
  static SendQuestionRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get question => $_getSZ(0);
  @$pb.TagNumber(1)
  set question($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasQuestion() => $_has(0);
  @$pb.TagNumber(1)
  void clearQuestion() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get className => $_getSZ(1);
  @$pb.TagNumber(2)
  set className($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasClassName() => $_has(1);
  @$pb.TagNumber(2)
  void clearClassName() => $_clearField(2);
}

class SendQuestionResponse extends $pb.GeneratedMessage {
  factory SendQuestionResponse({
    $core.bool? success,
    $core.Iterable<$core.String>? errorMessages,
    $core.String? answer,
  }) {
    final $result = create();
    if (success != null) {
      $result.success = success;
    }
    if (errorMessages != null) {
      $result.errorMessages.addAll(errorMessages);
    }
    if (answer != null) {
      $result.answer = answer;
    }
    return $result;
  }
  SendQuestionResponse._() : super();
  factory SendQuestionResponse.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory SendQuestionResponse.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'SendQuestionResponse', package: const $pb.PackageName(_omitMessageNames ? '' : 'aiAPI'), createEmptyInstance: create)
    ..aOB(1, _omitFieldNames ? '' : 'success')
    ..pPS(2, _omitFieldNames ? '' : 'errorMessages', protoName: 'errorMessages')
    ..aOS(3, _omitFieldNames ? '' : 'answer')
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  SendQuestionResponse clone() => SendQuestionResponse()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  SendQuestionResponse copyWith(void Function(SendQuestionResponse) updates) => super.copyWith((message) => updates(message as SendQuestionResponse)) as SendQuestionResponse;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static SendQuestionResponse create() => SendQuestionResponse._();
  SendQuestionResponse createEmptyInstance() => create();
  static $pb.PbList<SendQuestionResponse> createRepeated() => $pb.PbList<SendQuestionResponse>();
  @$core.pragma('dart2js:noInline')
  static SendQuestionResponse getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<SendQuestionResponse>(create);
  static SendQuestionResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.bool get success => $_getBF(0);
  @$pb.TagNumber(1)
  set success($core.bool v) { $_setBool(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasSuccess() => $_has(0);
  @$pb.TagNumber(1)
  void clearSuccess() => $_clearField(1);

  @$pb.TagNumber(2)
  $pb.PbList<$core.String> get errorMessages => $_getList(1);

  @$pb.TagNumber(3)
  $core.String get answer => $_getSZ(2);
  @$pb.TagNumber(3)
  set answer($core.String v) { $_setString(2, v); }
  @$pb.TagNumber(3)
  $core.bool hasAnswer() => $_has(2);
  @$pb.TagNumber(3)
  void clearAnswer() => $_clearField(3);
}


const _omitFieldNames = $core.bool.fromEnvironment('protobuf.omit_field_names');
const _omitMessageNames = $core.bool.fromEnvironment('protobuf.omit_message_names');
