import React, { useState, useMemo, useEffect } from 'react';
import { BirthDetails, KundaliData, PlanetName } from '../types';
import {
  KpAyanamshaType,
  getKpAyanamsha,
  getAstroTimeFromBirth,
  calculateKpPlacidusCusps,
  buildKpCuspsTable,
  buildKpPlanetsTable,
  calculateRulingPlanets,
  calculateBtrWindow,
  evaluateKpLifeEvent,
  KP_LIFE_EVENTS_SPECS,
  generateKp249Database,
  formatDegreeDMS,
  KpCuspInfo,
  KpPlanetInfo,
  KpHouseSignificator,
  KpRulingPlanets,
  KpEventEvaluation,
} from '../lib/kpCalculations';
import { NorthIndianChart } from './NorthIndianChart';
import { SouthIndianChart } from './SouthIndianChart';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Search,
  Filter,
  RefreshCw,
  HelpCircle,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface KpAstrologyViewProps {
  kundali: KundaliData;
  onSaveProfile?: (updatedProfile: BirthDetails) => void;
}

export type KpSubTab =
  | 'cusps-chart'
  | 'planets-table'
  | 'significators'
  | 'ruling-planets'
  | 'event-promisors'
  | 'btr-assistant'
  | 'dba-analyzer'
  | 'table-249';

