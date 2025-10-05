import 'package:flutter/material.dart';

Widget buildLabel(String label, double fontSize) => Text(
  label,
  style: TextStyle(
    color: Colors.black,
    fontWeight: FontWeight.bold,
    fontSize: fontSize,
  ),
);

Widget buildInputField({
  required TextEditingController controller,
  required String hintText,
  required String? Function(String?) validator,
}) => TextFormField(
  controller: controller,
  decoration: InputDecoration(
    filled: true,
    fillColor: Colors.white,
    hintText: hintText,
    hintStyle: const TextStyle(color: Color.fromRGBO(169, 169, 169, 1)),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
  ),
  validator: validator,
);
