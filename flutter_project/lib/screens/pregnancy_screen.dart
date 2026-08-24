import 'package:flutter/material.dart';

class PregnancyScreen extends StatelessWidget {
  final VoidCallback onBackToDashboard;

  const PregnancyScreen({Key? key, required this.onBackToDashboard}) : super(key: key);

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
                icon: const Icon(Icons.arrow_back, color: Color(0xFF4A7C59)),
                onPressed: onBackToDashboard,
              ),
              const Text(
                'Pregnancy & Maternal Care',
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
              color: const Color(0xFFF4F9F5),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFD4E7D9)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Week 24 • Second Trimester',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF4A7C59),
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Baby is hearing your voice! Try listening to soothing classical music or gentle Indian ragas like Yaman or Bhairavi.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF2E5238)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
