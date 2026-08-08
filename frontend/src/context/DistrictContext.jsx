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
  'நாமக்கல்': 'Namakkal'
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

  const districtEn = DISTRICT_MAP[district] || 'Chennai';

  return (
    <DistrictContext.Provider value={{ district, setDistrict, districtEn, DISTRICT_MAP }}>
      {children}
    </DistrictContext.Provider>
  );
};
