import React, { useState, useEffect } from 'react';
import { DailyHoroscope, KundaliData } from '../types';
import {
  Sparkles,
  Calendar,
  Clock,
  Compass,
  Volume2,
  VolumeX,
  ShieldCheck,
  Heart,
  Briefcase,
  Activity,
  Award,
  RefreshCw,
  Sun,
  AlertCircle,
  Gem,
} from 'lucide-react';

interface DailyHoroscopeViewProps {
  kundali: KundaliData;
}

export const DailyHoroscopeView: React.FC<DailyHoroscopeViewProps> = ({ kundali }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Fetch daily horoscope from API
  const fetchHoroscope = async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/astrology/daily-horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kundali,
          date: dateStr,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setHoroscope(data);
      }
    } catch (err) {
      console.error('Failed to load daily horoscope:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscope(selectedDate);
  }, [kundali.birthDetails.id, selectedDate]);

  // Audio Chant Synthesizer (Vedic Solfeggio / Tanpura sacred frequency 432Hz Om drone)
  const playSacredOmTone = () => {
    if (isPlayingAudio) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      setIsPlayingAudio(true);

      // Fundamental frequency (C# / 136.1 Hz - traditional Om cosmic frequency)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(136.1, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(272.2, ctx.currentTime); // 1st harmonic

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        setIsPlayingAudio(false);
      }, 4500);
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 border-emerald-400 bg-emerald-50';
    if (score >= 65) return 'text-amber-700 border-amber-400 bg-amber-50';
    return 'text-rose-700 border-rose-400 bg-rose-50';
  };

  const currentMD = kundali.vimshottariDasha.currentMahadasha.lord;
  const currentAD = kundali.vimshottariDasha.currentAntardasha.lord;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-100/50 via-white to-amber-100/50 border border-amber-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Parashari Gochara Engine
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Personalized for {kundali.birthDetails.name}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
              Daily Personalized Vedic Horoscope
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Calculated from your natal Moon in <strong className="text-amber-900">{kundali.planets.Moon.sign} ({kundali.planets.Moon.nakshatra})</strong>,
              Ascendant in <strong className="text-amber-900">{kundali.planets.Ascendant.sign}</strong>, and running <strong className="text-amber-900">{currentMD}-{currentAD}</strong> Vimshottari Dasha.
            </p>
          </div>

          {/* Date Selector & Refresh */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchHoroscope(selectedDate)}
              disabled={loading}
              className="p-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg text-amber-900 transition-colors"
              title="Recalculate Daily Planetary Transits"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-amber-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-xs">
          <RefreshCw className="w-10 h-10 text-amber-600 animate-spin mb-4" />
          <h3 className="font-serif text-lg font-bold text-amber-950">
            Calculating Daily Planetary Transits & Gochara...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mt-1">
            Synthesizing Brihat Parashara Hora Shastra principles, your natal Chandra chart, and today&apos;s celestial degrees.
          </p>
        </div>
      ) : horoscope ? (
        <>
          {/* Main Score & Core Synthesis Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Overall Cosmic Index */}
            <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Overall Auspiciousness
              </span>
              <div
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 shadow-inner ${getScoreColor(
                  horoscope.overallScore
                )}`}
              >
                <span className="text-3xl font-bold font-serif">{horoscope.overallScore}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Index / 100</span>
              </div>
              <span className="mt-3 text-xs font-serif font-bold text-amber-950">
                {horoscope.overallScore >= 80 ? 'Highly Favorable Day (Shubha)' : horoscope.overallScore >= 65 ? 'Balanced & Productive (Madhyama)' : 'Patience & Discretion Advised'}
              </span>
            </div>

            {/* Daily Synthesis */}
            <div className="lg:col-span-3 bg-white border border-amber-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-lg text-amber-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-700" />
                    Celestial Alignment for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <span className="text-xs px-2.5 py-1 bg-amber-50 rounded-full border border-amber-200 font-semibold text-amber-900">
                    Moon in {horoscope.moonTransitSign} ({horoscope.moonTransitNakshatra})
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans mt-2">
                  {horoscope.userSummary}
                </p>
              </div>

              {/* Running Dasha Notice */}
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs flex items-start gap-2 text-amber-950">
                <Sun className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900">Active Dasha Influence: </strong>
                  {horoscope.activeDashaInfluence}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Life (Karma, Kama, Arogya, Chitta) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Career & Wealth */}
            <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    <h4 className="font-serif font-bold text-amber-950 text-sm">Career & Wealth</h4>
                  </div>
                  <span className="text-xs font-bold text-amber-800">{horoscope.ratings.careerAndWealth}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${horoscope.ratings.careerAndWealth}%` }} />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {horoscope.predictions.career}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 block font-serif">Karma & Artha (Houses 10 & 2)</span>
            </div>

            {/* Love & Relationships */}
            <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <h4 className="font-serif font-bold text-amber-950 text-sm">Love & Family</h4>
                  </div>
                  <span className="text-xs font-bold text-rose-700">{horoscope.ratings.loveAndFamily}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${horoscope.ratings.loveAndFamily}%` }} />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {horoscope.predictions.relationships}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 block font-serif">Kama & Bandhu (Houses 7 & 4)</span>
            </div>

            {/* Health & Vitality */}
            <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif font-bold text-amber-950 text-sm">Health & Vitality</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">{horoscope.ratings.healthAndVitality}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${horoscope.ratings.healthAndVitality}%` }} />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {horoscope.predictions.health}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 block font-serif">Arogya & Prana (Houses 1 & 6)</span>
            </div>

            {/* Spirituality & Mind */}
            <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-serif font-bold text-amber-950 text-sm">Mind & Spirit</h4>
                  </div>
                  <span className="text-xs font-bold text-indigo-700">{horoscope.ratings.spiritualityAndMind}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${horoscope.ratings.spiritualityAndMind}%` }} />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {horoscope.predictions.general}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 block font-serif">Chitta & Dharma (Houses 9 & 12)</span>
            </div>
          </div>

          {/* Muhurta Guidance & Planetary Timing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Muhurta & Auspicious Timings */}
            <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Clock className="w-5 h-5 text-amber-700" />
                <div>
                  <h3 className="font-serif font-bold text-amber-950 text-base">Shubha Muhurta & Daily Timing</h3>
                  <p className="text-xs text-slate-500">Classical Vedic electional timing for success</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div>
                    <span className="text-emerald-900 font-bold block">Auspicious Hora (Shubha)</span>
                    <span className="text-slate-600">Ideal for major meetings, investments, and sacred duties</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 whitespace-nowrap ml-2">
                    {horoscope.muhurtaGuidance.auspiciousPeriod}
                  </span>
                </div>

                <div className="flex items-start justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <span className="text-amber-950 font-bold block">Abhijit Muhurta</span>
                    <span className="text-slate-600">Solar zenith window conquering planetary obstacles</span>
                  </div>
                  <span className="font-mono font-bold text-amber-900 whitespace-nowrap ml-2">
                    {horoscope.muhurtaGuidance.abhijitMuhurta}
                  </span>
                </div>

                <div className="flex items-start justify-between p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                  <div>
                    <span className="text-rose-950 font-bold block">Rahu Kalam (Caution Window)</span>
                    <span className="text-slate-600">Avoid inaugurations, contracts, or traveling start</span>
                  </div>
                  <span className="font-mono font-bold text-rose-800 whitespace-nowrap ml-2">
                    {horoscope.muhurtaGuidance.rahuKalam}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100 text-center">
                    <span className="text-[10px] text-slate-500 font-medium block">Lucky Direction</span>
                    <strong className="text-amber-950 text-xs">{horoscope.muhurtaGuidance.favorableDirection}</strong>
                  </div>
                  <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100 text-center">
                    <span className="text-[10px] text-slate-500 font-medium block">Lucky Color</span>
                    <strong className="text-amber-950 text-xs">{horoscope.muhurtaGuidance.luckyColor}</strong>
                  </div>
                  <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100 text-center">
                    <span className="text-[10px] text-slate-500 font-medium block">Lucky Number</span>
                    <strong className="text-amber-950 text-xs font-mono">{horoscope.muhurtaGuidance.luckyNumber}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Vedic Remedies (Upayas) */}
            <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  <div>
                    <h3 className="font-serif font-bold text-amber-950 text-base">Parashari Upayas (Remedies)</h3>
                    <p className="text-xs text-slate-500">Classical remedies to harmonize planetary vibrations</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={playSacredOmTone}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-full text-xs font-bold text-amber-900 transition-colors"
                >
                  {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-amber-700 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? 'Sounding Om...' : 'Play Om Drone'}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <span className="text-amber-950 font-bold block mb-1">Mantra of the Day (Japa)</span>
                  <div className="font-serif text-sm font-bold text-amber-950 tracking-wide bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                    &ldquo;{horoscope.remedies.dailyMantra}&rdquo;
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block font-medium">Chant 108 or 28 times facing North-East during sunrise or sunset.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-medium">Deity to Honor</span>
                    <strong className="text-amber-950 text-xs font-serif font-bold">{horoscope.remedies.deity}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-medium">Gemstone / Rudraksha</span>
                    <strong className="text-amber-950 text-xs font-serif font-bold">{horoscope.remedies.gemstoneGuidance}</strong>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
                  <span className="text-amber-950 font-bold block mb-0.5">Dana & Karuna (Recommended Charity)</span>
                  <p className="text-slate-600 text-xs">{horoscope.remedies.charityAction}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-slate-500 text-sm">
          Select a date above to view your personalized daily horoscope.
        </div>
      )}
    </div>
  );
};
