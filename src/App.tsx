import React, { useState, useEffect, useMemo } from 'react';
import { BirthDetails, IndianLanguageCode, KundaliData } from './types';
import { generateKundali } from './lib/vedicCalculations';
import { Navbar, ActiveTab } from './components/Navbar';
import { DailyHoroscopeView } from './components/DailyHoroscopeView';
import { KundaliView } from './components/KundaliView';
import { DashaView } from './components/DashaView';
import { SadeSatiAndAshtakavarga } from './components/SadeSatiAndAshtakavarga';
import { MatchmakingView } from './components/MatchmakingView';
import { VedicAiConsult } from './components/VedicAiConsult';
import { HoraryView } from './components/HoraryView';
import { KpAstrologyView } from './components/KpAstrologyView';
import { IndianLanguagesView } from './components/IndianLanguagesView';
import { AstroSageReportsView } from './components/AstroSageReportsView';
import { ProfileModal } from './components/ProfileModal';
import { BirthDetailsEntryBar } from './components/BirthDetailsEntryBar';
import { Sparkles, Compass, Shield, BookOpen, RefreshCw, UserCheck } from 'lucide-react';

const DEFAULT_PROFILES: BirthDetails[] = [
  {
    id: 'default-profile-1',
    name: 'Acharya Sharma',
    gender: 'male',
    dateOfBirth: '1990-08-15',
    timeOfBirth: '06:30',
    placeOfBirth: 'Varanasi (Kashi), India',
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: 5.5,
  },
  {
    id: 'default-profile-2',
    name: 'Priya Sharma',
    gender: 'female',
    dateOfBirth: '1994-11-20',
    timeOfBirth: '14:15',
    placeOfBirth: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
  },
  {
    id: 'default-profile-3',
    name: 'Arjun Verma',
    gender: 'male',
    dateOfBirth: '1988-03-21',
    timeOfBirth: '10:45',
    placeOfBirth: 'Mumbai, India',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 5.5,
  },
];

export default function App() {
  const [profiles, setProfiles] = useState<BirthDetails[]>(() => {
    try {
      const saved = localStorage.getItem('parashar_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved profiles');
    }
    return DEFAULT_PROFILES;
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>(() => {
    return profiles[0]?.id || DEFAULT_PROFILES[0].id;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('daily-horoscope');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguageCode>(() => {
    try {
      const saved = localStorage.getItem('parashar_selected_language');
      if (saved) return saved as IndianLanguageCode;
    } catch (e) {
      console.warn('Could not read saved language');
    }
    return 'hi';
  });
  const [consultInitialQuery, setConsultInitialQuery] = useState<string>('');

  // Persist selected language
  useEffect(() => {
    try {
      localStorage.setItem('parashar_selected_language', selectedLanguage);
    } catch (e) {
      console.warn('Could not save language');
    }
  }, [selectedLanguage]);

  // Sync profiles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('parashar_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Could not save profiles');
    }
  }, [profiles]);

  const currentProfile = useMemo(() => {
    return (
      profiles.find((p) => p.id === currentProfileId) ||
      profiles[0] ||
      DEFAULT_PROFILES[0]
    );
  }, [profiles, currentProfileId]);

  // Generate real-time mathematical Vedic Kundali
  const kundali: KundaliData = useMemo(() => {
    return generateKundali(currentProfile);
  }, [currentProfile]);

  const handleSaveProfile = (newProfile: BirthDetails) => {
    setProfiles((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === newProfile.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newProfile;
        return copy;
      }
      return [newProfile, ...prev];
    });
    setCurrentProfileId(newProfile.id);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col selection:bg-amber-200 selection:text-amber-950">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profiles={profiles}
        currentProfile={currentProfile}
        onSelectProfile={(p) => setCurrentProfileId(p.id)}
        onOpenNewProfileModal={() => setIsProfileModalOpen(true)}
        activeLanguage={selectedLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Birth Date, Time & Place Entering Section across Every Category */}
        <BirthDetailsEntryBar
          activeCategory={activeTab}
          currentProfile={currentProfile}
          onSaveProfile={handleSaveProfile}
          profiles={profiles}
          onSelectProfile={(p) => setCurrentProfileId(p.id)}
          kundali={kundali}
          onOpenNewProfileModal={() => setIsProfileModalOpen(true)}
        />

        {/* Category Views */}
        {activeTab === 'daily-horoscope' && <DailyHoroscopeView kundali={kundali} />}
        {activeTab === 'astrosage-reports' && (
          <AstroSageReportsView
            kundali={kundali}
            onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
            onAskAiPandit={(prompt) => {
              setConsultInitialQuery(prompt);
              setActiveTab('ai-pandit');
            }}
          />
        )}
        {activeTab === 'kundali-charts' && (
          <KundaliView
            kundali={kundali}
            onEditBirthDetails={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        )}
        {activeTab === 'kp-astrology' && (
          <KpAstrologyView kundali={kundali} onSaveProfile={handleSaveProfile} />
        )}
        {activeTab === 'vimshottari-dasha' && <DashaView kundali={kundali} />}
        {activeTab === 'sade-sati-sav' && <SadeSatiAndAshtakavarga kundali={kundali} />}
        {activeTab === 'guna-milan' && (
          <MatchmakingView currentKundali={kundali} allProfiles={profiles} />
        )}
        {activeTab === 'horary-chart' && (
          <HoraryView currentProfile={currentProfile} />
        )}
        {activeTab === 'indian-languages' && (
          <IndianLanguagesView
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(lang) => setSelectedLanguage(lang)}
            onLaunchConsultWithQuery={(lang, query) => {
              setSelectedLanguage(lang);
              setConsultInitialQuery(query);
              setActiveTab('ai-pandit');
            }}
          />
        )}
        {activeTab === 'ai-pandit' && (
          <VedicAiConsult
            kundali={kundali}
            activeLanguage={selectedLanguage}
            onLanguageChange={(lang) => setSelectedLanguage(lang)}
            initialQuery={consultInitialQuery}
          />
        )}
      </main>

      {/* Vedic Astrology Citation Footer */}
      <footer className="bg-white border-t border-amber-200/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 mt-12 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-900 font-serif font-bold text-sm">
              <span className="text-amber-600 text-base">ॐ</span>
              <span>Parashar Lite Vedic Astrology Suite</span>
            </div>
            <p className="text-slate-500 mt-1">
              Grounded in Maharishi Parashara&apos;s <em>Brihat Parashara Hora Shastra</em>, Chitrapaksha (Lahiri) Ayanamsha, and Classical Gochara.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="hover:text-amber-800 transition-colors">Precision Sidereal Ephemeris</span>
            <span>•</span>
            <span className="hover:text-amber-800 transition-colors">Vimshottari 120-Year Dasha</span>
            <span>•</span>
            <span className="hover:text-amber-800 transition-colors">Daily Personalized Gochara</span>
            <span>•</span>
            <span className="hover:text-amber-800 transition-colors">Ashtakoot Guna Milan (36)</span>
          </div>
        </div>
      </footer>

      {/* Profile Creation / Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
