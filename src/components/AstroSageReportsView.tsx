import React, { useState } from 'react';
import {
  KundaliData,
  AstroSageToolId,
  AstroSageReportCategory,
} from '../types';
import {
  calculateMangalDosha,
  calculateKaalSarpDosha,
  calculateLalKitabReport,
  calculateVarshphal,
  calculateGemstonesReport,
  calculateTransitToday,
  calculateBasicAvakahada,
} from '../lib/astrosageCalculations';
import {
  Scroll,
  Disc3,
  BookOpen,
  CalendarDays,
  Grid3X3,
  Sparkles,
  ShieldAlert,
  Flame,
  Clock,
  Gem,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Printer,
  Share2,
  ChevronRight,
  TrendingUp,
  Heart,
  Briefcase,
  Activity,
  Layers,
  Award,
  Zap,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';

interface AstroSageReportsViewProps {
  kundali: KundaliData;
  onNavigateToTab?: (tabName: string) => void;
  onAskAiPandit?: (prompt: string) => void;
}

export const AstroSageReportsView: React.FC<AstroSageReportsViewProps> = ({
  kundali,
  onNavigateToTab,
  onAskAiPandit,
}) => {
  const [activeCategory, setActiveCategory] = useState<AstroSageReportCategory>('predictions');
  const [selectedReport, setSelectedReport] = useState<AstroSageToolId | null>(null);
  const [targetVarshYear, setTargetVarshYear] = useState<number>(new Date().getFullYear());

  // Compute calculated reports
  const mangalDosha = calculateMangalDosha(kundali);
  const kaalSarpDosha = calculateKaalSarpDosha(kundali);
  const lalKitab = calculateLalKitabReport(kundali);
  const varshphal = calculateVarshphal(kundali, targetVarshYear);
  const gemstones = calculateGemstonesReport(kundali);
  const transitToday = calculateTransitToday(kundali);
  const basicAvakahada = calculateBasicAvakahada(kundali);

  const { planets, houses, vimshottariDasha, sadeSati } = kundali;
  const currentMD = vimshottariDasha.currentMahadasha?.lord || 'Jupiter';
  const currentAD = vimshottariDasha.currentAntardasha?.lord || 'Saturn';

  // Quick 6 tools from screenshot
  const topSixTools = [
    { id: 'basic' as AstroSageToolId, label: 'Basic', sublabel: 'Avakahada & Panchanga', icon: Scroll, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'dasha' as AstroSageToolId, label: 'Dasha', sublabel: '120-Yr Vimshottari', icon: Disc3, color: 'text-orange-700 bg-orange-50 border-orange-200' },
    { id: 'kp-system' as AstroSageToolId, label: 'KP System', sublabel: 'Placidus Sub-Lords', icon: Sparkles, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { id: 'shodashvarga' as AstroSageToolId, label: 'Shodashvarga', sublabel: 'D-1 to D-16 Charts', icon: Grid3X3, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'lal-kitab' as AstroSageToolId, label: 'Lal Kitab', sublabel: 'Teva, Rin & Totke', icon: BookOpen, color: 'text-red-700 bg-red-50 border-red-200' },
    { id: 'varshphal' as AstroSageToolId, label: 'Varshphal', sublabel: 'Tajik Annual Solar Chart', icon: CalendarDays, color: 'text-sky-700 bg-sky-50 border-sky-200' },
  ];

  // The 14 Report Rows from screenshot (2-column layout)
  const reportRows: Array<{ left: { id: AstroSageToolId; label: string; tag?: string }; right: { id: AstroSageToolId; label: string; tag?: string } }> = [
    {
      left: { id: 'life-predictions', label: 'Life Predictions', tag: 'Core' },
      right: { id: 'monthly-predictions', label: 'Monthly Predictions', tag: '2026-27' },
    },
    {
      left: { id: 'daily-predictions', label: 'Daily Predictions', tag: 'Today' },
      right: { id: 'mangal-dosh', label: 'Mangal Dosh', tag: mangalDosha.severity === 'None' ? 'Clear' : mangalDosha.severity },
    },
    {
      left: { id: 'sade-sati-life', label: 'Sade Sati Life Report', tag: sadeSati?.status || 'Active' },
      right: { id: 'kaal-sarp-dosha', label: 'Kaal Sarp Dosha', tag: kaalSarpDosha.present ? kaalSarpDosha.type : 'Clear' },
    },
    {
      left: { id: 'lal-kitab-debt', label: 'Lal Kitab Debt', tag: '9 Rins' },
      right: { id: 'lal-kitab-teva', label: 'Lal Kitab Teva Type', tag: 'Kundali' },
    },
    {
      left: { id: 'lal-kitab-remedies', label: 'Lal Kitab Remedies', tag: 'Upay' },
      right: { id: 'ascendant-prediction', label: 'Ascendant Prediction', tag: `${planets.Ascendant.sign} Lagna` },
    },
    {
      left: { id: 'planet-consideration', label: 'Planet Consideration', tag: '9 Grahas' },
      right: { id: 'gemstones-report', label: 'Gemstones Report', tag: 'Lucky Gems' },
    },
    {
      left: { id: 'transit-today', label: 'Transit Today', tag: `${transitToday.overallScore}% Auspicious` },
      right: { id: 'mahadasha-phala', label: 'Mahadasha Phala', tag: `${currentMD}-${currentAD}` },
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleConsultAi = (topic: string) => {
    if (onAskAiPandit) {
      onAskAiPandit(`कृपया मेरी कुंडली के आधार पर ${topic} का विस्तृत पाराशरी एवं लाल किताब विश्लेषण और उपाय बताएं।`);
    } else if (onNavigateToTab) {
      onNavigateToTab('ai-pandit');
    }
  };

  return (
    <div className="space-y-6">
      {/* AstroSage Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-2xl p-6 text-amber-950 shadow-md border border-amber-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/10 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AstroSage Vedic Reports Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-950">
              100+ Free Astrological Reports & Vedic Tools
            </h1>
            <p className="text-amber-900 text-sm mt-1 max-w-2xl">
              Authentic Parashari, Tajik Varshphal, and 1952 Lal Kitab predictive reports calculated from your exact birth chart of {kundali.birthDetails.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white/90 hover:bg-white text-amber-900 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-1.5"
              title="Print Current Report"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={() => handleConsultAi('संपूर्ण 100+ रिपोर्ट्स फलादेश')}
              className="px-4 py-2 bg-amber-950 hover:bg-black text-amber-100 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI Pandit
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-2 border-t border-amber-500/30 scrollbar-none">
          {[
            { id: 'predictions', label: 'PREDICTIONS' },
            { id: 'life-predictions', label: 'LIFE PREDICTIONS' },
            { id: 'monthly-predictions', label: 'MONTHLY PREDICTIONS' },
            { id: 'dosha-reports', label: 'MANGAL & KAAL SARP' },
            { id: 'lal-kitab', label: 'LAL KITAB' },
            { id: 'varshphal', label: 'VARSHPHAL' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as AstroSageReportCategory);
                setSelectedReport(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-950 text-white shadow'
                  : 'bg-amber-400/50 hover:bg-amber-300 text-amber-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {selectedReport ? (
        /* Report Detail View */
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedReport(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              Back to All 100+ Reports
            </button>
            <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              Native: {kundali.birthDetails.name} ({planets.Ascendant.sign} Lagna)
            </span>
          </div>

          <div className="p-6">
            {renderSelectedReportDetail(selectedReport)}
          </div>
        </div>
      ) : (
        /* Reports Dashboard Matching Screenshot */
        <div className="space-y-6">
          {/* Top 6 Quick Astro Tools Grid */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              Quick Vedic Astrological Engines
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {topSixTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (tool.id === 'kp-system' && onNavigateToTab) {
                        onNavigateToTab('kp-astrology');
                      } else if (tool.id === 'shodashvarga' && onNavigateToTab) {
                        onNavigateToTab('kundali-charts');
                      } else if (tool.id === 'dasha' && onNavigateToTab) {
                        onNavigateToTab('vimshottari-dasha');
                      } else {
                        setSelectedReport(tool.id);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center group hover:shadow-md hover:scale-[1.02] ${tool.color}`}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 shadow-xs bg-white/80 group-hover:bg-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-gray-900 leading-tight">{tool.label}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">{tool.sublabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 14 Reports List (2-column format matching screenshot) */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Comprehensive Astrological Reports</h3>
                <p className="text-xs text-gray-500">Click any report to view calculated analysis, planetary checks, and Vedic remedies.</p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                14 In-Depth Reports
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {reportRows.map((row, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  {/* Left Column Item */}
                  <button
                    onClick={() => setSelectedReport(row.left.id)}
                    className="flex items-center justify-between px-6 py-4 hover:bg-amber-50/60 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                      <span className="font-semibold text-gray-800 text-sm group-hover:text-amber-900">
                        {row.left.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {row.left.tag && (
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 group-hover:bg-amber-100 group-hover:text-amber-900">
                          {row.left.tag}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>

                  {/* Right Column Item */}
                  <button
                    onClick={() => setSelectedReport(row.right.id)}
                    className="flex items-center justify-between px-6 py-4 hover:bg-amber-50/60 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                      <span className="font-semibold text-gray-800 text-sm group-hover:text-amber-900">
                        {row.right.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {row.right.tag && (
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 group-hover:bg-amber-100 group-hover:text-amber-900">
                          {row.right.tag}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render individual report detail based on selection
  function renderSelectedReportDetail(reportId: AstroSageToolId) {
    switch (reportId) {
      // 1. MANGAL DOSH REPORT
      case 'mangal-dosh':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  Kuja Dosha Analysis (भौम / मंगल दोष)
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mangal Dosh Consideration & Marital Compatibility</h3>
                <p className="text-sm text-gray-600">Calculated from Natal Lagna, Chandra (Moon), and Shukra (Venus) cusps with Brihat Parashara exceptions.</p>
              </div>

              <div className={`px-4 py-2 rounded-xl text-center border ${
                mangalDosha.severity === 'None'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : mangalDosha.severity.includes('Partial')
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                <div className="text-xs uppercase font-semibold">Status</div>
                <div className="text-base font-extrabold">{mangalDosha.severity}</div>
                <div className="text-xs font-medium">{mangalDosha.percentage}% Affliction</div>
              </div>
            </div>

            {/* 3 Reference Point Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="text-xs font-bold text-gray-500 uppercase">From Lagna (Ascendant)</div>
                <div className="text-base font-bold text-gray-900 mt-1">House {mangalDosha.lagnaCheck.house} ({planets.Mars.sign})</div>
                <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  mangalDosha.lagnaCheck.isManglik ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {mangalDosha.lagnaCheck.isManglik ? 'Manglik House (1,2,4,7,8,12)' : 'Non-Manglik House'}
                </div>
                <p className="text-xs text-gray-600 mt-2">{mangalDosha.lagnaCheck.description}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="text-xs font-bold text-gray-500 uppercase">From Moon (Chandra)</div>
                <div className="text-base font-bold text-gray-900 mt-1">House {mangalDosha.moonCheck.house} from Moon</div>
                <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  mangalDosha.moonCheck.isManglik ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {mangalDosha.moonCheck.isManglik ? 'Chandra Manglik' : 'Clear from Moon'}
                </div>
                <p className="text-xs text-gray-600 mt-2">{mangalDosha.moonCheck.description}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="text-xs font-bold text-gray-500 uppercase">From Venus (Shukra)</div>
                <div className="text-base font-bold text-gray-900 mt-1">House {mangalDosha.venusCheck.house} from Venus</div>
                <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  mangalDosha.venusCheck.isManglik ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {mangalDosha.venusCheck.isManglik ? 'Shukra Manglik' : 'Clear from Venus'}
                </div>
                <p className="text-xs text-gray-600 mt-2">{mangalDosha.venusCheck.description}</p>
              </div>
            </div>

            {/* Parashari Cancellations */}
            {mangalDosha.cancellations.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Vedic Cancellations & Neutralizations Found
                </h4>
                <ul className="space-y-1.5">
                  {mangalDosha.cancellations.map((c, i) => (
                    <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Remedies */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="text-sm font-bold text-amber-900 mb-2">Classical Astrological Remedies for Mangal</h4>
              <ul className="space-y-2">
                {mangalDosha.remedies.map((rem, i) => (
                  <li key={i} className="text-xs text-amber-900 flex items-start gap-2">
                    <span className="font-bold text-amber-700">{i + 1}.</span>
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      // 2. KAAL SARP DOSHA REPORT
      case 'kaal-sarp-dosha':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  12 Types of Kaal Sarp Dosha Check
                </div>
                <h3 className="text-xl font-bold text-gray-900">{kaalSarpDosha.name}</h3>
                <p className="text-sm text-gray-600">{kaalSarpDosha.sanskritName} • Rahu in House {kaalSarpDosha.rahuHouse} & Ketu in House {kaalSarpDosha.ketuHouse}</p>
              </div>

              <div className={`px-4 py-2 rounded-xl text-center border ${
                !kaalSarpDosha.present
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : kaalSarpDosha.type === 'Anshik (Partial)'
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-indigo-50 border-indigo-300 text-indigo-800'
              }`}>
                <div className="text-xs uppercase font-semibold">Diagnosis</div>
                <div className="text-base font-extrabold">{kaalSarpDosha.type}</div>
                <div className="text-xs font-medium">{kaalSarpDosha.direction}</div>
              </div>
            </div>

            {/* Analysis details */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Astrological Interpretation</h4>
              <ul className="space-y-2">
                {kaalSarpDosha.effects.map((eff, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>{eff}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Positive Yogas born from Kaal Sarp */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <h4 className="text-sm font-bold text-emerald-900 mb-2">Positive Karmic Potential (Kaal Sarp Yoga)</h4>
              <ul className="space-y-1.5">
                {kaalSarpDosha.positiveYogas.map((yoga, i) => (
                  <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{yoga}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authentic Remedies */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="text-sm font-bold text-amber-900 mb-2">Vedic Shanti & Remedies</h4>
              <ul className="space-y-2">
                {kaalSarpDosha.remedies.map((rem, i) => (
                  <li key={i} className="text-xs text-amber-900 flex items-start gap-2">
                    <span className="font-bold text-amber-700">{i + 1}.</span>
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      // 3. LAL KITAB SUITE (TEVA, DEBTS, REMEDIES)
      case 'lal-kitab':
      case 'lal-kitab-teva':
      case 'lal-kitab-debt':
      case 'lal-kitab-remedies':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-200 text-red-900 text-xs font-bold mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Lal Kitab System (लाल किताब 1952)
                  </div>
                  <h3 className="text-xl font-bold text-red-950">{lalKitab.tevaType.primary}</h3>
                  <p className="text-xs text-red-800 mt-1 max-w-xl">{lalKitab.tevaType.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-red-700 font-semibold uppercase">Kismat Ka Grah (Destiny Planet)</div>
                  <div className="text-lg font-black text-red-950">{lalKitab.kismatKaGrah}</div>
                </div>
              </div>
            </div>

            {/* Sleeping houses & planets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Dormant / Sleeping Houses (सोये हुए घर)</h4>
                <div className="flex flex-wrap gap-1.5">
                  {lalKitab.sleepingHouses.map((h) => (
                    <span key={h} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">
                      House {h}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">In Lal Kitab, dormant houses activate through remedies of their Pakka Ghar ruler.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Sleeping Planets (सोये हुए ग्रह)</h4>
                <div className="flex flex-wrap gap-1.5">
                  {lalKitab.sleepingPlanets.length > 0 ? (
                    lalKitab.sleepingPlanets.map((p) => (
                      <span key={p} className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-semibold">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium">All key planets are awake and active.</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Awakening sleeping planets unlocks dormant karmic opportunities.</p>
              </div>
            </div>

            {/* 9 Lal Kitab Debts (Rin) */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                <span>9 Lal Kitab Debts (ऋण विचार)</span>
                <span className="text-xs font-normal text-gray-500">Ancestral and karmic debt diagnosis</span>
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {lalKitab.debts.map((debt) => (
                  <div
                    key={debt.id}
                    className={`p-3.5 rounded-lg border text-xs ${
                      debt.present
                        ? 'bg-red-50/70 border-red-200 text-red-950'
                        : 'bg-gray-50/50 border-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-sm">{debt.name} ({debt.hindiName})</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        debt.present ? 'bg-red-200 text-red-900' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {debt.present ? 'Active Debt' : 'Clear'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-0.5">{debt.indication}</p>
                    {debt.present && (
                      <div className="mt-2 pt-2 border-t border-red-200/60 text-red-900 font-medium">
                        <span className="font-bold">Lal Kitab Upay: </span>
                        {debt.remedy}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Planet-by-Planet Lal Kitab Remedies */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Lal Kitab Planet Placements & Classic Upay</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {lalKitab.planetRemedies.map((pr) => (
                  <div key={pr.planet} className="p-3 rounded-lg border border-gray-200 bg-gray-50/40 text-xs">
                    <div className="flex items-center justify-between font-bold text-sm text-gray-900 mb-1">
                      <span>{pr.planet}</span>
                      <span className="text-[11px] font-normal text-gray-500">House {pr.house} (Pakka {pr.pakkaGhar})</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mb-2">{pr.karka}</div>
                    <ul className="space-y-1 text-gray-700">
                      {pr.upay.map((u, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-600 font-bold">•</span>
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // 4. VARSHPHAL (ANNUAL TAJIK HOROSCOPE)
      case 'varshphal':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-sky-50 border border-sky-200 rounded-xl p-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-900 text-xs font-bold mb-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Tajik Varshphal (वार्षिक वर्षफल)
                </div>
                <h3 className="text-xl font-bold text-sky-950">Annual Solar Return Chart for Year {varshphal.targetYear}</h3>
                <p className="text-xs text-sky-800 mt-1">Native Age: {varshphal.nativeAge} Years • Solar Return Date: {varshphal.solarReturnDate}</p>
              </div>

              {/* Year Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-sky-900">Select Year:</label>
                <select
                  value={targetVarshYear}
                  onChange={(e) => setTargetVarshYear(parseInt(e.target.value, 10))}
                  className="bg-white border border-sky-300 text-sky-900 text-sm rounded-lg px-3 py-1.5 font-bold shadow-xs focus:ring-2 focus:ring-sky-400"
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} (Age {yr - parseInt(kundali.birthDetails.dateOfBirth.slice(0, 4))})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Muntha & Varshesh Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-sky-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-800 uppercase">Muntha Position & Lord</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    varshphal.muntha.auspiciousness.includes('High')
                      ? 'bg-emerald-100 text-emerald-800'
                      : varshphal.muntha.auspiciousness.includes('Sensitive')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {varshphal.muntha.auspiciousness}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  Muntha in {varshphal.muntha.sign} (House {varshphal.muntha.house})
                </div>
                <div className="text-xs text-gray-500 mb-2">Munthesh (Lord): {varshphal.muntha.lord}</div>
                <p className="text-xs text-gray-700">{varshphal.muntha.prediction}</p>
              </div>

              <div className="p-4 rounded-xl border border-sky-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-800 uppercase">Varshesh (Lord of the Year)</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800">
                    Pancha-Adhikari Selected
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">{varshphal.varshesh.title}</div>
                <div className="text-xs text-emerald-700 font-medium mb-2">{varshphal.varshesh.balaRank}</div>
                <p className="text-xs text-gray-700">{varshphal.varshesh.significance}</p>
              </div>
            </div>

            {/* Tajik Sahams (Sensitive points) */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Key Tajik Sahams (सहम् विचार)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {varshphal.sahams.map((s) => (
                  <div key={s.name} className="p-3 rounded-lg border border-gray-200 bg-gray-50/50 text-xs">
                    <div className="font-bold text-gray-900">{s.name} ({s.sanskritName})</div>
                    <div className="text-sky-700 font-semibold my-1">{s.sign} at {s.degrees}°</div>
                    <p className="text-gray-600 text-[11px]">{s.significance}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 12-Month Outlook */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="text-sm font-bold text-gray-900 mb-3">12-Month Varshphal Trajectory</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {varshphal.monthlyOutlook.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-gray-100 bg-gray-50/40 text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                      <span>{m.month}</span>
                      <span className="text-amber-500">{'★'.repeat(m.rating)}</span>
                    </div>
                    <p className="text-gray-600">{m.forecast}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // 5. GEMSTONES REPORT
      case 'gemstones-report':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                  <Gem className="w-3.5 h-3.5" />
                  Vedic Ratna Paramarsh (रत्न परामर्श)
                </div>
                <h3 className="text-xl font-bold text-gray-900">Custom Gemstone Recommendations</h3>
                <p className="text-xs text-gray-600">Prescribed based on your functional benefics, Lagna lord, and 9th fortune lord.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gemstones.map((gem) => (
                <div key={gem.type} className="p-5 rounded-xl border border-gray-200 bg-white flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">{gem.type}</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">{gem.primaryGem}</div>
                    <div className="text-xs text-gray-500">{gem.sanskritGem} • Planet: {gem.planet}</div>

                    <div className="mt-4 space-y-2 text-xs text-gray-700">
                      <div><span className="font-semibold text-gray-900">Weight:</span> {gem.caratWeight}</div>
                      <div><span className="font-semibold text-gray-900">Metal:</span> {gem.metal}</div>
                      <div><span className="font-semibold text-gray-900">Finger:</span> {gem.finger}</div>
                      <div><span className="font-semibold text-gray-900">Time:</span> {gem.wearingDayTime}</div>
                      <div><span className="font-semibold text-gray-900">Mantra:</span> <span className="font-mono text-[11px] text-emerald-800">{gem.mantra}</span></div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs font-bold text-gray-900 mb-1">Primary Blessings:</div>
                      <ul className="space-y-1 text-[11px] text-gray-600">
                        {gem.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-red-100 bg-red-50/50 -mx-5 -mb-5 p-3 rounded-b-xl">
                    <span className="text-[11px] font-bold text-red-900">Do NOT wear together with: </span>
                    <span className="text-[11px] text-red-700">{gem.incompatibleGems.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 6. TRANSIT TODAY (GOCHAR PHALA)
      case 'transit-today':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  Real-Time Gochar (गोचर फल विचार)
                </div>
                <h3 className="text-xl font-bold text-gray-900">Current Planetary Transits Relative to Moon</h3>
                <p className="text-xs text-gray-600">Natal Moon in {kundali.planets.Moon.sign} ({kundali.planets.Moon.nakshatra} Nakshatra)</p>
              </div>

              <div className="px-4 py-2 rounded-xl text-center border border-amber-300 bg-amber-50">
                <div className="text-xs text-amber-800 font-semibold uppercase">Today’s Cosmic Vibe</div>
                <div className="text-xl font-black text-amber-950">{transitToday.overallScore}%</div>
                <div className="text-[11px] text-amber-800 font-medium">Auspicious Transit</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-medium">
              {transitToday.todaysGuidance}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {transitToday.transits.map((tr) => (
                <div key={tr.planet} className="p-3.5 rounded-xl border border-gray-200 bg-white text-xs">
                  <div className="flex items-center justify-between mb-1 font-bold">
                    <span className="text-sm text-gray-900">{tr.planet}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      tr.isAuspicious ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tr.isAuspicious ? 'Benefic Transit' : 'Neutral / Precaution'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mb-2">
                    In {tr.transitSign} • House {tr.houseFromMoon} from Moon
                  </div>
                  <p className="text-gray-700">{tr.prediction}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // 7. BASIC DETAILS (AVAKAHADA)
      case 'basic':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Basic Astrological Details & Avakahada Chakra</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'Varna', value: basicAvakahada.varna },
                { label: 'Vashya', value: basicAvakahada.vashya },
                { label: 'Yoni', value: basicAvakahada.yoni },
                { label: 'Gana', value: basicAvakahada.gana },
                { label: 'Nadi', value: basicAvakahada.nadi },
                { label: 'Tatva (Element)', value: basicAvakahada.tatva },
                { label: 'Paya (Feet of Birth)', value: basicAvakahada.paya },
                { label: 'Lucky Color', value: basicAvakahada.luckyColor },
                { label: 'Lucky Numbers', value: basicAvakahada.luckyNumbers },
                { label: 'Lucky Day', value: basicAvakahada.luckyDays },
                { label: 'Ishta Devata', value: basicAvakahada.ishtaDevata },
                { label: 'Sun Sign', value: planets.Sun.sign },
                { label: 'Moon Sign', value: planets.Moon.sign },
                { label: 'Ascendant (Lagna)', value: planets.Ascendant.sign },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-gray-500 font-medium">{item.label}</div>
                  <div className="text-gray-900 font-bold text-sm mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        );

      // 8. ASCENDANT PREDICTION
      case 'ascendant-prediction':
        return (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase">Lagna Phala (लग्न फल विचार)</div>
              <h3 className="text-xl font-bold text-gray-900">{planets.Ascendant.sign} Ascendant Comprehensive Life Analysis</h3>
              <p className="text-xs text-gray-600">Ascendant Lord: {houses[0]?.signLord} • Nakshatra: {planets.Ascendant.nakshatra} (Pada {planets.Ascendant.pada || 1})</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Physical Demeanor & Constitution</h4>
                <p className="text-gray-700 leading-relaxed">
                  Individuals born under {planets.Ascendant.sign} rising possess distinctive physical magnetism, clear facial contour, upright posture, and naturally expressive eyes. You exude natural dignity and self-possession that draws attention without overt posturing.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Psychological Archetype & Intellect</h4>
                <p className="text-gray-700 leading-relaxed">
                  You possess an innate sense of responsibility, fierce loyalty towards genuine companions, and an inability to tolerate duplicity. Your mind combines analytical sharpness with deep intuitive instinct, excelling in strategic decision-making and crisis leadership.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Career & Wealth Creation Tendencies</h4>
                <p className="text-gray-700 leading-relaxed">
                  You are naturally inclined towards autonomy and executive positions rather than subservient roles. Industries involving governance, technology, commerce, or creative advisory bring maximum fulfillment. Your wealth multiplies progressively through disciplined asset compounding.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Marital & Relationship Dynamic</h4>
                <p className="text-gray-700 leading-relaxed">
                  In relationships, you seek an intellectual equal who respects your individuality while providing emotional security. While you are deeply affectionate, you require moments of quiet contemplation to recharge your creative vitality.
                </p>
              </div>
            </div>
          </div>
        );

      // 9. MAHADASHA PHALA
      case 'mahadasha-phala':
        return (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase">Vimshottari Dasha Phala (महादशा फलादेश)</div>
              <h3 className="text-xl font-bold text-gray-900">
                Running {currentMD} Mahadasha with {currentAD} Antardasha
              </h3>
              <p className="text-xs text-gray-600">
                Active Cycle: {vimshottariDasha.currentMahadasha?.startDate || 'Recent'} to {vimshottariDasha.currentMahadasha?.endDate || 'Future'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <h4 className="font-bold text-amber-900 mb-2">Mahadasha Lord {currentMD} Operational Directive</h4>
              <p className="text-amber-950 leading-relaxed">
                As ruler of your current Mahadasha, {currentMD} sets the overarching spiritual and material agenda. This period demands focused channelization of your core talents. Any investments made in long-term education, authentic relationships, and disciplined health routines will compound dramatically during this cycle.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs">
              <h4 className="font-bold text-sky-900 mb-2">Antardasha Lord {currentAD} Immediate Fruition</h4>
              <p className="text-sky-950 leading-relaxed">
                The sub-period of {currentAD} activates rapid events in your professional sphere. Expect shifts in responsibilities, opportunities for relocation or expansion, and testing of your patience. Upholding ethical boundaries will protect your reputation and guarantee steady elevation.
              </p>
            </div>
          </div>
        );

      // 10. PLANET CONSIDERATION (ALL 9 GRAHAS)
      case 'planet-consideration':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Planet Consideration (ग्रह विचार एवं स्थिति)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(planets).map(([key, pl]) => (
                <div key={key} className="p-3.5 rounded-xl border border-gray-200 bg-white text-xs">
                  <div className="flex items-center justify-between font-bold text-sm text-gray-900 mb-1">
                    <span>{key} ({pl.sanskritName})</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      House {pl.house}
                    </span>
                  </div>
                  <div className="text-gray-500 mb-2">
                    {pl.sign} at {pl.degrees}° • {pl.nakshatra} (Pada {pl.pada || 1})
                  </div>
                  <p className="text-gray-700 text-[11px]">
                    Placed in House {pl.house}, {key} exerts direct influence over your {pl.house === 1 ? 'personality and health' : pl.house === 7 ? 'marriage and contracts' : pl.house === 10 ? 'career and public reputation' : 'karmic affairs'}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      // 11. SADE SATI LIFE REPORT
      case 'sade-sati-life':
        return (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase">Shani Sade Sati Life Cycle (साढ़ेसाती विचार)</div>
              <h3 className="text-xl font-bold text-gray-900">Comprehensive Saturn Transit Analysis</h3>
              <p className="text-xs text-gray-600">Current Phase: {sadeSati?.status || 'Calculated'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h4 className="font-bold text-gray-900 mb-1">Phase 1: Rising (उदय / 12th from Moon)</h4>
                <p className="text-gray-600">Focuses on unexpected expenditures, foreign travels, mental decluttering, and spiritual detachment.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h4 className="font-bold text-gray-900 mb-1">Phase 2: Peak (शिखर / Over Moon)</h4>
                <p className="text-gray-600">Intense personal maturity, heavy responsibilities, restructuring of priorities, and testing of endurance.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h4 className="font-bold text-gray-900 mb-1">Phase 3: Setting (अस्त / 2nd from Moon)</h4>
                <p className="text-gray-600">Financial stabilization, rebuilding domestic peace, realization of hard-earned wisdom and steady growth.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <h4 className="font-bold text-amber-900 mb-2">Authentic Shani Shanti Remedies</h4>
              <ul className="space-y-1.5 text-amber-950">
                <li>• Recite the Dasharatha Shani Stotram every Saturday evening with an oil lamp.</li>
                <li>• Feed black sesame, mustard oil, or cooked food to black dogs and crows.</li>
                <li>• Avoid alcohol, non-vegetarian food, and deceitful conduct to harness Saturn’s highest blessings.</li>
              </ul>
            </div>
          </div>
        );

      // Default fallback / Life predictions / Monthly predictions
      default:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Life Predictions & Classical Parashari Overview</h3>
            <p className="text-xs text-gray-600">Integrated analysis covering your health, career, relationships, and spiritual dharma.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Health & Vitality (Aayushya & Arogya)
                </h4>
                <p className="text-gray-700 leading-relaxed mt-1">
                  Your Lagna is fortified by {houses[0]?.signLord}. Maintain regular dietary discipline and avoid nocturnal stress. Routine yoga and solar salutations (Surya Namaskar) will preserve high vitality.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Profession & Wealth (Artha & Karma)
                </h4>
                <p className="text-gray-700 leading-relaxed mt-1">
                  10th House Lord {houses[9]?.signLord} indicates progressive elevation through independent competence. Strategic patience and disciplined financial savings guarantee high net worth after age 32.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" />
                  Marriage & Family (Kama & Grihastha)
                </h4>
                <p className="text-gray-700 leading-relaxed mt-1">
                  7th House Lord {houses[6]?.signLord} indicates an intelligent, supportive, and cultured spouse. Mutual respect and collaborative decision-making guarantee domestic peace.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Spiritual Evolution (Moksha & Dharma)
                </h4>
                <p className="text-gray-700 leading-relaxed mt-1">
                  9th House Lord {houses[8]?.signLord} activates divine grace (Bhagya) when engaging in selfless charity, temple visits, and reverence towards parents and mentors.
                </p>
              </div>
            </div>
          </div>
        );
    }
  }
};
