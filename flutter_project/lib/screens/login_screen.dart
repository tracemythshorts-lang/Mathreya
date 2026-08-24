import 'package:flutter/material.dart';
import '../models/app_models.dart';

class LoginScreen extends StatefulWidget {
  final Function(UserProfile) onLoginSuccess;
  final VoidCallback onGuestMode;

  const LoginScreen({
    Key? key,
    required this.onLoginSuccess,
    required this.onGuestMode,
  }) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'ananya.sharma@example.com');
  final _passwordController = TextEditingController(text: '••••••••••••');
  bool _isFaceIdScanning = false;
  bool _faceIdVerified = false;
  int _tabIndex = 0; // 0 = Password, 1 = Face ID

  void _submitPassword() {
    final user = UserProfile(
      name: 'Ananya Sharma',
      email: _emailController.text,
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
    widget.onLoginSuccess(user);
  }

  void _simulateFaceId() {
    setState(() {
      _isFaceIdScanning = true;
    });

    Future.delayed(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      setState(() {
        _isFaceIdScanning = false;
        _faceIdVerified = true;
      });

      Future.delayed(const Duration(milliseconds: 600), () {
        if (!mounted) return;
        _submitPassword();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCFAF7),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Container(
              maxWidth: 400,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: const Color(0xFFF0E8DD)),
                boxShadow: const [
                  BoxShadow(
                    color: Color.fromRGBO(94, 34, 17, 0.06),
                    blurRadius: 20,
                    offset: Offset(0, 4),
                  )
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Top Header Gradient Banner
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(28),
                    decoration: const BoxDecoration(
                      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                      gradient: LinearGradient(
                        colors: [Color(0xFF8B3012), Color(0xFFC85A32)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white30),
                          ),
                          child: const Center(
                            child: Text(
                              'M',
                              style: TextStyle(
                                fontFamily: 'Serif',
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Mathreya',
                          style: TextStyle(
                            fontFamily: 'Serif',
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'A Care That Feels Like Home',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFFFDE8E0),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Tab Buttons & Forms
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      children: [
                        // Mode Switcher
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFFAF6F0),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFEAE0D2)),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: GestureDetector(
                                  onTap: () => setState(() => _tabIndex = 0),
                                  child: Container(
                                    padding: const EdgeInsets.vertical(10),
                                    decoration: BoxDecoration(
                                      color: _tabIndex == 0 ? Colors.white : Colors.transparent,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: _tabIndex == 0
                                          ? [
                                              BoxShadow(
                                                color: Colors.black.withOpacity(0.04),
                                                blurRadius: 4,
                                              )
                                            ]
                                          : [],
                                    ),
                                    child: const Text(
                                      'Account Login',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF5E2211),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              Expanded(
                                child: GestureDetector(
                                  onTap: () => setState(() => _tabIndex = 1),
                                  child: Container(
                                    padding: const EdgeInsets.vertical(10),
                                    decoration: BoxDecoration(
                                      color: _tabIndex == 1 ? Colors.white : Colors.transparent,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: _tabIndex == 1
                                          ? [
                                              BoxShadow(
                                                color: Colors.black.withOpacity(0.04),
                                                blurRadius: 4,
                                              )
                                            ]
                                          : [],
                                    ),
                                    child: const Text(
                                      'Face ID Verify',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF5E2211),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        if (_tabIndex == 0) ...[
                          TextField(
                            controller: _emailController,
                            decoration: InputDecoration(
                              labelText: 'Email or Mobile Number',
                              labelStyle: const TextStyle(fontSize: 12, color: Color(0xFF5E2211)),
                              prefixIcon: const Icon(Icons.email_outlined, color: Colors.stone),
                              filled: true,
                              fillColor: const Color(0xFFFCFAF7),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: const BorderSide(color: Color(0xFFEAE0D2)),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _passwordController,
                            obscureText: true,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              labelStyle: const TextStyle(fontSize: 12, color: Color(0xFF5E2211)),
                              prefixIcon: const Icon(Icons.lock_outline, color: Colors.stone),
                              filled: true,
                              fillColor: const Color(0xFFFCFAF7),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: const BorderSide(color: Color(0xFFEAE0D2)),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _submitPassword,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFC85A32),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                              child: const Text(
                                'Sign In to Safe Space',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ] else ...[
                          Container(
                            height: 100,
                            width: 100,
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF7ED),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: const Color(0xFFC85A32).withOpacity(0.4)),
                            ),
                            child: Center(
                              child: _isFaceIdScanning
                                  ? const CircularProgressIndicator(color: Color(0xFFC85A32))
                                  : _faceIdVerified
                                      ? const Icon(Icons.check_circle, size: 48, color: Colors.green)
                                      : const Icon(Icons.face_retouching_natural, size: 48, color: Color(0xFFC85A32)),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            _isFaceIdScanning
                                ? 'Scanning Face Credentials...'
                                : _faceIdVerified
                                    ? 'Biometrics Verified!'
                                    : 'Face ID Safe Space Unlock',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF5E2211),
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: _isFaceIdScanning ? null : _simulateFaceId,
                              icon: const Icon(Icons.camera_front, color: Colors.white),
                              label: Text(_isFaceIdScanning ? 'Scanning...' : 'Verify Face ID Now'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.teal[800],
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                            ),
                          ),
                        ],

                        const SizedBox(height: 16),
                        OutlinedButton(
                          onPressed: widget.onGuestMode,
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color(0xFFEAE0D2)),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                          ),
                          child: const Text(
                            'Continue as Guest User',
                            style: TextStyle(
                              fontSize: 12,
                              color: Color(0xFF5E2211),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
