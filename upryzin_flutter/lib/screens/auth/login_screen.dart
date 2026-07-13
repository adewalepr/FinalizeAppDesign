import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/colors.dart';
import '../../widgets/logo_mark.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true, _loading = false;

  @override
  void dispose() { _emailCtrl.dispose(); _passCtrl.dispose(); super.dispose(); }

  Future<void> _signIn() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 900));
    if (mounted) context.go('/app');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(children: [
        Positioned(top: -80, left: -80,
          child: _Orb(280, AppColors.primary.withOpacity(0.08))),
        Positioned(top: MediaQuery.of(context).size.height * 0.45, right: -60,
          child: _Orb(220, AppColors.primary.withOpacity(0.05))),
        Positioned(bottom: -60, left: MediaQuery.of(context).size.width * 0.3,
          child: _Orb(240, AppColors.amber.withOpacity(0.07))),
        SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const SizedBox(height: 16),
              const UpryzinLogo(height: 30),
              const SizedBox(height: 52),
              RichText(text: TextSpan(
                style: GoogleFonts.spaceGrotesk(fontSize: 34, fontWeight: FontWeight.w700,
                    color: AppColors.foreground, height: 1.15),
                children: const [
                  TextSpan(text: 'Welcome\nback'),
                  TextSpan(text: '.', style: TextStyle(color: AppColors.primary)),
                ],
              )),
              const SizedBox(height: 8),
              Text('Sign in to your creative universe',
                  style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 15)),
              const SizedBox(height: 40),
              TextField(controller: _emailCtrl, keyboardType: TextInputType.emailAddress,
                style: GoogleFonts.dmSans(color: AppColors.foreground),
                decoration: const InputDecoration(hintText: 'Email address',
                    prefixIcon: Icon(Icons.mail_outline_rounded, size: 20))),
              const SizedBox(height: 14),
              TextField(controller: _passCtrl, obscureText: _obscure,
                style: GoogleFonts.dmSans(color: AppColors.foreground),
                decoration: InputDecoration(hintText: 'Password',
                  prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20),
                  suffixIcon: IconButton(
                    icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20),
                    onPressed: () => setState(() => _obscure = !_obscure)))),
              const SizedBox(height: 8),
              Align(alignment: Alignment.centerRight,
                child: TextButton(onPressed: () {},
                  child: Text('Forgot password?',
                      style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 13)))),
              const SizedBox(height: 20),
              SizedBox(width: double.infinity, height: 52,
                child: ElevatedButton(
                  onPressed: _loading ? null : _signIn,
                  child: _loading
                      ? const SizedBox(width: 20, height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.background))
                      : Text('Sign In', style: GoogleFonts.spaceGrotesk(
                          fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.background)))),
              const SizedBox(height: 28),
              Row(children: [
                const Expanded(child: Divider(color: AppColors.border)),
                Padding(padding: const EdgeInsets.symmetric(horizontal: 14),
                  child: Text('or continue with',
                      style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12))),
                const Expanded(child: Divider(color: AppColors.border)),
              ]),
              const SizedBox(height: 20),
              Row(children: [
                Expanded(child: _SocialBtn('Google', Icons.g_mobiledata_rounded, _signIn)),
                const SizedBox(width: 12),
                Expanded(child: _SocialBtn('Apple', Icons.apple_rounded, _signIn)),
              ]),
              const SizedBox(height: 36),
              Center(child: GestureDetector(
                onTap: () => context.go('/signup'),
                child: Text.rich(TextSpan(children: [
                  TextSpan(text: "Don't have an account? ",
                      style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 14)),
                  TextSpan(text: 'Join Upryzin',
                      style: GoogleFonts.dmSans(color: AppColors.primary,
                          fontSize: 14, fontWeight: FontWeight.w600)),
                ])),
              )),
              const SizedBox(height: 24),
            ]),
          ),
        ),
      ]),
    );
  }
}

Widget _Orb(double size, Color color) => Container(
    width: size, height: size,
    decoration: BoxDecoration(shape: BoxShape.circle, color: color));

class _SocialBtn extends StatelessWidget {
  final String label; final IconData icon; final VoidCallback onTap;
  const _SocialBtn(this.label, this.icon, this.onTap);
  @override
  Widget build(BuildContext context) => GestureDetector(onTap: onTap,
    child: Container(height: 48,
      decoration: BoxDecoration(color: AppColors.card,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border)),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, color: AppColors.foreground, size: 22),
        const SizedBox(width: 8),
        Text(label, style: GoogleFonts.dmSans(color: AppColors.foreground,
            fontSize: 14, fontWeight: FontWeight.w500)),
      ])));
}
