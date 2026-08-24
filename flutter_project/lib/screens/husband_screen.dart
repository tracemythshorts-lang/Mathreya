import 'package:flutter/material.dart';

class HusbandScreen extends StatelessWidget {
  final VoidCallback onBackToDashboard;

  const HusbandScreen({Key? key, required this.onBackToDashboard}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Color(0xFF2C3E50)),
                onPressed: onBackToDashboard,
              ),
              const Text(
                'Husband Support Hub',
                style: TextStyle(
                  fontFamily: 'Serif',
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF5E2211),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFF0F5FA),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFD0E0EF)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Husband's Daily Checklist",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2C3E50),
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  '1. Remind her to take Iron & Folic Acid tablet.\n2. Ensure fresh coconut water is available.\n3. Assist with 20 min evening walk.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF1E2B37)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
