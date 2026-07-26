import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';

const Directory = () => {
  const { lang, t } = useContext(LanguageContext);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('hospital');
  const [locality, setLocality] = useState('');
  const [hours, setHours] = useState('');
  const [phone, setPhone] = useState('');

  const fallbackListings = lang === 'en' ? [
    { id: 'demo-1', businessName: 'Apollo Clinic', category: 'hospital', addressLocality: 'Anna Nagar, Chennai', workingHours: '24 Hours Service', phoneNumber: '+91 44 2829 0200', rating: 4.5 },
    { id: 'demo-2', businessName: 'Raja Electricals & Plumbing', category: 'plumber', addressLocality: 'Gandhi Street, Coimbatore', workingHours: '9:00 AM - 7:00 PM', phoneNumber: '+91 98456 12345', rating: 4.8 },
    { id: 'demo-3', businessName: 'Selvam Wiring Service', category: 'electrician', addressLocality: 'Bus Stand Road, Madurai', workingHours: '8:00 AM - 8:00 PM', phoneNumber: '+91 98765 43210', rating: 4.2 },
    { id: 'demo-4', businessName: 'Sri Garden Restaurant', category: 'restaurant', addressLocality: 'Chinna Kadai Street, Trichy', workingHours: '7:00 AM - 11:00 PM', phoneNumber: '+91 431 270 1234', rating: 4.6 },
    { id: 'demo-5', businessName: 'Kannan Departmental Stores', category: 'store', addressLocality: 'Junction Road, Salem', workingHours: '9:00 AM - 10:00 PM', phoneNumber: '+91 427 244 5678', rating: 4.4 }
  ] : [
    { id: 'demo-1', businessName: 'அப்பல்லோ கிளினிக்', category: 'hospital', addressLocality: 'அண்ணா நகர், சென்னை', workingHours: '24 மணி நேர சேவை', phoneNumber: '+91 44 2829 0200', rating: 4.5 },
    { id: 'demo-2', businessName: 'ராஜா எலக்ட்ரிக்கல்ஸ் & பிளம்பிங்', category: 'plumber', addressLocality: 'காந்தி வீதி, கோயம்புத்தூர்', workingHours: 'காலை 9:00 - மாலை 7:00', phoneNumber: '+91 98456 12345', rating: 4.8 },
    { id: 'demo-3', businessName: 'செல்வம் வயரிங் சர்வீஸ்', category: 'electrician', addressLocality: 'பஸ் ஸ்டாண்ட் ரோடு, மதுரை', workingHours: 'காலை 8:00 - இரவு 8:00', phoneNumber: '+91 98765 43210', rating: 4.2 },
    { id: 'demo-4', businessName: 'ஸ்ரீ கார்டன் உணவகம்', category: 'restaurant', addressLocality: 'சின்ன கடை வீதி, திருச்சி', workingHours: 'காலை 7:00 - இரவு 11:00', phoneNumber: '+91 431 270 1234', rating: 4.6 },
    { id: 'demo-5', businessName: 'கண்ணன் டிபார்ட்மெண்டல் ஸ்டோர்ஸ்', category: 'store', addressLocality: 'ஜங்ஷன் ரோடு, சேலம்', workingHours: 'காலை 9:00 - இரவு 10:00', phoneNumber: '+91 427 244 5678', rating: 4.4 }
  ];

  const loadData = () => {
    fetchApi('/directory')
      .then(data => {
        const formatted = Array.isArray(data) ? data.map(item => {
          const rawName = item.businessName || item.business_name || '';
          const rawLocality = (item.addressStreet ? `${item.addressStreet}, ` : '') + (item.addressLocality || '');
          const rawHours = item.workingHours || item.working_hours || '';
          
          let nameVal = rawName;
          let localityVal = rawLocality;
          let hoursVal = rawHours;
          
          if (lang === 'en') {
            if (rawName.includes('அப்பல்லோ')) nameVal = 'Apollo Clinic';
            else if (rawName.includes('ராஜா')) nameVal = 'Raja Electricals & Plumbing';
            else if (rawName.includes('செல்வம்')) nameVal = 'Selvam Wiring Service';
            else if (rawName.includes('ஸ்ரீ கார்டன்')) nameVal = 'Sri Garden Restaurant';
            else if (rawName.includes('கண்ணன்')) nameVal = 'Kannan Departmental Stores';
            
            if (rawLocality.includes('சென்னை')) localityVal = rawLocality.replace('சென்னை', 'Chennai').replace('அண்ணா நகர்', 'Anna Nagar');
            else if (rawLocality.includes('கோயம்புத்தூர்') || rawLocality.includes('கோவை')) localityVal = rawLocality.replace('கோயம்புத்தூர்', 'Coimbatore').replace('கோவை', 'Coimbatore').replace('காந்தி வீதி', 'Gandhi Street');
            else if (rawLocality.includes('மதுரை')) localityVal = rawLocality.replace('மதுரை', 'Madurai').replace('பஸ் ஸ்டாண்ட் ரோடு', 'Bus Stand Road');
            else if (rawLocality.includes('திருச்சி')) localityVal = rawLocality.replace('திருச்சிராப்பள்ளி', 'Tiruchirappalli').replace('திருச்சி', 'Trichy').replace('சின்ன கடை வீதி', 'Chinna Kadai Street');
            else if (rawLocality.includes('சேலம்')) localityVal = rawLocality.replace('சேலம்', 'Salem').replace('ஜங்ஷன் ரோடு', 'Junction Road');
            
            if (rawHours.includes('மணி')) hoursVal = '24 Hours Service';
            else if (rawHours.includes('காலை') && rawHours.includes('மாலை')) hoursVal = rawHours.replace('காலை', '').replace('மாலை', '').replace('9:00', '9:00 AM').replace('7:00', '7:00 PM');
            else if (rawHours.includes('காலை') && rawHours.includes('இரவு')) hoursVal = rawHours.replace('காலை', '').replace('இரவு', '').replace('8:00', '8:00 AM').replace('8:00', '8:00 PM').replace('9:00', '9:00 AM').replace('10:00', '10:00 PM').replace('7:00', '7:00 AM').replace('11:00', '11:00 PM');
          }
          
          return {
            id: item.listing_id || item.id,
            businessName: nameVal,
            category: (item.category || '').toLowerCase(),
            addressLocality: localityVal,
            workingHours: hoursVal || (lang === 'en' ? '9:00 AM - 9:00 PM' : 'காலை 9:00 - இரவு 9:00'),
            phoneNumber: item.phoneNumber || item.phone_number,
            rating: item.rating || 5.0
          };
        }) : [];
        const merged = [...formatted, ...fallbackListings];
        setListings(merged);
        setFilteredListings(merged);
      })
      .catch((err) => {
        console.warn("Could not fetch directory from API, using fallback", err);
        setListings(fallbackListings);
        setFilteredListings(fallbackListings);
      });
  };

  useEffect(() => {
    loadData();
  }, [lang]);

  useEffect(() => {
    let result = listings;

    // Category filter
    if (selectedCat !== 'all') {
      result = result.filter(item => item.category === selectedCat);
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.businessName.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) ||
        item.addressLocality.toLowerCase().includes(query)
      );
    }

    setFilteredListings(result);
  }, [selectedCat, searchQuery, listings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApi('/directory', {
      method: 'POST',
      body: JSON.stringify({
        businessName: name,
        category: category.toLowerCase(),
        addressLocality: locality,
        addressStreet: '',
        workingHours: hours,
        phoneNumber: phone
      })
    })
    .then(() => {
      setName('');
      setLocality('');
      setHours('');
      setPhone('');
      setShowModal(false);
      loadData();
    })
    .catch(err => {
      console.warn("API directory save failed, updating locally", err);
      const newListing = {
        id: Date.now(),
        businessName: name,
        category: category,
        addressLocality: locality,
        workingHours: hours || 'காலை 9:00 - இரவு 9:00',
        phoneNumber: phone,
        rating: 5.0
      };
      setListings(prev => [newListing, ...prev]);
      setName('');
      setLocality('');
      setHours('');
      setPhone('');
      setShowModal(false);
    });
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      hospital: lang === 'en' ? 'Hospital' : 'மருத்துவமனை',
      plumber: lang === 'en' ? 'Plumber' : 'பிளம்பர்',
      electrician: lang === 'en' ? 'Electrician' : 'மின் பணியாளர்',
      restaurant: lang === 'en' ? 'Restaurant' : 'உணவகம்',
      store: lang === 'en' ? 'Store' : 'கடைகள்'
    };
    return labels[cat] || cat;
  };

  const getCategoryClass = (cat) => {
    const classes = {
      hospital: 'cat-politics',
      plumber: 'cat-business',
      electrician: 'cat-technology',
      restaurant: 'cat-cinema',
      store: 'cat-agriculture'
    };
    return classes[cat] || 'cat-politics';
  };

  return (
    <main className="container">
      {/* HERO / SEARCH */}
      <section className="directory-hero">
        <h1>{lang === 'en' ? 'Local Business Directory' : 'நம்ம ஊர் வணிகக் கோப்பகம்'}</h1>
        <p>{lang === 'en' ? 'Find local shops, emergency services, and professionals instantly' : 'உள்ளூர் கடைகள், அவசர சேவைகள் மற்றும் தொழில் வல்லுநர்களை உடனடியாகக் கண்டறியுங்கள்'}</p>
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder={lang === 'en' ? 'Hospital, Plumber, Store...' : 'மருத்துவமனை, பிளம்பர், கடை...'} 
            aria-label="Search Directory"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button>{lang === 'en' ? 'Search' : 'தேடுக'}</button>
        </div>
      </section>

      {/* FILTERS */}
      <div className="category-filter-row">
        <button 
          className={`filter-pill ${selectedCat === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCat('all')}
        >
          {lang === 'en' ? 'All Services' : 'அனைத்து சேவைகள்'}
        </button>
        <button 
          className={`filter-pill ${selectedCat === 'hospital' ? 'active' : ''}`}
          onClick={() => setSelectedCat('hospital')}
        >
          {lang === 'en' ? 'Hospitals' : 'மருத்துவமனை'}
        </button>
        <button 
          className={`filter-pill ${selectedCat === 'plumber' ? 'active' : ''}`}
          onClick={() => setSelectedCat('plumber')}
        >
          {lang === 'en' ? 'Plumbers' : 'பிளம்பர்'}
        </button>
        <button 
          className={`filter-pill ${selectedCat === 'electrician' ? 'active' : ''}`}
          onClick={() => setSelectedCat('electrician')}
        >
          {lang === 'en' ? 'Electrician' : 'மின் பணியாளர்'}
        </button>
        <button 
          className={`filter-pill ${selectedCat === 'restaurant' ? 'active' : ''}`}
          onClick={() => setSelectedCat('restaurant')}
        >
          {lang === 'en' ? 'Restaurants' : 'உணவகம்'}
        </button>
        <button 
          className={`filter-pill ${selectedCat === 'store' ? 'active' : ''}`}
          onClick={() => setSelectedCat('store')}
        >
          {lang === 'en' ? 'Shops' : 'கடைகள்'}
        </button>
      </div>

      {/* DIRECTORY GRID */}
      <section className="directory-grid">
        {filteredListings.map(lst => (
          <div className="directory-card" key={lst.id}>
            <div>
              <div className="biz-header">
                <span className={`biz-type ${getCategoryClass(lst.category)}`}>
                  {getCategoryLabel(lst.category)}
                </span>
                <div className="biz-rating">
                  <i className="fas fa-star"></i> {lst.rating || 5.0}
                </div>
              </div>
              <h2 className="biz-title">{lst.businessName}</h2>
              <div className="biz-details">
                <p><i className="fas fa-map-marker-alt"></i> {lst.addressLocality}</p>
                <p><i className="fas fa-clock"></i> {lst.workingHours}</p>
                <p><i className="fas fa-phone-alt"></i> {lst.phoneNumber}</p>
              </div>
            </div>
            <div className="biz-actions">
              <a href={`tel:${lst.phoneNumber}`} className="biz-btn call-btn">
                {lang === 'en' ? 'Call' : 'அழைக்க'}
              </a>
              <button className="biz-btn map-btn" onClick={() => alert(lang === 'en' ? 'Opening Map View...' : 'வரைபடம் ஏற்றப்படுகிறது...')}>
                {lang === 'en' ? 'Map' : 'வரைபடம்'}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* PROMO REGISTRATION BAR */}
      <section className="directory-hero" style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.08)', color: 'var(--text-dark)', marginTop: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
          {lang === 'en' ? 'Want to advertise your local business or service here?' : 'உங்கள் உள்ளூர் வணிகம் அல்லது சேவையை இங்கே விளம்பரப்படுத்த விருப்பமா?'}
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
          {lang === 'en' ? 'Reach thousands of local people at the lowest rates.' : 'மிகக் குறைந்த விலையில் ஆயிரக்கணக்கான உள்ளூர் மக்களைச் சென்றடையுங்கள்.'}</p>
        <button 
          onClick={() => setShowModal(true)}
          style={{ padding: '12px 24px', borderRadius: '30px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
        >
          {lang === 'en' ? 'Add Your Business' : 'உங்கள் வணிகத்தை சேர்க்கவும்'}
        </button>
      </section>

      {/* REGISTRATION MODAL */}
      {showModal && (
        <div className="modal open" id="addListingModal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{lang === 'en' ? 'Add New Business' : 'புதிய வணிகத்தை சேர்க்கவும்'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form id="addListingForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="bizName">{lang === 'en' ? 'Business Name *' : 'வணிகப் பெயர் *'}</label>
                  <input 
                    type="text" 
                    id="bizName" 
                    required 
                    placeholder={lang === 'en' ? 'e.g. Kannan Stores' : 'எ.கா: கண்ணன் ஸ்டோர்ஸ்'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bizCat">{lang === 'en' ? 'Category *' : 'வகை *'}</label>
                  <select 
                    id="bizCat" 
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'black' }}
                  >
                    <option value="hospital">{lang === 'en' ? 'Hospital' : 'மருத்துவமனை'}</option>
                    <option value="plumber">{lang === 'en' ? 'Plumber' : 'பிளம்பர்'}</option>
                    <option value="electrician">{lang === 'en' ? 'Electrician' : 'மின் பணியாளர்'}</option>
                    <option value="restaurant">{lang === 'en' ? 'Restaurant' : 'உணவகம்'}</option>
                    <option value="store">{lang === 'en' ? 'Shops / Store' : 'கடைகள்'}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="bizLoc">{lang === 'en' ? 'Address / Location *' : 'முகவரி / இடம் *'}</label>
                  <input 
                    type="text" 
                    id="bizLoc" 
                    required 
                    placeholder={lang === 'en' ? 'e.g. Rajaji Street, Madurai' : 'எ.கா: ராஜாஜி வீதி, மதுரை'}
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bizHours">{lang === 'en' ? 'Working Hours' : 'வேலை நேரம்'}</label>
                  <input 
                    type="text" 
                    id="bizHours" 
                    placeholder={lang === 'en' ? 'e.g. 9 AM - 9 PM' : 'எ.கா: காலை 9 - இரவு 9'}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bizPhone">{lang === 'en' ? 'Phone Number *' : 'தொலைபேசி எண் *'}</label>
                  <input 
                    type="tel" 
                    id="bizPhone" 
                    required 
                    placeholder={lang === 'en' ? 'e.g. +91 9876543210' : 'எ.கா: +91 9876543210'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button type="submit" className="submit-btn">{lang === 'en' ? 'Submit' : 'சமர்ப்பிக்க'}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Directory;
