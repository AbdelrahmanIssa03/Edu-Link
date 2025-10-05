//
//  Generated code. Do not modify.
//  source: ai_api.proto
//
// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:convert' as $convert;
import 'dart:core' as $core;
import 'dart:typed_data' as $typed_data;

@$core.Deprecated('Use sendQuestionRequestDescriptor instead')
const SendQuestionRequest$json = {
  '1': 'SendQuestionRequest',
  '2': [
    {'1': 'question', '3': 1, '4': 1, '5': 9, '10': 'question'},
    {'1': 'className', '3': 2, '4': 1, '5': 9, '10': 'className'},
  ],
};

/// Descriptor for `SendQuestionRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List sendQuestionRequestDescriptor = $convert.base64Decode(
    'ChNTZW5kUXVlc3Rpb25SZXF1ZXN0EhoKCHF1ZXN0aW9uGAEgASgJUghxdWVzdGlvbhIcCgljbG'
    'Fzc05hbWUYAiABKAlSCWNsYXNzTmFtZQ==');

@$core.Deprecated('Use sendQuestionResponseDescriptor instead')
const SendQuestionResponse$json = {
  '1': 'SendQuestionResponse',
  '2': [
    {'1': 'success', '3': 1, '4': 1, '5': 8, '10': 'success'},
    {'1': 'errorMessages', '3': 2, '4': 3, '5': 9, '10': 'errorMessages'},
    {'1': 'answer', '3': 3, '4': 1, '5': 9, '10': 'answer'},
  ],
};

/// Descriptor for `SendQuestionResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List sendQuestionResponseDescriptor = $convert.base64Decode(
    'ChRTZW5kUXVlc3Rpb25SZXNwb25zZRIYCgdzdWNjZXNzGAEgASgIUgdzdWNjZXNzEiQKDWVycm'
    '9yTWVzc2FnZXMYAiADKAlSDWVycm9yTWVzc2FnZXMSFgoGYW5zd2VyGAMgASgJUgZhbnN3ZXI=');

