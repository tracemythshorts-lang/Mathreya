import 'package:flutter/material.dart';
import '../models/app_models.dart';

class DashboardScreen extends StatelessWidget {
  final UserProfile user;
  final Function(LifeStage) onSelectStage;
  final VoidCallback onOpenProfile;

  const DashboardScreen({
    Key? key,
    required this.user,
    required this.onSelectStage,
    required this.onOpenProfile,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Welcome Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE5E7EB)),
              boxShadow: const [
                BoxShadow(
                  color: Color.fromRGBO(0, 0, 0, 0.03),
                  blurRadius: 10,
                  offset: Offset(0, 2),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF7ED),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFFFEDD5)),
                      ),
                      child: Text(
                        'Welcome back, ${user.name}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFFC85A32),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.person_outline, color: Color(0xFF475569)),
                      onPressed: onOpenProfile,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  "Women's Health & Care Dashboard",
                  style: TextStyle(
                    fontFamily: 'Serif',
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Track your wellness cycle, access maternal care guidance, sync with your partner, and consult your Virtual Amma companion.",
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFF475569),
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  onPressed: () => onSelectStage(LifeStage.virtualMother),
                  icon: const Icon(Icons.favorite, color: Colors.white, size: 18),
                  label: const Text('Talk to Virtual Amma'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6A1B29),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Bento Section Title
          const Text(
            'Explore Modules & Care Centers',
            style: TextStyle(
              fontFamily: 'Serif',
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF5E2211),
            ),
          ),
          const SizedBox(height: 12),

          // Bento Container 1: Virtual Mom
          _buildBentoCard(
            title: 'Virtual Mother Ecosystem (Amma)',
            subtitle: "Loving motherly warmth, grandmother's remedies & emotional support.",
            tag: 'AI Voice & Wisdom',
            tagColor: Colors.amber,
            bgColor: const Color(0xFFFFFBF6),
            borderColor: const Color(0xFFF0E8DD),
            icon: Icons.favorite,
            iconColor: const Color(0xFF6A1B29),
            onTap: () => onSelectStage(LifeStage.virtualMother),
          ),

          const SizedBox(height: 12),

          // Grid for Puberty & Pregnancy
          Row(
            children: [
              Expanded(
                child: _buildBentoCard(
                  title: 'Puberty & Cycle',
                  subtitle: 'Day 14 • Ovulation Phase',
                  tag: 'Adolescent',
                  tagColor: const Color(0xFFC85A32),
                  bgColor: Colors.white,
                  borderColor: const Color(0xFFF0E8DD),
                  icon: Icons.whatshot,
                  iconColor: const Color(0xFFC85A32),
                  onTap: () => onSelectStage(LifeStage.puberty),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildBentoCard(
                  title: 'Pregnancy & Care',
                  subtitle: 'Week 24 • Cantaloupe Size',
                  tag: 'Maternal',
                  tagColor: const Color(0xFF4A7C59),
                  bgColor: Colors.white,
                  borderColor: const Color(0xFFF0E8DD),
                  icon: Icons.child_care,
                  iconColor: const Color(0xFF4A7C59),
                  onTap: () => onSelectStage(LifeStage.pregnancyPrenatal),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Bento Container 3: Husband Hub & Medical Vault
          Row(
            children: [
              Expanded(
                child: _buildBentoCard(
                  title: 'Husband Support Hub',
                  subtitle: 'Empathy tips & hospital bag prep.',
                  tag: 'Partner Sync',
                  tagColor: const Color(0xFF2C3E50),
                  bgColor: Colors.white,
                  borderColor: const Color(0xFFF0E8DD),
                  icon: Icons.people,
                  iconColor: const Color(0xFF2C3E50),
                  onTap: () => onSelectStage(LifeStage.husbandDashboard),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBentoCard({
    required String title,
    required String subtitle,
    required String tag,
    required Color tagColor,
    required Color bgColor,
    required Color borderColor,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 8,
              offset: const Offset(0, 2),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: iconColor, size: 24),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: tagColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    tag,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: tagColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontFamily: 'Serif',
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Color(0xFF5E2211),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 11,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
