import React, { useState, useRef, useEffect } from 'react';
import { IndianLanguageCode, KundaliData } from '../types';
import { Sparkles, Send, Bot, User, BookOpen, Globe, RefreshCw, ChevronDown, Check, Compass, Award, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { INDIAN_LANGUAGES, getLanguageMeta } from '../lib/languages';
import { generateAlgorithmicConsultation, detectConsultationTopic } from '../lib/algorithmicConsultation';

interface VedicAiConsultProps {
  kundali: KundaliData;
  activeLanguage?: IndianLanguageCode;
  onLanguageChange?: (lang: IndianLanguageCode) => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'pandit';
  text: string;
  timestamp: string;
  topicBadge?: string;
}

type TopicFilter = 'all' | 'marriage' | 'career' | 'wealth' | 'property' | 'education' | 'foreign' | 'gemstone' | 'health';

export const VedicAiConsult: React.FC<VedicAiConsultProps> = ({
  kundali,
  activeLanguage = 'hi',
  onLanguageChange,
  initialQuery,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguageCode>(activeLanguage);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [questionMode, setQuestionMode] = useState<'easy' | 'complex'>('easy');
  const [activeTopicFilter, setActiveTopicFilter] = useState<TopicFilter>('all');

  const langMeta = getLanguageMeta(selectedLanguage);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init',
      sender: 'pandit',
      text: `${langMeta.greeting}\n\n` +
        `**जातक / Querent:** ${kundali.birthDetails.name}\n` +
        `• **लग्न (Lagna)**: ${kundali.planets.Ascendant.sign} (${kundali.planets.Ascendant.degrees}°) — नक्षत्र: ${kundali.planets.Ascendant.nakshatra}\n` +
        `• **जन्म राशि (Chandra)**: ${kundali.planets.Moon.sign} (${kundali.planets.Moon.nakshatra})\n` +
        `• **सक्रिय विंशोत्तरी दशा**: ${kundali.vimshottariDasha.currentMahadasha.lord} महादशा — ${kundali.vimshottariDasha.currentAntardasha.lord} अंतर्दशा\n` +
        `• **शनि साढ़ेसाती**: ${kundali.sadeSati.status}\n` +
        `• **षोडशवर्ग (D1 to D16)**: गणना पूर्ण (विंशोपक बल समाहित)\n\n` +
        `आप अपने जीवन, विवाह, नौकरी/करियर, संपत्ति, विदेश गमन, स्वास्थ्य या वैदिक उपायों के संबंध में कोई भी विशिष्ट प्रश्न पूछें। प्रत्येक प्रश्न का स्पष्ट, सीधा व शास्त्रीय उत्तर प्राप्त होगा।`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync when prop activeLanguage changes
  useEffect(() => {
    if (activeLanguage && activeLanguage !== selectedLanguage) {
      setSelectedLanguage(activeLanguage);
    }
  }, [activeLanguage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // When language switches, append a gentle welcoming Pandit greeting in that language
  const handleLanguageSwitch = (newLang: IndianLanguageCode) => {
    setSelectedLanguage(newLang);
    setLangDropdownOpen(false);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }

    const newMeta = getLanguageMeta(newLang);
    const greetingMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'pandit',
      text: `${newMeta.greeting}\n\n*Language switched to **${newMeta.name} (${newMeta.nativeName})**. Tradition: ${newMeta.astrologyTradition}. You can now ask questions in ${newMeta.name} or your preferred script.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, greetingMsg]);
  };

  const handleSend = async (customQuery?: string) => {
    const query = (typeof customQuery === 'string' ? customQuery : inputMessage).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    const topicInfo = detectConsultationTopic(query);
    const isHindiScript = ['hi', 'sa', 'mr', 'ne', 'mai', 'doi'].includes(selectedLanguage);
    const topicLabel = isHindiScript ? topicInfo.topicLabelHindi : topicInfo.topicLabelEnglish;

    try {
      const res = await fetch('/api/astrology/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kundali,
          message: query,
          chatHistory: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          languageCode: selectedLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || generateAlgorithmicConsultation(kundali, query, selectedLanguage);
        const panditMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'pandit',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topicBadge: topicLabel,
        };
        setMessages((prev) => [...prev, panditMsg]);
      } else {
        const fallbackText = generateAlgorithmicConsultation(kundali, query, selectedLanguage);
        const panditMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'pandit',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topicBadge: topicLabel,
        };
        setMessages((prev) => [...prev, panditMsg]);
      }
    } catch (err) {
      console.warn('Network consult notice, using client-side classical synthesizer:', err);
      const fallbackText = generateAlgorithmicConsultation(kundali, query, selectedLanguage);
      const panditMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'pandit',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topicBadge: topicLabel,
      };
      setMessages((prev) => [...prev, panditMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Curated questions based on active topic filter
  const TOPIC_QUERIES: Record<TopicFilter, { easy: string[]; complex: string[] }> = {
    all: {
      easy: langMeta.sampleQuestionsEasy,
      complex: langMeta.sampleQuestionsComplex,
    },
    marriage: {
      easy: [
        'मेरी शादी कब होगी?',
        'Will I have a love marriage or arranged marriage?',
        'भावी जीवनसाथी का स्वभाव व स्वरूप कैसा होगा?',
      ],
      complex: [
        'सप्तमेश की नवमांश (D-9) में स्थिति एवं विवाह का निश्चित समय बताएं।',
        'Analyze 7th house lord, Venus disposition & exact Dasha timing for marriage.',
        'क्या मेरी कुंडली में मांगलिक दोष या दांपत्य में कोई विलंब कारक योग है?',
      ],
    },
    career: {
      easy: [
        'मुझे नौकरी करनी चाहिए या स्वतंत्र व्यापार (Business)?',
        'व्हेन विल आई गेट अ जॉब चेंज या प्रमोशन?',
        'मेरे लिए करियर का सबसे श्रेष्ठ क्षेत्र कौन सा रहेगा?',
      ],
      complex: [
        'दशमांश चक्र (D-10) और दशमेश के आधार पर आजीविका का सटीक फलित बताएं।',
        'Analyze 10th lord in D1 and D10 for executive corporate leadership vs business.',
        'सक्रिय विंशोत्तरी दशा में पदोन्नति एवं स्थानांतरण का समय कब है?',
      ],
    },
    wealth: {
      easy: [
        'मेरी आर्थिक स्थिति कब सुधरेगी और धन लाभ कब होगा?',
        'क्या मुझे शेयर मार्केट या ट्रेडिंग में निवेश करना चाहिए?',
        'कर्ज से मुक्ति और आमदनी बढ़ाने के वैदिक उपाय क्या हैं?',
      ],
      complex: [
        'द्वितीय एवं एकादश भाव जनित धन योग (Dhana Yoga) का विश्लेषण करें।',
        'Evaluate 5th house, Rahu and Mercury for speculative equity trading risks.',
        'कुंडली में लक्ष्मी योग एवं अचल संपत्ति वृद्धि का काल बताएं।',
      ],
    },
    property: {
      easy: [
        'मेरा अपना घर या फ्लैट कब बनेगा?',
        'नई गाड़ी (कार) कब खरीदूं और कौन सा रंग शुभ रहेगा?',
        'भूमि अथवा अचल संपत्ति खरीदने का सर्वोत्तम समय क्या है?',
      ],
      complex: [
        'चतुर्थ भाव, भूमि-कारक मंगल और D-4 चतुर्थांश का गहन विश्लेषण करें।',
        'Analyze D-16 Shodashamsha chart for luxury vehicle acquisition timing.',
      ],
    },
    education: {
      easy: [
        'क्या मुझे सरकारी नौकरी या प्रतियोगी परीक्षा में सफलता मिलेगी?',
        'पढ़ाई में एकाग्रता और उच्च शिक्षा के क्या योग हैं?',
      ],
      complex: [
        'पंचम एवं नवम भाव के आधार पर यूपीएससी/सिविल सेवा योग का परीक्षण करें।',
        'Analyze 5th lord and Mercury for competitive examinations.',
      ],
    },
    foreign: {
      easy: [
        'क्या मेरी कुंडली में विदेश जाने या विदेश में बसने (PR) के योग हैं?',
        'मेरा वीज़ा कब लगेगा और विदेश यात्रा कब होगी?',
      ],
      complex: [
        'द्वादश भाव (12th), नवमेश एवं राहु के आधार पर विदेश स्थायी निवास का फलित बताएं।',
        'Assess 12th house and movable signs on cusps for foreign relocation.',
      ],
    },
    gemstone: {
      easy: [
        'मेरी कुंडली के अनुसार मेरा सबसे शुभ रत्न कौन सा है?',
        'मेरा लकी नंबर और लकी रंग क्या है?',
        'मेरे इष्ट देव कौन हैं और कौन से मंत्र का जप करना चाहिए?',
      ],
      complex: [
        'लग्नेश एवं भाग्येश के आधार पर धातु, उंगली और प्राण-प्रतिष्ठा विधि सहित रत्न बताएं।',
        'Recommend consecrated Vedic gemstones and authentic Rudraksha.',
      ],
    },
    health: {
      easy: [
        'मानसिक तनाव, डिप्रेशन और अनिद्रा से मुक्ति के क्या उपाय हैं?',
        'स्वास्थ्य लाभ कब होगा और बीमारी से कब राहत मिलेगी?',
        'क्या कोर्ट केस अथवा शत्रुओं पर विजय प्राप्त होगी?',
      ],
      complex: [
        'लग्नेश, सूर्य एवं षष्ठेश के आधार पर जीवनी शक्ति एवं आरोग्य विचार करें।',
        'Analyze 6th house Shatru-Hanta Yoga for litigation victory.',
      ],
    },
  };

  const activeQueries =
    questionMode === 'easy'
      ? TOPIC_QUERIES[activeTopicFilter]?.easy || langMeta.sampleQuestionsEasy
      : TOPIC_QUERIES[activeTopicFilter]?.complex || langMeta.sampleQuestionsComplex;

  return (
    <div className="bg-white border border-amber-200 rounded-2xl shadow-sm flex flex-col h-[740px] overflow-hidden">
      {/* Consultation Header */}
      <div className="px-5 py-3.5 border-b border-amber-100 bg-amber-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-amber-950 text-base flex items-center gap-2">
              <span>AI Pandit Consultation</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Targeted Question Solver
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Dedicated, question-specific answers backed by Parashari BPHS & Shodashvarga (D1–D16)
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:border-amber-400 text-xs font-bold text-slate-800 shadow-2xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-serif text-amber-950">{langMeta.nativeName}</span>
            <span className="text-[10px] text-slate-500 uppercase">({langMeta.code})</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 max-h-72 overflow-y-auto bg-white border border-amber-200 rounded-xl shadow-lg z-50 p-1.5 text-xs">
              <div className="px-2 py-1.5 font-bold text-[10px] text-amber-900 uppercase tracking-wider border-b border-amber-100 mb-1">
                Select Indian Language ({INDIAN_LANGUAGES.length})
              </div>
              {INDIAN_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageSwitch(l.code)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    selectedLanguage === l.code ? 'bg-amber-100 text-amber-950 font-bold' : 'hover:bg-amber-50 text-slate-700'
                  }`}
                >
                  <span className="font-serif">{l.nativeName} ({l.name})</span>
                  {selectedLanguage === l.code && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Topic Category Filter Tabs */}
      <div className="px-4 py-2 bg-amber-50/40 border-b border-amber-100 flex items-center gap-1.5 overflow-x-auto scrollbar-thin text-xs">
        <span className="text-[11px] font-bold text-amber-950 shrink-0 font-serif mr-1">विषय (Topics):</span>
        {[
          { id: 'all', label: '🌟 All' },
          { id: 'marriage', label: '💍 Marriage (विवाह)' },
          { id: 'career', label: '💼 Career (करियर/नौकरी)' },
          { id: 'wealth', label: '💰 Wealth & Stocks (धन/शेयर)' },
          { id: 'property', label: '🏡 Property & Car (मकान/वाहन)' },
          { id: 'education', label: '📚 Education (शिक्षा/परीक्षा)' },
          { id: 'foreign', label: '✈️ Foreign (विदेश यात्रा)' },
          { id: 'gemstone', label: '💎 Gemstones (शुभ रत्न/उपाय)' },
          { id: 'health', label: '🩺 Health & Peace (स्वास्थ्य/शांति)' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTopicFilter(t.id as TopicFilter)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors ${
              activeTopicFilter === t.id
                ? 'bg-amber-700 text-white shadow-2xs font-bold'
                : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-200/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'pandit' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <Bot className="w-4 h-4 text-amber-200" />
              </div>
            )}

            <div
              className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-600 text-white font-medium rounded-tr-none'
                  : 'bg-white text-slate-800 border border-amber-200/80 rounded-tl-none prose prose-xs max-w-none'
              }`}
            >
              {m.sender === 'pandit' && m.topicBadge && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold mb-3 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  <span>🎯 {m.topicBadge}</span>
                </div>
              )}

              {m.sender === 'user' ? (
                <p className="whitespace-pre-wrap">{m.text}</p>
              ) : (
                <div className="space-y-2 text-slate-800">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              )}

              <span
                className={`text-[10px] block mt-2 text-right ${
                  m.sender === 'user' ? 'text-amber-100' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <User className="w-4 h-4 text-slate-700" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-amber-800" />
            </div>
            <div className="bg-white border border-amber-200 p-4 rounded-2xl rounded-tl-none text-xs text-amber-900 flex items-center gap-2.5 shadow-xs">
              <RefreshCw className="w-4 h-4 text-amber-700 animate-spin" />
              <span>
                Analyzing {kundali.birthDetails.name}&apos;s specific question across D1-D16 charts, {kundali.vimshottariDasha.currentMahadasha.lord} Mahadasha & Parashari Yogas...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Inquiries with Easy / Complex toggle */}
      <div className="px-4 py-2 bg-amber-50/70 border-t border-amber-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-600 font-bold text-[11px] flex items-center gap-1 font-serif">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            Quick Inquiries:
          </span>

          {/* Mode Switcher */}
          <div className="inline-flex bg-amber-100/80 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setQuestionMode('easy')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                questionMode === 'easy'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              Easy (सरल प्रश्न)
            </button>
            <button
              type="button"
              onClick={() => setQuestionMode('complex')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                questionMode === 'complex'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              Complex (शास्त्रीय प्रश्न)
            </button>
          </div>
        </div>

        {/* Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-thin">
          {activeQueries.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1 bg-white hover:bg-amber-100 text-slate-700 hover:text-amber-950 rounded-full border border-amber-200 transition-colors text-[11px] font-medium shadow-2xs shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3.5 sm:p-4 bg-white border-t border-amber-100 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask any specific question in ${langMeta.name} or English (e.g., "Meri shaadi kab hogi?", "Job or Business?")`}
          className="flex-1 bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <span>Ask Pandit</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
