import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../models/course_model.dart';
import '../models/user_model.dart';

class AppSession {
  static final AppSession _instance = AppSession._internal();

  factory AppSession() => _instance;

  AppSession._internal();

  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final String _userKey = 'eduLink_user';

  UserModel? _currentUser;

  UserModel? get currentUser => _currentUser;

  bool get isLoggedIn => _currentUser != null;

  List<Course> _cachedCourses = [];

  List<Course> get courses => _cachedCourses;
  Course? _liveLectureCourse;

  Course? get liveLectureCourse => _liveLectureCourse;

  List<Course> lastAttendedCourses = [];
  final List<String> _sessionQnA = [];

  Future<void> saveUser(UserModel user) async {
    _currentUser = user;
    final jsonString = jsonEncode(user.toJson());
    await _secureStorage.write(key: _userKey, value: jsonString);
  }

  Future<bool> loadUserFromCache() async {
    final jsonString = await _secureStorage.read(key: _userKey);
    if (jsonString == null) return false;

    try {
      final jsonData = jsonDecode(jsonString);
      _currentUser = UserModel.fromJson(jsonData);
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<void> clear() async {
    _currentUser = null;
    _cachedCourses.clear();
    lastAttendedCourses.clear();
    _sessionQnA.clear();
    await _secureStorage.delete(key: _userKey);
  }

  void updateCourses(List<Course> courses) {
    _cachedCourses = courses;
    _updateLastAttendedCourses();
    _checkForLiveLecture();
  }

  void _updateLastAttendedCourses() {
    if (_cachedCourses.isEmpty) return;

    final coursesWithSessions =
        _cachedCourses.where((course) => course.sessions.isNotEmpty).toList();

    coursesWithSessions.sort((a, b) {
      final aLatest = a.sessions
          .map((s) => DateTime.parse(s.date))
          .reduce((a, b) => a.isAfter(b) ? a : b);
      final bLatest = b.sessions
          .map((s) => DateTime.parse(s.date))
          .reduce((a, b) => a.isAfter(b) ? a : b);
      return bLatest.compareTo(aLatest);
    });

    lastAttendedCourses = coursesWithSessions.take(4).toList();
  }

  void _checkForLiveLecture() {
    _liveLectureCourse = null;

    for (final course in _cachedCourses) {
      final hasLive = course.sessions.any((session) => session.isLive);
      if (hasLive) {
        _liveLectureCourse = course;
        break;
      }
    }
  }

  List<String> getQnA() {
    return _sessionQnA;
  }

  void addQnA(String text) {
    _sessionQnA.add(text);
  }

  void clearQnA() {
    _sessionQnA.clear();
  }
}
