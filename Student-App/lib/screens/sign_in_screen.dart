import 'package:flutter/material.dart';

import '../services/app_session.dart';
import '../services/grpc_api_manager.dart';
import '../utils/sign_in_validators.dart';
import '../widgets/form_widgets.dart';
import '../models/user_model.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;

  void _signIn() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final authService = GrpcApiManager().authenticationService;
      final response = await authService.login(
        _emailController.text.trim(),
        _passwordController.text.trim(),
      );

      if (response != null && response.success) {
        final user = UserModel.fromGrpc(response.user);

        await AppSession().saveUser(user);

        if (!mounted) return;
        Navigator.pushReplacementNamed(context, '/WrapperPage');
      } else {
        _showSnackBar(response?.message ?? 'Login failed');
      }
    } catch (e) {
      _showSnackBar('gRPC error: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.sizeOf(context).width;
    final double height = MediaQuery.sizeOf(context).height;
    final double labelFontSize = width * 0.045;

    return Scaffold(
      backgroundColor: const Color.fromRGBO(217, 217, 217, 1),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(vertical: height * 0.05),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(Icons.menu_book, size: width * 0.2),
              SizedBox(height: height * 0.03),
              Text('Sign In', style: TextStyle(fontSize: width * 0.1)),
              Text('Welcome back to EduLink!',
                  style: TextStyle(fontSize: width * 0.065)),
              SizedBox(height: height * 0.05),
              Form(
                key: _formKey,
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: width * 0.1),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      buildLabel('Email', labelFontSize),
                      SizedBox(height: height * 0.01),
                      buildInputField(
                        controller: _emailController,
                        hintText: 'Enter your email...',
                        validator: SignInValidators.validateEmail,
                      ),
                      SizedBox(height: height * 0.035),
                      buildLabel('Password', labelFontSize),
                      SizedBox(height: height * 0.01),
                      buildInputField(
                        controller: _passwordController,
                        hintText: 'Enter your password...',
                        validator: SignInValidators.validatePassword,
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: height * 0.05),
              SizedBox(
                width: width * 0.8,
                child: TextButton(
                  onPressed: _isLoading ? null : _signIn,
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Colors.black,
                    padding: EdgeInsets.symmetric(vertical: height * 0.015),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text('Sign In',
                      style: TextStyle(fontSize: width * 0.06)),
                ),
              ),
              SizedBox(height: height * 0.03),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Don\'t have an account?',
                    style: TextStyle(
                      fontSize: width * 0.045,
                      color: const Color.fromRGBO(90, 85, 85, 1),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pushReplacementNamed(context, '/signUpPage');
                    },
                    child: Text(
                      'Sign Up',
                      style: TextStyle(
                        fontSize: width * 0.045,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}