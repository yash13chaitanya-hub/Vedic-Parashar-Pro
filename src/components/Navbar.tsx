import React from 'react';
import { BirthDetails, IndianLanguageCode } from '../types';
import {
  Sparkles,
  Calendar,
  Compass,
  Clock,
  Heart,
  MessageSquare,
  Shield,
  Plus,
  ChevronDown,
  User,
  Printer,
  HelpCircle,
  Globe,
  Layers,
} from 'lucide-react';

export type ActiveTab =
  | 'daily-horoscope'
  | 'astrosage-reports'
  | 'kundali-charts'
  | 'kp-astrology'
  | 'horary-chart'
  | 'vimshottari-dasha'
  | 'sade-sati-sav'
  | 'guna-milan'
  | 'indian-languages'
  | 'ai-pandit';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profiles: BirthDetails[];
  currentProfile: BirthDetails;
  onSelectProfile: (profile: BirthDetails) => void;
  onOpenNewProfileModal: () => void;
  activeLanguage?: IndianLanguageCode;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profiles,
  currentProfile,
  onSelectProfile,
  onOpenNewProfileModal,
  activeLanguage = 'hi',
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'daily-horoscope', label: 'Daily Horoscope', icon: Calendar },
    { id: 'astrosage-reports', label: '100+ Free Reports (AstroSage Tools)', icon: Layers },
    { id: 'kundali-charts', label: 'Kundali & Shodashvarga (D1–D16)', icon: Compass },
    { id: 'kp-astrology', label: 'KP Astrology (KP Shastra)', icon: Sparkles },
    { id: 'horary-chart', label: 'Horary (Prashna)', icon: HelpCircle },
    { id: 'vimshottari-dasha', label: 'Vimshottari Dasha', icon: Clock },
    { id: 'sade-sati-sav', label: 'Sade Sati & SAV', icon: Shield },
    { id: 'guna-milan', label: 'Kundali Milan (36)', icon: Heart },
    { id: 'indian-languages', label: 'Indian Languages (भाषाएं)', icon: Globe },
    { id: 'ai-pandit', label: 'AI Pandit Consultation', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-amber-200/80 backdrop-blur-md shadow-xs">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <span className="font-serif text-xl">ॐ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-extrabold text-lg sm:text-xl text-amber-950 tracking-wider">
                PARASHAR LITE
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase tracking-wider">
                BPHS 99% Precision
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Maharishi Parashara Classical Vedic Astrology & Daily Personalized Horoscopes
            </p>
          </div>
        </div>

        {/* Profile Selector & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 rounded-xl text-xs sm:text-sm text-slate-800 transition-colors shadow-xs"
            >
              <User className="w-4 h-4 text-amber-700" />
              <span className="font-bold text-amber-950 max-w-[130px] truncate">
                {currentProfile.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-amber-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Switch Saved Kundali
                </div>
                <div className="max-h-52 overflow-y-auto py-1">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSelectProfile(p);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50/80 transition-colors ${
                        p.id === currentProfile.id
                          ? 'bg-amber-100/80 text-amber-950 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="block font-medium">{p.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {p.dateOfBirth} • {p.placeOfBirth}
                        </span>
                      </div>
                      {p.id === currentProfile.id && (
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-1 border-t border-slate-100 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenNewProfileModal();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Birth Chart</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-slate-700 rounded-xl text-xs font-medium shadow-xs transition-colors"
            title="Print Kundali Report"
          >
            <Printer className="w-3.5 h-3.5 text-amber-700" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-amber-100 bg-amber-50/40">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold border border-amber-400'
                    : 'text-slate-600 hover:text-amber-950 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
