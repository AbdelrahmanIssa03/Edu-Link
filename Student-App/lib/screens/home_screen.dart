import 'package:flutter/material.dart';

import '../models/course_model.dart';
import '../screens/sessions_screen.dart';
import '../services/app_session.dart';
import '../services/grpc_api_manager.dart';
import '../widgets/live_classroom_lecture_widget.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<void> _coursesFuture;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _coursesFuture = _fetchCourses();
  }

  Future<void> _fetchCourses() async {
    final userId = AppSession().currentUser?.userId;
    if (userId == null) return;

    try {
      final response =
          await GrpcApiManager().courseManagerService.getCourses(userId);

      if (response.courses.isNotEmpty) {
        final courses = response.courses
            .map((grpcCourse) => Course.fromGrpc(grpcCourse))
            .toList();
        AppSession().updateCourses(courses);
      }
    } catch (e) {
      debugPrint('Error fetching courses: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Widget _buildGrid(List<Course> recentCourses, double width, double height) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: width * 0.05),
      child: GridView.builder(
        padding: EdgeInsets.only(bottom: height * 0.05),
        itemCount: recentCourses.length,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: (width < 600) ? 2 : 3,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1,
        ),
        itemBuilder: (context, index) {
          final course = recentCourses[index];
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => SessionsScreen(course: course),
                ),
              );
            },
            child: Container(
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Text(
                    course.name,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: width * 0.04,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyMessage(double width) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 40),
        child: Text(
          'No recently attended courses yet.',
          style: TextStyle(
            fontSize: width * 0.05,
            color: Colors.grey[700],
            fontWeight: FontWeight.w500,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  Widget _buildLoadingLiveSessionCard(double width, double height) {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: width * 0.05, 
        vertical: height * 0.01
      ),
      child: Container(
        width: double.infinity,
        height: 80,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: const BoxDecoration(
                color: Colors.grey,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: width * 0.6,
                    height: 16,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: width * 0.4,
                    height: 12,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 24,
              height: 24,
              decoration: const BoxDecoration(
                color: Colors.grey,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingCourseGrid(double width, double height) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: width * 0.05),
      child: GridView.builder(
        padding: EdgeInsets.only(bottom: height * 0.05),
        itemCount: 4,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: (width < 600) ? 2 : 3,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1,
        ),
        itemBuilder: (context, index) {
          return Container(
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(16),
            ),
            child: Center(
              child: Container(
                width: width * 0.1,
                height: width * 0.1,
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  shape: BoxShape.circle,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.sizeOf(context).width;
    final double height = MediaQuery.sizeOf(context).height;
    final user = AppSession().currentUser;

    return Scaffold(
      backgroundColor: const Color.fromRGBO(217, 217, 217, 1),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: height * 0.03),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: width * 0.05),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () {},
                    child: Container(
                      width: width * 0.1,
                      height: width * 0.1,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.person,
                        color: Colors.white,
                        size: width * 0.08,
                      ),
                    ),
                  ),
                  SizedBox(width: width * 0.03),
                  Expanded(
                    child: Text(
                      'Welcome Back, ${user?.username ?? ''}',
                      style: TextStyle(fontSize: width * 0.06),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: height * 0.04),
            _isLoading
                ? _buildLoadingLiveSessionCard(width, height)
                : LiveLectureCard(course: AppSession().liveLectureCourse),
            SizedBox(height: height * 0.04),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: width * 0.05),
              child: Text(
                'Recently Attended Courses',
                style: TextStyle(
                  fontSize: width * 0.05,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            SizedBox(height: height * 0.02),
            Expanded(
              child: _isLoading
                  ? _buildLoadingCourseGrid(width, height)
                  : FutureBuilder(
                      future: _coursesFuture,
                      builder: (context, snapshot) {
                        final recentCourses = AppSession().lastAttendedCourses;
                        if (recentCourses.isEmpty) {
                          return _buildEmptyMessage(width);
                        } else {
                          return _buildGrid(recentCourses, width, height);
                        }
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
