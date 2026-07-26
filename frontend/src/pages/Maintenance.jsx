import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Maintenance = () => {
  const { lang } = useContext(LanguageContext);

  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A, #1E293B)',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '50px 30px',
        maxWidth: '560px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Animated Icon */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <i className="fas fa-tools fa-2x" style={{ color: '#FFD700' }}></i>
          </div>
          <div className="pulse" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '2px solid #FFD700',
            opacity: 0.8,
            boxSizing: 'border-box'
          }} />
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.5px' }}>
          {lang === 'en' ? 'System Under Maintenance' : 'கணினி பராமரிப்பில் உள்ளது'}
        </h1>

        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '15px', lineHeight: 1.6, margin: '0 0 30px 0' }}>
          {lang === 'en' 
            ? "We are currently performing scheduled maintenance to improve our platform services. We apologize for the inconvenience and will be back online shortly."
            : "எங்கள் செய்தி தள சேவைகளை மேம்படுத்த தற்போது திட்டமிடப்பட்ட பராமரிப்புப் பணிகள் நடைபெற்று வருகின்றன. விரைவில் நாங்கள் நேரலைக்குத் திரும்புவோம்."}
        </p>

        <div style={{
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          fontSize: '13px',
          color: '#FFD700',
          fontWeight: 700,
          display: 'inline-block'
        }}>
          <i className="far fa-clock"></i> {lang === 'en' ? 'Estimated time: 30 minutes' : 'மதிப்பிடப்பட்ட நேரம்: 30 நிமிடங்கள்'}
        </div>
      </div>

      <style>{`
        @keyframes pulse-anim {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        .pulse {
          animation: pulse-anim 2s infinite ease-out;
        }
      `}</style>
    </main>
  );
};

export default Maintenance;
