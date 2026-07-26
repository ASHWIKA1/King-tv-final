import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';
import './AiAssistant.css';

const AiAssistant = () => {
  const { lang } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'voice'
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize data
  useEffect(() => {
    fetchApi('/articles').then(data => {
      if (Array.isArray(data)) setArticles(data);
    }).catch(err => console.warn("AI Assistant failed to load articles", err));

    fetchApi('/videos').then(data => {
      if (Array.isArray(data)) setVideos(data);
    }).catch(err => console.warn("AI Assistant failed to load videos", err));
  }, []);

  // Listen for custom open events (e.g. from header search button)
  useEffect(() => {
    const handleToggle = (e) => {
      setIsOpen(true);
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab);
      }
      setChatHistory(prev => {
        if (prev.length === 0) {
          const welcomeMsg = lang === 'en'
            ? "Hello! I am your KINGS 24x7 AI Assistant. Search news or use the voice assistant to hear audio updates."
            : "வணக்கம்! நான் கிங்ஸ் 24x7 ஏஐ குரல் மற்றும் தேடல் செயலி. செய்திகளைத் தேட அல்லது குரல் வழி செய்திகளைக் கேட்கப் பேசுங்கள்.";
          return [{ sender: 'bot', text: welcomeMsg }];
        }
        return prev;
      });
    };
    window.addEventListener('toggle-ai-assistant', handleToggle);
    return () => window.removeEventListener('toggle-ai-assistant', handleToggle);
  }, [lang]);

  // Set up Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'en' ? 'en-US' : 'ta-IN';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleAiSearch(transcript);
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Speech synthesis speaker
  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const cleanText = text.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'en' ? 'en-US' : 'ta-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Perform the search matching logic
  const handleAiSearch = async (query) => {
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setChatHistory(prev => [...prev, userMessage]);

    // Perform matching against articles & videos
    const lowerQuery = query.toLowerCase().trim();
    
    // Check articles
    let matchedArticles = articles.filter(art => 
      (art.titleEn || '').toLowerCase().includes(lowerQuery) ||
      (art.titleTa || '').toLowerCase().includes(lowerQuery) ||
      (art.shortDescEn || '').toLowerCase().includes(lowerQuery) ||
      (art.shortDescTa || '').toLowerCase().includes(lowerQuery) ||
      (art.contentEn || '').toLowerCase().includes(lowerQuery) ||
      (art.contentTa || '').toLowerCase().includes(lowerQuery)
    );

    // Smart query routing / synonym expanding
    if (matchedArticles.length === 0) {
      if (lowerQuery.includes('cm') || lowerQuery.includes('chief minister') || lowerQuery.includes('politics') || lowerQuery.includes('vijay') || lowerQuery.includes('முதல்வர்') || lowerQuery.includes('அரசியல்') || lowerQuery.includes('கூட்டணி')) {
        matchedArticles = articles.filter(art => 
          (art.titleEn || '').toLowerCase().includes('politics') || 
          (art.titleTa || '').toLowerCase().includes('அரசியல்') ||
          (art.titleEn || '').toLowerCase().includes('vijay') || 
          (art.titleTa || '').toLowerCase().includes('விஜய்')
        );
      } else if (lowerQuery.includes('space') || lowerQuery.includes('isro') || lowerQuery.includes('gaganyaan') || lowerQuery.includes('விண்வெளி') || lowerQuery.includes('இஸ்ரோ') || lowerQuery.includes('ககன்யான்')) {
        matchedArticles = articles.filter(art => 
          (art.titleEn || '').toLowerCase().includes('space') || 
          (art.titleTa || '').toLowerCase().includes('விண்வெளி')
        );
      } else if (lowerQuery.includes('metro') || lowerQuery.includes('rail') || lowerQuery.includes('chennai') || lowerQuery.includes('மெட்ரோ') || lowerQuery.includes('ரயில்') || lowerQuery.includes('சென்னை')) {
        matchedArticles = articles.filter(art => 
          (art.titleEn || '').toLowerCase().includes('metro') || 
          (art.titleTa || '').toLowerCase().includes('மெட்ரோ')
        );
      } else if (lowerQuery.includes('sports') || lowerQuery.includes('cricket') || lowerQuery.includes('விளையாட்டு') || lowerQuery.includes('கிரிக்கெட்')) {
        matchedArticles = articles.filter(art => 
          (art.titleEn || '').toLowerCase().includes('cricket') || 
          (art.titleTa || '').toLowerCase().includes('கிரிக்கெட்')
        );
      } else if (lowerQuery.includes('business') || lowerQuery.includes('gdp') || lowerQuery.includes('trade') || lowerQuery.includes('economy') || lowerQuery.includes('பொருளாதாரம்') || lowerQuery.includes('ஜிடிபி')) {
        matchedArticles = articles.filter(art => 
          (art.titleEn || '').toLowerCase().includes('gdp') || 
          (art.titleTa || '').toLowerCase().includes('ஜிடிபி')
        );
      } else if (lowerQuery.includes('tech') || lowerQuery.includes('ai') || lowerQuery.includes('gpt') || lowerQuery.includes('openai') || lowerQuery.includes('தொழில்நுட்பம்') || lowerQuery.includes('செயற்கை நுண்ணறிவு') || lowerQuery.includes('சாட்ஜிபிடி')) {
        matchedArticles = articles.filter(art => 
          (art.titleEn || '').toLowerCase().includes('openai') || 
          (art.titleTa || '').toLowerCase().includes('ஜிபிடி')
        );
      }
    }

    // Check videos
    const matchedVideos = videos.filter(vid => 
      (vid.title || '').toLowerCase().includes(lowerQuery) ||
      (vid.description || '').toLowerCase().includes(lowerQuery)
    );

    let replyText = '';
    let links = [];

    if (matchedArticles.length > 0 || matchedVideos.length > 0) {
      if (lang === 'en') {
        replyText = `According to KINGS 24x7 AI search, I found relevant updates: <br/>`;
        if (matchedArticles.length > 0) {
          replyText += `<strong>News Articles:</strong><br/>`;
          matchedArticles.forEach((art, idx) => {
            replyText += `${idx + 1}. ${art.titleEn}<br/>`;
            links.push({ type: 'article', id: art.id || art.article_id, title: art.titleEn });
          });
        }
        if (matchedVideos.length > 0) {
          replyText += `<br/><strong>Video Coverages:</strong><br/>`;
          matchedVideos.forEach((vid, idx) => {
            replyText += `${idx + 1}. ${vid.title}<br/>`;
            links.push({ type: 'video', id: vid.id || vid.videoId, title: vid.title });
          });
        }
      } else {
        replyText = `கிங்ஸ் 24x7 ஏஐ தேடலின்படி, பின்வரும் செய்திகள் கண்டறியப்பட்டன: <br/>`;
        if (matchedArticles.length > 0) {
          replyText += `<strong>செய்தி கட்டுரைகள்:</strong><br/>`;
          matchedArticles.forEach((art, idx) => {
            replyText += `${idx + 1}. ${art.titleTa}<br/>`;
            links.push({ type: 'article', id: art.id || art.article_id, title: art.titleTa });
          });
        }
        if (matchedVideos.length > 0) {
          replyText += `<br/><strong>வீடியோ பதிவுகள்:</strong><br/>`;
          matchedVideos.forEach((vid, idx) => {
            replyText += `${idx + 1}. ${vid.title}<br/>`;
            links.push({ type: 'video', id: vid.id || vid.videoId, title: vid.title });
          });
        }
      }

      const botMessage = { sender: 'bot', text: replyText, links };
      setTimeout(() => {
        setChatHistory(prev => [...prev, botMessage]);
        speakResponse(replyText);
      }, 600);

    } else {
      // Fallback: Call Third Party Wikipedia Search API!
      try {
        const searchLang = lang === 'ta' ? 'ta' : 'en';
        const wikiSearchUrl = `https://${searchLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        const res = await fetch(wikiSearchUrl);
        const data = await res.json();
        
        const searchResults = data?.query?.search || [];
        if (searchResults.length > 0) {
          const topResult = searchResults[0];
          const topTitle = topResult.title;
          
          // Get page summary from Wikipedia REST API
          const summaryUrl = `https://${searchLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`;
          const summaryRes = await fetch(summaryUrl);
          const summaryData = await summaryRes.json();
          
          if (summaryData.extract) {
            if (lang === 'en') {
              replyText = `<strong>AI Search (via Wikipedia API):</strong><br/>${summaryData.extract}`;
            } else {
              replyText = `<strong>ஏஐ தேடல் (விக்கிப்பீடியா வழியாக):</strong><br/>${summaryData.extract}`;
            }
            links.push({ type: 'external', url: summaryData.content_urls?.desktop?.page || `https://${searchLang}.wikipedia.org/wiki/${encodeURIComponent(topTitle)}`, title: topTitle });
          } else {
            // Snippet fallback
            const snippetClean = topResult.snippet.replace(/<\/?[^>]+(>|$)/g, "");
            if (lang === 'en') {
              replyText = `<strong>AI Search (via Wikipedia API):</strong><br/>${snippetClean}...`;
            } else {
              replyText = `<strong>ஏஐ தேடல் (விக்கிப்பீடியா வழியாக):</strong><br/>${snippetClean}...`;
            }
            links.push({ type: 'external', url: `https://${searchLang}.wikipedia.org/wiki/${encodeURIComponent(topTitle)}`, title: topTitle });
          }
        } else {
          // No Wikipedia results either
          if (lang === 'en') {
            replyText = `I couldn't find any direct match for "${query}". Try searching for <strong>politics</strong>, <strong>metro rail</strong>, <strong>cricket</strong>, or <strong>GPT-5</strong>.`;
          } else {
            replyText = `"${query}" தொடர்பாகத் தகவல்கள் ஏதும் இல்லை. <strong>அரசியல்</strong>, <strong>மெட்ரோ ரயில்</strong>, <strong>கிரிக்கெட்</strong> அல்லது <strong>ஜிபிடி-5</strong> என தேடிப் பாருங்கள்.`;
          }
        }
      } catch (err) {
        console.warn("Wikipedia API search failed, using local fallback suggestions", err);
        if (lang === 'en') {
          replyText = `I couldn't find any direct match for "${query}". Try searching for <strong>politics</strong>, <strong>metro rail</strong>, <strong>cricket</strong>, or <strong>GPT-5</strong>.`;
        } else {
          replyText = `"${query}" தொடர்பாகத் தகவல்கள் ஏதும் இல்லை. <strong>அரசியல்</strong>, <strong>மெட்ரோ ரயில்</strong>, <strong>கிரிக்கெட்</strong> அல்லது <strong>ஜிபிடி-5</strong> என தேடிப் பாருங்கள்.`;
        }
      }

      const botMessage = { sender: 'bot', text: replyText, links };
      setChatHistory(prev => [...prev, botMessage]);
      speakResponse(replyText);
    }

    setSearchQuery('');
  };

  const startVoiceListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } else {
      alert(lang === 'en' ? "Voice recognition not supported in this browser." : "உங்கள் உலாவியில் குரல் தேடல் வசதி ஆதரிக்கப்படவில்லை.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAiSearch(searchQuery);
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
    // Add welcome message if chat empty
    if (!isOpen && chatHistory.length === 0) {
      const welcomeMsg = lang === 'en'
        ? "Hello! I am your KINGS 24x7 AI Assistant. Search news or use the voice assistant to hear audio updates."
        : "வணக்கம்! நான் கிங்ஸ் 24x7 ஏஐ குரல் மற்றும் தேடல் செயலி. செய்திகளைத் தேட அல்லது குரல் வழி செய்திகளைக் கேட்கப் பேசுங்கள்.";
      setChatHistory([{ sender: 'bot', text: welcomeMsg }]);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        className={`ai-assistant-toggle ${isOpen ? 'open' : ''}`} 
        onClick={togglePanel}
        aria-label="AI Search and Voice Assistant"
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <div className="ai-icon-wrapper">
            <i className="fas fa-robot"></i>
            <span className="pulse-glowing-ring"></span>
          </div>
        )}
      </button>

      {/* AI Assistant Drawer Panel */}
      <div className={`ai-assistant-panel ${isOpen ? 'open' : ''}`}>
        {/* Panel Header */}
        <div className="ai-panel-header">
          <div className="bot-info">
            <div className="bot-avatar">
              <i className="fas fa-robot"></i>
              <span className="online-dot"></span>
            </div>
            <div>
              <h3>KINGS 24x7 AI</h3>
              <span>{lang === 'en' ? 'Voice & Search Engine' : 'குரல் & ஏஐ தேடல்'}</span>
            </div>
          </div>
          <button className="close-panel-btn" onClick={togglePanel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Panel Tabs */}
        <div className="ai-panel-tabs">
          <button 
            className={`ai-tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <i className="fas fa-search"></i> {lang === 'en' ? 'AI Search' : 'ஏஐ தேடல்'}
          </button>
          <button 
            className={`ai-tab-btn ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('voice')}
          >
            <i className="fas fa-microphone"></i> {lang === 'en' ? 'AI Voice' : 'குரல் அசிஸ்டண்ட்'}
          </button>
        </div>

        {/* Panel Body (Chat History) */}
        <div className="ai-panel-body">
          <div className="chat-container">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="bot-chat-icon"><i className="fas fa-robot"></i></div>
                )}
                <div className="chat-bubble">
                  <div dangerouslySetInnerHTML={{ __html: msg.text }}></div>
                  
                  {/* Clickable links to actual articles/videos/external */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="matched-links-container">
                      {msg.links.map((link, lIdx) => 
                        link.type === 'external' ? (
                          <a 
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="matched-link-item"
                          >
                            <i className="fas fa-external-link-alt"></i>
                            <span>{link.title}</span>
                          </a>
                        ) : (
                          <Link 
                            key={lIdx} 
                            to={link.type === 'article' ? `/article/${link.id}` : `/videos`}
                            onClick={() => setIsOpen(false)}
                            className="matched-link-item"
                          >
                            <i className={link.type === 'article' ? "far fa-newspaper" : "fas fa-play-circle"}></i>
                            <span>{link.title}</span>
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Panel Input Bar */}
        <div className="ai-panel-footer">
          {activeTab === 'voice' ? (
            <div className="voice-input-container">
              <button 
                className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
                onClick={startVoiceListening}
                aria-label="Start Voice Input"
              >
                <i className="fas fa-microphone fa-lg"></i>
                {isListening && <span className="mic-wave-pulse"></span>}
              </button>
              <div className="voice-status-text">
                {isListening 
                  ? (lang === 'en' ? 'Listening...' : 'கேட்கிறது, பேசுங்கள்...') 
                  : (lang === 'en' ? 'Click to speak' : 'பேச தட்டவும்')}
              </div>
            </div>
          ) : (
            <div className="search-input-container">
              <input 
                type="text" 
                placeholder={lang === 'en' ? 'Search news articles/videos...' : 'செய்திகள்/வீடியோக்களைத் தேடுக...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="send-btn" onClick={() => handleAiSearch(searchQuery)} aria-label="Send query">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AiAssistant;
