import 'package:edu_link/models/user_model.dart';
import 'package:flutter/material.dart';

import '../services/app_session.dart';
import '../services/grpc_api_manager.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initServices();
  }

  Future<void> _initServices() async {
    await GrpcApiManager().init();
    await _checkSession();
  }

  Future<void> _checkSession() async {
    await Future.delayed(const Duration(seconds: 2));

    final loaded = await AppSession().loadUserFromCache();

    if (!mounted) return;

    if (!loaded || AppSession().currentUser == null) {
      Navigator.pushReplacementNamed(context, '/signInPage');
      return;
    }

    final authService = GrpcApiManager().authenticationService;
    final token = AppSession().currentUser!.token;
    final refreshToken = AppSession().currentUser!.refreshToken;

    try {
      final isValid = await authService.validateToken(token);
      if (!mounted) return;

      if (isValid != null && isValid.valid) {
        Navigator.pushReplacementNamed(context, '/WrapperPage');
        return;
      }

      final refreshed = await authService.refreshToken(refreshToken);
      if (!mounted) return;

      if (refreshed != null && refreshed.success) {
        final currentUser = AppSession().currentUser!;
        AppSession().saveUser(UserModel(
            userId: currentUser.userId,
            username: currentUser.username,
            email: currentUser.email,
            token: token,
            refreshToken: currentUser.refreshToken));

        Navigator.pushReplacementNamed(context, '/WrapperPage');
      } else {
        await AppSession().clear();
        if (!mounted) return;

        Navigator.pushReplacementNamed(context, '/signInPage');
      }
    } catch (e) {
      await AppSession().clear();
      if (!mounted) return;

      Navigator.pushReplacementNamed(context, '/signInPage');
    }
  }

  @override
  Widget build(BuildContext context) {
    final double screenWidth = MediaQuery.sizeOf(context).width;
    final double screenHeight = MediaQuery.sizeOf(context).height;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(50),
            bottomRight: Radius.circular(50),
          ),
          color: Color.fromARGB(255, 124, 124, 124),
        ),
        width: screenWidth,
        height: screenHeight * 0.7,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Image.asset('assets/splash_image.jpg'),
            Column(
              children: [
                Text('EduLink',
                    style: TextStyle(
                        color: Colors.white, fontSize: screenWidth * 0.15)),
                Text('Your Classroom\'s Instant',
                    style: TextStyle(
                        color: Colors.white, fontSize: screenWidth * 0.05)),
                Text('Knowledge Hub',
                    style: TextStyle(
                        color: Colors.white, fontSize: screenWidth * 0.05)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
