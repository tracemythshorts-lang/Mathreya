import { LifeStage, SubTab } from '../types';

export function getFlutterCodeSnippet(stage: LifeStage, subTab: SubTab): { fileName: string; code: string } {
  switch (stage) {
    case 'puberty':
      return {
        fileName: 'puberty_screen.dart',
        code: `// Mathreya Women's Health - Puberty Screen (Flutter Dart)
// Clean, spacious, and accessible design pattern

import 'package:flutter/material.dart';

class PubertyScreen extends StatefulWidget {
  const PubertyScreen({Key? key}) : super(key: key);

  @override
  State<PubertyScreen> createState() => _PubertyScreenState();
}

class _PubertyScreenState extends State<PubertyScreen> {
  int _selectedSubTab = 0;
  final List<String> _subTabs = [
    'Period Tracker',
    'Safe Space',
    'AI Assistant',
    'Media Hub',
    'Community',
    'Mentorship'
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF7), // Warm terracotta cream
      appBar: AppBar(
        backgroundColor: const Color(0xFFC85A32),
        elevation: 0,
        title: const Text(
          'Mathreya • Puberty Care',
          style: TextStyle(
            fontFamily: 'Serif',
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.lock_outline, color: Colors.white),
            onPressed: () {},
            tooltip: 'Secured Safe Space',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Cycle Banner Widget
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFFF5F0), Color(0xFFFFE8DC)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFF4C4B2)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: const BoxDecoration(
                        color: Color(0xFFC85A32),
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Text(
                          'Day 14',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'Ovulation Phase • Low Cramp Risk',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF4A2B20),
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Next period expected in 14 days. Drink warm water.',
                            style: TextStyle(
                              fontSize: 13,
                              color: Color(0xFF7A5C50),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              
              // Sub Tab Switcher
              SizedBox(
                height: 45,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _subTabs.length,
                  itemBuilder: (context, index) {
                    final isSelected = _selectedSubTab == index;
                    return Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: ChoiceChip(
                        label: Text(_subTabs[index]),
                        selected: isSelected,
                        selectedColor: const Color(0xFFC85A32),
                        backgroundColor: Colors.white,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : const Color(0xFF4A2B20),
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                        onSelected: (bool selected) {
                          setState(() {
                            _selectedSubTab = index;
                          });
                        },
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
              
              // Feature Grid
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.3,
                children: [
                  _buildCard(
                    context,
                    title: 'Safe Space Journal',
                    icon: Icons.menu_book_rounded,
                    color: const Color(0xFFE8F5E9),
                    iconColor: const Color(0xFF2E7D32),
                  ),
                  _buildCard(
                    context,
                    title: 'AI Companion',
                    icon: Icons.psychology_rounded,
                    color: const Color(0xFFF3E5F5),
                    iconColor: const Color(0xFF7B1FA2),
                  ),
                  _buildCard(
                    context,
                    title: 'Soothing Media',
                    icon: Icons.play_circle_fill_rounded,
                    color: const Color(0xFFE0F7FA),
                    iconColor: const Color(0xFF0097A7),
                  ),
                  _buildCard(
                    context,
                    title: 'Sister Mentorship',
                    icon: Icons.handshake_rounded,
                    color: const Color(0xFFFFF3E0),
                    iconColor: const Color(0xFFE65100),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required Color iconColor,
  }) {
    return Card(
      elevation: 0,
      color: color,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 32, color: iconColor),
            const SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: iconColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
      };

    case 'pregnancy_prenatal':
    case 'pregnancy_postnatal':
      return {
        fileName: 'pregnancy_screen.dart',
        code: `// Mathreya Women's Health - Pregnancy & Postnatal Screen (Flutter Dart)
// Designed for extreme comfort, large tap targets, & motherly care

import 'package:flutter/material.dart';

class PregnancyScreen extends StatefulWidget {
  final bool isPostnatal;
  const PregnancyScreen({Key? key, this.isPostnatal = false}) : super(key: key);

  @override
  State<PregnancyScreen> createState() => _PregnancyScreenState();
}

class _PregnancyScreenState extends State<PregnancyScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF7),
      appBar: AppBar(
        backgroundColor: const Color(0xFF4A7C59), // Sage green for soothing maternity
        title: Text(
          widget.isPostnatal ? 'Mathreya • Postnatal Healing' : 'Mathreya • Prenatal Journey',
          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFFEBF3ED),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFC2DBC7)),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 30,
                    backgroundColor: Color(0xFF4A7C59),
                    child: Icon(Icons.favorite, color: Colors.white, size: 30),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.isPostnatal ? 'Postpartum Week 6 Recovery' : 'Trimester 2 • Week 24',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2C4C36)),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.isPostnatal
                              ? 'Baby size of a honeydew melon • pelvic rest & warm broth'
                              : 'Baby hearing is fully active • Garbh Sanskar shlokas recommended',
                          style: const TextStyle(fontSize: 13, color: Color(0xFF5A7563)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Functional Modules List
            _buildActionTile(context, 'AI Psychiatrist & Emotional Support', Icons.psychology_outlined, Colors.purple),
            _buildActionTile(context, '1-1 Doctor & Doula Consultation', Icons.medical_services_outlined, Colors.teal),
            _buildActionTile(context, 'Garbh Sanskar & Yoga Routines', Icons.self_improvement_outlined, Colors.orange),
            _buildActionTile(context, 'Mothers Community Circle', Icons.people_outline, Colors.blue),
          ],
        ),
      ),
    );
  }

  Widget _buildActionTile(BuildContext context, String title, IconData icon, Color accentColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        tileColor: Colors.white,
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: accentColor.withOpacity(0.1), shape: BoxShape.circle),
          child: Icon(icon, color: accentColor),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
        onTap: () {},
      ),
    );
  }
}
`
      };

    case 'virtual_mother':
      return {
        fileName: 'virtual_mother_screen.dart',
        code: `// Mathreya Women's Health - Virtual Mother (Amma/Maa) Screen (Flutter Dart)
