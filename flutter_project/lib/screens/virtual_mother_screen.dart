import 'package:flutter/material.dart';

class VirtualMotherScreen extends StatelessWidget {
  final VoidCallback onBackToDashboard;

  const VirtualMotherScreen({Key? key, required this.onBackToDashboard}) : super(key: key);

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
                icon: const Icon(Icons.arrow_back, color: Color(0xFF6A1B29)),
                onPressed: onBackToDashboard,
              ),
              const Text(
                'Virtual Mother Ecosystem (Amma)',
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
              color: const Color(0xFFFFFBF6),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFF0E8DD)),
            ),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: const Color(0xFF6A1B29),
                  child: const Text(
                    'अं',
                    style: TextStyle(fontSize: 28, color: Colors.amber, fontFamily: 'Serif'),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  '"Don\'t worry child, everything will be fine. Eat warm food and rest well today."',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    fontStyle: FontStyle.italic,
                    color: Color(0xFF5E2211),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