export const KpAstrologyView: React.FC<KpAstrologyViewProps> = ({ kundali, onSaveProfile }) => {
  const [activeSubTab, setActiveSubTab] = useState<KpSubTab>('cusps-chart');
  const [ayanamshaType, setAyanamshaType] = useState<KpAyanamshaType>('kp_original');
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [selectedEventId, setSelectedEventId] = useState<string>(KP_LIFE_EVENTS_SPECS[0].id);
  const [seedSearch, setSeedSearch] = useState<string>('');
  const [subLordFilter, setSubLordFilter] = useState<string>('all');
  const [btrMinutesOffset, setBtrMinutesOffset] = useState<number>(0);
  const [transitTime, setTransitTime] = useState<Date>(new Date());

  // Derive adjusted birth details for BTR experimentation if offset applied
  const effectiveBirthDetails = useMemo(() => {
    if (btrMinutesOffset === 0) return kundali.birthDetails;
    const [hStr, mStr] = (kundali.birthDetails.timeOfBirth || '12:00').split(':');
    const totalM = (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0) + btrMinutesOffset;
    const normM = ((totalM % 1440) + 1440) % 1440;
    const newH = Math.floor(normM / 60);
    const newM = normM % 60;
    return {
      ...kundali.birthDetails,
      timeOfBirth: `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`,
    };
  }, [kundali.birthDetails, btrMinutesOffset]);

  // Master Astronomical Timing
  const { astroTime, dateObj } = useMemo(() => {
    return getAstroTimeFromBirth(effectiveBirthDetails);
  }, [effectiveBirthDetails]);

  // Ayanamsha
  const ayanamshaInfo = useMemo(() => {
    const jd = astroTime.ut + 2451545.0;
    return getKpAyanamsha(jd, ayanamshaType);
  }, [astroTime, ayanamshaType]);

  // KP 12 Placidus Cusps
  const cuspLongitudes = useMemo(() => {
    return calculateKpPlacidusCusps(
      astroTime,
      effectiveBirthDetails.latitude,
      effectiveBirthDetails.longitude,
      ayanamshaInfo.ayanamsha
    );
  }, [astroTime, effectiveBirthDetails, ayanamshaInfo]);

  // Cusps Table with Occupants & Sub-Lords
  const kpCusps: KpCuspInfo[] = useMemo(() => {
    return buildKpCuspsTable(cuspLongitudes, kundali.planets);
  }, [cuspLongitudes, kundali.planets]);

  // KP Planets Table & 4-Fold Significators (A, B, C, D)
  const { planets: kpPlanets, houseSignificators } = useMemo(() => {
    return buildKpPlanetsTable(kundali, kpCusps);
  }, [kundali, kpCusps]);

  // Natal Ruling Planets
  const natalRulingPlanets = useMemo(() => {
    const moonLon = kundali.planets.Moon ? kundali.planets.Moon.longitude : 0;
    return calculateRulingPlanets(
      astroTime,
      effectiveBirthDetails.latitude,
      effectiveBirthDetails.longitude,
      ayanamshaInfo.ayanamsha,
      dateObj,
      moonLon,
      kpPlanets
    );
  }, [astroTime, effectiveBirthDetails, ayanamshaInfo, dateObj, kundali.planets.Moon, kpPlanets]);

  // Live Real-Time Transit Ruling Planets
  const [liveRulingPlanets, setLiveRulingPlanets] = useState<KpRulingPlanets | null>(null);

  const refreshLiveTransitRps = () => {
    const now = new Date();
    setTransitTime(now);
    const tzOffsetHours = -now.getTimezoneOffset() / 60;
    const utcMs = now.getTime();
    const utcDate = new Date(utcMs);
    const nowAstroTime = getAstroTimeFromBirth({
      ...effectiveBirthDetails,
      dateOfBirth: now.toISOString().split('T')[0],
      timeOfBirth: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      timezone: tzOffsetHours,
    }).astroTime;

    const rps = calculateRulingPlanets(
      nowAstroTime,
      effectiveBirthDetails.latitude,
      effectiveBirthDetails.longitude,
      ayanamshaInfo.ayanamsha,
      now,
      kundali.planets.Moon?.longitude || 0,
      kpPlanets
    );
    setLiveRulingPlanets(rps);
  };

  useEffect(() => {
    refreshLiveTransitRps();
  }, [effectiveBirthDetails, ayanamshaInfo, kpPlanets]);

  // BTR Window Calculation
  const btrData = useMemo(() => {
    return calculateBtrWindow(effectiveBirthDetails, ayanamshaInfo.ayanamsha);
  }, [effectiveBirthDetails, ayanamshaInfo]);

  // Evaluated Life Event
  const currentEventSpec = useMemo(() => {
    return (
      KP_LIFE_EVENTS_SPECS.find((s) => s.id === selectedEventId) || KP_LIFE_EVENTS_SPECS[0]
    );
  }, [selectedEventId]);

  const eventEvaluation: KpEventEvaluation = useMemo(() => {
    return evaluateKpLifeEvent(currentEventSpec, kpCusps, kpPlanets);
  }, [currentEventSpec, kpCusps, kpPlanets]);

  // KP 249 Table
  const full249Db = useMemo(() => generateKp249Database(), []);
  const filtered249 = useMemo(() => {
    return full249Db.filter((item) => {
      const matchSearch =
        seedSearch === '' ||
        String(item.seedNumber).includes(seedSearch) ||
        item.sign.toLowerCase().includes(seedSearch.toLowerCase()) ||
        item.nakshatra.toLowerCase().includes(seedSearch.toLowerCase()) ||
        item.subLord.toLowerCase().includes(seedSearch.toLowerCase()) ||
        item.starLord.toLowerCase().includes(seedSearch.toLowerCase());

      const matchSubLord =
        subLordFilter === 'all' || item.subLord.toLowerCase() === subLordFilter.toLowerCase();

      return matchSearch && matchSubLord;
    });
  }, [full249Db, seedSearch, subLordFilter]);

  // Custom House placements for KP Placidus Bhava Chalit Chart
  const kpHousePlacements: Partial<Record<PlanetName, number>> = useMemo(() => {
    const map: Partial<Record<PlanetName, number>> = {};
    (Object.values(kpPlanets) as KpPlanetInfo[]).forEach((p) => {
      map[p.name] = p.kpBhava;
    });
    return map;
  }, [kpPlanets]);

  const kpCuspSignNumbers: Record<number, number> = useMemo(() => {
    const map: Record<number, number> = {};
    kpCusps.forEach((c) => {
      map[c.houseNumber] = c.signIndex + 1;
    });
    return map;
  }, [kpCusps]);

  // Find planets that shifted houses between D-1 Rashi & KP Placidus Bhava Chalit
  const shiftedPlanets = useMemo(() => {
    const shifted: { name: PlanetName; rashiHouse: number; kpHouse: number }[] = [];
    const planetsToTest: PlanetName[] = [
      'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
    ];
    for (const p of planetsToTest) {
      const rashiHouse = kundali.planets[p]?.house;
      const kpHouse = kpPlanets[p]?.kpBhava;
      if (rashiHouse && kpHouse && rashiHouse !== kpHouse) {
        shifted.push({ name: p, rashiHouse, kpHouse });
      }
    }
    return shifted;
  }, [kundali.planets, kpPlanets]);

  // Save rectified time back to profile
  const handleApplyBtr = () => {
    if (!onSaveProfile) return;
    onSaveProfile(effectiveBirthDetails);
    setBtrMinutesOffset(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KP Philosophy */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/80 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold text-sm">
                KP
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-950">
                Krishnamurti Paddhati (KP System)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Placidus Cusps & Sub-Lords
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Pioneered by <strong>Prof. K.S. Krishnamurti</strong>. Based on the golden principle:{' '}
              <em>&ldquo;Planet is the Source, Constellation/Star Lord indicates the Result, and the Sub-Lord is the decisive arbiter of Fruition.&rdquo;</em>
            </p>
          </div>

          {/* Ayanamsha & Mode Selector */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-xl px-3 py-1.5 shadow-xs text-xs">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold text-slate-700">Ayanamsha:</span>
              <select
                id="kp-ayanamsha-select"
                value={ayanamshaType}
                onChange={(e) => setAyanamshaType(e.target.value as KpAyanamshaType)}
                className="bg-transparent font-bold text-amber-950 focus:outline-none cursor-pointer"
              >
                <option value="kp_original">KP Original (K.S.K)</option>
                <option value="kp_new">KP New (Modern)</option>
                <option value="lahiri">Chitrapaksha (Lahiri)</option>
              </select>
              <span className="text-[11px] font-mono text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                {formatDegreeDMS(ayanamshaInfo.ayanamsha)}
              </span>
            </div>
          </div>
        </div>

        {/* Shifted Planets Alert Banner (if any planet moved houses in KP) */}
        {shiftedPlanets.length > 0 && (
          <div className="mt-4 p-3 bg-amber-100/60 border border-amber-300 rounded-xl flex items-center gap-3 text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">KP Placidus Bhava Shift Detected: </span>
              {shiftedPlanets.map((sp, idx) => (
                <span key={sp.name} className="font-medium mr-2">
                  <strong>{sp.name}</strong> shifted from House {sp.rashiHouse} (D-1 Rashi) into{' '}
                  <span className="underline decoration-amber-600 font-bold">House {sp.kpHouse}</span> (KP Placidus)
                  {idx < shiftedPlanets.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* KP Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 border-b border-amber-200/80">
        {[
          { id: 'cusps-chart', label: 'Cusps & Bhava Chalit', icon: Compass },
          { id: 'planets-table', label: 'Planets & Sub-Lords', icon: Layers },
          { id: 'significators', label: '4-Fold Significators', icon: Award },
          { id: 'ruling-planets', label: 'Ruling Planets (RP)', icon: Sparkles },
          { id: 'event-promisors', label: '12 Life Event Promisors', icon: TrendingUp },
          { id: 'btr-assistant', label: 'Birth Time Rectifier', icon: Clock },
          { id: 'dba-analyzer', label: 'DBA Timing Engine', icon: ShieldCheck },
          { id: 'table-249', label: 'KP 249 Table', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`kp-tab-${tab.id}`}
              type="button"
              onClick={() => setActiveSubTab(tab.id as KpSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-700'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CUSPAL CHART & 12 PLACIDUS BHAVAS */}
      {activeSubTab === 'cusps-chart' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Chart Column (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-extrabold text-base text-amber-950">
                    KP Placidus Bhava Chalit Chart
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Actual astronomical unequal house boundaries
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setChartStyle('north')}
                    className={`px-2 py-1 rounded-md font-bold transition-colors ${
                      chartStyle === 'north'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    North
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartStyle('south')}
                    className={`px-2 py-1 rounded-md font-bold transition-colors ${
                      chartStyle === 'south'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    South
                  </button>
                </div>
              </div>

              {/* Render Selected Chart */}
              <div className="w-full flex justify-center py-2">
                {chartStyle === 'north' ? (
                  <NorthIndianChart
                    chartTitle="KP Bhava Chalit"
                    lagnaSignIndex={kpCusps[0].signIndex}
                    planets={kundali.planets}
                    outerPlanets={kundali.outerPlanets}
                    customHousePlacements={kpHousePlacements}
                    cuspSignNumbers={kpCuspSignNumbers}
                  />
                ) : (
                  <SouthIndianChart
                    chartTitle="KP Bhava Chalit"
                    lagnaSignIndex={kpCusps[0].signIndex}
                    planets={kundali.planets}
                    outerPlanets={kundali.outerPlanets}
                    planetPlacements={kundali.divisionalCharts.d1}
                  />
                )}
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                <span className="font-bold text-amber-900">Note: </span>
                In KP Astrology, house cusps are calculated using the <strong>Placidus system</strong>. A house can extend beyond 30° or less than 30°, causing some planets to be in a different Bhava than their D-1 sign!
              </div>
            </div>

            {/* 12 Cusps Table Column (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-extrabold text-base text-amber-950">
                    The 12 KP Cuspal Sub-Lords & Occupants
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pinpoint degrees, Star Lord, Sub Lord & Sub-Sub Lord for every Cusp
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  12 Placidus Cusps
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200">
                    <tr>
                      <th className="py-2.5 px-3">Cusp</th>
                      <th className="py-2.5 px-3">Degree & Sign</th>
                      <th className="py-2.5 px-3">Sign Lord</th>
                      <th className="py-2.5 px-3">Star Lord</th>
                      <th className="py-2.5 px-3 bg-amber-100/70 text-amber-950 font-extrabold">Sub Lord</th>
                      <th className="py-2.5 px-3">Sub-Sub</th>
                      <th className="py-2.5 px-3">Occupants</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {kpCusps.map((c) => (
                      <tr key={c.houseNumber} className="hover:bg-amber-50/50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-amber-950">
                          Cusp {c.houseNumber}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          <div>{c.degStr}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{c.sign}</div>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">{c.signLord}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">{c.starLord}</td>
                        <td className="py-2.5 px-3 bg-amber-50 font-extrabold text-amber-900">
                          <span className="px-2 py-0.5 rounded bg-amber-200/80 border border-amber-300">
                            {c.subLord}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium">{c.subSubLord}</td>
                        <td className="py-2.5 px-3">
                          {c.occupants.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {c.occupants.map((occ) => (
                                <span
                                  key={occ}
                                  className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-[10px]"
                                >
                                  {occ}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLANETS & SUB-LORDS TABLE */}
      {activeSubTab === 'planets-table' && (
        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-base text-amber-950">
                KP Planetary Coordinates & Ruling Table
              </h3>
              <p className="text-xs text-slate-500">
                Sign Lord, Star Lord, Sub-Lord, Sub-Sub Lord, and Untenanted (Self-Significator) status
              </p>
            </div>
            <div className="text-xs text-amber-900 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <span className="font-bold">Untenanted: </span>
              No other planet occupies its star (becomes extraordinarily potent self-significator)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200">
                <tr>
                  <th className="py-3 px-3">Planet</th>
                  <th className="py-3 px-3">KP Bhava</th>
                  <th className="py-3 px-3">Degree & Sign</th>
                  <th className="py-3 px-3">Sign Lord</th>
                  <th className="py-3 px-3">Star (Nakshatra)</th>
                  <th className="py-3 px-3">Star Lord</th>
                  <th className="py-3 px-3 bg-amber-100/70 text-amber-950 font-extrabold">Sub Lord</th>
                  <th className="py-3 px-3">Sub-Sub</th>
                  <th className="py-3 px-3">Untenanted?</th>
                  <th className="py-3 px-3">Signified Houses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {(Object.values(kpPlanets) as KpPlanetInfo[]).map((p) => (
                  <tr key={p.name} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-950">
                      <div className="flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.isRetrograde && (
                          <span className="px-1 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200 text-[9px] font-bold">
                            [R]
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-900">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300">
                        House {p.kpBhava}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{p.degStr}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">{p.sign}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{p.signLord}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{p.nakshatra}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{p.starLord}</td>
                    <td className="py-3 px-3 bg-amber-50 font-extrabold text-amber-900">
                      <span className="px-2 py-0.5 rounded bg-amber-200/80 border border-amber-300">
                        {p.subLord}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{p.subSubLord}</td>
                    <td className="py-3 px-3">
                      {p.name !== 'Ascendant' && p.isUntenanted ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 text-[10px]">
                          Yes (Self-Sig)
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Tenanted</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {p.signifiesHouses.all.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {p.signifiesHouses.all.map((h) => (
                            <span
                              key={h}
                              className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[10px]"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: 4-FOLD SIGNIFICATORS (A, B, C, D) MATRIX */}
      {activeSubTab === 'significators' && (
        <div className="space-y-6">
          <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-extrabold text-base text-amber-950">
                  4-Fold House Significators Matrix (Levels A, B, C, D)
                </h3>
                <p className="text-xs text-slate-500">
                  Classical Krishnamurti Paddhati order of significator strength for all 12 houses
                </p>
              </div>
              <div className="text-[11px] text-slate-600 bg-amber-50 p-2 rounded-xl border border-amber-200">
                <strong>Strength Order: </strong> Level A (Planets in star of occupant) &gt; Level B (Occupant) &gt; Level C (Planets in star of lord) &gt; Level D (House Lord)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200">
                  <tr>
                    <th className="py-3 px-3">House</th>
                    <th className="py-3 px-3">Cusp Sub-Lord</th>
                    <th className="py-3 px-3 bg-amber-100/70 text-amber-950">Level A (Strongest)</th>
                    <th className="py-3 px-3">Level B (Occupants)</th>
                    <th className="py-3 px-3">Level C (In Star of Lord)</th>
                    <th className="py-3 px-3">Level D (House Lord)</th>
                    <th className="py-3 px-3">Net Significators</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {(Object.values(houseSignificators) as KpHouseSignificator[]).map((hs) => (
                    <tr key={hs.houseNumber} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-amber-950">
                        House {hs.houseNumber}
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-900">
                        <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300">
                          {hs.cuspSubLord}
                        </span>
                      </td>
                      <td className="py-3 px-3 bg-amber-50 font-bold text-amber-950">
                        {hs.levelA.length > 0 ? hs.levelA.join(', ') : <span className="text-slate-400 font-normal italic">—</span>}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {hs.levelB.length > 0 ? hs.levelB.join(', ') : <span className="text-slate-400 italic">—</span>}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {hs.levelC.length > 0 ? hs.levelC.join(', ') : <span className="text-slate-400 italic">—</span>}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {hs.levelD.join(', ')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-amber-950">
                        <div className="flex flex-wrap gap-1">
                          {hs.allSignificators.map((sig) => (
                            <span
                              key={sig}
                              className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200 text-[10px]"
                            >
                              {sig}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reverse Planet-wise Significators Table */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-extrabold text-base text-amber-950">
              Planet-wise Significators (Reverse Lookup)
            </h3>
            <p className="text-xs text-slate-500">
              Shows what houses each planet represents at each strength tier
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200">
                  <tr>
                    <th className="py-3 px-3">Planet</th>
                    <th className="py-3 px-3">Level A Houses</th>
                    <th className="py-3 px-3">Level B Houses</th>
                    <th className="py-3 px-3">Level C Houses</th>
                    <th className="py-3 px-3">Level D Houses</th>
                    <th className="py-3 px-3 bg-amber-100/70 font-extrabold">All Fruitful Houses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {(Object.values(kpPlanets) as KpPlanetInfo[])
                    .filter((p) => p.name !== 'Ascendant')
                    .map((p) => (
                      <tr key={p.name} className="hover:bg-amber-50/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-amber-950">{p.name}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {p.signifiesHouses.levelA.join(', ') || '—'}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {p.signifiesHouses.levelB.join(', ') || '—'}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {p.signifiesHouses.levelC.join(', ') || '—'}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {p.signifiesHouses.levelD.join(', ') || '—'}
                        </td>
                        <td className="py-3 px-3 bg-amber-50 font-extrabold text-amber-950">
                          <span className="px-2 py-0.5 rounded bg-amber-200/80 border border-amber-300">
                            {p.signifiesHouses.all.join(', ') || 'None'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RULING PLANETS (NATAL & LIVE TRANSIT) */}
      {activeSubTab === 'ruling-planets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Natal Ruling Planets Card */}
            <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-extrabold text-base text-amber-950">
                    Natal Ruling Planets (At Birth)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {effectiveBirthDetails.dateOfBirth} at {effectiveBirthDetails.timeOfBirth}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
                  Birth RPs
                </span>
              </div>

              <div className="space-y-2.5">
                {natalRulingPlanets.rulingPlanetsOrdered.map((rp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs"
                  >
                    <div>
                      <div className="font-bold text-amber-950">{rp.role}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Star Lord: <span className="font-semibold text-slate-700">{rp.starLord}</span>
                        {rp.isStarRetrograde && ' (Retrograde)'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-sm shadow-xs">
                        {rp.planet}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rahu / Ketu Agents */}
              <div className="p-3 bg-white border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-950">Nodes (Rahu & Ketu) as Agents:</div>
                <p className="text-[11px] text-slate-600">
                  Rahu represents: <strong>{natalRulingPlanets.rahuRepresenting.join(', ') || 'Sign Lord'}</strong> • Ketu represents: <strong>{natalRulingPlanets.ketuRepresenting.join(', ') || 'Sign Lord'}</strong>
                </p>
              </div>
            </div>

            {/* Live Transit Ruling Planets Card (Crucial for Prashna & Decision Making) */}
            <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-extrabold text-base text-amber-950">
                    Live Transit Ruling Planets (Right Now)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Current epoch: {transitTime.toLocaleTimeString()} ({transitTime.toLocaleDateString()})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshLiveTransitRps}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recalculate Now</span>
                </button>
              </div>

              {liveRulingPlanets && (
                <div className="space-y-2.5">
                  {liveRulingPlanets.rulingPlanetsOrdered.map((rp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs"
                    >
                      <div>
                        <div className="font-bold text-amber-950">{rp.role}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Star Lord: <span className="font-semibold text-slate-700">{rp.starLord}</span>
                          {rp.isStarRetrograde && ' (Retrograde)'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-sm shadow-xs">
                          {rp.planet}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 bg-amber-100/60 border border-amber-300 rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-950">How Practicing KP Astrologers Use RPs:</div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  When a question is asked or birth time is rectified, the <strong>Live Transit Ruling Planets</strong> are compared with the event significators. The fruitful Dasha-Bhukti-Antara (DBA) periods will always belong to planets common to both the Significators and the Ruling Planets!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 12 LIFE EVENT PROMISORS (CUSPAL INTERLINKS) */}
      {activeSubTab === 'event-promisors' && (
        <div className="space-y-6">
          {/* Event Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {KP_LIFE_EVENTS_SPECS.map((spec) => {
              const isSelected = selectedEventId === spec.id;
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => setSelectedEventId(spec.id)}
                  className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                      : 'bg-white text-slate-800 hover:bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    Cusp {spec.primaryCusp} • {spec.category}
                  </div>
                  <div className="text-xs font-extrabold truncate mt-0.5">{spec.title}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Event Assessment Card */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-extrabold text-xl text-amber-950">
                    {eventEvaluation.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Primary Cusp {eventEvaluation.primaryCusp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{currentEventSpec.description}</p>
              </div>

              {/* Status Badge & Score */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-500">KP Promise Index</div>
                  <div className="text-2xl font-black text-amber-950">{eventEvaluation.score}%</div>
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold border ${
                    eventEvaluation.status === 'Strongly Promised'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : eventEvaluation.status === 'Promised with Effort / Delay'
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : 'bg-rose-100 text-rose-950 border-rose-300'
                  }`}
                >
                  {eventEvaluation.status}
                </div>
              </div>
            </div>

            {/* Cuspal Sub-Lord Decider Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                <div className="text-[11px] font-bold text-amber-900 uppercase">
                  Primary Cusp {eventEvaluation.primaryCusp} Sub-Lord
                </div>
                <div className="text-xl font-extrabold text-amber-950 mt-1">
                  {eventEvaluation.cuspSubLord}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Placed in Star of: <strong>{eventEvaluation.subLordStarLord}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                <div className="text-[11px] font-bold text-amber-900 uppercase">
                  Favorable Supporting Houses
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {eventEvaluation.favorableHouses.map((h) => (
                    <span
                      key={h}
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-xs"
                    >
                      House {h}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  Must be signified by Sub-Lord or its Star Lord
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                <div className="text-[11px] font-bold text-amber-900 uppercase">
                  Detrimental / Denial Houses
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {eventEvaluation.detrimentalHouses.map((h) => (
                    <span
                      key={h}
                      className="px-2 py-0.5 rounded bg-rose-100 text-rose-950 border border-rose-300 font-bold text-xs"
                    >
                      House {h}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  12th to favorable houses (cause denial/loss)
                </div>
              </div>
            </div>

            {/* Classical KP Analysis Checklist */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-amber-950">
                Krishnamurti Paddhati Astrological Reasoning:
              </h4>
              <div className="space-y-2">
                {eventEvaluation.classicalReasoning.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Fruitful DBA Planets for this Event */}
            {eventEvaluation.recommendedDbaPlanets.length > 0 && (
              <div className="p-4 bg-amber-100/60 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-amber-950">Timing of Event (Fruitful DBA Lords): </span>
                  <span className="text-slate-700">
                    Fruition occurs during the joint periods of:{' '}
                    <strong>{eventEvaluation.recommendedDbaPlanets.join(', ')}</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('dba-analyzer')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  Verify Current DBA Period &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: BIRTH TIME RECTIFICATION (BTR) ASSISTANT */}
      {activeSubTab === 'btr-assistant' && (
        <div className="space-y-6">
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
              <div>
                <h3 className="font-serif font-extrabold text-xl text-amber-950">
                  KP Birth Time Rectification (BTR) Assistant
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Prof. K.S. Krishnamurti&apos;s rules on Ascendant Sub-Lord validity, gender matching, and time window calibration
                </p>
              </div>

              {btrMinutesOffset !== 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
                    Offset: {btrMinutesOffset > 0 ? `+${btrMinutesOffset}` : btrMinutesOffset} min
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyBtr}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    Save Rectified Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setBtrMinutesOffset(0)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Time Adjuster Stepper */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-950">
                  Micro-Adjust Native&apos;s Birth Time:
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-white px-2.5 py-1 rounded border border-amber-300">
                  Current: {effectiveBirthDetails.timeOfBirth} (Original: {kundali.birthDetails.timeOfBirth})
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[-10, -5, -2, -1, -0.5, 0.5, 1, 2, 5, 10].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setBtrMinutesOffset((prev) => prev + step)}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold text-slate-800 transition-colors shadow-2xs cursor-pointer"
                  >
                    {step > 0 ? `+${step}m` : `${step}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Sub-Lord Active Window Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="text-[11px] font-bold text-amber-900 uppercase">Ascendant Degree</div>
                <div className="text-lg font-extrabold text-amber-950 mt-1">
                  {btrData.currentAscDegStr}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Sign Lord: <strong>{btrData.signLord}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="text-[11px] font-bold text-amber-900 uppercase">Asc Star Lord</div>
                <div className="text-lg font-extrabold text-amber-950 mt-1">
                  {btrData.starLord}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Vimshottari Constellation Lord
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-100/70 border border-amber-300">
                <div className="text-[11px] font-bold text-amber-900 uppercase">
                  Ascendant Sub-Lord (CSL)
                </div>
                <div className="text-2xl font-black text-amber-950 mt-1">
                  {btrData.subLord}
                </div>
                <div className="text-[11px] text-amber-900 font-semibold mt-1">
                  Sub-Sub Lord: {btrData.subSubLord}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="text-[11px] font-bold text-amber-900 uppercase">
                  Valid Time Range for this Sub-Lord
                </div>
                <div className="text-base font-bold text-amber-950 mt-1">
                  {btrData.windowStartTime} – {btrData.windowEndTime}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Duration: ~{Math.round(btrData.durationSeconds / 60)} min ({btrData.durationSeconds}s)
                </div>
              </div>
            </div>

            {/* KP Gender & Ruling Verification */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-amber-950">
                KP Verification Tests:
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Gender Polarity Rule: </span>
                    <span className="text-slate-700">{btrData.genderRuleVerdict}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Moon Star Lord Alignment: </span>
                    <span className="text-slate-700">
                      Moon is in the star of <strong>{kundali.planets.Moon?.nakshatraLord}</strong>. In classical KP BTR, the Ascendant Sub-Lord frequently reflects or conjoins the Moon&apos;s Star Lord or the Ruling Planets at inquiry time.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DASH-BHUKTI-ANTARA (DBA) PERIOD SIGNIFICATOR ANALYZER */}
      {activeSubTab === 'dba-analyzer' && (
        <div className="space-y-6">
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif font-extrabold text-xl text-amber-950">
                Running Dasha-Bhukti-Antara (DBA) Fruitful Houses
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Cross-references the current Mahadasha, Bhukti, and Antara lords with the 4-Fold Significators to reveal which life houses are active right now!
              </p>
            </div>

            {/* Current DBA Period Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kundali.vimshottariDasha && (
                <>
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                    <div className="text-[10px] font-bold uppercase text-amber-900">Mahadasha Lord</div>
                    <div className="text-2xl font-black text-amber-950 mt-1">
                      {kundali.vimshottariDasha.currentMahadasha.lord}
                    </div>
                    <div className="text-xs text-slate-600 mt-2">
                      Signifies Houses:{' '}
                      <strong className="text-amber-950">
                        {kpPlanets[kundali.vimshottariDasha.currentMahadasha.lord]?.signifiesHouses.all.join(', ') || '—'}
                      </strong>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Until: {kundali.vimshottariDasha.currentMahadasha.endDate}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                    <div className="text-[10px] font-bold uppercase text-amber-900">Bhukti (Antardasha) Lord</div>
                    <div className="text-2xl font-black text-amber-950 mt-1">
                      {kundali.vimshottariDasha.currentAntardasha.lord}
                    </div>
                    <div className="text-xs text-slate-600 mt-2">
                      Signifies Houses:{' '}
                      <strong className="text-amber-950">
                        {kpPlanets[kundali.vimshottariDasha.currentAntardasha.lord]?.signifiesHouses.all.join(', ') || '—'}
                      </strong>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Until: {kundali.vimshottariDasha.currentAntardasha.endDate}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-100/70 border border-amber-300">
                    <div className="text-[10px] font-bold uppercase text-amber-900">Antara Lord (Prorated)</div>
                    <div className="text-2xl font-black text-amber-950 mt-1">
                      {kpPlanets[kundali.vimshottariDasha.currentAntardasha.lord]?.subLord || 'Jupiter'}
                    </div>
                    <div className="text-xs text-amber-900 mt-2">
                      Sub-Lord of Bhukti Lord acts as trigger for fast events!
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Active Life Spheres Overview */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-slate-900">KP Timing Interpretation:</div>
              <p className="text-slate-700 leading-relaxed">
                In Krishnamurti Paddhati, an event cannot manifest simply because a planet promises it in the natal chart. The event will <strong>only materialize</strong> when the native runs the joint Mahadasha, Bhukti, and Antara (DBA) of planets that jointly signify the primary and supporting houses!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: KP 249 HORARY SUB-DIVISION TABLE EXPLORER */}
      {activeSubTab === 'table-249' && (
        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-extrabold text-base text-amber-950">
                Complete KP 249 Horary Sub-Division Table
              </h3>
              <p className="text-xs text-slate-500">
                All 249 sub-divisions of the 27 Nakshatras with exact arc boundaries and degrees
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="kp-249-search-input"
                  type="text"
                  placeholder="Search seed (1-249), sign, star..."
                  value={seedSearch}
                  onChange={(e) => setSeedSearch(e.target.value)}
                  className="w-full sm:w-60 pl-8 pr-3 py-1.5 text-xs bg-amber-50/50 border border-amber-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                id="kp-249-sublord-filter"
                value={subLordFilter}
                onChange={(e) => setSubLordFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-xl text-slate-700 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all">All Sub-Lords</option>
                {['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'].map(
                  (p) => (
                    <option key={p} value={p}>
                      Sub-Lord: {p}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* 249 Table */}
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto border border-amber-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-amber-100/90 text-amber-950 font-bold border-b border-amber-200 z-10 backdrop-blur-xs">
                <tr>
                  <th className="py-2.5 px-3">Seed #</th>
                  <th className="py-2.5 px-3">Sign</th>
                  <th className="py-2.5 px-3">Sign Lord</th>
                  <th className="py-2.5 px-3">Nakshatra</th>
                  <th className="py-2.5 px-3">Star Lord</th>
                  <th className="py-2.5 px-3 bg-amber-200/80 font-extrabold text-amber-950">Sub Lord</th>
                  <th className="py-2.5 px-3">Arc Span Start</th>
                  <th className="py-2.5 px-3">Arc Span End</th>
                  <th className="py-2.5 px-3">Span (Arcmin)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {filtered249.map((row) => (
                  <tr key={row.seedNumber} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-2 px-3 font-extrabold text-amber-950">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 inline-flex items-center justify-center text-[11px]">
                        {row.seedNumber}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-800">{row.sign}</td>
                    <td className="py-2 px-3 text-slate-600 font-medium">{row.signLord}</td>
                    <td className="py-2 px-3 font-medium text-slate-800">{row.nakshatra}</td>
                    <td className="py-2 px-3 font-semibold text-slate-700">{row.starLord}</td>
                    <td className="py-2 px-3 bg-amber-50/60 font-extrabold text-amber-900">
                      <span className="px-2 py-0.5 rounded bg-amber-200/70 border border-amber-300">
                        {row.subLord}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-700">{row.startDegStr}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-700">{row.endDegStr}</td>
                    <td className="py-2 px-3 text-slate-500 font-medium">{row.spanMinutes}&apos;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-slate-500 text-right">
            Showing {filtered249.length} of {full249Db.length} KP Sub-Divisions
          </div>
        </div>
      )}
    </div>
  );
};
