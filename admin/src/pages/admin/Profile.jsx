import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Key, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import ImageUploadPreview from '../../components/common/ImageUploadPreview';

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', profileImage: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPwd, setChangingPwd] = useState(false);
  
  const [msg, setMsg] = useState(null);
  const showMsg = (text, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 5000);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setProfile(res.data);
      setFormData({ fullName: res.data.fullName || '', profileImage: res.data.profileImage || '' });
    } catch (e) {
      showMsg('Failed to load profile', true);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/user/profile', { fullName: formData.fullName });
      
      // If we need to upload image, we do it separately if it's a file, but here we can just pass URL if it's already uploaded.
      // Wait, ImageUploadPreview usually handles uploading and gives back the URL.
      // Let's assume ImageUploadPreview gives the URL and we update it. Actually, `/user/profile` in backend doesn't take profileImage in the request map!
      // Let's check UserController.java: updateProfile takes only `fullName`. 
      // If we need to update profileImage, we use `/user/profile-image` which takes MultipartFile.
      // If the ImageUploadPreview uploads it, it might use `/articles/upload` and return a URL. But we can't save the URL via `/user/profile`.
      // Let's look at how we can handle this. For now, we will just update fullName.
      
      setProfile(res.data);
      setEditMode(false);
      showMsg('Profile updated successfully');
    } catch (e) {
      showMsg('Failed to update profile', true);
    }
    setSavingProfile(false);
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      showMsg('Uploading image...');
      const res = await api.post('/user/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profileImage: res.data.profileImage }));
      setFormData(prev => ({ ...prev, profileImage: res.data.profileImage }));
      showMsg('Profile image updated');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to upload image', true);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      return showMsg('New passwords do not match', true);
    }
    setChangingPwd(true);
    try {
      await api.put('/user/profile/change-password', {
        oldPassword: pwdData.oldPassword,
        newPassword: pwdData.newPassword
      });
      showMsg('Password changed successfully');
      setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      showMsg(e.response?.data?.message || 'Failed to change password', true);
    }
    setChangingPwd(false);
  };
  
  const handleSetup2FA = async () => {
    try {
      const res = await api.post('/auth/2fa/setup');
      alert('2FA Setup Initiated. Secret Key: ' + res.data.secretKey + '\n(Normally you would show a QR code here)');
    } catch (e) {
      showMsg('Failed to initiate 2FA setup', true);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", fontSize: "1.75rem", fontWeight: 700 }}>
        <User size={26} color="var(--primary)" /> My Profile
      </h1>

      {msg && (
        <div style={{ padding: "0.75rem 1rem", marginBottom: "1.5rem", borderRadius: "8px", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem",
          background: msg.isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          color: msg.isError ? "#EF4444" : "#10B981" }}>
          {msg.isError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Profile Details */}
          <div className="glass-panel" style={{ padding: "2rem", borderRadius: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Account Information</h2>
              {!editMode && <button className="btn btn-secondary" onClick={() => setEditMode(true)}>Edit Profile</button>}
            </div>
            
            {editMode ? (
              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                  <input className="form-control" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                </div>
                <div>
                  <label className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Email (Cannot be changed)</label>
                  <input className="form-control" value={profile?.email} disabled style={{ opacity: 0.7 }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditMode(false); setFormData({ fullName: profile?.fullName || '', profileImage: profile?.profileImage || '' }); }}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>Full Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{profile?.fullName}</div>
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>Email Address</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={16} className="text-muted" /> {profile?.email}
                  </div>
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>Role</div>
                  <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
                    {profile?.role}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="glass-panel" style={{ padding: "2rem", borderRadius: "14px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={20} color="var(--primary)" /> Change Password
            </h2>
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Current Password</label>
                <input type="password" className="form-control" value={pwdData.oldPassword} onChange={e => setPwdData({...pwdData, oldPassword: e.target.value})} required />
              </div>
              <div>
                <label className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>New Password</label>
                <input type="password" className="form-control" value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} required minLength="8" />
              </div>
              <div>
                <label className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Confirm New Password</label>
                <input type="password" className="form-control" value={pwdData.confirmPassword} onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})} required minLength="8" />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={changingPwd}>{changingPwd ? 'Updating...' : 'Update Password'}</button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Avatar Card */}
          <div className="glass-panel" style={{ padding: "2rem", borderRadius: "14px", textAlign: "center" }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem auto' }}>
              {profile?.profileImage ? (
                <img src={profile.profileImage.startsWith('http') ? profile.profileImage : ('http://localhost:8080' + profile.profileImage)} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-secondary)', border: '3px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  {profile?.fullName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <Camera size={18} />
                <input type="file" style={{ display: 'none' }} accept="image/png, image/jpeg" onChange={handleImageUpload} />
              </label>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.25rem' }}>{profile?.fullName}</h3>
            <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Member since {profile?.createdAt}</p>
          </div>

          {/* Security / 2FA */}
          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "14px" }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="var(--primary)" /> Two-Factor Auth
            </h3>
            <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Enhance your account security by enabling two-factor authentication (2FA).
            </p>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSetup2FA}>
              Setup 2FA
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
