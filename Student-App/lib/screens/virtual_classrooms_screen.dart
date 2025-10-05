import 'package:flutter/material.dart';

import '../models/course_model.dart';
import '../services/app_session.dart';
import 'sessions_screen.dart';

class VirtualClassroomsScreen extends StatefulWidget {
  const VirtualClassroomsScreen({super.key});

  @override
  State<VirtualClassroomsScreen> createState() => _VirtualClassroomsScreenState();
}

class _VirtualClassroomsScreenState extends State<VirtualClassroomsScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Course> _allCourses = [];
  List<Course> _filteredCourses = [];

  @override
  void initState() {
    super.initState();
    _allCourses = List.from(AppSession().courses);
    _filteredCourses = List.from(_allCourses);
  }

  void _filterCourses(String query) {
    setState(() {
      _filteredCourses = _allCourses
          .where((course) => course.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  Widget _buildCourseList(double width, double height) {
    return Expanded(
      child: ListView.builder(
        itemCount: _filteredCourses.length,
        itemBuilder: (context, index) {
          final course = _filteredCourses[index];
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
              height: height * 0.1,
              margin: EdgeInsets.symmetric(
                vertical: height * 0.01,
                horizontal: width * 0.05,
              ),
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  course.name,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: width * 0.045,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildNoCoursesMessage(double width) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Text(
        'No Virtual Classrooms Found',
        style: TextStyle(
          fontSize: width * 0.05,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.sizeOf(context).width;
    final double height = MediaQuery.sizeOf(context).height;

    return Scaffold(
      backgroundColor: const Color.fromRGBO(217, 217, 217, 1),
      body: Column(
        children: [
          SizedBox(height: height * 0.05),
          Center(
            child: Text(
              'Virtual Classrooms',
              style: TextStyle(
                fontSize: width * 0.1,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Container(
            margin: EdgeInsets.only(top: height * 0.02),
            padding: EdgeInsets.symmetric(horizontal: width * 0.03),
            width: width * 0.9,
            height: height * 0.05,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.search),
                SizedBox(width: width * 0.02),
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: const InputDecoration(
                      hintText: 'Search...',
                      border: InputBorder.none,
                    ),
                    onChanged: _filterCourses,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: height * 0.01),
          _filteredCourses.isNotEmpty
              ? _buildCourseList(width, height)
              : _buildNoCoursesMessage(width),
        ],
      ),
    );
  }
}
