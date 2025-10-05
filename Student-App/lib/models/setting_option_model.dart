import 'package:flutter/material.dart';

class SettingOption {
  final String title;
  final String? subtitle;
  final IconData icon;
  final VoidCallback onTap;

  SettingOption({
    required this.title,
    required this.icon,
    required this.onTap,
    this.subtitle,
  });
}
