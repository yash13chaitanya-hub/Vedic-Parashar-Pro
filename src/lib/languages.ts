import { IndianLanguageCode, LanguageMeta } from '../types';

export const INDIAN_LANGUAGES: LanguageMeta[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'North & Central India (UP, MP, Bihar, Rajasthan, Delhi, etc.)',
    script: 'Devanagari',
    astrologyTradition: 'Parashari, Bhrigu Samhita, Lal Kitab & Jamini',
    greeting: 'प्रणाम! मैं आपका वैदिक ज्योतिष एआई पंडित हूँ। आज आपकी जन्मकुंडली के संदर्भ में आप क्या जानना चाहते हैं?',
    sampleQuestionsEasy: [
      'मेरा विवाह कब होगा और जीवनसाथी कैसा मिलेगा?',
      'मेरी नौकरी या करियर में तरक्की कब मिलेगी?',
      'क्या मुझे विदेश यात्रा या सेटलमेंट का योग है?',
      'मेरे लिए कौन सा रत्न (Gemstone) सबसे शुभ रहेगा?',
      'मेरी वर्तमान महादशा का मेरे जीवन पर क्या प्रभाव पड़ रहा है?'
    ],
    sampleQuestionsComplex: [
      'लग्न कुंडली (D1) और नवमांश (D9) में आत्मकारक और अमात्यकारक की युति का क्या फल है?',
      'दशमांश (D10) में दशमेश की स्थिति और गजकेसरी योग का करियर पर प्रभाव समझाइए।',
      'षोडशांश (D16) और विंशोपक बल के अनुसार वाहनों और भौतिक सुखों की स्थिति क्या है?',
      'अष्टमेश और षष्ठेश की दशा-अंतर्दशा में विपरीत राजयोग के फलित होने की संभावना क्या है?'
    ]
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    region: 'Classical Pan-Indian Vedic Heritage',
    script: 'Devanagari',
    astrologyTradition: 'Brihat Parashara Hora Shastra, Surya Siddhanta & Jaimini Sutras',
    greeting: 'नमो नमः! अहम् भवतः वैदिक-ज्योतिष-पण्डितः अस्मि। भवतः जन्मकुण्डल्याः किं जिज्ञासते?',
    sampleQuestionsEasy: [
      'मम विवाहस्य योगः कदा भविष्यति?',
      'मम आजीविकायां विद्यायां च कथम् सफलता सम्भविष्यति?',
      'मम राशौ कः ग्रहानुकूलः रत्नधारणं च श्रेयस्करम्?',
      'मम दशाफलानि शान्तिपाठाः च कानि सन्ति?'
    ],
    sampleQuestionsComplex: [
      'बृहत्पाराशरहोराशास्त्रानुसारं षोडशवर्गेषु आत्मकारकस्य विंशोपकबलं वर्णयतु।',
      'नवमांशकुण्डल्यां सप्तमेशस्य उच्च-नीच-स्थितिं विमृश्य दांपत्यसुखं निरूपयतु।',
      'षष्ट्यंशे (D-60) प्राक्तनकर्मणः स्थितिः वर्तमानजीवने कथं प्रतिफलति?'
    ]
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu & Puducherry',
    script: 'Tamil',
    astrologyTradition: 'Nadi Astrology (Agathiyar / Brighu Nandi), Thirukkanitha Panchangam',
    greeting: 'வணக்கம்! நான் உங்கள் வேத ஜோதிட பண்டிதர். உங்கள் ஜாதகத்தைப் பற்றி நீங்கள் என்ன அறிய விரும்புகிறீர்கள்?',
    sampleQuestionsEasy: [
      'எனக்கு திருமணம் எப்போது நடக்கும்? வரன் எவ்வாறு அமைவார்?',
      'என் தொழில் மற்றும் உத்தியோகத்தில் எப்போது நல்ல மாற்றம் வரும்?',
      'எனக்கு எந்த ராசிக்கல் அல்லது பரிகாரம் அதிர்ஷ்டம் தரும்?',
      'தற்போது நடக்கும் தசா புத்தி எனக்கு நன்மை தருமா?'
    ],
    sampleQuestionsComplex: [
      'நாடி ஜோதிட முறைப்படி குரு-சனி சேர்க்கையின் பலன்கள் என்ன?',
      'நவாம்சத்தில் (D-9) 7-ம் அதிபதியின் நிலை மற்றும் களத்திர தோஷ பரிகாரங்கள் யாவை?',
      'தசாம்சத்தில் (D-10) 10-ம் அதிபதியின் யோக பலன்கள் யாவை?'
    ]
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Andhra Pradesh & Telangana',
    script: 'Telugu',
    astrologyTradition: 'Gauri Panchangam, Parashari & Nadi Traditions',
    greeting: 'నమస్కారం! నేను మీ వేద జ్యోతిష AI పండితుడిని. మీ జాతకం గురించి మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?',
    sampleQuestionsEasy: [
      'నాకు వివాహం ఎప్పుడు అవుతుంది? జీవిత భాగస్వామి ఎలా ఉంటారు?',
      'నా కెరీర్ మరియు ఉద్యోగంలో ఎప్పుడు మంచి ఎదుగుదల ఉంటుంది?',
      'నాకు ఏ రత్నం ధరించడం వల్ల శుభ ఫలితాలు కలుగుతాయి?',
      'నా ప్రస్తుత మహాదశ అంతర్దశ ఎలా ఉంది?'
    ],
    sampleQuestionsComplex: [
      'నవాంశ (D-9) చక్రంలో సప్తమాధిపతి బలము మరియు దాంపత్య జీవిత విశేషాలు తెలపండి.',
      'దశాంశ (D-10) ప్రకారం వ్యాపార రంగంలో యోగం ఉందా లేదా ఉద్యోగం మంచిదా?',
      'షోడశవర్గాలలో గ్రహాల వింశోపక బలం ఎలా లెక్కించబడుతుంది?'
    ]
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal, Tripura & Assam (Barak Valley)',
    script: 'Bengali',
    astrologyTradition: 'Gupta Press Panjika, Vishuddha Siddhanta & Tantrik Jyotish',
    greeting: 'নমস্কার! আমি আপনার বৈদিক জ্যোতিষ AI পন্ডিত। আপনার জন্মকুণ্ডলী সম্পর্কে আপনি কী জানতে চান?',
    sampleQuestionsEasy: [
      'আমার বিবাহ কবে হবে এবং জীবনসঙ্গী কেমন হবে?',
      'আমার চাকরি বা ব্যবসায় উন্নতি কবে আসবে?',
      'আমার জন্য কোন রত্ন ধারণ করা সবচেয়ে শুভ হবে?',
      'বর্তমান মহাদশা আমার জন্য কেমন ফল দেবে?'
    ],
    sampleQuestionsComplex: [
      'লগ্নাধিপতি ও নবমাংশাধিপতির মধ্যে সম্বন্ধ বিচার করে ভাগ্যোন্নতির সময় বলুন।',
      'দশমাংশ (D-10) চক্র বিশ্লেষণ করে সরকারি চাকরির সম্ভাবনা ব্যাখ্যা করুন।',
      'ষষ্ঠ্যাংশ কুণ্ডলী (D-60) অনুসারে পূর্বজন্মের কর্মফল বর্তমানে কীভাবে প্রভাব ফেলছে?'
    ]
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra & Goa',
    script: 'Devanagari',
    astrologyTradition: 'Date Panchang, Tilak Panchang & Parashari Jyotish',
    greeting: 'नमस्कार! मी आपला वैदिक ज्योतिष AI पंडित आहे. आपल्या जन्मपत्रिकेबाबत (कुंडली) आपल्याला काय जाणून घ्यायचे आहे?',
    sampleQuestionsEasy: [
      'माझे लग्न कधी होईल आणि जोडीदार कसा मिळेल?',
      'माझ्या नोकरीमध्ये किंवा व्यवसायात कधी प्रगती होईल?',
      'माझ्यासाठी कोणते रत्न धारण करणे शुभ ठरेल?',
      'सध्या चालू असलेल्या महादशेचे काय परिणाम होतील?'
    ],
    sampleQuestionsComplex: [
      'नवमांश (D-9) आणि लग्न कुंडलीतील राजयोगांची तुलनात्मक स्थिती स्पष्ट करा.',
      'दशमांश (D-10) वरून करिअरमधील उच्च पद आणि सरकारी लाभाचा योग तपासा.',
      'साडेसातीचा चालू असलेला टप्पा आणि शनीच्या शांतीचे शास्त्रीय उपाय सांगा.'
    ]
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'Gujarat & Daman/Diu',
    script: 'Gujarati',
    astrologyTradition: 'Gujarat Samvat Panchang & Parashari / Jaimini Traditions',
    greeting: 'નમસ્કાર! હું તમારો વૈદિક જ્યોતિષ AI પંડિત છું. તમારી જન્મકુંડળી વિશે તમે શું જાણવા માંગો છો?',
    sampleQuestionsEasy: [
      'મારા લગ્ન ક્યારે થશે અને જીવનસાથી કેવા મળશે?',
      'મારા વેપાર કે નોકરીમાં ક્યારે પ્રગતિ થશે?',
      'મારા માટે કયો રત્ન પહેરવો સૌથી ઉત્તમ રહેશે?',
      'મારી વર્તમાન મહાદશા મારા માટે કેવી રહેશે?'
    ],
    sampleQuestionsComplex: [
      'દશમાંશ (D-10) કુંડળીમાં દશમેશની સ્થિતિથી વેપારમાં વૃદ્ધિ ક્યારે સંભવ છે?',
      'નવમાંશ (D-9) માં શુક્ર અને ગુરુની યુતિ દાંપત્ય જીવન પર શું અસર કરે છે?',
      'શોડશવર્ગમાં ગ્રહોના વિંશોપક બળ અનુસાર ધનલાભનો સમય બતાવો.'
    ]
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka',
    script: 'Kannada',
    astrologyTradition: 'Bangalore / Udupi Astrological Traditions, Ashtamangala Prasna',
    greeting: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ AI ಪಂಡಿತ. ನಿಮ್ಮ ಜಾತಕದ ಬಗ್ಗೆ ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?',
    sampleQuestionsEasy: [
      'ನನ್ನ ವಿವಾಹ ಯಾವಾಗ ಆಗಬಹುದು ಮತ್ತು ಸಂಗಾತಿ ಹೇಗಿರುತ್ತಾರೆ?',
      'ನನ್ನ ಉದ್ಯೋಗ ಅಥವಾ ವೃತ್ತಿಜೀವನದಲ್ಲಿ ಯಾವಾಗ ಬೆಳವಣಿಗೆ ಕಾಣಬಹುದು?',
      'ನನಗೆ ಅದೃಷ್ಟ ತರುವ ರತ್ನ ಯಾವುದು?',
      'ನನ್ನ ಪ್ರಸ್ತುತ ಮಹಾದಶಾ ಫಲ ಹೇಗಿದೆ?'
    ],
    sampleQuestionsComplex: [
      'ನವಾಂಶ (D-9) ದಲ್ಲಿ ಸಪ್ತಮ ಭಾವ ಮತ್ತು ದಾಂಪತ್ಯ ಯೋಗವನ್ನು ವಿಶ್ಲೇಷಿಸಿ.',
      'ದಶಾಂಶ (D-10) ಪ್ರಕಾರ ಸರಕಾರಿ ನೌಕರಿ ಅಥವಾ ವ್ಯಾಪಾರ ಲಾಭದ ಕಾಲಾವಧಿ ತಿಳಿಸಿ.',
      'ವಿಂಶೋಪಕ ಬಲದ ಆಧಾರದ ಮೇಲೆ ಗ್ರಹಗಳ ನಿಜವಾದ ಶಕ್ತಿಯನ್ನು ವಿವರಿಸಿ.'
    ]
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala & Lakshadweep',
    script: 'Malayalam',
    astrologyTradition: 'Kerala Prasna Marga, Ashtamangala Deva Prasna, Aryabhata System',
    greeting: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ വൈദിക ജ്യോതിഷ AI പണ്ഡിതനാണ്. നിങ്ങളുടെ ജാതകത്തെക്കുറിച്ച് എന്താണ് അറിയേണ്ടത്?',
    sampleQuestionsEasy: [
      'എന്റെ വിവാഹം എപ്പോഴായിരിക്കും? ജീവിതപങ്കാളി എങ്ങനെയുള്ള ആളായിരിക്കും?',
      'എന്റെ ജോലിയിലോ ബിസിനസ്സിലോ എപ്പോഴാണ് മാറ്റം വരിക?',
      'എനിക്ക് ഭാഗ്യം നൽകുന്ന രത്നം ഏതാണ്?',
      'ഇപ്പോഴത്തെ ദശാസന്ധി എനിക്ക് അനുകൂലമാണോ?'
    ],
    sampleQuestionsComplex: [
      'പ്രശ്നമാർഗ്ഗ രീതിയിൽ അഷ്ടമംഗല പ്രശ്ന തത്ത്വങ്ങളും ഗ്രഹനിലയും വിലയിരുത്തുക.',
      'നവാംശകത്തിൽ (D-9) ശുക്രന്റെയും വ്യാഴത്തിന്റെയും സ്ഥിതി ദാമ്പത്യത്തെ എങ്ങനെ ബാധിക്കുന്നു?',
      'ദശാംശ (D-10) ചക്രപ്രകാരം ഉന്നത ഉദ്യോഗസാധ്യതകൾ എപ്പോഴാണ്?'
    ]
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'Punjab & Chandigarh',
    script: 'Gurmukhi',
    astrologyTradition: 'North Indian Bhrigu & Parashari Traditions',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਵੈਦਿਕ ਜੋਤਿਸ਼ AI ਪੰਡਿਤ ਹਾਂ। ਤੁਹਾਡੀ ਜਨਮ ਕੁੰਡਲੀ ਬਾਰੇ ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
    sampleQuestionsEasy: [
      'ਮੇਰਾ ਵਿਆਹ ਕਦੋਂ ਹੋਵੇਗਾ ਅਤੇ ਜੀਵਨ ਸਾਥੀ ਕਿਹੋ ਜਿਹਾ ਹੋਵੇਗਾ?',
      'ਮੇਰੇ ਕੰਮ-ਕਾਰ ਜਾਂ ਨੌਕਰੀ ਵਿੱਚ ਤਰੱਕੀ ਕਦੋਂ ਮਿਲੇਗੀ?',
      'ਕੀ ਮੇਰੇ ਵਿਦੇਸ਼ ਜਾਣ (PR / Study Visa) ਦੇ ਯੋਗ ਹਨ?',
      'ਮੇਰੇ ਲਈ ਕਿਹੜਾ ਨਗ (ਰਤਨ) ਸ਼ੁਭ ਰਹੇਗਾ?'
    ],
    sampleQuestionsComplex: [
      'ਲਗਨ ਅਤੇ ਨਵਮਾਂਸ਼ (D-9) ਕੁੰਡਲੀ ਵਿੱਚ ਵਿਦੇਸ਼ ਯਾਤਰਾ ਅਤੇ ਪੱਕੇ ਤੌਰ ਤੇ ਵਸਣ ਦੇ ਯੋਗ ਦੱਸੋ।',
      'ਦਸ਼ਮਾਂਸ਼ (D-10) ਅਨੁਸਾਰ ਸਰਕਾਰੀ ਨੌਕਰੀ ਜਾਂ ਕਾਰੋਬਾਰ ਵਿੱਚ ਸਫਲਤਾ ਕਦੋਂ ਮਿਲੇਗੀ?',
      'ਰਾਹੂ ਅਤੇ ਸ਼ਨੀ ਦੀ ਮਹਾਦਸ਼ਾ ਵਿੱਚ ਕਿਹੜੇ ਉਪਾਅ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ?'
    ]
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    region: 'Odisha',
    script: 'Odia',
    astrologyTradition: 'Kohinoor & Asali Samanta Chandrasekhar Panjika',
    greeting: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର ବୈଦିକ ଜ୍ୟୋତିଷ AI ପଣ୍ଡିତ। ଆପଣଙ୍କ ଜନ୍ମ କୋଷ୍ଠୀ ବିଷୟରେ କ’ଣ ଜାଣିବାକୁ ଚାହାନ୍ତି?',
    sampleQuestionsEasy: [
      'ମୋର ବିବାହ କେବେ ହେବ ଏବଂ ଜୀବନସାଥୀ କିପରି ମିଳିବେ?',
      'ମୋର ଚାକିରି କିମ୍ବା ବ୍ୟବସାୟରେ କେବେ ଉନ୍ନତି ହେବ?',
      'ମୋ ପାଇଁ କେଉଁ ରତ୍ନ ଧାରଣ କରିବା ଶୁଭଙ୍କର?',
      'ବର୍ତ୍ତମାନ ଚାଲୁଥିବା ମହାଦଶାର ପ୍ରଭାବ କ’ଣ ରହିବ?'
    ],
    sampleQuestionsComplex: [
      'ନବାଂଶ (D-9) ଏବଂ ଦଶମାଂଶ (D-10) କୁଣ୍ଡଳୀ ଆଧାରରେ ରାଜଯୋଗର ବିଶ୍ଳେଷଣ କରନ୍ତୁ।',
      'ଷୋଡ଼ଶବର୍ଗ ବଳ ଅନୁଯାୟୀ କାର୍ଯ୍ୟକ୍ଷେତ୍ରରେ ପଦୋନ୍ନତି କେବେ ସମ୍ଭବ?'
    ]
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'Assam & North East',
    script: 'Bengali-Assamese',
    astrologyTradition: 'Kamakhya Tantra & Pragjyotishpura Classical Jyotish',
    greeting: 'নমস্কাৰ! মই আপোনাৰ বৈদিক জ্যোতিষ AI পণ্ডিত। আপোনাৰ জন্ম কুণ্ডলী সন্দৰ্ভত আপুনি কি জানিব বিচাৰে?',
    sampleQuestionsEasy: [
      'মোৰ বিবাহ কেতিয়া হ’ব আৰু জীৱনসংগী কেনেকুৱা হ’ব?',
      'মোৰ চাকৰি বা ব্যৱসায়ত কেতিয়া উন্নতি হ’ব?',
      'মোৰ বাবে কোনটো ৰত্ন ধাৰণ কৰাটো শুভ হ’ব?',
      'বৰ্তমানৰ মহাদশাই মোৰ জীৱনত কি প্ৰভাৱ পেলাব?'
    ],
    sampleQuestionsComplex: [
      'প্ৰাগজ্যোতিষপুৰ পৰম্পৰামতে দশমাংশ (D-10) আৰু নৱমাংশ (D-9) বিশ্লেষণ কৰক।',
      'বিপৰীত ৰাজযোগ আৰু শনিৰ মহাদশাৰ প্ৰভাৱ ব্যাখ্যা কৰক।'
    ]
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'Jammu & Kashmir, Telangana, Delhi, UP, Bihar',
    script: 'Perso-Arabic',
    astrologyTradition: 'Ilm-e-Najoom & Tajik Neelakanthi (Perso-Sanskrit Astrology)',
    greeting: 'آداب! میں آپ کا ویدک علم نجوم (Astrology) اے آئی پنڈت ہوں۔ آپ اپنے زائچہ (Kundali) کے بارے میں کیا جاننا چاہتے ہیں؟',
    sampleQuestionsEasy: [
      'میری شادی کب ہوگی اور جیون ساتھی کیسا ہوگا؟',
      'میرے روزگار اور کیریئر میں ترقی کب حاصل ہوگی؟',
      'میرے لیے کون سا نگینہ (Gemstone) موافق رہے گا؟',
      'موجودہ دور سیارگان (Dasha) کا کیا اثر پڑے گا؟'
    ],
    sampleQuestionsComplex: [
      'تاجک نیلا کنٹھی کے سہام اور قران سیارگان کی روشنی میں مستقبل بیان کریں۔',
      'دہمامشہ (D10) اور نومانشہ (D9) سے سرکاری ملازمت کے امکانات واضح کریں۔'
    ]
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    region: 'Mithila (Bihar & Nepal Terai)',
    script: 'Devanagari / Mithilakshar',
    astrologyTradition: 'Mithila Siddhanta, Vidyapati Jyotish & Panji Prabandha',
    greeting: 'प्रणाम! हम अहाँक वैदिक ज्योतिष AI पंडित छी। अपन जन्मपत्रिका (कुण्डली) विषय में की जानय चाहैत छी?',
    sampleQuestionsEasy: [
      'हमर विवाह कहिया धरि हेतैक आ जीवनसंगिनी केहन भेटतीह?',
      'हमर नौकरी आ व्यापार में कहिया उन्नति हेतैक?',
      'हमरा लेल कोन रत्न धारण करब शुभ रहत?'
    ],
    sampleQuestionsComplex: [
      'मिथिला पञ्चाङ्ग परम्परा अनुसार नवमांश आ दशमांश कुण्डलीक राजयोग बतौब।'
    ]
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    region: 'Jharkhand, West Bengal, Odisha, Bihar',
    script: 'Ol Chiki',
    astrologyTradition: 'Traditional Eastern Astro-Cosmology & Parashari',
    greeting: 'ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ ᱟᱢᱟᱜ ᱵᱮᱫᱤᱠ ᱡᱭᱚᱛᱤᱥ AI ᱯᱚᱸᱰᱤᱛ ᱠᱟᱱᱟᱹᱧ᱾ ᱟᱢᱟᱜ ᱠᱩᱱᱰᱞᱤ ᱵᱟᱵᱚᱛ ᱪᱮᱫ ᱵᱟᱰᱟᱭ ᱥᱟᱱᱟᱭᱮᱫ ᱢᱮᱭᱟ?',
    sampleQuestionsEasy: [
      'ᱤᱧᱟᱜ ᱵᱟᱯᱞᱟ ᱛᱤᱥ ᱦᱩᱭᱩᱜ-ᱟ?',
      'ᱤᱧᱟᱜ ᱠᱟᱹᱢᱤ ᱟᱨ ᱠᱟᱹᱣᱰᱤ ᱟᱹᱨᱤ ᱚᱵᱚᱥᱛᱟ ᱛᱤᱥ ᱵᱮᱥᱚᱜ-ᱟ?'
    ],
    sampleQuestionsComplex: [
      'ᱱᱚᱣᱟᱢᱥᱟ (D9) ᱟᱨ ᱫᱚᱥᱟᱢᱥᱟ (D10) ᱨᱮ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱨᱮᱱᱟᱜ ᱵᱤᱪᱟᱹᱨ ᱞᱟᱹᱭ ᱢᱮ᱾'
    ]
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कॉशुर',
    region: 'Jammu & Kashmir',
    script: 'Perso-Arabic / Sharada / Devanagari',
    astrologyTradition: 'Kashmiri Shaiva Jyotish & Sharada Astronomical Heritage',
    greeting: 'नमस्कार / آداب! بہ چھُس تُہُند ویدک جوتش AI پنڈت۔ تُہۍ کیا چِھو پَننِس کُنڈلی مُتعلِق زانُن یژھان؟',
    sampleQuestionsEasy: [
      'مےٚ کَر گژھِ خاندر تہٕ رَفِیقِ حیات کِتھ پٲٹھۍ آسِ؟',
      'مؠانہِ روزگارَس منٛز کَر یِیہِ بَرکت تہٕ تَرقی؟'
    ],
    sampleQuestionsComplex: [
      'نومانشہ (D-9) تہٕ راج یوگَن ہُنٛد اثر کِتھ پٲٹھۍ پؠیہِ؟'
    ]
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    region: 'Sikkim, Darjeeling, Uttarakhand, Nepal',
    script: 'Devanagari',
    astrologyTradition: 'Himalayan Vedic Jyotish & Patro Siddhanta',
    greeting: 'नमस्ते! म तपाईंको वैदिक ज्योतिष AI पण्डित हुँ। तपाईंको जन्मकुण्डली बारे के जान्न चाहनुहुन्छ?',
    sampleQuestionsEasy: [
      'मेरो विवाह कहिले हुन्छ र जीवनसाथी कस्तो मिल्छ?',
      'मेरो जागिर वा व्यवसायमा कहिले प्रगति हुन्छ?',
      'मेरो लागि कुन रत्न लगाउनु शुभ रहन्छ?'
    ],
    sampleQuestionsComplex: [
      'नवमांश र दशमांश कुण्डलीको आधारमा भाग्य र करियरको विश्लेषण गरिदिनुहोस्।'
    ]
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    region: 'Goa, Coastal Karnataka & Maharashtra',
    script: 'Devanagari / Roman / Kannada',
    astrologyTradition: 'Goan & Karavali Parashari Jyotish',
    greeting: 'नमस्कार! हांव तुमचो वैदिक ज्योतिष AI पंडित. तुमगेल्या कुंडली विशीं तुमकां कितें जाणून घेवपाची इत्सा आसा?',
    sampleQuestionsEasy: [
      'म्हजें लग्न केन्ना जातलें ಆನಿ जीवनसाथी कसो मेळतलो?',
      'म्हज्या नोकरे खातीर वा व्यवसाया खातीर बरें फळ केन्ना मेळतलें?'
    ],
    sampleQuestionsComplex: [
      'नवमांश (D-9) कुंडली वरून वैवाहिक सुखाचे विवरण सांगात.'
    ]
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'सिन्धी',
    region: 'Sindhi Community across India',
    script: 'Devanagari / Perso-Arabic',
    astrologyTradition: 'Sindhi Tipno & Vedic Traditions',
    greeting: 'प्रणाम / سلام! آءٌ اوهانجو ويدڪ جوتش AI پنڊت آهيان. اوهان پنهنجي جنم ڪنڊليءَ بابت ڇا ڄاڻڻ چاهيو ٿا؟',
    sampleQuestionsEasy: [
      'منهنجي شادي ڪڏهن ٿيندي ۽ گهر واري ڪهڙي ملندي؟',
      'ڪاروبار ۽ روزگار ۾ ڪڏهن ترقي ايندي؟'
    ],
    sampleQuestionsComplex: [
      'نومانش ۽ دشامش ڪنڊليءَ موجب راج يوگ جي پڇا ڳاڇا ڪريو.'
    ]
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    region: 'Jammu Region & Himachal Pradesh',
    script: 'Devanagari',
    astrologyTradition: 'Duggar Vedic Jyotish',
    greeting: 'नमस्ते! म्हूँ थुआढ़ा वैदिक ज्योतिष AI पंडित आँ। अपनी जन्मपत्री बारे तुस केह् जानना चाह्ने ओ?',
    sampleQuestionsEasy: [
      'मेरा ब्याह् कदूं होग ते जीवनसाथी केह्-जेहा लब्भग?',
      'मेरी नौकरी चा तरक्की कदूं लग्गग?'
    ],
    sampleQuestionsComplex: [
      'नवमांश (D-9) ते दशमांश (D-10) चा राजयोगें दा असर दस्सो।'
    ]
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    region: 'Manipur',
    script: 'Meitei Mayek / Bengali',
    astrologyTradition: 'Manipuri Thawanmichak Astro-Vedic Lore',
    greeting: 'খুরুমজরি! ঐহাক নহাক্কী বৈদিক জ্যোতিষ AI পন্দিৎনি। নহাক্কী পোকপগী কুন্দলীগী মরমদা করি খঙবা পাম্বগে?',
    sampleQuestionsEasy: [
      'ঐগী লুহোংবা কৈদৌঙে ওইগনি?',
      'ঐগী থবক্তা কৈদৌঙে কান্নবা ফংগনি?'
    ],
    sampleQuestionsComplex: [
      'নবমাংশ (D-9) দা সপ্তম ভাব অমসুং বিবাহগী ভাগ্য নৈনবিযু।'
    ]
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    region: 'Bodoland (Assam)',
    script: 'Devanagari',
    astrologyTradition: 'Bodo Indigenous Solar-Lunar Timekeeping & Vedic Parashari',
    greeting: 'खुलुमबाय! आं नोंथांनि बैदिक ज्यथिस AI फण्डित। नोंथांनि जोनोम कुण्डलिनि सोमन्दै नोंथाङा मा मिनथिंनो लुबैयो?',
    sampleQuestionsEasy: [
      'आंनि हाबाया माब्ला जागोन?',
      'आंनि साख्रि एबा हाबानि थाखाय माब्ला मोजां जागोन?'
    ],
    sampleQuestionsComplex: [
      'नबमांश (D-9) कुण्डलिनि गेजेरजों मोजां सम आरो भाग्यनि गुवारै खौरां हो।'
    ]
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Pan-Indian & Global Diaspora',
    script: 'Latin',
    astrologyTradition: 'Vedic Astrological Science (Brihat Parashara & Jaimini)',
    greeting: 'Namaste! I am your Vedic Astrology AI Pandit. How may I assist you with your Janam Kundali today?',
    sampleQuestionsEasy: [
      'When is my marriage indicated and how will my spouse be?',
      'When will I see a breakthrough or promotion in my career?',
      'Do I have foreign travel or foreign settlement yogas?',
      'Which gemstone is most auspicious for me to wear?',
      'How is my current Vimshottari Mahadasha influencing my life?'
    ],
    sampleQuestionsComplex: [
      'Analyze the Atmakaraka and Amatyakaraka disposition across D1 (Rashi) and D9 (Navamsha).',
      'Examine the 10th lord in D10 (Dashamsha) and verify Rajayogas for executive authority.',
      'Assess Shodashamsha (D-16) and Vimsopaka Bala strength for conveyances and vehicles.',
      'Explain the occurrence of Viparita Raja Yoga during 6th/8th lord antardashas.'
    ]
  }
];

export function getLanguageMeta(code: IndianLanguageCode): LanguageMeta {
  const found = INDIAN_LANGUAGES.find((l) => l.code === code);
  return found || INDIAN_LANGUAGES[0]; // fallback Hindi
}
