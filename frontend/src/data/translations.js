/**
 * UI translations for the header language selector (architecture doc — Key
 * Feature 8, extended with Telugu for the Chittoor region). Phase 1 covers site
 * chrome and high-visibility strings; long-form content (service descriptions,
 * blog articles) stays in English until translated copy is approved. Keys
 * missing from a language automatically fall back to `en`.
 */

/** Languages offered by the header selector. */
export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिंदी', short: 'हिं' },
  { code: 'te', label: 'తెలుగు', short: 'తె' },
]

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.specialties': 'Specialties',
    'nav.whoWeServe': 'Who We Serve',
    'nav.packages': 'Packages',
    'nav.gallery': 'Gallery',
    'nav.team': 'Team',
    'nav.stories': 'Stories',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.careers': 'Careers',
    // CTAs
    'cta.callNow': 'Call Now',
    'cta.whatsapp': 'WhatsApp',
    'cta.bookConsultation': 'Book Consultation',
    'cta.whatsappUs': 'WhatsApp Us',
    'cta.learnMore': 'Learn More',
    // Hero
    'hero.badge': 'Trusted Home Healthcare in Chittoor',
    'hero.headline1': 'Your Family...',
    'hero.headline2': 'Our Care and Responsibility',
    'hero.sub': 'Professional healthcare services at home',
    'hero.support':
      'We believe that the health, safety and happiness of your family members is our responsibility — and we serve with love and trust.',
    'hero.trust.nurses': 'Certified Nurses',
    'hero.trust.caregivers': 'Verified Caregivers',
    'hero.trust.support': '24/7 Support',
    'hero.trust.assessment': 'Free Assessment',
    // Stats
    'stats.families': 'Happy Families',
    'stats.professionals': 'Healthcare Professionals',
    'stats.support': 'Support',
    'stats.experience': 'Years Experience',
    // Emergency banner
    'emergency.title': 'Need Immediate Care?',
    'emergency.sub': 'Our emergency team is ready 24/7. One call brings professional care to your door.',
    'emergency.request': 'Emergency Request',
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.ourServices': 'Our Services',
    'footer.contactUs': 'Contact Us',
    'footer.emergencyCare': 'Emergency Care',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.blurb':
      'Professional home healthcare services — certified nurses, verified caregivers and 24/7 support for the people you love most.',
  },

  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.services': 'सेवाएं',
    'nav.specialties': 'विशेष सेवाएं',
    'nav.whoWeServe': 'हम किनकी सेवा करते हैं',
    'nav.packages': 'पैकेज',
    'nav.gallery': 'गैलरी',
    'nav.team': 'हमारी टीम',
    'nav.stories': 'कहानियां',
    'nav.faq': 'सामान्य प्रश्न',
    'nav.contact': 'संपर्क करें',
    'nav.careers': 'करियर',
    // CTAs
    'cta.callNow': 'अभी कॉल करें',
    'cta.whatsapp': 'व्हाट्सएप',
    'cta.bookConsultation': 'परामर्श बुक करें',
    'cta.whatsappUs': 'व्हाट्सएप करें',
    'cta.learnMore': 'और जानें',
    // Hero
    'hero.badge': 'चित्तूर में विश्वसनीय होम हेल्थकेयर',
    'hero.headline1': 'आपका परिवार...',
    'hero.headline2': 'हमारी देखभाल और ज़िम्मेदारी',
    'hero.sub': 'घर पर पेशेवर स्वास्थ्य सेवाएं',
    'hero.support':
      'हमारा विश्वास है कि आपके परिवार के सदस्यों का स्वास्थ्य, सुरक्षा और खुशी हमारी ज़िम्मेदारी है — और हम प्रेम और विश्वास के साथ सेवा करते हैं।',
    'hero.trust.nurses': 'प्रमाणित नर्सें',
    'hero.trust.caregivers': 'सत्यापित देखभालकर्ता',
    'hero.trust.support': '24/7 सहायता',
    'hero.trust.assessment': 'नि:शुल्क मूल्यांकन',
    // Stats
    'stats.families': 'खुश परिवार',
    'stats.professionals': 'स्वास्थ्य पेशेवर',
    'stats.support': 'सहायता',
    'stats.experience': 'वर्षों का अनुभव',
    // Emergency banner
    'emergency.title': 'तुरंत देखभाल चाहिए?',
    'emergency.sub': 'हमारी आपातकालीन टीम 24/7 तैयार है। एक कॉल पर पेशेवर देखभाल आपके द्वार पर।',
    'emergency.request': 'आपातकालीन अनुरोध',
    // Footer
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.ourServices': 'हमारी सेवाएं',
    'footer.contactUs': 'संपर्क करें',
    'footer.emergencyCare': 'आपातकालीन देखभाल',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'नियम एवं शर्तें',
    'footer.blurb':
      'पेशेवर होम हेल्थकेयर सेवाएं — प्रमाणित नर्सें, सत्यापित देखभालकर्ता और आपके प्रियजनों के लिए 24/7 सहायता।',
  },

  te: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.about': 'మా గురించి',
    'nav.services': 'సేవలు',
    'nav.specialties': 'ప్రత్యేక సేవలు',
    'nav.whoWeServe': 'మేము ఎవరికి సేవ చేస్తాం',
    'nav.packages': 'ప్యాకేజీలు',
    'nav.gallery': 'గ్యాలరీ',
    'nav.team': 'మా బృందం',
    'nav.stories': 'కథలు',
    'nav.faq': 'తరచూ ప్రశ్నలు',
    'nav.contact': 'సంప్రదించండి',
    'nav.careers': 'కెరీర్లు',
    // CTAs
    'cta.callNow': 'ఇప్పుడే కాల్ చేయండి',
    'cta.whatsapp': 'వాట్సాప్',
    'cta.bookConsultation': 'సంప్రదింపు బుక్ చేయండి',
    'cta.whatsappUs': 'వాట్సాప్ చేయండి',
    'cta.learnMore': 'మరింత తెలుసుకోండి',
    // Hero
    'hero.badge': 'చిత్తూరులో విశ్వసనీయ హోమ్ హెల్త్‌కేర్',
    'hero.headline1': 'మీ కుటుంబం...',
    'hero.headline2': 'మా సంరక్షణ, మా బాధ్యత',
    'hero.sub': 'ఇంటి వద్దే వృత్తిపరమైన ఆరోగ్య సేవలు',
    'hero.support':
      'మీ కుటుంబ సభ్యుల ఆరోగ్యం, భద్రత మరియు ఆనందం మా బాధ్యత అని మేము నమ్ముతాం — ప్రేమ మరియు నమ్మకంతో సేవ చేస్తాం.',
    'hero.trust.nurses': 'ప్రమాణీకృత నర్సులు',
    'hero.trust.caregivers': 'ధృవీకరించిన సంరక్షకులు',
    'hero.trust.support': '24/7 సహాయం',
    'hero.trust.assessment': 'ఉచిత అంచనా',
    // Stats
    'stats.families': 'సంతోషకరమైన కుటుంబాలు',
    'stats.professionals': 'ఆరోగ్య నిపుణులు',
    'stats.support': 'సహాయం',
    'stats.experience': 'సంవత్సరాల అనుభవం',
    // Emergency banner
    'emergency.title': 'తక్షణ సంరక్షణ కావాలా?',
    'emergency.sub': 'మా అత్యవసర బృందం 24/7 సిద్ధంగా ఉంది. ఒక్క కాల్‌తో వృత్తిపరమైన సంరక్షణ మీ ఇంటికి.',
    'emergency.request': 'అత్యవసర అభ్యర్థన',
    // Footer
    'footer.quickLinks': 'త్వరిత లింకులు',
    'footer.ourServices': 'మా సేవలు',
    'footer.contactUs': 'సంప్రదించండి',
    'footer.emergencyCare': 'అత్యవసర సంరక్షణ',
    'footer.rights': 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.',
    'footer.privacy': 'గోప్యతా విధానం',
    'footer.terms': 'నియమాలు & షరతులు',
    'footer.blurb':
      'వృత్తిపరమైన హోమ్ హెల్త్‌కేర్ సేవలు — ప్రమాణీకృత నర్సులు, ధృవీకరించిన సంరక్షకులు మరియు మీ ఆత్మీయుల కోసం 24/7 సహాయం.',
  },
}
