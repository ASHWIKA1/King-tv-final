import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

const translationMap = {
  "இருள்": "Dark",
  "ஒளி": "Light",
  "தமிழ்": "Tamil",
  "ஆங்கிலம்": "English",
  "முகப்பு": "Home",
  "உள்நுழை": "Login",
  "வெளியேறு": "Logout",
  "வழிகாட்டி": "Directory",
  "விளம்பரங்கள்": "Classifieds",
  "வாழ்த்துகள்": "Wishes",
  "மரண அறிவிப்புகள்": "Obituaries",
  "வேலைவாய்ப்பு": "Jobs",
  "வணிகக் கதைகள்": "Business Studies",
  "தேடுதல்...": "Search...",
  "தேடு": "Search",
  "நம்ம ஊர்": "Regional",
  "செய்திகள்": "News",
  "வாழ்த்து": "Wishes",
  "இரங்கல்": "Obituaries",
  "வணிகம்": "Business",
  "வேலை": "Jobs",
  "தள்ளுபடி": "Classifieds",
  "வடிவமைப்பு மாற்றி": "Design Customizer",
  "வடிவமைப்பு அமைப்புகள்": "Design Settings",
  "வண்ணம்": "Color",
  "எழுத்து அளவு": "Font Size",
  "சிறிய": "Small",
  "நடுத்தர": "Medium",
  "பெரிய": "Large",
  "இடது பக்கப்பட்டி அகலம் (பிக்சல்)": "Left Widget Width (px)",
  "நகரும் வேகம் (வினாடி)": "Slide Ticker Speed (sec)",
  "பகுதி தெரிவுநிலை": "Section Visibility",
  "அனைத்தையும் மீட்டமை": "Reset All Settings",
  "வடிவமைப்பு மாற்றியை மூடு": "Close Customizer",
  "வணிக அடைவு": "Business Directory",
  "புதிய பதிவு": "New Listing",
  "முகவரி": "Address",
  "தொடர்பு எண்": "Phone Number",
  "வேலை நேரம்": "Working Hours",
  "தொடர்புகொள்ள": "Contact",
  "வகை": "Category",
  "நகரம்": "City",
  "சம்பளம்": "Salary",
  "நிறுவனம்": "Company",
  "விண்ணப்பி": "Apply Now",
  "விண்ணப்பப் படிவம்": "Application Form",
  "பெயர்": "Name",
  "அனுபவம்": "Experience",
  "சுருக்கம்": "Summary",
  "சமர்ப்பி": "Submit",
  "வகைப்பாடு மற்றும் சலுகைகள்": "Classifieds & Offers",
  "விலை விபரம்": "Price Details",
  "வணிக வெற்றி கதைகள்": "MSME Case Studies & Success Stories",
  "கதை விவரம்": "Story Details",
  "அனுப்பியவர்": "Sender",
  "பெறுநர்": "Recipient",
  "செய்தி": "Message",
  "வாழ்த்து அட்டை உருவாக்கம்": "Create Greeting Wish Card",
  "மரண அறிவிப்பு பலகை": "Memorial Obituary Board",
  "வயது": "Age",
  "இறந்த தேதி": "Date of Demise",
  "இறுதிச் சடங்கு விபரம்": "Funeral Details",
  "சுருக்கமான குறிப்பு": "Short Description",
  "புதிய மரண அறிவிப்பு சேர்க்க": "Add New Obituary",
  "நேரலை": "Live TV",
  "இன்றைய முக்கிய செய்திகள்": "Today's Headlines",
  "மாவட்ட செய்திகள்": "District News",
  "விளம்பரம்": "Advertisement",
  "மின்னஞ்சல் முகவரி": "Email Address",
  "கடவுச்சொல்": "Password",
  "என்னை நினைவில் கொள்": "Remember Me",
  "கடவுச்சொல் மறந்துவிட்டதா?": "Forgot Password?",
  "உள்நுழைய": "Sign In",
  "பதிவு செய்க": "Register",
  "நிர்வாகி": "Admin",
  "வணிகர்": "Vendor",
  "ஆசிரியர்": "Editor",
  "செய்தியாளர்": "Reporter",
  "வாசகர்": "User"
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('king24x7_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('king24x7_lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = (text) => {
    if (lang === 'en') {
      return translationMap[text] || text;
    }
    // Return original Tamil text when language is 'ta'
    // Find the original Tamil key if an English string was passed
    for (const key in translationMap) {
      if (translationMap[key] === text) {
        return key;
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
