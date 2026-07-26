import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import ProfileCard from '../components/ProfileCard';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const { user, token, isAuthenticated, updateUser } = useContext(AuthContext);
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="profile-page-wrapper" style={{
      background: '#000000',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {lang === 'en' ? 'My Workspace Profile' : 'எனது சுயவிவர பக்க பணியிடம்'}
        </h1>
        <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '12px auto 0 auto', borderRadius: '2px' }}></div>
      </div>

      <ProfileCard 
        user={user} 
        onEditClick={() => setShowEditModal(true)} 
      />

      {showEditModal && (
        <EditProfileModal 
          user={user} 
          token={token} 
          onClose={() => setShowEditModal(false)} 
          onSaveSuccess={(updatedUser) => {
            updateUser(updatedUser);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
