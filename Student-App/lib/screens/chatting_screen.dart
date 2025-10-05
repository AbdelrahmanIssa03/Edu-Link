import 'package:edu_link/services/grpc_api_manager.dart';
import 'package:flutter/material.dart';

import '../services/app_session.dart';
import '../widgets/animated_dots_widgets.dart';

class ChattingScreen extends StatefulWidget {
  final String session;
  final String courseId;

  const ChattingScreen(
      {super.key, required this.session, required this.courseId});

  @override
  State<ChattingScreen> createState() => _ChattingScreenState();
}

class _ChattingScreenState extends State<ChattingScreen> {
  final TextEditingController _questionController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<String> questions = [];
  final List<String> answers = [];

  bool isTyping = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    GrpcApiManager().shutdown();
    _questionController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    AppSession().addQnA(text);

    setState(() {
      questions.add(text.trim());
      answers.add("");
      isTyping = true;
      _questionController.clear();
    });

    final response = await _getAnswerFromAPI(text);
    AppSession().addQnA(response);

    setState(() {
      answers[answers.length - 1] = response;
      isTyping = false;
    });

    await Future.delayed(const Duration(milliseconds: 100));
    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent + 100,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  Future<String> _getAnswerFromAPI(String question) async {
    try {
      final response =
          await GrpcApiManager().sessionManagerService.sendQuestion(
                question,
                widget.courseId,
              );

      if (response.success) {
        return response.answer;
      } else {
        return "❌ Error: ${response.errorMessages.join(', ')}";
      }
    } catch (e) {
      return "❌ gRPC error: $e";
    }
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final height = MediaQuery.sizeOf(context).height;

    return Scaffold(
      backgroundColor: const Color.fromRGBO(217, 217, 217, 1),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.symmetric(
                  horizontal: width * 0.05, vertical: height * 0.015),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.arrow_back, color: Colors.black),
                  ),
                  SizedBox(width: width * 0.03),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(50),
                      ),
                      child: Center(
                        child: Text(
                          widget.session,
                          style: TextStyle(
                              color: Colors.white, fontSize: width * 0.045),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                itemCount: questions.length,
                padding: EdgeInsets.symmetric(horizontal: width * 0.05),
                itemBuilder: (context, index) {
                  final question = questions[index];
                  final answer = answers[index];

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Flexible(
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              margin: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(question,
                                  style: const TextStyle(fontSize: 16)),
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.person),
                        ],
                      ),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.smart_toy_outlined),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              margin: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: answer.isNotEmpty
                                  ? Text(answer,
                                      style: const TextStyle(fontSize: 16))
                                  : const AnimatedDots(),
                            ),
                          ),
                        ],
                      ),
                    ],
                  );
                },
              ),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(
                  width * 0.05, 0, width * 0.05, height * 0.025),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _questionController,
                      onSubmitted: _sendMessage,
                      style: const TextStyle(color: Colors.white),
                      cursorColor: Colors.white,
                      decoration: InputDecoration(
                        hintText: "Enter Your Question",
                        hintStyle: const TextStyle(color: Colors.white70),
                        filled: true,
                        fillColor: Colors.black,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  IconButton(
                    onPressed: () => _sendMessage(_questionController.text),
                    icon: const Icon(Icons.send, color: Colors.black),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}