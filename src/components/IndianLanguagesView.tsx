import React, { useState } from 'react';
import { IndianLanguageCode, LanguageMeta } from '../types';
import { INDIAN_LANGUAGES, getLanguageMeta } from '../lib/languages';
import {
  Globe,
  Sparkles,
  BookOpen,
  MessageSquare,
  Search,
  CheckCircle,
  HelpCircle,
  Award,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface IndianLanguagesViewProps {
  selectedLanguage: IndianLanguageCode;
  onSelectLanguage: (code: IndianLanguageCode) => void;
  onLaunchConsultWithQuery?: (code: IndianLanguageCode, query: string) => void;
}

export const IndianLanguagesView: React.FC<IndianLanguagesViewProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onLaunchConsultWithQuery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'north' | 'south' | 'east' | 'west'>('all');

  const filteredLanguages = INDIAN_LANGUAGES.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.includes(searchTerm) ||
      lang.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.script.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (regionFilter === 'all') return true;
    if (regionFilter === 'south') {
      return ['ta', 'te', 'kn', 'ml'].includes(lang.code);
    }
    if (regionFilter === 'north') {
      return ['hi', 'sa', 'pa', 'ur', 'ks', 'doi'].includes(lang.code);
    }
    if (regionFilter === 'east') {
      return ['bn', 'as', 'or', 'mai', 'sat', 'mni', 'brx', 'ne'].includes(lang.code);
    }
    if (regionFilter === 'west') {
      return ['mr', 'gu', 'kok', 'sd'].includes(lang.code);
    }
    return true;
  });

  const activeMeta = getLanguageMeta(selectedLanguage);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-3">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>22 Official Indian Languages + Sanskrit & English</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-amber-50">
            Multilingual Vedic Astrological Heritage
          </h2>
          <p className="text-sm text-amber-100/90 mt-2 leading-relaxed">
            Astrology across Bharat has flourished for millennia through distinct regional traditions—from Tamil Nadi and
            Kerala Prasna Marga to Mithila Siddhanta, Date Panchang, and classical Parashari Sanskrit. Our AI Pandit
            seamlessly comprehends both <strong>easy everyday vernacular</strong> and <strong>complex classical Shastra terminology</strong> across every Indian language.
          </p>

          <div className="mt-4 pt-4 border-t border-amber-700/50 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-amber-300 font-semibold">Active Consultation Language:</span>
            <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              {activeMeta.name} ({activeMeta.nativeName})
            </span>
            <span className="text-amber-200/80">
              Script: {activeMeta.script} • Tradition: {activeMeta.astrologyTradition}
            </span>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 -bottom-6 text-amber-700/20 font-serif text-9xl select-none pointer-events-none">
          ॐ
        </div>
      </div>

      {/* Search & Region Filters */}
      <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search language, script, or state..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/40 text-slate-800"
          />
        </div>

        {/* Region Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All (23)' },
            { id: 'north', label: 'North India' },
            { id: 'south', label: 'South India' },
            { id: 'east', label: 'East & North-East' },
            { id: 'west', label: 'West & Coastal' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRegionFilter(r.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                regionFilter === r.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200/70'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLanguages.map((lang) => {
          const isSelected = lang.code === selectedLanguage;

          return (
            <div
              key={lang.code}
              className={`bg-white border rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/20'
                  : 'border-amber-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-2xl font-bold text-amber-950">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
                        {lang.code.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{lang.name}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectLanguage(lang.code)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                  </button>
                </div>

                {/* Region & Tradition Details */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  <p>
                    <strong className="text-slate-700">Region:</strong> {lang.region}
                  </p>
                  <p>
                    <strong className="text-slate-700">Script:</strong> {lang.script}
                  </p>
                  <p>
                    <strong className="text-amber-900">Astrology Tradition:</strong>{' '}
                    <span className="text-amber-950 font-medium">{lang.astrologyTradition}</span>
                  </p>
                </div>

                {/* Greeting */}
                <div className="mb-4 text-xs italic text-slate-700 bg-white p-2 rounded-lg border border-slate-200/70">
                  &ldquo;{lang.greeting}&rdquo;
                </div>

                {/* Sample Easy & Complex Questions */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Sample Queries (Easy & Complex):</span>
                  </div>

                  {/* Easy Sample */}
                  {lang.sampleQuestionsEasy[0] && (
                    <button
                      type="button"
                      onClick={() =>
                        onLaunchConsultWithQuery
                          ? onLaunchConsultWithQuery(lang.code, lang.sampleQuestionsEasy[0])
                          : onSelectLanguage(lang.code)
                      }
                      className="w-full text-left p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs text-emerald-950 transition-colors flex items-start justify-between gap-2 group"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                          Easy / Everyday:
                        </span>
                        <span>{lang.sampleQuestionsEasy[0]}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}

                  {/* Complex Sample */}
                  {lang.sampleQuestionsComplex[0] && (
                    <button
                      type="button"
                      onClick={() =>
                        onLaunchConsultWithQuery
                          ? onLaunchConsultWithQuery(lang.code, lang.sampleQuestionsComplex[0])
                          : onSelectLanguage(lang.code)
                      }
                      className="w-full text-left p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs text-indigo-950 transition-colors flex items-start justify-between gap-2 group"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-indigo-700 block">
                          Complex / Shastric:
                        </span>
                        <span>{lang.sampleQuestionsComplex[0]}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-4 pt-3 border-t border-amber-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    if (onLaunchConsultWithQuery) {
                      onLaunchConsultWithQuery(lang.code, lang.sampleQuestionsEasy[0] || 'Namaste');
                    }
                  }}
                  className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Consult in {lang.name} ↗</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Classical Pan-Indian Astrological Heritage Information */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-serif text-lg font-bold text-amber-950 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-700" />
          The Pan-Indian Vedic Astrological Heritage
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Vedic Astrology is an unbroken living tradition practiced in every corner of the Indian subcontinent. While
          the core astronomical calculations (Graha Spashta, Lahiri Ayanamsha, and Nakshatras) unify all systems, each
          linguistic tradition contributes invaluable classical commentaries:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
            <h4 className="font-bold text-amber-950 mb-1">Northern & Central India</h4>
            <p className="text-slate-600">
              Anchored in <em>Brihat Parashara Hora Shastra</em>, Bhrigu Samhita, Mansagari, and Jaimini Sutras. Emphasizes North Indian diamond charts, Vimshottari Dasha, and gemstone kavachas.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
            <h4 className="font-bold text-amber-950 mb-1">Southern Indian Traditions</h4>
            <p className="text-slate-600">
              Celebrated for Nadi Astrology (Agasthiya & Bhrigu Nandi Nadi in Tamil Nadu), Ashtamangala Deva Prasna and <em>Prashna Marga</em> (Kerala), and Thirukkanitha Panchangam with fixed-sign square charts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
            <h4 className="font-bold text-amber-950 mb-1">Eastern, Western & Himalayan</h4>
            <p className="text-slate-600">
              Renowned for Gupta Press & Vishuddha Siddhanta Panjika (Bengal/Assam), Date Panchang (Maharashtra), Mithila Panji Prabandha (Bihar), and Tajik Neelakanthi solar returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
