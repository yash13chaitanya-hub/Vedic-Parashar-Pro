import React, { useState } from 'react';
import { BirthDetails } from '../types';
import { POPULAR_CITIES, CityLocation } from '../lib/cityData';
import { X, MapPin, Calendar, Clock, User, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: BirthDetails) => void;
  initialProfile?: BirthDetails;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    initialProfile?.gender || 'male'
  );
  const [isUnknownBirthDetails, setIsUnknownBirthDetails] = useState<boolean>(
    initialProfile?.isUnknownBirthDetails || false
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    initialProfile?.dateOfBirth || '1992-05-18'
  );
  const [timeOfBirth, setTimeOfBirth] = useState(
    initialProfile?.timeOfBirth || '09:30'
  );
  const [placeOfBirth, setPlaceOfBirth] = useState(
    initialProfile?.placeOfBirth || 'New Delhi, India'
  );
  const [latitude, setLatitude] = useState<number>(
    initialProfile?.latitude || 28.6139
  );
  const [longitude, setLongitude] = useState<number>(
    initialProfile?.longitude || 77.2090
  );
  const [timezone, setTimezone] = useState<number>(
    initialProfile?.timezone || 5.5
  );

  const [searchCity, setSearchCity] = useState('');
  const [filteredCities, setFilteredCities] = useState<CityLocation[]>([]);

  if (!isOpen) return null;

  const handleToggleUnknownBirth = () => {
    const nextVal = !isUnknownBirthDetails;
    setIsUnknownBirthDetails(nextVal);
    if (nextVal) {
      const now = new Date();
      setDateOfBirth(now.toISOString().split('T')[0]);
      setTimeOfBirth(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }
  };

  const handleCitySearch = (query: string) => {
    setSearchCity(query);
    if (!query.trim()) {
      setFilteredCities([]);
      return;
    }
    const matches = POPULAR_CITIES.filter((c) =>
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCities(matches);
  };

  const handleSelectCity = (c: CityLocation) => {
    setPlaceOfBirth(`${c.city}, ${c.country}`);
    setLatitude(c.latitude);
    setLongitude(c.longitude);
    setTimezone(c.timezone);
    setSearchCity('');
    setFilteredCities([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: BirthDetails = {
      id: initialProfile?.id || `profile-${Date.now()}`,
      name: name.trim(),
      gender,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: Number(timezone),
      isUnknownBirthDetails,
    };

    onSave(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-amber-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif font-bold text-amber-950 text-lg">
              {initialProfile ? 'Edit Birth Chart Details' : 'Create New Vedic Birth Chart'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-amber-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Full Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 mb-1 font-bold">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Unknown Birth Details Toggle (Nashta Jataka Mode) */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Unknown Birth Year, Date, or Time?</span>
              </span>
              <button
                type="button"
                onClick={handleToggleUnknownBirth}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                  isUnknownBirthDetails
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400'
                }`}
              >
                {isUnknownBirthDetails ? '✓ Nashta Jataka Mode' : 'Enable Prashna / Now Mode'}
              </button>
            </div>
            {isUnknownBirthDetails && (
              <p className="text-[11px] text-slate-600 leading-normal">
                ☸️ In Vedic astrology (<em>Prashna Marga</em>), when birth records are lost or unknown, your chart is cast from the query moment. This creates an authentic operative chart and calculates your active <strong>Prashna Vimshottari Dasha</strong>!
              </p>
            )}
          </div>

          {/* Date & Time of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                {isUnknownBirthDetails ? 'Query / Calculation Date' : 'Date of Birth'}
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                {isUnknownBirthDetails ? 'Query / Calculation Time (HH:MM)' : 'Exact Time of Birth (HH:MM)'}
              </label>
              <input
                type="time"
                required
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Place of Birth & Quick Search */}
          <div>
            <label className="block text-slate-700 mb-1 font-bold">City of Birth / Quick Lookup</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search major city (e.g. Delhi, Mumbai, London, New York)..."
                value={searchCity}
                onChange={(e) => handleCitySearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 placeholder-slate-400"
              />
              {filteredCities.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-amber-300 rounded-xl max-h-48 overflow-y-auto z-50 shadow-xl">
                  {filteredCities.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectCity(c)}
                      className="w-full text-left px-3 py-2 hover:bg-amber-50 border-b border-slate-100 last:border-0 text-xs flex justify-between items-center text-slate-800"
                    >
                      <span className="font-bold text-amber-950">{c.city}, {c.country}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {c.latitude.toFixed(2)}°, {c.longitude.toFixed(2)}° (UTC{c.timezone >= 0 ? `+${c.timezone}` : c.timezone})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2">
              <label className="block text-slate-500 text-[11px] font-medium">Selected Location Label</label>
              <input
                type="text"
                required
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              />
            </div>
          </div>

          {/* Coordinates & Timezone */}
          <div className="grid grid-cols-3 gap-2 bg-amber-50/40 p-3 rounded-xl border border-amber-200">
            <div>
              <label className="block text-slate-600 text-[10px] uppercase font-bold">Latitude (°)</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-amber-950 font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 text-[10px] uppercase font-bold">Longitude (°)</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-amber-950 font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 text-[10px] uppercase font-bold">Timezone (Hrs)</label>
              <input
                type="number"
                step="0.25"
                value={timezone}
                onChange={(e) => setTimezone(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-amber-950 font-bold font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-amber-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Calculate Kundali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
