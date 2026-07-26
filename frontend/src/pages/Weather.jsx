import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { statesData } from '../utils/locations';

const Weather = () => {
  const { lang } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const pageBg = isDark ? '#000000' : '#F8FAFC';
  const textDark = isDark ? '#ffffff' : '#0F172A';
  const textMuted = isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748B';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0';

  const [selectedState, setSelectedState] = useState(statesData[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(statesData[0].districts[0]);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);

  const citiesWeather = {
    Chennai: { 
      temp: '32°C', 
      condition: 'Cloudy', 
      humidity: '72%', 
      wind: '18 km/h', 
      uv: 'Very High (8)',
      sunrise: '05:58 AM',
      sunset: '06:38 PM',
      pressure: '1012 hPa',
      aqi: 'Good (42)',
      aqiTa: 'நன்று (42)',
      visibility: '9 km',
      visibilityTa: '9 கி.மீ',
      precipitation: '20%',
      precipitationTa: '20%',
      dewPoint: '22°C',
      dewPointTa: '22°C',
      forecastSummaryEn: "Expect cloudy skies with high humidity throughout the day. Light showers are likely in the evening.",
      forecastSummaryTa: "இன்று நாள் முழுவதும் மேகமூட்டத்துடனும் அதிக ஈரப்பதத்துடனும் காணப்படும். மாலையில் லேசான மழைக்கு வாய்ப்பு உள்ளது.",
      ta: 'சென்னை', 
      conditionTa: 'மேகமூட்டம்',
      forecast: [
        { day: 'Mon', dayTa: 'திங்கள்', icon: '☀️', temp: '32°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Tue', dayTa: 'செவ்வாய்', icon: '⛅', temp: '31°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Wed', dayTa: 'புதன்', icon: '🌤️', temp: '33°', desc: 'Mostly Sunny', descTa: 'பெரும்பாலும் வெயில்' },
        { day: 'Thu', dayTa: 'வியாழன்', icon: '⛈️', temp: '29°', desc: 'Thunderstorms', descTa: 'இடிமழை' },
        { day: 'Fri', dayTa: 'வெள்ளி', icon: '🌧️', temp: '28°', desc: 'Heavy Rain', descTa: 'கனமழை' },
        { day: 'Sat', dayTa: 'சனி', icon: '⛅', temp: '30°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Sun', dayTa: 'ஞாயிறு', icon: '☀️', temp: '32°', desc: 'Sunny', descTa: 'வெயில்' }
      ]
    },
    Coimbatore: { 
      temp: '28°C', 
      condition: 'Partly Cloudy', 
      humidity: '55%', 
      wind: '12 km/h', 
      uv: 'High (6)',
      sunrise: '06:04 AM',
      sunset: '06:44 PM',
      pressure: '1014 hPa',
      aqi: 'Excellent (28)',
      aqiTa: 'மிகவும் நன்று (28)',
      visibility: '12 km',
      visibilityTa: '12 கி.மீ',
      precipitation: '10%',
      precipitationTa: '10%',
      dewPoint: '18°C',
      dewPointTa: '18°C',
      forecastSummaryEn: "Pleasant weather with light wind and partial cloud cover. Ideal for outdoor activities.",
      forecastSummaryTa: "லேசான காற்று மற்றும் பகுதி மேகமூட்டத்துடன் கூடிய இதமான வானிலை காணப்படும். வெளிப்புற நடவடிக்கைகளுக்கு ஏற்றது.",
      ta: 'கோயம்புத்தூர்', 
      conditionTa: 'பகுதி மேகமூட்டம்',
      forecast: [
        { day: 'Mon', dayTa: 'திங்கள்', icon: '⛅', temp: '28°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Tue', dayTa: 'செவ்வாய்', icon: '🌤️', temp: '29°', desc: 'Mostly Sunny', descTa: 'பெரும்பாலும் வெயில்' },
        { day: 'Wed', dayTa: 'புதன்', icon: '☀️', temp: '30°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Thu', dayTa: 'வியாழன்', icon: '🌦️', temp: '27°', desc: 'Showers', descTa: 'மழைச்சாரல்' },
        { day: 'Fri', dayTa: 'வெள்ளி', icon: '🌧️', temp: '26°', desc: 'Rain', descTa: 'மழை' },
        { day: 'Sat', dayTa: 'சனி', icon: '⛅', temp: '28°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Sun', dayTa: 'ஞாயிறு', icon: '☀️', temp: '29°', desc: 'Sunny', descTa: 'வெயில்' }
      ]
    },
    Madurai: { 
      temp: '35°C', 
      condition: 'Sunny', 
      humidity: '48%', 
      wind: '10 km/h', 
      uv: 'Extreme (10)',
      sunrise: '06:01 AM',
      sunset: '06:40 PM',
      pressure: '1010 hPa',
      aqi: 'Moderate (55)',
      aqiTa: 'மிதமானது (55)',
      visibility: '10 km',
      visibilityTa: '10 கி.மீ',
      precipitation: '5%',
      precipitationTa: '5%',
      dewPoint: '20°C',
      dewPointTa: '20°C',
      forecastSummaryEn: "Very hot and dry conditions. Drink plenty of water and avoid direct sunlight in the afternoon.",
      forecastSummaryTa: "மிகவும் வெப்பமான மற்றும் வறண்ட வானிலை காணப்படும். மதிய வேளையில் அதிக நீர் அருந்து, நேரடி வெயிலைத் தவிர்க்கவும்.",
      ta: 'மதுரை', 
      conditionTa: 'அதிக வெயில்',
      forecast: [
        { day: 'Mon', dayTa: 'திங்கள்', icon: '☀️', temp: '35°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Tue', dayTa: 'செவ்வாய்', icon: '☀️', temp: '36°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Wed', dayTa: 'புதன்', icon: '🌤️', temp: '34°', desc: 'Mostly Sunny', descTa: 'பெரும்பாலும் வெயில்' },
        { day: 'Thu', dayTa: 'வியாழன்', icon: '⛅', temp: '33°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Fri', dayTa: 'வெள்ளி', icon: '⛈️', temp: '31°', desc: 'Thunderstorms', descTa: 'இடிமழை' },
        { day: 'Sat', dayTa: 'சனி', icon: '☀️', temp: '34°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Sun', dayTa: 'ஞாயிறு', icon: '☀️', temp: '35°', desc: 'Sunny', descTa: 'வெயில்' }
      ]
    },
    Salem: { 
      temp: '31°C', 
      condition: 'Clear Sky', 
      humidity: '52%', 
      wind: '8 km/h', 
      uv: 'Very High (9)',
      sunrise: '06:00 AM',
      sunset: '06:41 PM',
      pressure: '1011 hPa',
      aqi: 'Good (38)',
      aqiTa: 'நன்று (38)',
      visibility: '11 km',
      visibilityTa: '11 கி.மீ',
      precipitation: '8%',
      precipitationTa: '8%',
      dewPoint: '19°C',
      dewPointTa: '19°C',
      forecastSummaryEn: "Clear blue skies and comfortable weather. Mild temperatures expected at night.",
      forecastSummaryTa: "தெளிவான நீல நிற வானம் மற்றும் இதமான வானிலை காணப்படும். இரவில் குறைந்த வெப்பநிலை நிலவ வாய்ப்புள்ளது.",
      ta: 'சேலம்', 
      conditionTa: 'தெளிவான வானம்',
      forecast: [
        { day: 'Mon', dayTa: 'திங்கள்', icon: '☀️', temp: '31°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Tue', dayTa: 'செவ்வாய்', icon: '☀️', temp: '32°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Wed', dayTa: 'புதன்', icon: '⛅', temp: '31°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Thu', dayTa: 'வியாழன்', icon: '🌦️', temp: '29°', desc: 'Showers', descTa: 'மழைச்சாரல்' },
        { day: 'Fri', dayTa: 'வெள்ளி', icon: '🌧️', temp: '28°', desc: 'Rain', descTa: 'மழை' },
        { day: 'Sat', dayTa: 'சனி', icon: '☀️', temp: '30°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Sun', dayTa: 'ஞாயிறு', icon: '☀️', temp: '31°', desc: 'Sunny', descTa: 'வெயில்' }
      ]
    },
    Trichy: { 
      temp: '33°C', 
      condition: 'Sunny', 
      humidity: '50%', 
      wind: '11 km/h', 
      uv: 'Very High (9)',
      sunrise: '05:59 AM',
      sunset: '06:39 PM',
      pressure: '1012 hPa',
      aqi: 'Moderate (52)',
      aqiTa: 'மிதமானது (52)',
      visibility: '10 km',
      visibilityTa: '10 கி.மீ',
      precipitation: '15%',
      precipitationTa: '15%',
      dewPoint: '21°C',
      dewPointTa: '21°C',
      forecastSummaryEn: "Warm and bright day. High solar radiation levels in the afternoon hours.",
      forecastSummaryTa: "வெப்பமான மற்றும் வெளிச்சமான நாள். மதிய நேரங்களில் சூரிய கதிர்வீச்சு அதிகமாக இருக்கும்.",
      ta: 'திருச்சி', 
      conditionTa: 'வெயில்',
      forecast: [
        { day: 'Mon', dayTa: 'திங்கள்', icon: '☀️', temp: '33°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Tue', dayTa: 'செவ்வாய்', icon: '☀️', temp: '34°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Wed', dayTa: 'புதன்', icon: '⛅', temp: '32°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Thu', dayTa: 'வியாழன்', icon: '⛈️', temp: '30°', desc: 'Thunderstorms', descTa: 'இடிமழை' },
        { day: 'Fri', dayTa: 'வெள்ளி', icon: '🌧️', temp: '29°', desc: 'Rain', descTa: 'மழை' },
        { day: 'Sat', dayTa: 'சனி', icon: '☀️', temp: '32°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Sun', dayTa: 'ஞாயிறு', icon: '☀️', temp: '33°', desc: 'Sunny', descTa: 'வெயில்' }
      ]
    },
    Erode: { 
      temp: '30°C', 
      condition: 'Cloudy', 
      humidity: '58%', 
      wind: '9 km/h', 
      uv: 'High (7)',
      sunrise: '06:03 AM',
      sunset: '06:43 PM',
      pressure: '1013 hPa',
      aqi: 'Good (40)',
      aqiTa: 'நன்று (40)',
      visibility: '9 km',
      visibilityTa: '9 கி.மீ',
      precipitation: '45%',
      precipitationTa: '45%',
      dewPoint: '20°C',
      dewPointTa: '20°C',
      forecastSummaryEn: "Overcast skies with rain showers highly likely in the afternoon. Cooler evening temperatures.",
      forecastSummaryTa: "மதிய வேளையில் மழையுடன் கூடிய மேகமூட்டம் நிலவ அதிக வாய்ப்புள்ளது. மாலையில் குளிர்ந்த காற்று வீசக்கூடும்.",
      ta: 'ஈரோடு', 
      conditionTa: 'மேகமூட்டம்',
      forecast: [
        { day: 'Mon', dayTa: 'திங்கள்', icon: '☁️', temp: '30°', desc: 'Cloudy', descTa: 'மேகமூட்டம்' },
        { day: 'Tue', dayTa: 'செவ்வாய்', icon: '⛅', temp: '31°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Wed', dayTa: 'புதன்', icon: '☀️', temp: '32°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Thu', dayTa: 'வியாழன்', icon: '🌧️', temp: '28°', desc: 'Rain', descTa: 'மழை' },
        { day: 'Fri', dayTa: 'வெள்ளி', icon: '🌧️', temp: '27°', desc: 'Heavy Rain', descTa: 'கனமழை' },
        { day: 'Sat', dayTa: 'சனி', icon: '⛅', temp: '29°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Sun', dayTa: 'ஞாயிறு', icon: '☀️', temp: '30°', desc: 'Sunny', descTa: 'வெயில்' }
      ]
    }
  };

  const generateDefaultWeatherData = (nameEn, nameTa) => {
    return {
      temp: '30°C',
      condition: 'Clear Sky',
      conditionTa: 'தெளிவான வானம்',
      humidity: '65%',
      wind: '10 km/h',
      uv: 'High (6)',
      sunrise: '06:00 AM',
      sunset: '06:30 PM',
      pressure: '1012 hPa',
      aqi: 'Good (35)',
      aqiTa: 'நன்று (35)',
      visibility: '10 km',
      visibilityTa: '10 கி.மீ',
      precipitation: '10%',
      precipitationTa: '10%',
      dewPoint: '20°C',
      dewPointTa: '20°C',
      forecastSummaryEn: `Expect pleasant clear weather in ${nameEn} with moderate temperature.`,
      forecastSummaryTa: `${nameTa} பகுதியில் இதமான தெளிவான வானிலை காணப்படும், மிதமான வெப்பநிலை நிலவும்.`,
      ta: nameTa,
      forecast: [
        { day: 'Mon', dayTa: 'திங்கள்', icon: '☀️', temp: '30°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Tue', dayTa: 'செவ்வாய்', icon: '☀️', temp: '31°', desc: 'Sunny', descTa: 'வெயில்' },
        { day: 'Wed', dayTa: 'புதன்', icon: '⛅', temp: '30°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Thu', dayTa: 'வியாழன்', icon: '🌦️', temp: '29°', desc: 'Showers', descTa: 'மழைசாரல்' },
        { day: 'Fri', dayTa: 'வெள்ளி', icon: '🌧️', temp: '28°', desc: 'Rain', descTa: 'மழை' },
        { day: 'Sat', dayTa: 'சனி', icon: '⛅', temp: '30°', desc: 'Partly Cloudy', descTa: 'பகுதி மேகமூட்டம்' },
        { day: 'Sun', dayTa: 'ஞாயிறு', icon: '☀️', temp: '31°', desc: 'Sunny', descTa: 'வெயில்' }
      ]
    };
  };

  const [weatherData, setWeatherData] = useState(citiesWeather);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeLocation = selectedSubDistrict || selectedDistrict;

  useEffect(() => {
    const coords = { lat: activeLocation.lat, lon: activeLocation.lon };
    if (!coords.lat || !coords.lon) return;

    const baseApi = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1';
    const locationKey = activeLocation.nameEn;

    fetch(`${baseApi}/weather?city=${locationKey}&lat=${coords.lat}&lon=${coords.lon}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.temp) {
          setWeatherData(prev => ({
            ...prev,
            [locationKey]: {
              ...generateDefaultWeatherData(activeLocation.nameEn, activeLocation.nameTa),
              ...data,
              ta: activeLocation.nameTa
            }
          }));
        }
      })
      .catch(err => console.warn("Failed to fetch live weather details", err));
  }, [activeLocation]);

  const locationKey = activeLocation.nameEn;
  const current = weatherData[locationKey] || citiesWeather[locationKey] || generateDefaultWeatherData(activeLocation.nameEn, activeLocation.nameTa);

  const weatherIcons = {
    'Sunny': 'fas fa-sun',
    'Clear Sky': 'fas fa-sun',
    'Partly Cloudy': 'fas fa-cloud-sun',
    'Mostly Sunny': 'fas fa-cloud-sun',
    'Cloudy': 'fas fa-cloud',
    'Showers': 'fas fa-cloud-showers-heavy',
    'Rain': 'fas fa-cloud-showers-heavy',
    'Heavy Rain': 'fas fa-cloud-showers-heavy',
    'Thunderstorms': 'fas fa-bolt'
  };

  const currentIconClass = weatherIcons[current.condition] || 'fas fa-cloud-sun';

  const getDynamicAdvisories = () => {
    const advisories = [];
    
    // UV Alert
    if (current.uv.includes('Extreme') || current.uv.includes('10')) {
      advisories.push({
        titleEn: 'Extreme UV Alert',
        titleTa: 'அதி தீவிர சூரிய கதிர் எச்சரிக்கை',
        textEn: 'Extreme solar radiation. Avoid going outdoors between 11 AM and 4 PM. Use high-factor SPF sunscreen.',
        textTa: 'மிகக் கடுமையான சூரிய கதிர்வீச்சு. காலை 11 முதல் மாலை 4 மணி வரை வெளியில் செல்வதைத் தவிர்க்கவும்.',
        color: '#EF4444' // red
      });
    } else {
      advisories.push({
        titleEn: 'UV Protection Advisory',
        titleTa: 'யுவி கதிர் பாதுகாப்பு குறிப்பு',
        textEn: 'High UV index detected. Wear sunglasses, a wide-brimmed hat, and seek shade during midday hours.',
        textTa: 'அதிக வெயில் காரணமாக மதியம் குடை அல்லது தொப்பி பயன்படுத்தவும்.',
        color: '#10B981' // green
      });
    }

    // Temp / Hydration Alert
    const tempNum = parseInt(current.temp);
    if (tempNum >= 34) {
      advisories.push({
        titleEn: 'High Temperature & Hydration Alert',
        titleTa: 'அதிக வெப்பம் & நீர்ச்சத்து எச்சரிக்கை',
        textEn: 'Temperatures are very high. Drink at least 4 liters of water and consume electrolyte-rich drinks like coconut water.',
        textTa: 'வெப்பநிலை மிக அதிகமாக உள்ளதால், இளநீர், நீர்மோர் போன்றவற்றை அதிகம் பருகி உடலை குளிர்ச்சியாக வைத்திருக்கவும்.',
        color: '#F59E0B' // amber
      });
    } else {
      advisories.push({
        titleEn: 'Daily Hydration Tip',
        titleTa: 'தினசரி நீர்ச்சத்து குறிப்பு',
        textEn: 'Keep hydrated by drinking sufficient fluids throughout the day to support energy levels.',
        textTa: 'உடல் வறட்சியைத் தவிர்க்க போதுமான அளவு தண்ணீர் குடிக்கவும்.',
        color: '#3B82F6' // blue
      });
    }

    // Rain / Wind Alert
    const precipNum = parseInt(current.precipitation);
    if (precipNum >= 30) {
      advisories.push({
        titleEn: 'Rain & Wet Conditions Alert',
        titleTa: 'மழை மற்றும் ஈரப்பதம் எச்சரிக்கை',
        textEn: `High chance of rain (${current.precipitation}). Carry an umbrella and drive carefully on wet roads. Stay away from electric poles.`,
        textTa: `மழை பெய்ய அதிக வாய்ப்பு (${current.precipitationTa}) உள்ளது. குடை கொண்டு செல்லவும், மின் கம்பங்களின் அருகே நிற்க வேண்டாம்.`,
        color: '#3B82F6' // blue
      });
    } else if (current.condition.includes('Cloudy') || current.condition.includes('Thunderstorms')) {
      advisories.push({
        titleEn: 'Monsoon Alert',
        titleTa: 'மழைக்கால எச்சரிக்கை',
        textEn: 'Thunderstorms or overcast conditions likely. Watch out for sudden heavy downpours in open spaces.',
        textTa: 'இடிமழை அல்லது மேகமூட்டத்திற்கு வாய்ப்பு. திடீர் கனமழையைக் கண்காணிக்கவும்.',
        color: '#8B5CF6' // purple
      });
    } else {
      advisories.push({
        titleEn: 'Wind Advisory',
        titleTa: 'காற்று வேக குறிப்பு',
        textEn: `Moderate winds blowing at ${current.wind}. Safe conditions for daily outdoor commutes.`,
        textTa: `காற்றின் வேகம் மிதமாக ${current.wind} உள்ளது. தினசரி பயணங்களுக்கு உகந்த வானிலை.`,
        color: '#6B7280' // grey
      });
    }

    return advisories;
  };

  const activeAdvisories = getDynamicAdvisories();

  return (
    <div className="weather-page-wrapper" style={{ background: pageBg, color: textDark, minHeight: '100vh', padding: '30px 20px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        /* Desktop vs Mobile display triggers */
        .weather-mobile-view {
          display: none;
        }
        @media (min-width: 769px) {
          .weather-desktop-view {
            display: block !important;
          }
          .weather-mobile-view {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .weather-desktop-view {
            display: none !important;
          }
          .weather-mobile-view {
            display: block !important;
          }
          
          .city-selector-buttons-mobile {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            gap: 8px !important;
            padding-bottom: 10px !important;
            scrollbar-width: none !important;
          }
          .city-selector-buttons-mobile::-webkit-scrollbar {
            display: none !important;
          }
          .city-selector-buttons-mobile button {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }
        }
      `}} />

      {/* ========================================================
          1. DESKTOP VIEW (LAPTOP VIEW) - UNTOUCHED & RICH DETAILS
          ======================================================== */}
      <div className="weather-desktop-view">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* BREADCRUMBS */}
          <div className="breadcrumbs" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: textMuted }}>
            <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
              {lang === 'en' ? 'Home' : 'முகப்பு'}
            </Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '9px', opacity: 0.5 }}></i>
            <span style={{ fontWeight: '600' }}>{lang === 'en' ? 'Weather' : 'வானிலை'}</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '30px', color: textDark, letterSpacing: '0.5px' }}>
            {lang === 'en' ? 'Local Weather Forecast' : 'தமிழக மாவட்ட வானிலை நிலவரம்'}
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '30px', alignItems: 'start' }}>
            {/* HIERARCHICAL LOCATION SELECTOR */}
            <div style={{ background: cardBg, border: '1px solid ' + cardBorder, padding: '24px', borderRadius: '12px', backdropFilter: 'blur(20px)' }}>
              <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid ' + cardBorder, paddingBottom: '12px', fontSize: '16px', fontWeight: 700, color: textDark, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i>
                {lang === 'en' ? 'Select Location' : 'இடத்தைத் தேர்வு செய்க'}
              </h3>
              
              {/* Level 1: State Dropdown */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>
                  {lang === 'en' ? 'State' : 'மாநிலம்'}
                </label>
                <select
                  value={selectedState.id}
                  onChange={(e) => {
                    const newState = statesData.find(s => s.id === e.target.value);
                    setSelectedState(newState);
                    setSelectedDistrict(newState.districts[0]);
                    setSelectedSubDistrict(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid ' + cardBorder,
                    background: isDark ? '#1E293B' : '#ffffff',
                    color: textDark,
                    fontSize: '14px',
                    fontWeight: '600',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {statesData.map(state => (
                    <option key={state.id} value={state.id}>
                      {lang === 'en' ? state.nameEn : state.nameTa}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level 2: District Quick-select Buttons */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>
                  {lang === 'en' ? 'District' : 'மாவட்டம்'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedState.districts.map(dist => (
                    <button
                      key={dist.nameEn}
                      onClick={() => {
                        setSelectedDistrict(dist);
                        setSelectedSubDistrict(null);
                      }}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid ' + (selectedDistrict.nameEn === dist.nameEn ? 'var(--primary)' : cardBorder),
                        background: selectedDistrict.nameEn === dist.nameEn ? 'rgba(179, 115, 42, 0.15)' : (isDark ? 'rgba(255, 255, 255, 0.01)' : '#f1f5f9'),
                        color: selectedDistrict.nameEn === dist.nameEn ? 'white' : textDark,
                        fontWeight: '700',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.3s'
                      }}
                    >
                      {lang === 'en' ? dist.nameEn : dist.nameTa}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level 3: Sub-district (Taluk/Mandal/Tehsil) Dropdown */}
              {selectedDistrict && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>
                    {lang === 'en' ? selectedState.level3LabelEn : selectedState.level3LabelTa}
                  </label>
                  <select
                    value={selectedSubDistrict ? selectedSubDistrict.nameEn : ""}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setSelectedSubDistrict(null);
                      } else {
                        const sub = selectedDistrict.subDistricts.find(s => s.nameEn === e.target.value);
                        setSelectedSubDistrict(sub);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid ' + cardBorder,
                      background: isDark ? '#1E293B' : '#ffffff',
                      color: textDark,
                      fontSize: '14px',
                      fontWeight: '600',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">
                      {lang === 'en' 
                        ? `All ${selectedDistrict.nameEn} (${selectedState.level3LabelEn})` 
                        : `அனைத்து ${selectedDistrict.nameTa} (${selectedState.level3LabelTa})`}
                    </option>
                    {selectedDistrict.subDistricts && selectedDistrict.subDistricts.map(sub => (
                      <option key={sub.nameEn} value={sub.nameEn}>
                        {lang === 'en' ? sub.nameEn : sub.nameTa}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* DETAILS CONTAINER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ background: cardBg, border: '1px solid ' + cardBorder, padding: '40px 30px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 800, color: textDark }}>{lang === 'en' ? activeLocation.nameEn : activeLocation.nameTa}</h2>
                  <span style={{ fontSize: '18px', color: 'var(--primary)', fontWeight: '600', display: 'block', marginTop: '6px' }}>
                    {lang === 'en' ? current.condition : current.conditionTa}
                  </span>
                  
                  {/* Expanded 3x3 Grid of Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px 30px', marginTop: '30px' }}>
                    <div>
                      <small style={{ color: textMuted, display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{lang === 'en' ? 'Humidity' : 'ஈரப்பதம்'}</small>
                      <strong style={{ fontSize: '15px', color: textDark }}>{current.humidity}</strong>
                    </div>
                    <div>
                      <small style={{ color: textMuted, display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{lang === 'en' ? 'Wind Speed' : 'காற்றின் வேகம்'}</small>
                      <strong style={{ fontSize: '15px', color: textDark }}>{current.wind}</strong>
                    </div>
                    <div>
                      <small style={{ color: textMuted, display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{lang === 'en' ? 'UV Index' : 'யுவி குறியீடு'}</small>
                      <strong style={{ fontSize: '15px', color: textDark }}>{current.uv}</strong>
                    </div>
                    <div>
                      <small style={{ color: textMuted, display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{lang === 'en' ? 'Barometer' : 'அழுத்தம்'}</small>
                      <strong style={{ fontSize: '15px', color: textDark }}>{current.pressure}</strong>
                    </div>
                    <div>
                      <small style={{ color: textMuted, display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{lang === 'en' ? 'Air Quality' : 'காற்று தரம்'}</small>
                      <strong style={{ fontSize: '15px', color: textDark }}>{lang === 'en' ? current.aqi : current.aqiTa}</strong>
                    </div>
                    <div>
                      <small style={{ color: textMuted, display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{lang === 'en' ? 'Visibility' : 'பார்வைதிறன்'}</small>
                      <strong style={{ fontSize: '15px', color: textDark }}>{lang === 'en' ? current.visibility : current.visibilityTa}</strong>
                    </div>
                    <div>
                      <small style={{ color: textMuted, display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{lang === 'en' ? 'Rain Chance' : 'மழை வாய்ப்பு'}</small>
                      <strong style={{ fontSize: '15px', color: textDark }}>{lang === 'en' ? current.precipitation : current.precipitationTa}</strong>
                    </div>
                    <div>
                      <small style={{ color: textMuted, display: 'block', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{lang === 'en' ? 'Dew Point' : 'பனி நிலை'}</small>
                      <strong style={{ fontSize: '15px', color: textDark }}>{lang === 'en' ? current.dewPoint : current.dewPointTa}</strong>
                    </div>
                  </div>

                  {/* Descriptive summary block */}
                  <div style={{ marginTop: '24px', padding: '16px', background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: '8px', borderLeft: '3px solid var(--primary)', fontSize: '13px', lineHeight: '1.6', color: textDark }}>
                    <strong>{lang === 'en' ? 'Today\'s Outlook: ' : 'இன்றைய வானிலை குறிப்பு: '}</strong>
                    {lang === 'en' ? current.forecastSummaryEn : current.forecastSummaryTa}
                  </div>

                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '80px', fontWeight: '900', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', lineHeight: 1 }}>
                    {current.temp}
                    <i className={currentIconClass} style={{ color: 'var(--primary)', fontSize: '64px' }}></i>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'flex-end', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    <span><i className="far fa-sun" style={{ marginRight: '6px' }}></i>{current.sunrise}</span>
                    <span><i className="far fa-moon" style={{ marginRight: '6px' }}></i>{current.sunset}</span>
                  </div>
                </div>
              </div>

              {/* 7 DAY FORECAST */}
              <div style={{ background: cardBg, border: '1px solid ' + cardBorder, padding: '30px', borderRadius: '12px', backdropFilter: 'blur(20px)' }}>
                <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid ' + cardBorder, paddingBottom: '12px', fontSize: '18px', fontWeight: 800, color: textDark }}>
                  {lang === 'en' ? '7-Day Outlook' : '7-நாள் வானிலை முன்னறிவிப்பு'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {current.forecast.map((fc, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 2fr 1fr', alignItems: 'center', padding: '12px 20px', background: isDark ? 'rgba(255, 255, 255, 0.01)' : '#f1f5f9', border: '1px solid ' + cardBorder, borderRadius: '8px', fontSize: '14px' }}>
                      <span style={{ fontWeight: '700', color: textDark }}>{lang === 'en' ? fc.day : fc.dayTa}</span>
                      <span style={{ fontSize: '20px', textAlign: 'center' }}>{fc.icon}</span>
                      <span style={{ color: textMuted, fontWeight: '600' }}>{lang === 'en' ? fc.desc : fc.descTa}</span>
                      <span style={{ fontWeight: '800', color: 'var(--primary)', textAlign: 'right', fontSize: '15px' }}>{fc.temp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE VIEW - MINIMIZED SIZE WITH DYNAMIC ADVISORIES
          ======================================================== */}
      <div className="weather-mobile-view">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Breadcrumbs for Mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '8px' }}></i>
            <span>{lang === 'en' ? 'Weather' : 'வானிலை'}</span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '800', color: textDark, margin: '0 0 2px 0' }}>
            {lang === 'en' ? 'Local Weather Forecast' : 'தமிழக மாவட்ட வானிலை நிலவரம்'}
          </h2>

          {/* Mobile Location Selector Block */}
          <div style={{ background: cardBg, padding: '16px', borderRadius: '12px', border: '1px solid ' + cardBorder, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Level 1: State Select */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'State' : 'மாநிலம்'}
              </label>
              <select
                value={selectedState.id}
                onChange={(e) => {
                  const newState = statesData.find(s => s.id === e.target.value);
                  setSelectedState(newState);
                  setSelectedDistrict(newState.districts[0]);
                  setSelectedSubDistrict(null);
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid ' + cardBorder,
                  background: isDark ? '#1E293B' : '#ffffff',
                  color: textDark,
                  fontSize: '13px',
                  fontWeight: '600',
                  outline: 'none'
                }}
              >
                {statesData.map(state => (
                  <option key={state.id} value={state.id}>
                    {lang === 'en' ? state.nameEn : state.nameTa}
                  </option>
                ))}
              </select>
            </div>

            {/* Level 2: District Horizontal Swipe */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'District' : 'மாவட்டம்'}
              </label>
              <div className="city-selector-buttons-mobile">
                {selectedState.districts.map(dist => (
                  <button
                    key={dist.nameEn}
                    onClick={() => {
                      setSelectedDistrict(dist);
                      setSelectedSubDistrict(null);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid ' + (selectedDistrict.nameEn === dist.nameEn ? 'var(--primary)' : cardBorder),
                      background: selectedDistrict.nameEn === dist.nameEn ? 'rgba(179, 115, 42, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                      color: selectedDistrict.nameEn === dist.nameEn ? 'white' : textDark,
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {lang === 'en' ? dist.nameEn : dist.nameTa}
                  </button>
                ))}
              </div>
            </div>

            {/* Level 3: Sub-district Dropdown */}
            {selectedDistrict && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>
                  {lang === 'en' ? selectedState.level3LabelEn : selectedState.level3LabelTa}
                </label>
                <select
                  value={selectedSubDistrict ? selectedSubDistrict.nameEn : ""}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setSelectedSubDistrict(null);
                    } else {
                      const sub = selectedDistrict.subDistricts.find(s => s.nameEn === e.target.value);
                      setSelectedSubDistrict(sub);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid ' + cardBorder,
                    background: isDark ? '#1E293B' : '#ffffff',
                    color: textDark,
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                >
                  <option value="">
                    {lang === 'en' 
                      ? `All ${selectedDistrict.nameEn} (${selectedState.level3LabelEn})` 
                      : `அனைத்து ${selectedDistrict.nameTa} (${selectedState.level3LabelTa})`}
                  </option>
                  {selectedDistrict.subDistricts && selectedDistrict.subDistricts.map(sub => (
                    <option key={sub.nameEn} value={sub.nameEn}>
                      {lang === 'en' ? sub.nameEn : sub.nameTa}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* MAIN WEATHER CARD - MINIMIZED SIZE */}
          <div style={{
            background: cardBg,
            border: '1px solid ' + cardBorder,
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}>
            {/* Header: Selected Location Weather */}
            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '15px',
              fontWeight: '800',
              color: textDark,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fas fa-cloud-sun" style={{ color: 'var(--primary)', fontSize: '15px' }}></i>
              <span>{lang === 'en' ? `${activeLocation.nameEn} Weather` : `${activeLocation.nameTa} வானிலை`}</span>
            </h3>

            {/* Current Temperature & Details block side-by-side */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              {/* Temperature on the Left */}
              <div style={{
                fontSize: '46px',
                fontWeight: '900',
                color: 'var(--primary, #B3732A)',
                lineHeight: '1.0',
                letterSpacing: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {current.temp}
              </div>

              {/* Status details on the Right */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: textDark }}>
                  {lang === 'en' ? current.condition : current.conditionTa}
                </span>
                <span style={{ fontSize: '11px', color: textMuted, fontWeight: '500' }}>
                  {lang === 'en' ? `Humidity: ${current.humidity}` : `ஈரப்பதம்: ${current.humidity}`}
                </span>
                <span style={{ fontSize: '11px', color: textMuted, fontWeight: '500' }}>
                  {lang === 'en' ? `Wind: ${current.wind}` : `காற்று: ${current.wind}`}
                </span>
              </div>
            </div>

            {/* Additional details grid for mobile weather card */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '6px 12px', 
              marginTop: '12px', 
              background: isDark ? 'rgba(255, 255, 255, 0.01)' : '#f1f5f9', 
              padding: '10px 12px', 
              borderRadius: '8px', 
              border: '1px solid rgba(255, 255, 255, 0.03)' 
            }}>
              <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '4px' }}>
                <span style={{ color: textMuted }}>{lang === 'en' ? 'UV Index:' : 'யுவி:'}</span>
                <strong>{current.uv}</strong>
              </div>
              <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '4px' }}>
                <span style={{ color: textMuted }}>{lang === 'en' ? 'Air Quality:' : 'காற்று தரம்:'}</span>
                <strong>{lang === 'en' ? current.aqi : current.aqiTa}</strong>
              </div>
              <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '4px' }}>
                <span style={{ color: textMuted }}>{lang === 'en' ? 'Rain Chance:' : 'மழை வாய்ப்பு:'}</span>
                <strong>{lang === 'en' ? current.precipitation : current.precipitationTa}</strong>
              </div>
              <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '4px' }}>
                <span style={{ color: textMuted }}>{lang === 'en' ? 'Visibility:' : 'பார்வைதிறன்:'}</span>
                <strong>{lang === 'en' ? current.visibility : current.visibilityTa}</strong>
              </div>
              <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '4px' }}>
                <span style={{ color: textMuted }}>{lang === 'en' ? 'Sunrise:' : 'சூரிய உதயம்:'}</span>
                <strong>{current.sunrise}</strong>
              </div>
              <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '4px' }}>
                <span style={{ color: textMuted }}>{lang === 'en' ? 'Sunset:' : 'மறைவு:'}</span>
                <strong>{current.sunset}</strong>
              </div>
            </div>

            {/* Daily Summary block for mobile */}
            <div style={{ 
              marginTop: '12px', 
              padding: '8px 12px', 
              background: 'rgba(179, 115, 42, 0.05)', 
              borderRadius: '6px', 
              borderLeft: '2px solid var(--primary, #B3732A)', 
              fontSize: '11px', 
              lineHeight: '1.4', 
              color: textDark,
              textAlign: 'left'
            }}>
              {lang === 'en' ? current.forecastSummaryEn : current.forecastSummaryTa}
            </div>

            {/* Divider Line */}
            <hr style={{ border: 'none', borderTop: '1px solid ' + cardBorder, margin: '12px 0' }} />

            {/* Mon, Tue, Wed 3-Day Forecast side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {current.forecast.slice(0, 3).map((fc, i) => (
                <div 
                  key={i} 
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc',
                    border: '1px solid ' + cardBorder,
                    padding: '8px 4px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: '700', color: textMuted }}>
                    {lang === 'en' ? fc.day : (fc.day === 'Mon' ? 'தி' : fc.day === 'Tue' ? 'செ' : 'பு')}
                  </span>
                  <span style={{ fontSize: '16px' }}>{fc.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: textDark }}>{fc.temp}</span>
                </div>
              ))}
            </div>

          </div>

          {/* DYNAMIC WEATHER ADVISORY & WARNINGS */}
          <div style={{
            background: cardBg,
            border: '1px solid ' + cardBorder,
            padding: '16px',
            borderRadius: '12px',
            marginTop: '20px',
            textAlign: 'left'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '15px',
              fontWeight: '800',
              color: textDark,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ color: 'var(--primary, #B3732A)', fontSize: '14px' }}></i>
              <span>{lang === 'en' ? 'Weather Safety Advisory' : 'வானிலை பாதுகாப்பு எச்சரிக்கை'}</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: textMuted }}>
              {activeAdvisories.map((adv, idx) => (
                <div key={idx} style={{ borderLeft: `2px solid ${adv.color}`, paddingLeft: '8px' }}>
                  <strong style={{ color: textDark, display: 'block', marginBottom: '2px' }}>
                    {lang === 'en' ? adv.titleEn : adv.titleTa}
                  </strong>
                  {lang === 'en' ? adv.textEn : adv.textTa}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Weather;
