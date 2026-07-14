import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/models.dart';
import '../../theme/colors.dart';

class OpportunitiesScreen extends StatefulWidget {
  const OpportunitiesScreen({super.key});
  @override
  State<OpportunitiesScreen> createState() => _OpportunitiesScreenState();
}

class _OpportunitiesScreenState extends State<OpportunitiesScreen> {
  String _filter = 'All';
  final Set<int> _applied = {};
  static const _filters = ['All', 'Full-time', 'Freelance', 'Contract', 'Collab'];

  List<OpportunityModel> get _list => _filter == 'All'
      ? sampleOpportunities
      : sampleOpportunities.where((o) => o.type == _filter).toList();

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(slivers: [
      SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
        child: Row(children: [
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Opportunities', style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 22, fontWeight: FontWeight.w700)),
            Text('Matched to your skills & score', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 13)),
          ]),
          const Spacer(),
          Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.white12)),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.tune_rounded, color: AppColors.muted, size: 15),
              const SizedBox(width: 6),
              Text('Filters', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 13)),
            ])),
        ]))),
      SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
        child: SizedBox(height: 38, child: ListView.separated(scrollDirection: Axis.horizontal,
          itemCount: _filters.length, separatorBuilder: (_, __) => const SizedBox(width: 8),
          itemBuilder: (_, i) {
            final active = _filters[i] == _filter;
            return GestureDetector(onTap: () => setState(() => _filter = _filters[i]),
              child: AnimatedContainer(duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: active ? AppColors.primary : Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: active ? AppColors.primary : Colors.white12)),
                child: Text(_filters[i], style: GoogleFonts.dmSans(color: active ? Colors.white : AppColors.muted, fontSize: 13, fontWeight: active ? FontWeight.w600 : FontWeight.w400))));
          })))),
      SliverPadding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        sliver: SliverList(delegate: SliverChildBuilderDelegate(
          (_, i) => _OppCard(opp: _list[i], applied: _applied.contains(_list[i].id),
            onApply: () => setState(() => _applied.add(_list[i].id))),
          childCount: _list.length))),
    ]);
  }
}

class _OppCard extends StatelessWidget {
  final OpportunityModel opp;
  final bool applied;
  final VoidCallback onApply;
  const _OppCard({required this.opp, required this.applied, required this.onApply});

  @override
  Widget build(BuildContext context) {
    return Container(margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(16),
          border: Border.all(color: opp.isUrgent ? AppColors.primary.withOpacity(0.25) : Colors.white.withOpacity(0.06))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          ClipRRect(borderRadius: BorderRadius.circular(10),
            child: CachedNetworkImage(imageUrl: opp.logoUrl, width: 46, height: 46, fit: BoxFit.cover,
                placeholder: (_, __) => Container(width: 46, height: 46, color: AppColors.cardDeep))),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              if (opp.isUrgent) Container(margin: const EdgeInsets.only(right: 6), padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(4)),
                child: Text('URGENT', style: GoogleFonts.dmSans(color: AppColors.primary, fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 0.8))),
              Expanded(child: Text(opp.title, style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 14, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis)),
            ]),
            const SizedBox(height: 2),
            Text('${opp.company}', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 13)),
          ])),
          const SizedBox(width: 8),
          // Type badge
          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: typeBg(opp.type), borderRadius: BorderRadius.circular(20), border: Border.all(color: typeFg(opp.type).withOpacity(0.3))),
            child: Text(opp.type, style: GoogleFonts.dmSans(color: typeFg(opp.type), fontSize: 10, fontWeight: FontWeight.w700))),
        ]),
        const SizedBox(height: 10),
        Row(children: [
          const Icon(Icons.location_on_outlined, color: AppColors.muted, size: 13),
          const SizedBox(width: 3),
          Text(opp.location, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12)),
          const SizedBox(width: 12),
          const Icon(Icons.attach_money_rounded, color: AppColors.primary, size: 13),
          Text(opp.salary, style: GoogleFonts.dmSans(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.w600)),
          const Spacer(),
          const Icon(Icons.access_time_rounded, color: AppColors.muted, size: 12),
          const SizedBox(width: 3),
          Text(opp.posted, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 11)),
        ]),
        const SizedBox(height: 10),
        Wrap(spacing: 6, runSpacing: 6, children: opp.skills.map((s) =>
          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.04), borderRadius: BorderRadius.circular(6), border: Border.all(color: Colors.white12)),
            child: Text(s, style: GoogleFonts.dmSans(color: const Color(0xFFA8A8C8), fontSize: 11)))).toList()),
        const SizedBox(height: 12),
        // Bottom row: applicants + match bar + apply
        Row(children: [
          Text('${opp.applicants} applicants', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12)),
          const Spacer(),
          // Match bar
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Text('${opp.match}% match', style: GoogleFonts.dmSans(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.w700)),
            const SizedBox(height: 3),
            ClipRRect(borderRadius: BorderRadius.circular(4),
              child: SizedBox(width: 60, height: 5,
                child: LinearProgressIndicator(value: opp.match / 100, backgroundColor: Colors.white12, color: AppColors.primary))),
          ]),
        ]),
        const SizedBox(height: 12),
        SizedBox(width: double.infinity, height: 46,
          child: OutlinedButton(
            onPressed: applied ? null : onApply,
            style: OutlinedButton.styleFrom(
              backgroundColor: applied ? Colors.white.withOpacity(0.03) : AppColors.primary.withOpacity(0.1),
              side: BorderSide(color: applied ? Colors.white12 : AppColors.primary.withOpacity(0.3)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              foregroundColor: applied ? Colors.green.shade400 : AppColors.primary),
            child: Text(applied ? '✓ Applied' : 'Apply Now', style: GoogleFonts.spaceGrotesk(fontSize: 13, fontWeight: FontWeight.w700)))),
      ]));
  }
}
