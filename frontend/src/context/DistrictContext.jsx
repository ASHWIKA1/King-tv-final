import React, { createContext, useState, useEffect } from 'react';

const DISTRICT_MAP = {
  'சென்னை': 'Chennai',
  'கோயம்புத்தூர்': 'Coimbatore',
  'மதுரை': 'Madurai',
  'சேலம்': 'Salem',
  'திருச்சி': 'Trichy',
  'திருநெல்வேலி': 'Tirunelveli',
  'வேலூர்': 'Vellore',
  'ஈரோடு': 'Erode',
  'தஞ்சாவூர்': 'Tanjore',
  'கன்னியாகுமரி': 'Kanyakumari',
  'நாமக்கல்': 'Namakkal',
  'புதுச்சேரி': 'Puducherry'
};

export const DistrictContext = createContext();

export const DistrictProvider = ({ children }) => {
  const [district, setDistrictState] = useState(() => {
    return localStorage.getItem('selectedDistrict') || 'சென்னை';
  });

  const setDistrict = (key) => {
    setDistrictState(key);
    localStorage.setItem('selectedDistrict', key);
  };

  const autoDetectLocation = () => {
    const isSecure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isSecure && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Using BigDataCloud free client-side reverse geocoding which works better on localhost without API keys
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            if (data) {
              const addressValues = [
                data.city, 
                data.locality, 
                data.principalSubdivision, 
                ...(data.localityInfo?.administrative?.map(a => a.name) || [])
              ].join(' ').toLowerCase();
              
              const mappedTamilDistrict = Object.keys(DISTRICT_MAP).find(
                (tamilName) =>
                  addressValues.includes(DISTRICT_MAP[tamilName].toLowerCase())
              );

              if (mappedTamilDistrict) {
                setDistrict(mappedTamilDistrict);
              } else {
                const fallbackLocation = data.city || data.locality || data.principalSubdivision;
                if (fallbackLocation) {
                  setDistrict(fallbackLocation);
                } else {
                  console.warn('Location detected but district could not be parsed:', addressValues);
                }
              }
            }
          } catch (error) {
            console.warn('Location data fetch failed:', error);
          }
        },
        (error) => {
          // Graceful silent fallback over HTTP / permission denied
        },
        { timeout: 5000 }
      );
    }
  };

  useEffect(() => {
    const hasSelectedBefore = localStorage.getItem('selectedDistrict');
    if (!hasSelectedBefore) {
      autoDetectLocation();
    }
  }, []);

  const districtEn = DISTRICT_MAP[district] || 'Chennai';

  return (
    <DistrictContext.Provider value={{ district, setDistrict, districtEn, DISTRICT_MAP, autoDetectLocation }}>
      {children}
    </DistrictContext.Provider>
  );
};
