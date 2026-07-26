const API_BASE = import.meta.env.VITE_API_BASE || 'https://kings-tv.onrender.com/api/v1';

export const authService = {
  async register(fullName, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async logout(refreshToken) {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    return res.ok;
  },

  async googleLogin(email, name, profileImage) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, profileImage })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Google Login failed');
    }
    return res.json();
  },

  async appleLogin(email, name) {
    const res = await fetch(`${API_BASE}/auth/apple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Apple Login failed');
    }
    return res.json();
  },

  async facebookLogin(email, name, profileImage) {
    const res = await fetch(`${API_BASE}/auth/facebook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, profileImage })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Facebook Login failed');
    }
    return res.json();
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Forgot password failed');
    }
    return res.json();
  },

  async verifyOtp(email, otp) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'OTP verification failed');
    }
    return res.json();
  },

  async resetPassword(email, otp, newPassword) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Password reset failed');
    }
    return res.json();
  },

  async sendSmsOtp(phoneNumber) {
    const res = await fetch(`${API_BASE}/auth/send-sms-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to request OTP');
    }
    return res.json();
  },

  async verifySmsOtp(phoneNumber, otpCode) {
    const res = await fetch(`${API_BASE}/auth/verify-sms-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otpCode })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'OTP verification failed');
    }
    return res.json();
  }
};
