// ORCA UI strings. English is the complete source dictionary; other languages
// override the keys they translate and fall back to English for the rest
// (App merges `{ ...UI_STRINGS.EN, ...UI_STRINGS[lang] }`).

export const LANG_CODES = ['EN', 'हि', 'मरा', 'த', 'മ', 'తె', 'বা']

// Short code -> full language name expected by the backend query pipeline.
export const LANG_FULL = {
  EN: 'english',
  हि: 'hindi',
  मरा: 'marathi',
  த: 'tamil',
  മ: 'malayalam',
  తె: 'telugu',
  বা: 'bengali',
}

// Short code -> BCP-47 tag for the Web Speech API.
export const LANG_SPEECH = {
  EN: 'en-IN',
  हि: 'hi-IN',
  मरा: 'mr-IN',
  த: 'ta-IN',
  മ: 'ml-IN',
  తె: 'te-IN',
  বা: 'bn-IN',
}

export const UI_STRINGS = {
  EN: {
    // Original keys (kept for compatibility)
    safe: 'SAFE', caution: 'CAUTION', danger: 'DANGER',
    near: 'near', sst: 'SST', wind: 'Wind', waves: 'Waves', chla: 'Chl-a',
    asOf: 'as of', analyzing: 'ORCA is analyzing…',
    placeholder: 'Where is the fish?',
    defaultText: 'Tap a zone on the map, or ask ORCA a question',
    likelyCatch: 'Likely catch', why: 'Why', conditions: 'Conditions',
    confidence: 'Confidence', howItKnows: 'How ORCA knows this',
    activeAlerts: 'Active Alerts',

    // Navigation
    navHome: 'Home', navMap: 'Ocean Map', navAsk: 'Ask ORCA',
    navAlerts: 'Alerts', navReports: 'Reports', navSettings: 'Settings',
    navMore: 'More', logout: 'Log out',

    // Header / identity
    productName: 'Ocean Operations Center',
    searchPlaceholder: 'Locate a port or fishing ground…',
    profile: 'Skipper', homePort: 'Home port', vessel: 'Vessel',

    // System status
    systemLive: 'LIVE', systemOffline: 'OFFLINE', systemConnecting: 'LINKING',

    // Safety
    safetyTitle: 'Sea Safety', safetyUnknown: 'AWAITING DATA',
    lastUpdate: 'Last update', craftAdvisory: 'Craft advisory',

    // Ocean conditions
    conditionsTitle: 'Ocean Conditions', location: 'Location',
    metricSst: 'Sea Surface Temp', metricWind: 'Wind Speed',
    metricWave: 'Wave Height', metricChl: 'Chlorophyll-a',
    source: 'Source', optimal: 'optimal band',

    // AI insights
    insightsTitle: 'AI Insights',
    noInsights: 'No insights available right now.',
    insightPfzTitle: 'High-probability fishing zone',
    insightSafeTitle: 'Favorable ocean conditions',
    insightRiskTitle: 'Ocean risk detected',
    insightSafetyWarnTitle: 'Safety warning',
    insightAlertTitle: 'Recent advisory',
    viewOnMap: 'View on map', askAboutThis: 'Ask ORCA',

    // Map
    layers: 'Layers', layerPfz: 'PFZ Zones', layerSea: 'Sea State',
    live: 'LIVE', recenter: 'Recenter on vessel',
    zoomIn: 'Zoom in', zoomOut: 'Zoom out',
    legendPfz: 'Fishing zone', legendSafe: 'Safe', legendCaution: 'Caution',
    legendDanger: 'Danger',
    legendVessel: 'Your vessel', legendRoute: 'Route', legendHazard: 'Hazard zone',
    seaCalm: 'Calm', seaModerate: 'Moderate', seaRough: 'Rough',

    // Ask ORCA
    askTitle: 'Ask ORCA',
    askHint: 'Fish · safety · routes · ocean conditions — in your language',
    send: 'Send', listening: 'Listening…',
    voiceUnsupported: 'Voice input is not supported on this device',

    // Response
    orcaAnswer: 'ORCA', evidence: 'Evidence',
    routeDistance: 'Distance', routeEta: 'Est. time', routeAvoiding: 'Avoiding',
    hrs: 'hrs', km: 'km',
    stepRunning: 'running', stepDone: 'done',

    // States
    loadingDashboard: 'Establishing link to ORCA…',
    mapLoading: 'Loading ocean chart…',
    backendDown: 'ORCA is offline',
    backendDownMsg:
      'Cannot reach the ORCA intelligence service. Make sure the backend is running on port 8000.',
    queryFailed: 'ORCA could not process that',
    queryTimeout: 'ORCA is taking too long',
    queryFailedMsg:
      'The request failed. The AI pipeline or Ollama service may be unavailable — try again.',
    queryTimeoutMsg:
      'The AI pipeline did not respond in time. It may be busy — try again in a moment.',
    retry: 'Retry',
    emptyResponse: 'Ask ORCA a question or tap a zone on the map to begin.',

    // Alerts
    alertsTitle: 'Alerts', noAlerts: 'No active alerts.',

    // Reports
    reportTitle: 'Session Brief', reportGenerated: 'Generated',
    reportSafety: 'Safety status', reportTopZone: 'Top fishing zone',
    reportConditions: 'Conditions snapshot', reportAlerts: 'Active advisories',
    copyBrief: 'Copy brief', copied: 'Copied',

    // Settings
    settingsTitle: 'Settings', settingLanguage: 'Language',
    settingMotion: 'Motion', settingApi: 'API endpoint',
    settingStatus: 'Backend status',
    motionReduced: 'Reduced (device setting)', motionFull: 'Full',

    // Generic
    close: 'Close', clear: 'Clear',
  },

  हि: {
    safe: 'सुरक्षित', caution: 'सावधान', danger: 'खतरा',
    near: 'पास', sst: 'तापमान', wind: 'हवा', waves: 'लहरें', chla: 'क्लोरोफिल',
    asOf: 'के अनुसार', analyzing: 'ORCA विश्लेषण कर रहा है…',
    placeholder: 'मछली कहाँ है?',
    defaultText: 'नक्शे पर एक क्षेत्र टैप करें, या ORCA से पूछें',
    likelyCatch: 'संभावित मछली', why: 'क्यों', conditions: 'स्थितियाँ',
    confidence: 'विश्वास', howItKnows: 'ORCA यह कैसे जानता है',
    activeAlerts: 'सक्रिय अलर्ट',

    navHome: 'होम', navMap: 'महासागर नक्शा', navAsk: 'ORCA से पूछें',
    navAlerts: 'अलर्ट', navReports: 'रिपोर्ट', navSettings: 'सेटिंग्स',

    productName: 'महासागर संचालन केंद्र',
    searchPlaceholder: 'बंदरगाह या मछली क्षेत्र खोजें…',
    profile: 'कप्तान', homePort: 'गृह बंदरगाह', vessel: 'नौका',

    systemLive: 'लाइव', systemOffline: 'ऑफ़लाइन', systemConnecting: 'जोड़ रहे',

    safetyTitle: 'समुद्री सुरक्षा', safetyUnknown: 'डेटा प्रतीक्षारत',
    lastUpdate: 'अंतिम अपडेट', craftAdvisory: 'नौका सलाह',

    conditionsTitle: 'महासागर स्थितियाँ', location: 'स्थान',
    metricSst: 'सतह तापमान', metricWind: 'हवा गति',
    metricWave: 'लहर ऊँचाई', metricChl: 'क्लोरोफिल-ए',
    source: 'स्रोत', optimal: 'उत्तम सीमा',

    insightsTitle: 'AI अंतर्दृष्टि', noInsights: 'अभी कोई अंतर्दृष्टि नहीं।',
    insightPfzTitle: 'उच्च संभावना मछली क्षेत्र',
    insightSafeTitle: 'अनुकूल महासागर स्थितियाँ',
    insightRiskTitle: 'महासागर जोखिम',
    insightSafetyWarnTitle: 'सुरक्षा चेतावनी',
    insightAlertTitle: 'हालिया सलाह',
    viewOnMap: 'नक्शे पर देखें', askAboutThis: 'ORCA से पूछें',

    layers: 'परतें', layerPfz: 'PFZ क्षेत्र', layerSea: 'समुद्र स्थिति',
    live: 'लाइव', recenter: 'नौका पर केंद्रित करें',
    zoomIn: 'ज़ूम इन', zoomOut: 'ज़ूम आउट',
    legendPfz: 'मछली क्षेत्र', legendSafe: 'सुरक्षित', legendCaution: 'सावधान',
    legendDanger: 'खतरा',

    askTitle: 'ORCA से पूछें',
    askHint: 'मछली · सुरक्षा · मार्ग · महासागर स्थितियाँ — अपनी भाषा में',
    send: 'भेजें', listening: 'सुन रहा है…',
    voiceUnsupported: 'इस डिवाइस पर वॉइस इनपुट समर्थित नहीं है',

    orcaAnswer: 'ORCA', evidence: 'प्रमाण',
    routeDistance: 'दूरी', routeEta: 'अनुमानित समय', routeAvoiding: 'बचाव',
    hrs: 'घंटे', km: 'किमी',
    stepRunning: 'चल रहा', stepDone: 'पूर्ण',

    loadingDashboard: 'ORCA से संपर्क बना रहे हैं…',
    mapLoading: 'महासागर चार्ट लोड हो रहा है…',
    backendDown: 'ORCA ऑफ़लाइन है',
    backendDownMsg:
      'ORCA सेवा तक नहीं पहुँच सके। सुनिश्चित करें कि बैकएंड पोर्ट 8000 पर चल रहा है।',
    queryFailed: 'ORCA इसे संसाधित नहीं कर सका',
    queryTimeout: 'ORCA को बहुत समय लग रहा है',
    queryFailedMsg: 'अनुरोध विफल रहा। AI पाइपलाइन या Ollama अनुपलब्ध हो सकता है — पुनः प्रयास करें।',
    queryTimeoutMsg: 'AI पाइपलाइन ने समय पर उत्तर नहीं दिया। पुनः प्रयास करें।',
    retry: 'पुनः प्रयास',
    emptyResponse: 'शुरू करने के लिए ORCA से पूछें या नक्शे पर क्षेत्र टैप करें।',

    alertsTitle: 'अलर्ट', noAlerts: 'कोई सक्रिय अलर्ट नहीं।',

    reportTitle: 'सत्र सारांश', reportGenerated: 'निर्मित',
    reportSafety: 'सुरक्षा स्थिति', reportTopZone: 'शीर्ष मछली क्षेत्र',
    reportConditions: 'स्थिति स्नैपशॉट', reportAlerts: 'सक्रिय सलाह',
    copyBrief: 'सारांश कॉपी करें', copied: 'कॉपी किया',

    settingsTitle: 'सेटिंग्स', settingLanguage: 'भाषा',
    settingMotion: 'एनिमेशन', settingApi: 'API एंडपॉइंट',
    settingStatus: 'बैकएंड स्थिति',
    motionReduced: 'कम (डिवाइस सेटिंग)', motionFull: 'पूर्ण',

    close: 'बंद करें', clear: 'साफ़ करें',
  },

  मरा: {
    safe: 'सुरक्षित', caution: 'सावधान', danger: 'धोका',
    near: 'जवळ', sst: 'तापमान', wind: 'वारा', waves: 'लाटा', chla: 'क्लोरोफिल',
    asOf: 'च्या नुसार', analyzing: 'ORCA विश्लेषण करत आहे…',
    placeholder: 'मासे कुठे आहेत?',
    defaultText: 'नकाशावर एक झोन टॅप करा, किंवा ORCA ला विचारा',
    likelyCatch: 'संभाव्य मासे', why: 'का', conditions: 'स्थिती',
    confidence: 'खात्री', howItKnows: 'ORCA ला हे कसे समजते',
    activeAlerts: 'सक्रिय सूचना',

    navHome: 'होम', navMap: 'महासागर नकाशा', navAsk: 'ORCA ला विचारा',
    navAlerts: 'सूचना', navReports: 'अहवाल', navSettings: 'सेटिंग्ज',

    productName: 'महासागर परिचालन केंद्र',
    searchPlaceholder: 'बंदर किंवा मासेमारी क्षेत्र शोधा…',
    profile: 'कप्तान', homePort: 'गृह बंदर', vessel: 'नौका',

    systemLive: 'लाइव्ह', systemOffline: 'ऑफलाइन', systemConnecting: 'जोडत आहे',

    safetyTitle: 'सागरी सुरक्षा', safetyUnknown: 'डेटा प्रतीक्षेत',
    lastUpdate: 'शेवटचे अपडेट', craftAdvisory: 'नौका सल्ला',

    conditionsTitle: 'महासागर स्थिती', location: 'ठिकाण',
    metricSst: 'पृष्ठभाग तापमान', metricWind: 'वाऱ्याचा वेग',
    metricWave: 'लाटेची उंची', metricChl: 'क्लोरोफिल-ए',
    source: 'स्रोत', optimal: 'उत्तम पट्टा',

    insightsTitle: 'AI माहिती', noInsights: 'सध्या कोणतीही माहिती नाही.',
    insightPfzTitle: 'उच्च शक्यता मासेमारी क्षेत्र',
    insightSafeTitle: 'अनुकूल महासागर स्थिती',
    insightRiskTitle: 'महासागर धोका',
    insightSafetyWarnTitle: 'सुरक्षा इशारा',
    insightAlertTitle: 'अलीकडील सल्ला',
    viewOnMap: 'नकाशावर पहा', askAboutThis: 'ORCA ला विचारा',

    layers: 'स्तर', layerPfz: 'PFZ क्षेत्रे', layerSea: 'समुद्र स्थिती',
    live: 'लाइव्ह', recenter: 'नौकेवर केंद्रित करा',
    zoomIn: 'झूम इन', zoomOut: 'झूम आउट',
    legendPfz: 'मासेमारी क्षेत्र', legendSafe: 'सुरक्षित', legendCaution: 'सावधान',
    legendDanger: 'धोका',

    askTitle: 'ORCA ला विचारा',
    askHint: 'मासे · सुरक्षा · मार्ग · महासागर स्थिती — तुमच्या भाषेत',
    send: 'पाठवा', listening: 'ऐकत आहे…',
    voiceUnsupported: 'या डिव्हाइसवर व्हॉइस इनपुट समर्थित नाही',

    orcaAnswer: 'ORCA', evidence: 'पुरावा',
    routeDistance: 'अंतर', routeEta: 'अंदाजे वेळ', routeAvoiding: 'टाळत आहे',
    hrs: 'तास', km: 'किमी',
    stepRunning: 'सुरू', stepDone: 'पूर्ण',

    loadingDashboard: 'ORCA शी संपर्क साधत आहे…',
    mapLoading: 'महासागर चार्ट लोड होत आहे…',
    backendDown: 'ORCA ऑफलाइन आहे',
    backendDownMsg: 'ORCA सेवेपर्यंत पोहोचता आले नाही. बॅकएंड पोर्ट 8000 वर सुरू असल्याची खात्री करा.',
    queryFailed: 'ORCA यावर प्रक्रिया करू शकले नाही',
    queryTimeout: 'ORCA ला खूप वेळ लागत आहे',
    queryFailedMsg: 'विनंती अयशस्वी. AI पाइपलाइन किंवा Ollama अनुपलब्ध असू शकते — पुन्हा प्रयत्न करा.',
    queryTimeoutMsg: 'AI पाइपलाइनने वेळेत उत्तर दिले नाही. पुन्हा प्रयत्न करा.',
    retry: 'पुन्हा प्रयत्न',
    emptyResponse: 'सुरू करण्यासाठी ORCA ला विचारा किंवा नकाशावर क्षेत्र टॅप करा.',

    alertsTitle: 'सूचना', noAlerts: 'सक्रिय सूचना नाहीत.',

    reportTitle: 'सत्र सारांश', reportGenerated: 'तयार केले',
    reportSafety: 'सुरक्षा स्थिती', reportTopZone: 'प्रमुख मासेमारी क्षेत्र',
    reportConditions: 'स्थिती स्नॅपशॉट', reportAlerts: 'सक्रिय सल्ले',
    copyBrief: 'सारांश कॉपी करा', copied: 'कॉपी केले',

    settingsTitle: 'सेटिंग्ज', settingLanguage: 'भाषा',
    settingMotion: 'अ‍ॅनिमेशन', settingApi: 'API एंडपॉइंट',
    settingStatus: 'बॅकएंड स्थिती',
    motionReduced: 'कमी (डिव्हाइस सेटिंग)', motionFull: 'पूर्ण',

    close: 'बंद करा', clear: 'साफ करा',
  },

  த: {
    safe: 'பாதுகாப்பு', caution: 'கவனம்', danger: 'ஆபத்து',
    near: 'அருகில்', sst: 'வெப்பநிலை', wind: 'காற்று', waves: 'அலைகள்', chla: 'பச்சையம்',
    asOf: 'கணக்கின்படி', analyzing: 'ORCA பகுப்பாய்வு செய்கிறது…',
    placeholder: 'மீன் எங்கே?',
    defaultText: 'வரைபடத்தில் ஒரு பகுதியை தட்டவும் அல்லது ORCA-விடம் கேட்கவும்',
    likelyCatch: 'சாத்தியமான மீன்', why: 'ஏன்', conditions: 'நிபந்தனைகள்',
    confidence: 'நம்பிக்கை', howItKnows: 'ORCA எப்படி இதை அறிகிறது',
    activeAlerts: 'செயலில் உள்ள விழிப்பூட்டல்கள்',

    navHome: 'முகப்பு', navMap: 'கடல் வரைபடம்', navAsk: 'ORCA-விடம் கேள்',
    navAlerts: 'எச்சரிக்கைகள்', navReports: 'அறிக்கைகள்', navSettings: 'அமைப்புகள்',

    productName: 'கடல் செயற்பாட்டு மையம்',
    searchPlaceholder: 'துறைமுகம் அல்லது மீன்பிடி பகுதியைத் தேடு…',
    profile: 'கேப்டன்', homePort: 'சொந்த துறைமுகம்', vessel: 'படகு',

    systemLive: 'நேரலை', systemOffline: 'ஆஃப்லைன்', systemConnecting: 'இணைக்கிறது',

    safetyTitle: 'கடல் பாதுகாப்பு', safetyUnknown: 'தரவு எதிர்பார்ப்பு',
    lastUpdate: 'கடைசி புதுப்பிப்பு', craftAdvisory: 'படகு அறிவுரை',

    conditionsTitle: 'கடல் நிலைமைகள்', location: 'இடம்',
    metricSst: 'மேற்பரப்பு வெப்பநிலை', metricWind: 'காற்றின் வேகம்',
    metricWave: 'அலை உயரம்', metricChl: 'குளோரோஃபில்-ஏ',
    source: 'மூலம்', optimal: 'உகந்த வரம்பு',

    insightsTitle: 'AI நுண்ணறிவு', noInsights: 'தற்போது நுண்ணறிவு இல்லை.',
    insightPfzTitle: 'அதிக வாய்ப்புள்ள மீன்பிடி பகுதி',
    insightSafeTitle: 'சாதகமான கடல் நிலைமைகள்',
    insightRiskTitle: 'கடல் அபாயம்',
    insightSafetyWarnTitle: 'பாதுகாப்பு எச்சரிக்கை',
    insightAlertTitle: 'சமீபத்திய அறிவுரை',
    viewOnMap: 'வரைபடத்தில் காண்', askAboutThis: 'ORCA-விடம் கேள்',

    layers: 'அடுக்குகள்', layerPfz: 'PFZ பகுதிகள்', layerSea: 'கடல் நிலை',
    live: 'நேரலை', recenter: 'படகில் மையப்படுத்து',
    zoomIn: 'பெரிதாக்கு', zoomOut: 'சிறிதாக்கு',
    legendPfz: 'மீன்பிடி பகுதி', legendSafe: 'பாதுகாப்பு', legendCaution: 'கவனம்',
    legendDanger: 'ஆபத்து',

    askTitle: 'ORCA-விடம் கேள்',
    askHint: 'மீன் · பாதுகாப்பு · வழிகள் · கடல் நிலைமைகள் — உங்கள் மொழியில்',
    send: 'அனுப்பு', listening: 'கேட்கிறது…',
    voiceUnsupported: 'இந்த சாதனத்தில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை',

    orcaAnswer: 'ORCA', evidence: 'சான்று',
    routeDistance: 'தூரம்', routeEta: 'மதிப்பிடப்பட்ட நேரம்', routeAvoiding: 'தவிர்க்கிறது',
    hrs: 'மணி', km: 'கிமீ',
    stepRunning: 'இயங்குகிறது', stepDone: 'முடிந்தது',

    loadingDashboard: 'ORCA உடன் இணைப்பு ஏற்படுத்துகிறது…',
    mapLoading: 'கடல் விளக்கப்படம் ஏற்றுகிறது…',
    backendDown: 'ORCA ஆஃப்லைனில் உள்ளது',
    backendDownMsg:
      'ORCA சேவையை அணுக முடியவில்லை. பின்தளம் போர்ட் 8000 இல் இயங்குகிறதா என சரிபார்க்கவும்.',
    queryFailed: 'ORCA அதைச் செயலாக்க முடியவில்லை',
    queryTimeout: 'ORCA அதிக நேரம் எடுக்கிறது',
    queryFailedMsg: 'கோரிக்கை தோல்வி. AI பைப்லைன் அல்லது Ollama கிடைக்கவில்லை — மீண்டும் முயற்சி செய்.',
    queryTimeoutMsg: 'AI பைப்லைன் சரியான நேரத்தில் பதிலளிக்கவில்லை. மீண்டும் முயற்சி செய்.',
    retry: 'மீண்டும் முயற்சி',
    emptyResponse: 'தொடங்க ORCA-விடம் கேள் அல்லது வரைபடத்தில் ஒரு பகுதியைத் தட்டு.',

    alertsTitle: 'எச்சரிக்கைகள்', noAlerts: 'செயலில் எச்சரிக்கைகள் இல்லை.',

    reportTitle: 'அமர்வு சுருக்கம்', reportGenerated: 'உருவாக்கப்பட்டது',
    reportSafety: 'பாதுகாப்பு நிலை', reportTopZone: 'சிறந்த மீன்பிடி பகுதி',
    reportConditions: 'நிலை ஸ்னாப்ஷாட்', reportAlerts: 'செயலில் அறிவுரைகள்',
    copyBrief: 'சுருக்கத்தை நகலெடு', copied: 'நகலெடுக்கப்பட்டது',

    settingsTitle: 'அமைப்புகள்', settingLanguage: 'மொழி',
    settingMotion: 'அசைவூட்டம்', settingApi: 'API முனை',
    settingStatus: 'பின்தள நிலை',
    motionReduced: 'குறைக்கப்பட்டது (சாதன அமைப்பு)', motionFull: 'முழு',

    close: 'மூடு', clear: 'அழி',
  },

  മ: {
    safe: 'സുരക്ഷിതം', caution: 'ശ്രദ്ധിക്കുക', danger: 'അപകടം',
    near: 'സമീപം', sst: 'താപനില', wind: 'കാറ്റ്', waves: 'തിരമാല', chla: 'ക്ലോറോഫിൽ',
    asOf: 'പ്രകാരം', analyzing: 'ORCA വിശകലനം ചെയ്യുന്നു…',
    placeholder: 'മീൻ എവിടെയാണ്?',
    defaultText: 'മാപ്പിൽ ഒരു മേഖല ടാപ്പ് ചെയ്യുക, അല്ലെങ്കിൽ ORCA യോട് ചോദിക്കുക',
    likelyCatch: 'സാധ്യതയുള്ള മത്സ്യം', why: 'എന്തുകൊണ്ട്', conditions: 'സാഹചര്യങ്ങൾ',
    confidence: 'ഉറപ്പ്', howItKnows: 'ORCA എങ്ങനെ അറിയുന്നു',
    activeAlerts: 'സജീവ മുന്നറിയിപ്പുകൾ',

    navHome: 'ഹോം', navMap: 'സമുദ്ര മാപ്പ്', navAsk: 'ORCA യോട് ചോദിക്കൂ',
    navAlerts: 'മുന്നറിയിപ്പുകൾ', navReports: 'റിപ്പോർട്ടുകൾ', navSettings: 'ക്രമീകരണങ്ങൾ',

    productName: 'സമുദ്ര ഓപ്പറേഷൻസ് സെന്റർ',
    searchPlaceholder: 'തുറമുഖമോ മത്സ്യബന്ധന മേഖലയോ തിരയുക…',
    profile: 'ക്യാപ്റ്റൻ', homePort: 'ഹോം തുറമുഖം', vessel: 'വള്ളം',

    systemLive: 'ലൈവ്', systemOffline: 'ഓഫ്‌ലൈൻ', systemConnecting: 'ബന്ധിപ്പിക്കുന്നു',

    safetyTitle: 'കടൽ സുരക്ഷ', safetyUnknown: 'ഡാറ്റ കാത്തിരിക്കുന്നു',
    lastUpdate: 'അവസാന അപ്‌ഡേറ്റ്', craftAdvisory: 'വള്ള നിർദേശം',

    conditionsTitle: 'സമുദ്ര സാഹചര്യങ്ങൾ', location: 'സ്ഥലം',
    metricSst: 'ഉപരിതല താപനില', metricWind: 'കാറ്റിന്റെ വേഗത',
    metricWave: 'തിരയുടെ ഉയരം', metricChl: 'ക്ലോറോഫിൽ-എ',
    source: 'ഉറവിടം', optimal: 'അനുയോജ്യ പരിധി',

    insightsTitle: 'AI ഉൾക്കാഴ്ചകൾ', noInsights: 'ഇപ്പോൾ ഉൾക്കാഴ്ചകളില്ല.',
    insightPfzTitle: 'ഉയർന്ന സാധ്യതയുള്ള മത്സ്യബന്ധന മേഖല',
    insightSafeTitle: 'അനുകൂല സമുദ്ര സാഹചര്യങ്ങൾ',
    insightRiskTitle: 'സമുദ്ര അപകടസാധ്യത',
    insightSafetyWarnTitle: 'സുരക്ഷാ മുന്നറിയിപ്പ്',
    insightAlertTitle: 'സമീപകാല നിർദേശം',
    viewOnMap: 'മാപ്പിൽ കാണുക', askAboutThis: 'ORCA യോട് ചോദിക്കൂ',

    layers: 'ലെയറുകൾ', layerPfz: 'PFZ മേഖലകൾ', layerSea: 'കടൽ നില',
    live: 'ലൈവ്', recenter: 'വള്ളത്തിൽ കേന്ദ്രീകരിക്കുക',
    zoomIn: 'സൂം ഇൻ', zoomOut: 'സൂം ഔട്ട്',
    legendPfz: 'മത്സ്യബന്ധന മേഖല', legendSafe: 'സുരക്ഷിതം', legendCaution: 'ശ്രദ്ധിക്കുക',
    legendDanger: 'അപകടം',

    askTitle: 'ORCA യോട് ചോദിക്കൂ',
    askHint: 'മീൻ · സുരക്ഷ · വഴികൾ · സമുദ്ര സാഹചര്യങ്ങൾ — നിങ്ങളുടെ ഭാഷയിൽ',
    send: 'അയയ്ക്കുക', listening: 'കേൾക്കുന്നു…',
    voiceUnsupported: 'ഈ ഉപകരണത്തിൽ വോയ്‌സ് ഇൻപുട്ട് പിന്തുണയ്ക്കുന്നില്ല',

    orcaAnswer: 'ORCA', evidence: 'തെളിവ്',
    routeDistance: 'ദൂരം', routeEta: 'കണക്കാക്കിയ സമയം', routeAvoiding: 'ഒഴിവാക്കുന്നു',
    hrs: 'മണിക്കൂർ', km: 'കിമീ',
    stepRunning: 'നടക്കുന്നു', stepDone: 'പൂർത്തിയായി',

    loadingDashboard: 'ORCA യുമായി ബന്ധം സ്ഥാപിക്കുന്നു…',
    mapLoading: 'സമുദ്ര ചാർട്ട് ലോഡ് ചെയ്യുന്നു…',
    backendDown: 'ORCA ഓഫ്‌ലൈനാണ്',
    backendDownMsg:
      'ORCA സേവനത്തിലേക്ക് എത്താനായില്ല. ബാക്കെൻഡ് പോർട്ട് 8000-ൽ പ്രവർത്തിക്കുന്നുവെന്ന് ഉറപ്പാക്കുക.',
    queryFailed: 'ORCA ന് അത് പ്രോസസ്സ് ചെയ്യാനായില്ല',
    queryTimeout: 'ORCA വളരെ സമയമെടുക്കുന്നു',
    queryFailedMsg: 'അഭ്യർത്ഥന പരാജയപ്പെട്ടു. AI പൈപ്പ്‌ലൈൻ അല്ലെങ്കിൽ Ollama ലഭ്യമല്ല — വീണ്ടും ശ്രമിക്കുക.',
    queryTimeoutMsg: 'AI പൈപ്പ്‌ലൈൻ സമയത്ത് പ്രതികരിച്ചില്ല. വീണ്ടും ശ്രമിക്കുക.',
    retry: 'വീണ്ടും ശ്രമിക്കുക',
    emptyResponse: 'തുടങ്ങാൻ ORCA യോട് ചോദിക്കൂ അല്ലെങ്കിൽ മാപ്പിൽ ഒരു മേഖല ടാപ്പ് ചെയ്യുക.',

    alertsTitle: 'മുന്നറിയിപ്പുകൾ', noAlerts: 'സജീവ മുന്നറിയിപ്പുകളില്ല.',

    reportTitle: 'സെഷൻ സംഗ്രഹം', reportGenerated: 'സൃഷ്ടിച്ചത്',
    reportSafety: 'സുരക്ഷാ നില', reportTopZone: 'മുൻനിര മത്സ്യബന്ധന മേഖല',
    reportConditions: 'സാഹചര്യ സ്നാപ്‌ഷോട്ട്', reportAlerts: 'സജീവ നിർദേശങ്ങൾ',
    copyBrief: 'സംഗ്രഹം പകർത്തുക', copied: 'പകർത്തി',

    settingsTitle: 'ക്രമീകരണങ്ങൾ', settingLanguage: 'ഭാഷ',
    settingMotion: 'ആനിമേഷൻ', settingApi: 'API എൻഡ്‌പോയിന്റ്',
    settingStatus: 'ബാക്കെൻഡ് നില',
    motionReduced: 'കുറച്ചു (ഉപകരണ ക്രമീകരണം)', motionFull: 'പൂർണം',

    close: 'അടയ്ക്കുക', clear: 'മായ്ക്കുക',
  },

  తె: {
    safe: 'సురక్షితం', caution: 'హెచ్చరిక', danger: 'ప్రమాదం',
    near: 'దగ్గర', sst: 'ఉష్ణోగ్రత', wind: 'గాలి', waves: 'అలలు', chla: 'క్లోరోఫిల్',
    asOf: 'ప్రకారం', analyzing: 'ORCA విశ్లేషిస్తోంది…',
    placeholder: 'చేప ఎక్కడ ఉంది?',
    defaultText: 'మ్యాప్‌పై జోన్‌ను నొక్కండి లేదా ORCA ను అడగండి',
    likelyCatch: 'సాధ్యమయ్యే చేప', why: 'ఎందుకు', conditions: 'పరిస్థితులు',
    confidence: 'నమ్మకం', howItKnows: 'ORCA కు ఎలా తెలుసు',
    activeAlerts: 'క్రియాశీల హెచ్చరికలు',

    navHome: 'హోమ్', navMap: 'సముద్ర మ్యాప్', navAsk: 'ORCA ను అడగండి',
    navAlerts: 'హెచ్చరికలు', navReports: 'నివేదికలు', navSettings: 'సెట్టింగ్‌లు',

    productName: 'సముద్ర కార్యకలాపాల కేంద్రం',
    searchPlaceholder: 'ఓడరేవు లేదా చేపల ప్రాంతాన్ని కనుగొనండి…',
    profile: 'కెప్టెన్', homePort: 'స్వస్థల ఓడరేవు', vessel: 'పడవ',

    systemLive: 'లైవ్', systemOffline: 'ఆఫ్‌లైన్', systemConnecting: 'కలుపుతోంది',

    safetyTitle: 'సముద్ర భద్రత', safetyUnknown: 'డేటా కోసం వేచి ఉంది',
    lastUpdate: 'చివరి నవీకరణ', craftAdvisory: 'పడవ సలహా',

    conditionsTitle: 'సముద్ర పరిస్థితులు', location: 'ప్రదేశం',
    metricSst: 'ఉపరితల ఉష్ణోగ్రత', metricWind: 'గాలి వేగం',
    metricWave: 'అల ఎత్తు', metricChl: 'క్లోరోఫిల్-ఎ',
    source: 'మూలం', optimal: 'అనుకూల పరిధి',

    insightsTitle: 'AI అంతర్దృష్టులు', noInsights: 'ప్రస్తుతం అంతర్దృష్టులు లేవు.',
    insightPfzTitle: 'అధిక అవకాశం ఉన్న చేపల ప్రాంతం',
    insightSafeTitle: 'అనుకూల సముద్ర పరిస్థితులు',
    insightRiskTitle: 'సముద్ర ప్రమాదం',
    insightSafetyWarnTitle: 'భద్రతా హెచ్చరిక',
    insightAlertTitle: 'ఇటీవలి సలహా',
    viewOnMap: 'మ్యాప్‌లో చూడండి', askAboutThis: 'ORCA ను అడగండి',

    layers: 'పొరలు', layerPfz: 'PFZ ప్రాంతాలు', layerSea: 'సముద్ర స్థితి',
    live: 'లైవ్', recenter: 'పడవపై కేంద్రీకరించండి',
    zoomIn: 'జూమ్ ఇన్', zoomOut: 'జూమ్ అవుట్',
    legendPfz: 'చేపల ప్రాంతం', legendSafe: 'సురక్షితం', legendCaution: 'హెచ్చరిక',
    legendDanger: 'ప్రమాదం',

    askTitle: 'ORCA ను అడగండి',
    askHint: 'చేప · భద్రత · మార్గాలు · సముద్ర పరిస్థితులు — మీ భాషలో',
    send: 'పంపండి', listening: 'వింటోంది…',
    voiceUnsupported: 'ఈ పరికరంలో వాయిస్ ఇన్‌పుట్ మద్దతు లేదు',

    orcaAnswer: 'ORCA', evidence: 'ఆధారం',
    routeDistance: 'దూరం', routeEta: 'అంచనా సమయం', routeAvoiding: 'తప్పించుకుంటోంది',
    hrs: 'గంటలు', km: 'కిమీ',
    stepRunning: 'నడుస్తోంది', stepDone: 'పూర్తయింది',

    loadingDashboard: 'ORCA తో అనుసంధానం ఏర్పరుస్తోంది…',
    mapLoading: 'సముద్ర చార్ట్ లోడ్ అవుతోంది…',
    backendDown: 'ORCA ఆఫ్‌లైన్‌లో ఉంది',
    backendDownMsg:
      'ORCA సేవను చేరుకోలేకపోయాము. బ్యాకెండ్ పోర్ట్ 8000లో నడుస్తోందని నిర్ధారించుకోండి.',
    queryFailed: 'ORCA దాన్ని ప్రాసెస్ చేయలేకపోయింది',
    queryTimeout: 'ORCA చాలా సమయం తీసుకుంటోంది',
    queryFailedMsg: 'అభ్యర్థన విఫలమైంది. AI పైప్‌లైన్ లేదా Ollama అందుబాటులో లేదు — మళ్ళీ ప్రయత్నించండి.',
    queryTimeoutMsg: 'AI పైప్‌లైన్ సకాలంలో స్పందించలేదు. మళ్ళీ ప్రయత్నించండి.',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    emptyResponse: 'ప్రారంభించడానికి ORCA ను అడగండి లేదా మ్యాప్‌పై ఒక జోన్‌ను నొక్కండి.',

    alertsTitle: 'హెచ్చరికలు', noAlerts: 'క్రియాశీల హెచ్చరికలు లేవు.',

    reportTitle: 'సెషన్ సారాంశం', reportGenerated: 'రూపొందించబడింది',
    reportSafety: 'భద్రతా స్థితి', reportTopZone: 'అగ్ర చేపల ప్రాంతం',
    reportConditions: 'పరిస్థితి స్నాప్‌షాట్', reportAlerts: 'క్రియాశీల సలహాలు',
    copyBrief: 'సారాంశం కాపీ చేయండి', copied: 'కాపీ చేయబడింది',

    settingsTitle: 'సెట్టింగ్‌లు', settingLanguage: 'భాష',
    settingMotion: 'యానిమేషన్', settingApi: 'API ఎండ్‌పాయింట్',
    settingStatus: 'బ్యాకెండ్ స్థితి',
    motionReduced: 'తగ్గించబడింది (పరికర సెట్టింగ్)', motionFull: 'పూర్తి',

    close: 'మూసివేయండి', clear: 'తొలగించండి',
  },

  বা: {
    safe: 'নিরাপদ', caution: 'সতর্কতা', danger: 'বিপদ',
    near: 'কাছে', sst: 'তাপমাত্রা', wind: 'বাতাস', waves: 'ঢেউ', chla: 'ক্লোরোফিল',
    asOf: 'অনুযায়ী', analyzing: 'ORCA বিশ্লেষণ করছে…',
    placeholder: 'মাছ কোথায়?',
    defaultText: 'মানচিত্রে একটি জোন ট্যাপ করুন বা ORCA কে জিজ্ঞাসা করুন',
    likelyCatch: 'সম্ভাব্য মাছ', why: 'কেন', conditions: 'শর্তাবলী',
    confidence: 'আত্মবিশ্বাস', howItKnows: 'ORCA কিভাবে জানে',
    activeAlerts: 'সক্রিয় সতর্কতা',

    navHome: 'হোম', navMap: 'সমুদ্র মানচিত্র', navAsk: 'ORCA কে জিজ্ঞাসা করুন',
    navAlerts: 'সতর্কতা', navReports: 'রিপোর্ট', navSettings: 'সেটিংস',

    productName: 'সমুদ্র অপারেশন কেন্দ্র',
    searchPlaceholder: 'বন্দর বা মাছ ধরার এলাকা খুঁজুন…',
    profile: 'ক্যাপ্টেন', homePort: 'নিজ বন্দর', vessel: 'নৌকা',

    systemLive: 'লাইভ', systemOffline: 'অফলাইন', systemConnecting: 'সংযোগ হচ্ছে',

    safetyTitle: 'সমুদ্র নিরাপত্তা', safetyUnknown: 'ডেটার অপেক্ষায়',
    lastUpdate: 'সর্বশেষ আপডেট', craftAdvisory: 'নৌকা পরামর্শ',

    conditionsTitle: 'সমুদ্র পরিস্থিতি', location: 'অবস্থান',
    metricSst: 'পৃষ্ঠের তাপমাত্রা', metricWind: 'বাতাসের গতি',
    metricWave: 'ঢেউয়ের উচ্চতা', metricChl: 'ক্লোরোফিল-এ',
    source: 'উৎস', optimal: 'উপযুক্ত সীমা',

    insightsTitle: 'AI অন্তর্দৃষ্টি', noInsights: 'এই মুহূর্তে কোনো অন্তর্দৃষ্টি নেই।',
    insightPfzTitle: 'উচ্চ সম্ভাবনার মাছ ধরার এলাকা',
    insightSafeTitle: 'অনুকূল সমুদ্র পরিস্থিতি',
    insightRiskTitle: 'সমুদ্র ঝুঁকি',
    insightSafetyWarnTitle: 'নিরাপত্তা সতর্কতা',
    insightAlertTitle: 'সাম্প্রতিক পরামর্শ',
    viewOnMap: 'মানচিত্রে দেখুন', askAboutThis: 'ORCA কে জিজ্ঞাসা করুন',

    layers: 'স্তর', layerPfz: 'PFZ এলাকা', layerSea: 'সমুদ্র অবস্থা',
    live: 'লাইভ', recenter: 'নৌকায় কেন্দ্রীভূত করুন',
    zoomIn: 'জুম ইন', zoomOut: 'জুম আউট',
    legendPfz: 'মাছ ধরার এলাকা', legendSafe: 'নিরাপদ', legendCaution: 'সতর্কতা',
    legendDanger: 'বিপদ',

    askTitle: 'ORCA কে জিজ্ঞাসা করুন',
    askHint: 'মাছ · নিরাপত্তা · পথ · সমুদ্র পরিস্থিতি — আপনার ভাষায়',
    send: 'পাঠান', listening: 'শুনছে…',
    voiceUnsupported: 'এই ডিভাইসে ভয়েস ইনপুট সমর্থিত নয়',

    orcaAnswer: 'ORCA', evidence: 'প্রমাণ',
    routeDistance: 'দূরত্ব', routeEta: 'আনুমানিক সময়', routeAvoiding: 'এড়িয়ে যাচ্ছে',
    hrs: 'ঘণ্টা', km: 'কিমি',
    stepRunning: 'চলছে', stepDone: 'সম্পন্ন',

    loadingDashboard: 'ORCA-র সাথে সংযোগ স্থাপন করা হচ্ছে…',
    mapLoading: 'সমুদ্র চার্ট লোড হচ্ছে…',
    backendDown: 'ORCA অফলাইনে আছে',
    backendDownMsg:
      'ORCA পরিষেবায় পৌঁছানো যায়নি। নিশ্চিত করুন ব্যাকএন্ড পোর্ট 8000-এ চলছে।',
    queryFailed: 'ORCA এটি প্রক্রিয়া করতে পারেনি',
    queryTimeout: 'ORCA খুব বেশি সময় নিচ্ছে',
    queryFailedMsg: 'অনুরোধ ব্যর্থ হয়েছে। AI পাইপলাইন বা Ollama অনুপলব্ধ হতে পারে — আবার চেষ্টা করুন।',
    queryTimeoutMsg: 'AI পাইপলাইন সময়মতো সাড়া দেয়নি। আবার চেষ্টা করুন।',
    retry: 'আবার চেষ্টা',
    emptyResponse: 'শুরু করতে ORCA কে জিজ্ঞাসা করুন বা মানচিত্রে একটি জোন ট্যাপ করুন।',

    alertsTitle: 'সতর্কতা', noAlerts: 'কোনো সক্রিয় সতর্কতা নেই।',

    reportTitle: 'সেশন সারসংক্ষেপ', reportGenerated: 'তৈরি',
    reportSafety: 'নিরাপত্তা অবস্থা', reportTopZone: 'শীর্ষ মাছ ধরার এলাকা',
    reportConditions: 'পরিস্থিতির স্ন্যাপশট', reportAlerts: 'সক্রিয় পরামর্শ',
    copyBrief: 'সারসংক্ষেপ কপি করুন', copied: 'কপি হয়েছে',

    settingsTitle: 'সেটিংস', settingLanguage: 'ভাষা',
    settingMotion: 'অ্যানিমেশন', settingApi: 'API এন্ডপয়েন্ট',
    settingStatus: 'ব্যাকএন্ড অবস্থা',
    motionReduced: 'হ্রাসকৃত (ডিভাইস সেটিং)', motionFull: 'সম্পূর্ণ',

    close: 'বন্ধ করুন', clear: 'সাফ করুন',
  },
}
