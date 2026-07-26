import React, { useState, useEffect } from 'react';
import api from '../../api';
import { ShieldAlert, Plus, Trash2 } from 'lucide-react';

const ProfanityFilter = () => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    setLoading(true);
    try {
      // Backend returns a list of dictionary words
      const res = await api.get('/admin/profanity/dictionary');
      setWords(res.data || []);
    } catch (error) {
      console.error("Failed to fetch profanity list", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    
    try {
      await api.post('/admin/profanity/dictionary', { term: newWord.trim() });
      setNewWord('');
      fetchWords();
    } catch (e) {
      alert("Failed to add word");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Remove this word from the filter dictionary?")) {
      try {
        await api.delete(`/admin/profanity/dictionary/${id}`);
        fetchWords();
      } catch (e) {
        alert("Failed to delete word");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Profanity Filter</h1>
          <p className="text-secondary">Manage the bad-word dictionary that automatically flags UGC submissions.</p>
        </div>
        <div style={{ padding: '0.75rem', background: 'var(--danger-glow)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <ShieldAlert size={20} />
          Filter Active
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Add New Term</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label">Blacklisted Word / Phrase</label>
              <input 
                type="text" 
                className="form-control" 
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Enter word here..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Plus size={16} /> Add to Dictionary
            </button>
          </form>
        </div>

        <div className="glass-panel table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Added Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : words.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Dictionary is empty.</td></tr>
              ) : (
                words.map(w => (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 600 }}>{w.term}</td>
                    <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem', color: 'var(--danger)' }} 
                        onClick={() => handleDelete(w.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfanityFilter;
