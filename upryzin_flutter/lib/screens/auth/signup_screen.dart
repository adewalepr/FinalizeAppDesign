import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/colors.dart';
import '../../widgets/logo_mark.dart';

const _roles = ['Photographer','Filmmaker','Designer','Illustrator',
  'Art Director','Stylist','Creative Director','Content Creator','Animator','Copywriter'];

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true, _loading = false;
  String? _role;

  @override
  void dispose() { _nameCtrl.dispose(); _emailCtrl.dispose(); _passCtrl.dispose(); super.dispose(); }

  Future<void> _create() async {
    if (_role == null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Select your creative role', style: GoogleFonts.dmSans()),
        backgroundColor: AppColors.card));
      return;
    }
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 1000));
    if (mounted) context.go('/app');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              GestureDetector(onTap: () => context.go('/login'),
                child: Container(width: 38, height: 38,
                  decoration: BoxDecoration(color: AppColors.card,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.border)),
                  child: const Icon(Icons.arrow_back_ios_new_rounded,
                      size: 16, color: AppColors.foreground))),
              const SizedBox(width: 14),
              const UpryzinLogo(height: 26),
            ]),
            const SizedBox(height: 40),
            RichText(text: TextSpan(
              style: GoogleFonts.spaceGrotesk(fontSize: 30, fontWeight: FontWeight.w700,
                  color: AppColors.foreground, height: 1.2),
              children: const [
                TextSpan(text: 'Join\nUpryzin'),
                TextSpan(text: '.', style: TextStyle(color: AppColors.primary)),
              ],
            )),
            const SizedBox(height: 6),
            Text("Connect with Africa's creative ecosystem",
                style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 14)),
            const SizedBox(height: 32),
            TextField(controller: _nameCtrl, textCapitalization: TextCapitalization.words,
              style: GoogleFonts.dmSans(color: AppColors.foreground),
              decoration: const InputDecoration(hintText: 'Full name',
                  prefixIcon: Icon(Icons.person_outline_rounded, size: 20))),
            const SizedBox(height: 12),
            TextField(controller: _emailCtrl, keyboardType: TextInputType.emailAddress,
              style: GoogleFonts.dmSans(color: AppColors.foreground),
              decoration: const InputDecoration(hintText: 'Email address',
                  prefixIcon: Icon(Icons.mail_outline_rounded, size: 20))),
            const SizedBox(height: 12),
            TextField(controller: _passCtrl, obscureText: _obscure,
              style: GoogleFonts.dmSans(color: AppColors.foreground),
              decoration: InputDecoration(hintText: 'Create password',
                prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20),
                suffixIcon: IconButton(
                  icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20),
                  onPressed: () => setState(() => _obscure = !_obscure)))),
            const SizedBox(height: 24),
            Text('I am a...', style: GoogleFonts.spaceGrotesk(
                color: AppColors.foreground, fontSize: 14, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            Wrap(spacing: 8, runSpacing: 8,
              children: _roles.map((r) {
                final sel = _role == r;
                return GestureDetector(onTap: () => setState(() => _role = r),
                  child: AnimatedContainer(duration: const Duration(milliseconds: 180),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: sel ? AppColors.primary.withOpacity(0.12) : AppColors.card,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                          color: sel ? AppColors.primary : AppColors.border,
                          width: sel ? 1.5 : 1)),
                    child: Text(r, style: GoogleFonts.dmSans(
                        color: sel ? AppColors.primary : AppColors.foreground,
                        fontSize: 13,
                        fontWeight: sel ? FontWeight.w600 : FontWeight.w400))));
              }).toList()),
            const SizedBox(height: 32),
            SizedBox(width: double.infinity, height: 52,
              child: ElevatedButton(onPressed: _loading ? null : _create,
                child: _loading
                    ? const SizedBox(width: 20, height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.background))
                    : Text('Create Account', style: GoogleFonts.spaceGrotesk(
                        fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.background)))),
            const SizedBox(height: 24),
            Center(child: GestureDetector(onTap: () => context.go('/login'),
              child: Text.rich(TextSpan(children: [
                TextSpan(text: 'Already have an account? ',
                    style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 14)),
                TextSpan(text: 'Sign in', style: GoogleFonts.dmSans(
                    color: AppColors.primary, fontSize: 14, fontWeight: FontWeight.w600)),
              ])))),
            const SizedBox(height: 24),
          ]),
        ),
      ),
    );
  }
}
