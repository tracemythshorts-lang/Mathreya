import 'package:flutter/material.dart';
import 'models/app_models.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/puberty_screen.dart';
import 'screens/pregnancy_screen.dart';
import 'screens/virtual_mother_screen.dart';
import 'screens/husband_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  runApp(const MathreyaApp());
}

class MathreyaApp extends StatelessWidget {
  const MathreyaApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mathreya - A Care That Feels Like Home',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFFCFAF7),
        primaryColor: const Color(0xFFC85A32),
        fontFamily: 'Roboto',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFC85A32),
          primary: const Color(0xFFC85A32),
          secondary: const Color(0xFF4A7C59),
          background: const Color(0xFFFCFAF7),
        ),
        useMaterial3: true,
      ),
      home: const MainAppWrapper(),
    );
  }
}

class MainAppWrapper extends StatefulWidget {
  const MainAppWrapper({Key? key}) : super(key: key);

  @override
  State<MainAppWrapper> createState() => _MainAppWrapperState();
}

class _MainAppWrapperState extends State<MainAppWrapper> {
  String _currentScreen = 'dashboard';
  UserProfile _user = UserProfile(
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    age: 26,
    stage: LifeStage.pregnancyPrenatal,
    faceAuthEnabled: true,
    isAuthenticated: true,
    pregnancyWeek: 24,
    emergencyContactName: 'Dr. Priya Sharma (Sister / OB-GYN)',
    emergencyContactPhone: '+91 98111 22233',
    location: 'Bengaluru, Karnataka',
  );

  void _navigateTo(String screen) {
    setState(() {
      _currentScreen = screen;
    });
  }

  void _handleLoginSuccess(UserProfile loggedUser) {
    setState(() {
      _user = loggedUser;
      _currentScreen = 'dashboard';
    });
  }

  void _handleLogout() {
    setState(() {
      _user = _user.copyWith(isAuthenticated: false);
      _currentScreen = 'login';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFFCFAF7),
        elevation: 0,
        scrolledUnderElevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFFC85A32),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text(
                'M',
                style: TextStyle(fontFamily: 'Serif', fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16),
              ),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Mathreya',
                  style: TextStyle(fontFamily: 'Serif', fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF5E2211)),
                ),
                Text(
                  'A CARE THAT FEELS LIKE HOME',
                  style: TextStyle(fontSize: 8, color: Color(0xFF8C5D4D), fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
        actions: [
          if (_user.isAuthenticated)
            IconButton(
              icon: const Icon(Icons.person_outline, color: Color(0xFF5E2211)),
              onPressed: () => _navigateTo('profile'),
            )
          else
            TextButton(
              onPressed: () => _navigateTo('login'),
              child: const Text('Login', style: TextStyle(color: Color(0xFFC85A32), fontWeight: FontWeight.bold)),
            ),
        ],
      ),
      body: _buildCurrentBody(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _getBottomNavIndex(),
        onTap: (index) {
          switch (index) {
            case 0:
              _navigateTo('dashboard');
              break;
            case 1:
              _navigateTo('puberty');
              break;
            case 2:
              _navigateTo('pregnancy');
              break;
            case 3:
              _navigateTo('virtual_mother');
              break;
            case 4:
              _navigateTo('husband');
              break;
          }
        },
        selectedItemColor: const Color(0xFFC85A32),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.whatshot_outlined), label: 'Puberty'),
          BottomNavigationBarItem(icon: Icon(Icons.child_care_outlined), label: 'Pregnancy'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite_outline), label: 'Amma'),
          BottomNavigationBarItem(icon: Icon(Icons.people_outline), label: 'Husband'),
        ],
      ),
    );
  }

  int _getBottomNavIndex() {
    switch (_currentScreen) {
      case 'dashboard':
        return 0;
      case 'puberty':
        return 1;
      case 'pregnancy':
        return 2;
      case 'virtual_mother':
        return 3;
      case 'husband':
        return 4;
      default:
        return 0;
    }
  }

  Widget _buildCurrentBody() {
    switch (_currentScreen) {
      case 'login':
        return LoginScreen(
          onLoginSuccess: _handleLoginSuccess,
          onGuestMode: () => _navigateTo('dashboard'),
        );
      case 'profile':
        return ProfileScreen(
          user: _user,
          onBackToDashboard: () => _navigateTo('dashboard'),
          onLogout: _handleLogout,
        );
      case 'puberty':
        return PubertyScreen(onBackToDashboard: () => _navigateTo('dashboard'));
      case 'pregnancy':
        return PregnancyScreen(onBackToDashboard: () => _navigateTo('dashboard'));
      case 'virtual_mother':
        return VirtualMotherScreen(onBackToDashboard: () => _navigateTo('dashboard'));
      case 'husband':
        return HusbandScreen(onBackToDashboard: () => _navigateTo('dashboard'));
      case 'dashboard':
      default:
        return DashboardScreen(
          user: _user,
          onSelectStage: (stage) {
            switch (stage) {
              case LifeStage.puberty:
                _navigateTo('puberty');
                break;
              case LifeStage.pregnancyPrenatal:
              case LifeStage.pregnancyPostnatal:
                _navigateTo('pregnancy');
                break;
              case LifeStage.virtualMother:
                _navigateTo('virtual_mother');
                break;
              case LifeStage.husbandDashboard:
                _navigateTo('husband');
                break;
            }
          },
          onOpenProfile: () => _navigateTo('profile'),
        );
    }
  }
}
