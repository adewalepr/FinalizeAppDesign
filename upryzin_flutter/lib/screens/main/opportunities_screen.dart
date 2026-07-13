import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/models.dart';
import '../../theme/colors.dart';

const _filters = ['All', 'Remote', 'On-site', 'Urgent'];

class OpportunitiesScreen extends StatefulWidget {
  const OpportunitiesScreen({super.key});
  @override
  State<OpportunitiesScreen> createState() => _OpportunitiesScreenState();
}

class _OpportunitiesScreenState extends State<OpportunitiesScreen> {
  int _filter = 0;

  List<OpportunityModel> get _list {
    if (_filter == 1) return sampleOpportunities.where((o) => o.location.contains('Remote')).toList();
    if (_filter == 3) return sampleOpportunities.where((o) => o.isUrgent).toList();
    return sampleOpportunities;
  }

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
        child: SingleChildScrollView(scrollDirection: Axis.horizontal,
          child: Row(children: List.generate(_filters.length, (i) {
            final active = i == _filter;
            return GestureDetector(onTap: () => setState(() => _filter = i),
              child: AnimatedContainer(duration: const Duration(milliseconds: 180),
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: active ? AppColors.primary : AppColors.card,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: active ? AppColors.primary : AppColors.border)),
                child: Text(_filters[i], style: GoogleFonts.dmSans(
                    color: active ? AppColors.background : AppColors.foreground,
                    fontSize: 13, fontWeight: active ? FontWeight.w600 : FontWeight.w400))));
          })))),
      Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Text('${_list.length} opportunities',
            style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 13))),
      const SizedBox(height: 12),
      Expanded(child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
        itemCount: _list.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) => _OppCard(opp: _list[i]))),
    ]);
  }
}

class _OppCard extends StatefulWidget {
  final OpportunityModel opp;
  const _OppCard({required this.opp});
  @override
  State<_OppCard> createState() => _OppCardState();
}

class _OppCardState extends State<_OppCard> {
  bool _saved = false;

  @override
  Widget build(BuildContext context) {
    final o = widget.opp;
    return Container(padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.card,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
              color: o.isUrgent ? AppColors.primary.withOpacity(0.3) : AppColors.border)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          ClipRRect(borderRadius: BorderRadius.circular(10),
            child: CachedNetworkImage(imageUrl: o.logoUrl, width: 44, height: 44,
                fit: BoxFit.cover,
                placeholder: (_, __) => Container(width: 44, height: 44, color: AppColors.cardDeep))),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              if (o.isUrgent) ...[
                Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(4)),
                  child: Text('URGENT', style: GoogleFonts.dmSans(color: AppColors.primary,
                      fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 0.8))),
                const SizedBox(width: 6),
              ],
              Flexible(child: Text(o.title, style: GoogleFonts.spaceGrotesk(
                  color: AppColors.foreground, fontSize: 15, fontWeight: FontWeight.w600),
                  maxLines: 1, overflow: TextOverflow.ellipsis)),
            ]),
            const SizedBox(height: 2),
            Text(o.company, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 13)),
          ])),
          GestureDetector(onTap: () => setState(() => _saved = !_saved),
            child: Icon(_saved ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                color: _saved ? AppColors.primary : AppColors.muted, size: 22)),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          const Icon(Icons.location_on_outlined, color: AppColors.muted, size: 14),
          const SizedBox(width: 4),
          Text(o.location, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12)),
          const SizedBox(width: 14),
          const Icon(Icons.attach_money_rounded, color: AppColors.primary, size: 14),
          Text(o.budgetRange, style: GoogleFonts.dmSans(color: AppColors.primary,
              fontSize: 12, fontWeight: FontWeight.w600)),
          const Spacer(),
          Text(o.postedAgo, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 11)),
        ]),
        const SizedBox(height: 12),
        Wrap(spacing: 6, runSpacing: 6, children: o.tags.map((t) =>
          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: AppColors.cardDeep,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: AppColors.border)),
            child: Text(t, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 11)))).toList()),
        const SizedBox(height: 14),
        SizedBox(width: double.infinity, height: 42,
          child: ElevatedButton(onPressed: () {},
            child: Text('Apply Now', style: GoogleFonts.spaceGrotesk(
                fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.background)))),
      ]));
  }
}
