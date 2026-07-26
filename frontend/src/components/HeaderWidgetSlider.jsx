import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';

const HeaderWidgetSlider = () => {
  const { lang } = useContext(LanguageContext);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeRiver, setActiveRiver] = useState(0);

  // Dynamic Data States
  const [goldData, setGoldData] = useState({
    g22: '₹8,950/g',
    g24: '₹9,760/g',
    silver: '₹118/g',
    platinum: '₹3,420/g'
  });

  const [vegetables, setVegetables] = useState([
    { labelEn: 'Tomato', labelTa: 'தக்காளி', price: '₹32/kg', change: 'up' },
    { labelEn: 'Onion', labelTa: 'வெங்காயம்', price: '₹38/kg', change: 'down' },
    { labelEn: 'Potato', labelTa: 'உருளைக்கிழங்கு', price: '₹28/kg', change: 'flat' },
    { labelEn: 'Coconut', labelTa: 'தேங்காய்', price: '₹48/pc', change: 'up' },
    { labelEn: 'Garlic', labelTa: 'பூண்டு', price: '₹180/kg', change: 'up' }
  ]);

  const [commodities, setCommodities] = useState([
    { labelEn: 'Paddy', labelTa: 'நெல்', price: '₹2,280/qtl', change: 'up' },
    { labelEn: 'Cotton', labelTa: 'பருத்தி', price: '₹7,450/qtl', change: 'down' },
    { labelEn: 'Turmeric', labelTa: 'மஞ்சள்', price: '₹12,800/qtl', change: 'up' },
    { labelEn: 'Groundnut', labelTa: 'நிலக்கடலை', price: '₹5,600/qtl', change: 'flat' },
    { labelEn: 'Sugarcane', labelTa: 'கரும்பு', price: '₹3,950/ton', change: 'up' }
  ]);

  const [fuelPrices, setFuelPrices] = useState([
    { labelEn: 'Petrol', labelTa: 'பெட்ரோல்', price: '₹104.50/L', change: 'flat' },
    { labelEn: 'Diesel', labelTa: 'டீசல்', price: '₹92.30/L', change: 'flat' },
    { labelEn: 'LPG', labelTa: 'எல்பிஜி', price: '₹803/cyl', change: 'down' },
    { labelEn: 'CNG', labelTa: 'CNG', price: '₹76/kg', change: 'up' }
  ]);

  const [stocks, setStocks] = useState([
    { labelEn: 'Sensex', labelTa: 'சென்செக்ஸ்', val: '↑ 82,350.45', isUp: true },
    { labelEn: 'Nifty', labelTa: 'நிஃப்டி', val: '↑ 25,120.80', isUp: true },
    { labelEn: 'Bank Nifty', labelTa: 'பேங்க் நிஃப்டி', val: '↓ 48,230.10', isUp: false },
    { labelEn: 'Gold Fut', labelTa: 'தங்கம் ப்யூச்சர்ஸ்', val: '↑ ₹71,250', isUp: true },
    { labelEn: 'Crude Oil', labelTa: 'கச்சா எண்ணெய்', val: '↑ $78.40', isUp: true }
  ]);

  const [cryptos, setCryptos] = useState([
    { name: 'Bitcoin', price: '↑ $67,450', isUp: true },
    { name: 'Ethereum', price: '↑ $3,520', isUp: true },
    { name: 'Solana', price: '↓ $142.80', isUp: false },
    { name: 'XRP', price: '↑ $0.62', isUp: true }
  ]);

  const rivers = [
    { nameEn: 'Mettur Dam', nameTa: 'மேட்டூர் அணை', current: '95 ft', max: '120 ft', inflow: '15,000 cfs', outflow: '12,000 cfs', percent: 78, isUp: true },
    { nameEn: 'Bhavani Sagar', nameTa: 'பவானி சாகர்', current: '72 ft', max: '105 ft', inflow: '8,500 cfs', outflow: '6,200 cfs', percent: 68, isUp: true },
    { nameEn: 'Vaigai Dam', nameTa: 'வைகை அணை', current: '48 ft', max: '71 ft', inflow: '3,200 cfs', outflow: '2,800 cfs', percent: 67, isUp: false },
    { nameEn: 'Mullaiperiyar', nameTa: 'முல்லைப்பெரியாறு', current: '128 ft', max: '152 ft', inflow: '12,500 cfs', outflow: '10,800 cfs', percent: 84, isUp: true },
    { nameEn: 'Amaravathi', nameTa: 'அமராவதி அணை', current: '62 ft', max: '90 ft', inflow: '4,800 cfs', outflow: '3,600 cfs', percent: 68, isUp: false },
    { nameEn: 'Sathanur', nameTa: 'சாத்தனூர் அணை', current: '45 ft', max: '68 ft', inflow: '2,100 cfs', outflow: '1,500 cfs', percent: 66, isUp: true },
    { nameEn: 'Krishnagiri', nameTa: 'கிருஷ்ணகிரி அணை', current: '38 ft', max: '55 ft', inflow: '1,800 cfs', outflow: '1,200 cfs', percent: 69, isUp: false }
  ];

  const totalSlides = 7;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const currentDam = rivers[activeRiver];

  return (
    <div className="right-widgets" style={{ maxWidth: '380px', width: '100%' }}>
      <div 
        className="widget-slider" 
        style={{ 
          background: 'var(--white, #ffffff)', 
          border: '1px solid var(--border-color, #E2E8F0)',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: 'var(--shadow-sm, 0 1.5px 4px rgba(0,0,0,0.05))',
          minHeight: '140px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          position: 'relative'
        }}
      >
        {/* Slide 0: Gold Rates */}
        {activeSlide === 0 && (
          <div className="widget-slide">
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#B3732A' }}>
              <i className="fas fa-coins" style={{ color: '#F59E0B' }}></i>
              {lang === 'en' ? 'Chennai Bullion Rates' : 'சென்னை தங்கம் விலை'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>22K Gold:</span>
                <span style={{ fontWeight: 700, color: '#22C55E' }}>{goldData.g22}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>24K Gold:</span>
                <span style={{ fontWeight: 700, color: '#22C55E' }}>{goldData.g24}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Silver:</span>
                <span style={{ fontWeight: 700, color: '#0057FF' }}>{goldData.silver}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Platinum:</span>
                <span style={{ fontWeight: 700, color: '#EF4444' }}>{goldData.platinum}</span>
              </div>
            </div>
          </div>
        )}

        {/* Slide 1: Vegetables */}
        {activeSlide === 1 && (
          <div className="widget-slide">
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#22C55E' }}>
              <i className="fas fa-carrot" style={{ color: '#22C55E' }}></i>
              {lang === 'en' ? 'Vegetable Market' : 'காய்கறி விலை'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '12px' }}>
              {vegetables.slice(0, 4).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? item.labelEn : item.labelTa}:</span>
                  <span style={{ fontWeight: 700, color: item.change === 'up' ? '#22C55E' : item.change === 'down' ? '#EF4444' : 'inherit' }}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 2: Agriculture Commodities */}
        {activeSlide === 2 && (
          <div className="widget-slide">
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A' }}>
              <i className="fas fa-seedling" style={{ color: '#16A34A' }}></i>
              {lang === 'en' ? 'Agri Commodity Rates' : 'வேளாண் பொருட்கள்'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '12px' }}>
              {commodities.slice(0, 4).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? item.labelEn : item.labelTa}:</span>
                  <span style={{ fontWeight: 700, color: item.change === 'up' ? '#22C55E' : item.change === 'down' ? '#EF4444' : 'inherit' }}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 3: Fuel Rates */}
        {activeSlide === 3 && (
          <div className="widget-slide">
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444' }}>
              <i className="fas fa-gas-pump" style={{ color: '#EF4444' }}></i>
              {lang === 'en' ? 'Fuel Rates - Chennai' : 'எரிபொருள் விலை - சென்னை'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '12px' }}>
              {fuelPrices.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? item.labelEn : item.labelTa}:</span>
                  <span style={{ fontWeight: 700, color: item.change === 'up' ? '#22C55E' : item.change === 'down' ? '#EF4444' : 'inherit' }}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 4: Stock Market */}
        {activeSlide === 4 && (
          <div className="widget-slide">
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#0057FF' }}>
              <i className="fas fa-chart-line" style={{ color: '#0057FF' }}></i>
              {lang === 'en' ? 'Stock Market Indices' : 'பங்குச் சந்தை'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '12px' }}>
              {stocks.slice(0, 4).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? item.labelEn : item.labelTa}:</span>
                  <span style={{ fontWeight: 700, color: item.isUp ? '#22C55E' : '#EF4444' }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 5: Crypto */}
        {activeSlide === 5 && (
          <div className="widget-slide">
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#F7931A' }}>
              <i className="fab fa-bitcoin" style={{ color: '#F7931A' }}></i>
              {lang === 'en' ? 'Cryptocurrency' : 'கிரிப்டோகரன்சி'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '12px' }}>
              {cryptos.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.name}:</span>
                  <span style={{ fontWeight: 700, color: item.isUp ? '#22C55E' : '#EF4444' }}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 6: Dam Water Storage (River Widget) */}
        {activeSlide === 6 && (
          <div className="widget-slide river-widget">
            <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
              <i className="fas fa-water" style={{ color: '#0284C7' }}></i>
              {lang === 'en' ? 'Dam Water Storage' : 'நீர்மட்ட நிலவரம்'}
            </h4>
            <div style={{ fontSize: '12px' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary, #B3732A)', marginBottom: '4px' }}>
                {lang === 'en' ? currentDam.nameEn : currentDam.nameTa}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Curr: <strong style={{ color: 'var(--text-dark)' }}>{currentDam.current}</strong></span>
                <span>Max: <strong style={{ color: 'var(--text-dark)' }}>{currentDam.max}</strong></span>
                <span>Inflow: <strong style={{ color: '#22C55E' }}>{currentDam.inflow}</strong></span>
                <span>Outflow: <strong style={{ color: 'var(--text-dark)' }}>{currentDam.outflow}</strong></span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', margin: '6px 0', overflow: 'hidden' }}>
                <div style={{ width: `${currentDam.percent}%`, height: '100%', background: '#0284C7', transition: 'width 0.3s' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span>Storage: {currentDam.percent}%</span>
                <span style={{ color: currentDam.isUp ? '#22C55E' : '#EF4444', fontWeight: 700 }}>{currentDam.isUp ? '▲ Rising' : '▼ Falling'}</span>
              </div>
            </div>
            {/* Dam Switcher Buttons 1 to 7 */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px', justifyContent: 'center' }}>
              {rivers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActiveRiver(idx); }}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: 'none',
                    background: activeRiver === idx ? '#0284C7' : '#CBD5E1',
                    color: activeRiver === idx ? '#ffffff' : '#334155',
                    fontSize: '9px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Slide Indicator Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <span
              key={idx}
              onClick={() => setActiveSlide(idx)}
              style={{
                width: activeSlide === idx ? '16px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: activeSlide === idx ? 'var(--primary, #B3732A)' : '#CBD5E1',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderWidgetSlider;
