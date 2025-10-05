import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/course_model.dart';
import '../models/session_model.dart';
import './chatting_screen.dart';

class SessionsScreen extends StatelessWidget {
  final Course course;

  const SessionsScreen({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.sizeOf(context).width;
    final double height = MediaQuery.sizeOf(context).height;

    final List<Session> liveSessions = course.liveSessions;
    final List<Session> archivedSessions = course.archivedSessions;

    final bool hasNoSessions = liveSessions.isEmpty && archivedSessions.isEmpty;

    return Scaffold(
      backgroundColor: const Color.fromRGBO(217, 217, 217, 1),
      body: SafeArea(
        child: hasNoSessions
            ? _buildEmptySessionsView(width, height, context)
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(context, width),
                  if (liveSessions.isNotEmpty)
                    _buildLiveSessionCard(
                        liveSessions.first, width, height, context),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: width * 0.05),
                    child: Text(
                      'Archived Sessions',
                      style: TextStyle(
                        fontSize: width * 0.05,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  SizedBox(height: height * 0.01),
                  Expanded(
                    child: archivedSessions.isNotEmpty
                        ? _buildArchivedSessionsList(
                            archivedSessions, width, height)
                        : _buildNoArchivedSessionsMessage(width),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, double width) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: width * 0.05, vertical: 20),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: const Icon(Icons.arrow_back, color: Colors.black),
          ),
          SizedBox(width: width * 0.03),
          Expanded(
            child: Text(
              '${course.name} Sessions',
              style: TextStyle(
                fontSize: width * 0.05,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLiveSessionCard(
      Session session, double width, double height, BuildContext context) {
    return Center(
      child: Container(
        margin: EdgeInsets.only(bottom: height * 0.02),
        padding: EdgeInsets.all(width * 0.05),
        width: width * 0.9,
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.circle, color: Colors.red, size: 10),
                SizedBox(width: width * 0.02),
                Text(
                  'Live Session',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: width * 0.045,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            SizedBox(height: height * 0.01),
            Text(
              session.title,
              style: TextStyle(
                color: Colors.white,
                fontSize: width * 0.04,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: height * 0.02),
            SizedBox(
              width: width * 0.6,
              child: TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChattingScreen(
                        session: session.title,
                        courseId: course.id,
                      ),
                    ),
                  );
                },
                style: TextButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text('Join Session'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildArchivedSessionsList(
      List<Session> sessions, double width, double height) {
    String formatTimestamp(String timestamp) {
      try {
        final DateTime dateTime = DateTime.parse(timestamp);
        // Format date as "May 16, 2025" and time as "9:32 PM"
        final String formattedDate = DateFormat.yMMMMd().format(dateTime);
        final String formattedTime = DateFormat.jm().format(dateTime);
        return "$formattedDate • $formattedTime";
      } catch (e) {
        // If we can't parse the timestamp, return it as is
        return timestamp;
      }
    }

    return ListView.builder(
      itemCount: sessions.length,
      padding: EdgeInsets.symmetric(horizontal: width * 0.05),
      itemBuilder: (context, index) {
        final session = sessions[index];
        return Container(
          margin: EdgeInsets.only(bottom: height * 0.02),
          padding: EdgeInsets.all(width * 0.05),
          decoration: BoxDecoration(
            color: Colors.black,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                session.title,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: width * 0.045,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: height * 0.005),
              Text(
                'Date: ${formatTimestamp(session.date)}',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: width * 0.035,
                ),
              ),
              SizedBox(height: height * 0.015),
              Align(
                alignment: Alignment.center,
                child: SizedBox(
                  width: width * 0.6,
                  child: TextButton(
                    onPressed: () {
                    },
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text('View Session'),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNoArchivedSessionsMessage(double width) {
    return Center(
      child: Text(
        'No archived sessions available.',
        style: TextStyle(
          fontSize: width * 0.045,
          color: Colors.grey[700],
          fontWeight: FontWeight.w500,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _buildEmptySessionsView(
      double width, double height, BuildContext context) {
    return Column(
      children: [
        _buildHeader(context, width),
        Expanded(
          child: Center(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: width * 0.1),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.info_outline,
                      size: width * 0.2, color: Colors.grey[500]),
                  SizedBox(height: height * 0.03),
                  Text(
                    'No sessions available yet.',
                    style: TextStyle(
                      fontSize: width * 0.05,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[700],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}