const API_BASE = import.meta.env.VITE_API_BASE || 'https://kings-tv.onrender.com/api/v1';

export const userService = {
  async getProfile(token) {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }
    return res.json();
  },

  async updateProfile(token, fullName) {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ fullName })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update profile');
    }
    return res.json();
  },

  async uploadProfileImage(token, file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/user/profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to upload profile picture');
    }
    return res.json();
  }
};
