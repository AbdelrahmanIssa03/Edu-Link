import 'package:flutter/material.dart';

import '../models/course_model.dart';
import '../models/session_model.dart';
import '../screens/chatting_screen.dart';

class LiveLectureCard extends StatelessWidget {
  final Course? course;

  const LiveLectureCard({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.sizeOf(context).width;
    final double height = MediaQuery.sizeOf(context).height;

    if (course == null) {
      return Padding(
        padding: EdgeInsets.symmetric(
            horizontal: width * 0.05, vertical: height * 0.01),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey[300],
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            'No live lectures at the moment.',
            style: TextStyle(
              fontSize: width * 0.045,
              fontWeight: FontWeight.w500,
              color: Colors.grey[800],
            ),
          ),
        ),
      );
    }

    // Find the live session in the course
    Session? liveSession;
    if (course!.sessions.isNotEmpty) {
      liveSession = course!.sessions.firstWhere(
        (session) => session.isLive,
        orElse: () => course!.sessions.first,
      );
    }

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => ChattingScreen(
                    session: liveSession?.title ?? course!.name,
                    courseId: course!.id,
                  )),
        );
      },
      child: Padding(
        padding: EdgeInsets.symmetric(
            horizontal: width * 0.05, vertical: height * 0.01),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.red[50],
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.red),
          ),
          child: Row(
            children: [
              _LiveRedDot(),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Live now: ${course!.name}',
                      style: TextStyle(
                        fontSize: width * 0.045,
                        fontWeight: FontWeight.w600,
                        color: Colors.red[800],
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (liveSession != null)
                      Text(
                        liveSession.title,
                        style: TextStyle(
                          fontSize: width * 0.035,
                          color: Colors.red[700],
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                  ],
                ),
              ),
              Icon(Icons.play_circle_fill,
                  color: Colors.red[700], size: width * 0.07),
            ],
          ),
        ),
      ),
    );
  }
}

class _LiveRedDot extends StatefulWidget {

  @override
  State<_LiveRedDot> createState() => _LiveRedDotState();
}

class _LiveRedDotState extends State<_LiveRedDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: Tween(begin: 0.6, end: 1.0).animate(_controller),
      child: const CircleAvatar(radius: 6, backgroundColor: Colors.red),
    );
  }
}
