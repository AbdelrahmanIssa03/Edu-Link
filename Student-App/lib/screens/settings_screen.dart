import 'package:flutter/material.dart';

import '../models/setting_option_model.dart';
import '../services/app_session.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  void _logout(BuildContext context) async {
    final bool? confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Log Out'),
        content: const Text('Are you sure you want to log out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await AppSession().clear();
      if (context.mounted) {
        Navigator.pushNamedAndRemoveUntil(
            context, '/signInPage', (route) => false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.sizeOf(context).width;
    final List<SettingOption> settings = [
      SettingOption(
        title: 'Account',
        subtitle: 'Edit your profile and password',
        icon: Icons.person,
        onTap: () {
        },
      ),
      SettingOption(
        title: 'Notifications',
        subtitle: 'Customize notification preferences',
        icon: Icons.notifications,
        onTap: () {
        },
      ),
      SettingOption(
        title: 'Log Out',
        icon: Icons.logout,
        onTap: () => _logout(context),
      ),
    ];

    return Scaffold(
      backgroundColor: const Color.fromRGBO(217, 217, 217, 1),
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Colors.black,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.symmetric(vertical: 10),
        itemCount: settings.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, index) {
          final item = settings[index];
          return ListTile(
            leading: Icon(item.icon, color: Colors.black),
            title: Text(
              item.title,
              style: TextStyle(fontSize: width * 0.045),
            ),
            subtitle: item.subtitle != null
                ? Text(item.subtitle!,
                    style: TextStyle(color: Colors.grey[600]))
                : null,
            onTap: item.onTap,
            trailing: const Icon(Icons.arrow_forward_ios,
                size: 16, color: Colors.grey),
          );
        },
      ),
    );
  }
}