// Interactive Motherly AI Persona, Voice & Comforting Reactivity

import 'package:flutter/material.dart';

class VirtualMotherScreen extends StatefulWidget {
  const VirtualMotherScreen({Key? key}) : super(key: key);

  @override
  State<VirtualMotherScreen> createState() => _VirtualMotherScreenState();
}

class _VirtualMotherScreenState extends State<VirtualMotherScreen> {
  bool _isListening = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF8F3),
      appBar: AppBar(
        backgroundColor: const Color(0xFF8B4513), // Warm Mahogany Brown
        title: const Text('Mathreya • Virtual Mother (Amma)', style: TextStyle(color: Colors.white)),
      ),
      body: Column(
        children: [
          // Avatar & Touch Reactivity Stage
          Expanded(
            flex: 3,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  colors: [Colors.amber.shade100, const Color(0xFFFFF8F3)],
                  radius: 0.9,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Amma gives you a warm comforting hug 🤗')),
                      );
                    },
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Container(
                          width: 170,
                          height: 170,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: const Color(0xFFD4AF37), width: 3),
                            boxShadow: [
                              BoxShadow(color: Colors.amber.withOpacity(0.3), blurRadius: 20, spreadRadius: 5)
                            ],
                          ),
                          child: const CircleAvatar(
                            backgroundImage: NetworkImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80'),
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6A1B29),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text(
                              'Tap Amma for a Hug',
                              style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    '"Kanna, how are you feeling today?"',
                    style: TextStyle(fontFamily: 'Serif', fontSize: 18, fontStyle: FontStyle.italic, color: Color(0xFF4A2B20)),
                  ),
                ],
              ),
            ),
          ),
          // Action Buttons
          Expanded(
            flex: 2,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF8B4513),
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                        ),
                        onPressed: () {},
                        icon: const Icon(Icons.mic, color: Colors.white),
                        label: const Text('Speak to Amma', style: TextStyle(color: Colors.white)),
                      ),
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                        ),
                        onPressed: () {},
                        icon: const Icon(Icons.spa, color: Color(0xFF8B4513)),
                        label: const Text('Grandma Nuskhe', style: TextStyle(color: Color(0xFF8B4513))),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
`
      };

    case 'husband_dashboard':
      return {
        fileName: 'husband_dashboard.dart',
        code: `// Mathreya Women's Health - Husband Support Dashboard (Flutter Dart)
// Consultation reminders, Medical Vault, SOS & Partner Mood Sync

import 'package:flutter/material.dart';

class HusbandDashboard extends StatelessWidget {
  const HusbandDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF2C3E50),
        title: const Text('Mathreya • Partner Support Hub', style: TextStyle(color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.error_outline, color: Colors.redAccent),
            onPressed: () {},
            tooltip: 'Emergency SOS',
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Partner Mood Sync Banner
            Card(
              color: const Color(0xFFE3F2FD),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: const [
                    Icon(Icons.favorite_rounded, color: Colors.pink, size: 40),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Partner Mood: Resting Comfortably', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          SizedBox(height: 4),
                          Text('Tip: Bring a cup of warm ginger tea and massage her shoulders.', style: TextStyle(fontSize: 13)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Quick Action Grid
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: [
                _buildCard('Consultation Checklist', Icons.task_alt, Colors.blue),
                _buildCard('Medical Vault', Icons.folder_special, Colors.teal),
                _buildCard('Baby Name Generator', Icons.child_care, Colors.purple),
                _buildCard('Emergency Call', Icons.phone_in_talk, Colors.red),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard(String title, IconData icon, Color color) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 36, color: color),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          ],
        ),
      ),
    );
  }
}
`
      };

    default:
      return {
        fileName: 'mathreya_app.dart',
        code: `// Mathreya Main App (Flutter Dart)
import 'package:flutter/material.dart';

void main() => runApp(const MathreyaApp());

class MathreyaApp extends StatelessWidget {
  const MathreyaApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mathreya',
      theme: ThemeData(
        primarySwatch: Colors.deepOrange,
        scaffoldBackgroundColor: const Color(0xFFFDFBF7),
        fontFamily: 'Serif',
      ),
      home: const Scaffold(
        body: Center(child: Text('Mathreya - A Care That Feels Like Home')),
      ),
    );
  }
}
`
      };
  }
}
