import 'package:flutter/material.dart';
import './screens/splash_screen.dart';
import './screens/sign_in_screen.dart';
import './screens/sign_up_screen.dart';
import './screens/wrapper_screen.dart';

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      restorationScopeId: null,
      initialRoute: '/',
      routes: {
        "/" : (context) => const SplashScreen(),
        "/signInPage" : (context) => const SignInScreen(),
        "/signUpPage" : (context) => const SignUpScreen(),
        "/WrapperPage" : (context) => const WrapperScreen()
      },
    );
  }
}
