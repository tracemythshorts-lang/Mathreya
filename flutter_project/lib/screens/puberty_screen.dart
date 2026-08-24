import 'package:flutter/material.dart';

class PubertyScreen extends StatelessWidget {
  final VoidCallback onBackToDashboard;

  const PubertyScreen({Key? key, required this.onBackToDashboard}) : super(key: key);

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
                icon: const Icon(Icons.arrow_back, color: Color(0xFFC85A32)),
                onPressed: onBackToDashboard,
              ),
              const Text(
                'Puberty & Cycle Guide',
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
              color: const Color(0xFFFFF7ED),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF0E8DD)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Cycle Status: Day 14 (Ovulation Phase)',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFC85A32),
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Your body temperature may rise slightly. Remember to stay hydrated and eat iron-rich foods like dates and spinach.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF3D251E)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
