import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import './Classifieds.css';

// DEFAULT CATEGORIES WITH SUBCATEGORIES
export const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: 'Property / சொத்துக்கள்',
    slug: 'property',
    iconClass: 'fa-building',
    activeAdCount: 42,
    subcategories: [
      { id: 101, name: 'House for Rent / வாடகை வீடு' },
      { id: 102, name: 'House for Sale / வீடு விற்பனை' },
      { id: 103, name: 'Plot & Land / நிலம்' },
      { id: 104, name: 'Commercial Property / வணிக இடம்' }
    ]
  },
  {
    id: 2,
    name: 'Vehicles / வாகனங்கள்',
    slug: 'vehicle',
    iconClass: 'fa-car',
    activeAdCount: 38,
    subcategories: [
      { id: 201, name: 'Cars / கார்கள்' },
      { id: 202, name: 'Bikes & Scooters / இருசக்கர வாகனங்கள்' },
      { id: 203, name: 'Commercial Vehicles / வர்த்தக வாகனங்கள்' },
      { id: 204, name: 'Auto Parts & Accessories / உதிரி பாகங்கள்' }
    ]
  },
  {
    id: 3,
    name: 'Mobiles & Electronics / மின்னணு சாதனங்கள்',
    slug: 'electronics',
    iconClass: 'fa-mobile-alt',
    activeAdCount: 56,
    subcategories: [
      { id: 301, name: 'Mobile Phones / கைபேசிகள்' },
      { id: 302, name: 'Laptops & Computers / கணினிகள்' },
      { id: 303, name: 'TVs & Audio / டிவி & ஆடியோ' },
      { id: 304, name: 'Home Appliances / வீட்டு உபகரணங்கள்' }
    ]
  },
  {
    id: 4,
    name: 'Jobs / வேலைவாய்ப்பு',
    slug: 'jobs',
    iconClass: 'fa-briefcase',
    activeAdCount: 29,
    subcategories: [
      { id: 401, name: 'Full Time / முழு நேர வேலை' },
      { id: 402, name: 'Part Time / பகுதி நேர வேலை' },
      { id: 403, name: 'Work From Home / வீட்டிலிருந்து வேலை' },
      { id: 404, name: 'Drivers & Delivery / ஓட்டுநர் & டெலிவரி' }
    ]
  },
  {
    id: 5,
    name: 'Services / சேவைகள்',
    slug: 'services',
    iconClass: 'fa-tools',
    activeAdCount: 19,
    subcategories: [
      { id: 501, name: 'Home Repair & Electrician / வீட்டு பழுது' },
      { id: 502, name: 'Transport & Packers / போக்குவரத்து' },
      { id: 503, name: 'Tuitions & Classes / பயிற்சிகள்' },
      { id: 504, name: 'Events & Catering / விழா ஏற்பாடுகள்' }
    ]
  },
  {
    id: 6,
    name: 'Special Offers / சிறப்பு சலுகைகள்',
    slug: 'discount',
    iconClass: 'fa-percent',
    activeAdCount: 24,
    subcategories: [
      { id: 601, name: 'Retail Store Deals / கடை சலுகைகள்' },
      { id: 602, name: 'Restaurant Offers / உணவக சலுகைகள்' },
      { id: 603, name: 'Electronics Discount / எலக்ட்ரானிக்ஸ் தள்ளுபடி' },
      { id: 604, name: 'Fashion & Clothing Sales / ஆடை தள்ளுபடி' }
    ]
  },
  {
    id: 7,
    name: 'Furniture & Home / வீட்டு உபயோகம்',
    slug: 'furniture',
    iconClass: 'fa-couch',
    activeAdCount: 15,
    subcategories: [
      { id: 701, name: 'Sofa & Dining / சோபா & மேஜை' },
      { id: 702, name: 'Beds & Wardrobes / கட்டில் & அலமாரி' },
      { id: 703, name: 'Home Decor & Lighting / அலங்கார பொருட்கள்' }
    ]
  },
  {
    id: 8,
    name: 'Fashion & Beauty / ஆடை & அழகு',
    slug: 'fashion',
    iconClass: 'fa-tshirt',
    activeAdCount: 21,
    subcategories: [
      { id: 801, name: "Men's Wear / ஆண்கள் ஆடை" },
      { id: 802, name: "Women's Wear / பெண்கள் ஆடை" },
      { id: 803, name: 'Watches & Accessories / கடிகாரங்கள்' }
    ]
  }
];

// DEFAULT ALL 38 DISTRICTS OF TAMIL NADU
export const DEFAULT_DISTRICTS = [
  { id: 1, nameEn: 'Chennai', nameTa: 'சென்னை' },
  { id: 2, nameEn: 'Coimbatore', nameTa: 'கோயம்புத்தூர்' },
  { id: 3, nameEn: 'Madurai', nameTa: 'மதுரை' },
  { id: 4, nameEn: 'Salem', nameTa: 'சேலம்' },
  { id: 5, nameEn: 'Tiruchirappalli', nameTa: 'திருச்சி' },
  { id: 6, nameEn: 'Tirunelveli', nameTa: 'திருநெல்வேலி' },
  { id: 7, nameEn: 'Vellore', nameTa: 'வேலூர்' },
  { id: 8, nameEn: 'Erode', nameTa: 'ஈரோடு' },
  { id: 9, nameEn: 'Thanjavur', nameTa: 'தஞ்சாவூர்' },
  { id: 10, nameEn: 'Kanyakumari', nameTa: 'கன்னியாகுமரி' },
  { id: 11, nameEn: 'Dindigul', nameTa: 'திண்டுக்கல்' },
  { id: 12, nameEn: 'Tiruppur', nameTa: 'திருப்பூர்' },
  { id: 13, nameEn: 'Kanchipuram', nameTa: 'காஞ்சிபுரம்' },
  { id: 14, nameEn: 'Tiruvallur', nameTa: 'திருவள்ளூர்' },
  { id: 15, nameEn: 'Cuddalore', nameTa: 'கடலூர்' },
  { id: 16, nameEn: 'Dharmapuri', nameTa: 'தர்மபுரி' },
  { id: 17, nameEn: 'Thoothukudi', nameTa: 'தூத்துக்குடி' },
  { id: 18, nameEn: 'Nagapattinam', nameTa: 'நாகப்பட்டினம்' },
  { id: 19, nameEn: 'Namakkal', nameTa: 'நாமக்கல்' },
  { id: 20, nameEn: 'Pudukkottai', nameTa: 'புதுக்கோட்டை' },
  { id: 21, nameEn: 'Ramanathapuram', nameTa: 'ராமநாதபுரம்' },
  { id: 22, nameEn: 'Sivaganga', nameTa: 'சிவகங்கை' },
  { id: 23, nameEn: 'Theni', nameTa: 'தேனி' },
  { id: 24, nameEn: 'Tiruvannamalai', nameTa: 'திருவண்ணாமலை' },
  { id: 25, nameEn: 'Tiruvarur', nameTa: 'திருவாரூர்' },
  { id: 26, nameEn: 'Virudhunagar', nameTa: 'விருதுநகர்' },
  { id: 27, nameEn: 'Viluppuram', nameTa: 'விழுப்புரம்' },
  { id: 28, nameEn: 'Krishnagiri', nameTa: 'கிருஷ்ணகிரி' },
  { id: 29, nameEn: 'Perambalur', nameTa: 'பெரம்பலூர்' },
  { id: 30, nameEn: 'Ariyalur', nameTa: 'அரியலூர்' },
  { id: 31, nameEn: 'Nilgiris', nameTa: 'நீலகிரி' },
  { id: 32, nameEn: 'Tirupattur', nameTa: 'திருப்பத்தூர்' },
  { id: 33, nameEn: 'Ranipet', nameTa: 'ராணிப்பேட்டை' },
  { id: 34, nameEn: 'Tenkasi', nameTa: 'தென்காசி' },
  { id: 35, nameEn: 'Chengalpattu', nameTa: 'செங்கல்பட்டு' },
  { id: 36, nameEn: 'Kallakurichi', nameTa: 'கள்ளக்குறிச்சி' },
  { id: 37, nameEn: 'Mayiladuthurai', nameTa: 'மயிலாடுதுறை' },
  { id: 38, nameEn: 'Karur', nameTa: 'கரூர்' }
];

// INITIAL SAMPLE APPROVED ADS
const INITIAL_SAMPLE_ADS = [
  {
    id: 1001,
    title: 'Apple MacBook Air M2 2023 - Like New',
    priceDetail: '₹85,000',
    price: 85000,
    location: 'Chennai / சென்னை',
    categoryName: 'Mobiles & Electronics',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    description: 'Apple MacBook Air M2 8GB RAM 256GB SSD. Midnight Color. Mint condition with original box, bill and charger.',
    contactPhone: '9876543210',
    whatsappNumber: '9876543210',
    createdAt: '2 hours ago'
  },
  {
    id: 1002,
    title: '2 BHK Luxury Apartment for Rent',
    priceDetail: '₹18,000 / month',
    price: 18000,
    location: 'Coimbatore / கோயம்புத்தூர்',
    categoryName: 'Property',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
    description: 'Spacious 2 BHK East facing apartment. Car parking, 24/7 security, elevator and metro water facility included.',
    contactPhone: '9876512345',
    whatsappNumber: '9876512345',
    createdAt: '4 hours ago'
  },
  {
    id: 1003,
    title: 'Honda City i-VTEC VX 2021 Petrol',
    priceDetail: '₹7,50,000',
    price: 750000,
    location: 'Madurai / மதுரை',
    categoryName: 'Vehicles',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500',
    description: 'Single owner Honda City, 35,000 km driven. Full company service history, insurance valid till Nov 2026.',
    contactPhone: '9123456789',
    whatsappNumber: '9123456789',
    createdAt: '1 day ago'
  },
  {
    id: 1004,
    title: 'Samsung 55 inch 4K Smart TV Offer',
    priceDetail: '₹39,999',
    price: 39999,
    location: 'Salem / சேலம்',
    categoryName: 'Special Offers',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500',
    description: 'Exclusive festival discount offer! Brand new sealed piece Samsung Crystal 4K UHD Smart TV with 2 year warranty.',
    contactPhone: '9988776655',
    whatsappNumber: '9988776655',
    createdAt: '2 days ago'
  }
];

const Classifieds = () => {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // Lists
  const [ads, setAds] = useState([]);
  const [pendingAds, setPendingAds] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [formSubcategories, setFormSubcategories] = useState(DEFAULT_CATEGORIES[0].subcategories);
  const [districts, setDistricts] = useState(DEFAULT_DISTRICTS);
  
  // Selection / Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedLoc, setSelectedLoc] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [priceMax, setPriceMax] = useState(1000000);
  const [conditionNew, setConditionNew] = useState(true);
  const [conditionUsed, setConditionUsed] = useState(true);

  // Loading
  const [loading, setLoading] = useState(false);

  // Modals & Views
  const [selectedAd, setSelectedAd] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareAdObj, setShareAdObj] = useState(null);
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCatId, setNewCatId] = useState('1');
  const [newSubcatId, setNewSubcatId] = useState('101');
  const [newPrice, setNewPrice] = useState('');
  const [newNegotiable, setNewNegotiable] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDistrictId, setNewDistrictId] = useState('1');
  const [newPincode, setNewPincode] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [newLatitude, setNewLatitude] = useState(null);
  const [newLongitude, setNewLongitude] = useState(null);
  const [isFree, setIsFree] = useState(false);

  // Hot Deal Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 36, secs: 58 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch categories & districts from API with automatic fallback
  useEffect(() => {
    fetchApi('/classifieds/categories')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setCategories(data);
      })
      .catch(() => setCategories(DEFAULT_CATEGORIES));

    fetchApi('/districts')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDistricts(data);
      })
      .catch(() => setDistricts(DEFAULT_DISTRICTS));

    loadPendingAdsFromStorage();
  }, []);

  // Load Pending Ads from localStorage and API
  const loadPendingAdsFromStorage = () => {
    try {
      const stored = localStorage.getItem('kings_classifieds_pending');
      const pendingList = stored ? JSON.parse(stored) : [];
      setPendingAds(pendingList);
    } catch {
      setPendingAds([]);
    }
  };

  // Load Ads (Combine API + Local Approved Ads)
  const loadAds = () => {
    setLoading(true);

    // Get locally approved ads
    let localApproved = [];
    try {
      const storedAppr = localStorage.getItem('kings_classifieds_approved');
      if (storedAppr) localApproved = JSON.parse(storedAppr);
    } catch (e) {
      localApproved = [];
    }

    let combinedList = [...localApproved, ...INITIAL_SAMPLE_ADS];

    fetchApi('/classifieds')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            id: item.id,
            title: item.title,
            priceDetail: item.price === 0 ? 'FREE' : `₹${item.price.toLocaleString()}`,
            price: item.price,
            location: item.location || 'Tamil Nadu',
            status: item.status || 'active',
            imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
            description: item.description,
            contactPhone: item.contactPhone,
            whatsappNumber: item.whatsappNumber,
            createdAt: 'Recently'
          }));
          combinedList = [...formatted, ...combinedList];
        }
        filterAndSetAds(combinedList);
      })
      .catch(() => {
        filterAndSetAds(combinedList);
      });
  };

  const filterAndSetAds = (allAds) => {
    let filtered = allAds.filter(a => a.status === 'active' || !a.status);

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || (a.description && a.description.toLowerCase().includes(q)));
    }

    if (selectedCat !== 'all') {
      filtered = filtered.filter(a => {
        const catObj = categories.find(c => c.slug === selectedCat);
        return catObj ? (a.categoryName?.includes(catObj.name) || a.categoryId === catObj.id) : true;
      });
    }

    if (selectedLoc !== 'all') {
      const distObj = districts.find(d => String(d.id) === String(selectedLoc));
      if (distObj) {
        filtered = filtered.filter(a => a.location?.includes(distObj.nameEn) || a.location?.includes(distObj.nameTa));
      }
    }

    if (priceMax < 1000000) {
      filtered = filtered.filter(a => (a.price || 0) <= priceMax);
    }

    if (selectedSort === 'price_asc') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (selectedSort === 'price_desc') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setAds(filtered);
    setLoading(false);
  };

  useEffect(() => {
    loadAds();

    try {
      const channel = new BroadcastChannel('kings_classifieds_channel');
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'AD_APPROVED') {
          loadAds();
        }
      };
      return () => channel.close();
    } catch (e) {}
  }, [selectedCat, selectedLoc, selectedSort, searchQuery, priceMax]);

  const handleOpenDetails = (ad) => {
    setSelectedAd(ad);
    setPhoneRevealed(false);
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setNewCatId(catId);
    
    // Find subcategories for selected category
    const selectedCategory = categories.find(c => String(c.id) === String(catId));
    if (selectedCategory && selectedCategory.subcategories) {
      setFormSubcategories(selectedCategory.subcategories);
      if (selectedCategory.subcategories.length > 0) {
        setNewSubcatId(String(selectedCategory.subcategories[0].id));
      }
    } else {
      setFormSubcategories([]);
      setNewSubcatId('');
    }
  };

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    setImageFiles(files);
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviewUrl(event.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation && window.isSecureContext) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setNewLatitude(pos.coords.latitude);
          setNewLongitude(pos.coords.longitude);
          alert(lang === 'en' ? 'Location captured successfully!' : 'இடம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!');
        },
        () => alert(lang === 'en' ? 'Unable to retrieve your location.' : 'உங்கள் இருப்பிடத்தை மீட்டெடுக்க முடியவில்லை.')
      );
    } else {
      alert(lang === 'en' ? 'Geolocation requires HTTPS connection.' : 'புவிஇருப்பிடம் HTTPS இணைப்பை கோருகிறது.');
    }
  };

  // OPEN PREVIEW MODAL BEFORE SUBMISSION
  const handleOpenPreview = (e) => {
    e.preventDefault();
    if (!newTitle || (!newPrice && !isFree) || !newPhone || !newDesc) {
      alert(lang === 'en' ? 'Please fill all required fields before previewing.' : 'முன்னோட்டம் பார்ப்பதற்கு முன் தேவையான அனைத்து புலங்களையும் நிரப்பவும்.');
      return;
    }
    setShowPreviewModal(true);
  };

  // FINAL SUBMISSION OF AD (PENDING APPROVAL)
  const handleConfirmSubmit = async () => {
    setUploadingMedia(true);
    let uploadedUrls = [];

    // Attempt file upload if API is present
    for (let file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetchApi('/classifieds/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.url) uploadedUrls.push(res.url);
      } catch (err) {
        console.warn("File upload notice: local preview used", err);
      }
    }

    const selectedCatObj = categories.find(c => String(c.id) === String(newCatId)) || DEFAULT_CATEGORIES[0];
    const selectedDistObj = districts.find(d => String(d.id) === String(newDistrictId)) || DEFAULT_DISTRICTS[0];
    const displayImg = uploadedUrls[0] || imagePreviewUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500';

    const newAdObj = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      price: isFree ? 0 : parseFloat(newPrice || '0'),
      priceDetail: isFree ? 'FREE' : `₹${parseFloat(newPrice || '0').toLocaleString()}`,
      negotiable: newNegotiable,
      categoryId: newCatId,
      categoryName: selectedCatObj.name,
      districtId: newDistrictId,
      location: `${selectedDistObj.nameEn} / ${selectedDistObj.nameTa}`,
      contactPhone: newPhone,
      whatsappNumber: newWhatsapp || newPhone,
      email: newEmail,
      imageUrl: displayImg,
      status: 'pending',
      createdAt: 'Just now'
    };

    // Save to pending in localStorage
    try {
      const existingPending = JSON.parse(localStorage.getItem('kings_classifieds_pending') || '[]');
      const updatedPending = [newAdObj, ...existingPending];
      localStorage.setItem('kings_classifieds_pending', JSON.stringify(updatedPending));
      setPendingAds(updatedPending);
      window.dispatchEvent(new Event('storage'));
      try {
        const channel = new BroadcastChannel('kings_classifieds_channel');
        channel.postMessage({ type: 'NEW_PENDING_AD', ad: newAdObj });
      } catch (bcErr) {}
    } catch (err) {
      console.warn("Storage warning", err);
    }

    // Attempt backend save
    fetchApi('/classifieds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdObj)
    }).catch(e => console.warn("API Offline notice, ad queued locally for approval", e));

    setUploadingMedia(false);
    setShowPreviewModal(false);
    setShowPostModal(false);

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewBrand('');
    setNewDesc('');
    setNewPhone('');
    setNewWhatsapp('');
    setImageFiles([]);
    setImagePreviewUrl('');
    setIsFree(false);

    alert(
      lang === 'en'
        ? '🎉 Your ad has been submitted successfully!\n\nStatus: PENDING ADMIN APPROVAL.\nIt has been sent to the Admin Portal (Ad Management -> Pending Classifieds Approval) for review.'
        : '🎉 உங்கள் விளம்பரம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!\n\nநிலை: நிர்வாக ஒப்புதலுக்கு காத்திருக்கிறது.\nநிர்வாக போர்ட்டலில் (Ad Management -> Pending Classifieds Approval) சரிபார்க்க அனுப்பப்பட்டுள்ளது.'
    );
  };

  // ADMIN APPROVE AD
  const handleApproveAd = (adId) => {
    const adToApprove = pendingAds.find(a => a.id === adId);
    if (!adToApprove) return;

    // Update status to active
    const approvedAd = { ...adToApprove, status: 'active' };

    // 1. Remove from pending list
    const updatedPending = pendingAds.filter(a => a.id !== adId);
    setPendingAds(updatedPending);
    localStorage.setItem('kings_classifieds_pending', JSON.stringify(updatedPending));

    // 2. Add to approved list
    try {
      const existingApproved = JSON.parse(localStorage.getItem('kings_classifieds_approved') || '[]');
      const updatedApproved = [approvedAd, ...existingApproved];
      localStorage.setItem('kings_classifieds_approved', JSON.stringify(updatedApproved));
    } catch (e) {
      console.warn("Local storage write error", e);
    }

    // 3. Call API approval if backend is live
    fetchApi(`/classifieds/admin/${adId}/approve`, { method: 'PUT' }).catch(() => {});

    alert(lang === 'en' ? `✅ Ad "${adToApprove.title}" has been APPROVED and is now live!` : `✅ விளம்பரம் "${adToApprove.title}" ஒப்புதல் அளிக்கப்பட்டு வெளியிடப்பட்டது!`);

    // Reload active ads
    loadAds();
  };

  // ADMIN REJECT AD
  const handleRejectAd = (adId) => {
    if (!window.confirm(lang === 'en' ? 'Are you sure you want to reject this ad?' : 'இந்த விளம்பரத்தை நிராகரிக்க விரும்புகிறீர்களா?')) return;
    const updatedPending = pendingAds.filter(a => a.id !== adId);
    setPendingAds(updatedPending);
    localStorage.setItem('kings_classifieds_pending', JSON.stringify(updatedPending));
  };

  const handleShareClick = (ad, platform) => {
    const pageUrl = window.location.origin + `/classifieds?id=${ad.id}`;
    const shareText = encodeURIComponent(`Check out this deal! ${ad.title} at ${ad.priceDetail}`);
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(pageUrl);
      alert(lang === 'en' ? 'Link copied!' : 'இணைப்பு நகலெடுக்கப்பட்டது!');
    }
    setShowShareModal(false);
  };

  return (
    <main className="container class-module-container" style={{ paddingTop: '20px' }}>
      
      {/* Breadcrumbs & Admin Panel Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="breadcrumbs" style={{ fontSize: '13px', color: '#64748b' }}>
          <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span>{lang === 'en' ? 'Classifieds' : 'வகைப்படுத்தப்பட்டவை'}</span>
        </div>

        <button 
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          style={{ background: showAdminPanel ? '#ef4444' : '#f59e0b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className="fas fa-user-shield"></i>
          {showAdminPanel ? 'Close Admin Queue' : `Admin Approval Queue (${pendingAds.length})`}
        </button>
      </div>

      {/* ADMIN APPROVAL QUEUE PANEL */}
      {showAdminPanel && (
        <div style={{ background: '#fffbe6', border: '2px solid #f59e0b', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, color: '#b45309', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-clipboard-check"></i> 
              {lang === 'en' ? 'Admin Moderation: Pending Ads Approval' : 'நிர்வாக ஒப்புதல் காத்திருப்பு விளம்பரங்கள்'}
              <span style={{ background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{pendingAds.length}</span>
            </h3>
            <span style={{ fontSize: '12px', color: '#78350f' }}>{lang === 'en' ? 'Ads require admin confirmation before appearing live' : 'விளம்பரங்கள் வெளியிடப்படுவதற்கு முன் நிர்வாக ஒப்புதல் தேவை'}</span>
          </div>

          {pendingAds.length === 0 ? (
            <p style={{ margin: 0, color: '#92400e', fontSize: '13px', fontStyle: 'italic' }}>
              {lang === 'en' ? 'No ads currently pending approval. Post a new ad to test the preview & approval workflow!' : 'ஒப்புதலுக்குக் காத்திருக்கும் விளம்பரங்கள் எதுவுமில்லை.'}
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {pendingAds.map(ad => (
                <div key={ad.id} style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '8px', backgroundImage: `url(${ad.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }}></div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>{ad.title}</h4>
                      <div style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: '13px' }}>{ad.priceDetail}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>📍 {ad.location}</div>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '12px', color: '#475569', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ad.description}</p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button 
                      onClick={() => handleOpenDetails(ad)}
                      style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      👁️ Preview
                    </button>
                    <button 
                      onClick={() => handleApproveAd(ad.id)}
                      style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      onClick={() => handleRejectAd(ad.id)}
                      style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HERO BANNER SECTION */}
      <section className="class-hero-banner">
        <div className="class-hero-left">
          <h1 className="class-hero-title">
            {lang === 'en' ? 'Buy, Sell & Discover Deals' : 'வாங்க, விற்க & சிறந்த சலுகைகளை அறிய'}
          </h1>
          <p className="class-hero-subtitle">
            {lang === 'en'
              ? 'Find verified deals around your Tamil Nadu district. Post your ad with preview and get instant buyer calls!'
              : 'உங்கள் மாவட்டத்தில் உள்ள சிறந்த சலுகைகளைக் கண்டறியவும். முன்னோட்ட வசதியுடன் விளம்பரம் பதிவிடவும்!'}
          </p>
          <div className="class-hero-btns">
            <button className="class-hero-btn-find" onClick={loadAds}>
              {lang === 'en' ? 'Explore Ads' : 'விளம்பரங்களை ஆராய்க'}
            </button>
            <button className="class-hero-btn-post" onClick={() => setShowPostModal(true)}>
              {lang === 'en' ? 'Post a Free Ad' : 'இலவச விளம்பரம்'}
            </button>
          </div>
        </div>

        {/* Float stat badges overlay */}
        <div className="class-stat-badge-float active-ads">
          <i className="fas fa-tags"></i>
          <div>
            <div className="class-stat-number">100% Free</div>
            <div className="class-stat-label">{lang === 'en' ? 'Post Ads Easily' : 'இலவச விளம்பரம்'}</div>
          </div>
        </div>
        <div className="class-stat-badge-float verified-users">
          <i className="fas fa-shield-alt"></i>
          <div>
            <div className="class-stat-number">Admin Verified</div>
            <div className="class-stat-label">{lang === 'en' ? 'Safe & Trusted' : 'பாதுகாப்பானது'}</div>
          </div>
        </div>

        {/* Right side illustration overlay */}
        <div className="class-banner-illustration" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400")' }}></div>
      </section>

      {/* ADVANCED SEARCH FILTER PANEL */}
      <div className="class-filter-panel">
        <div className="class-filter-row">
          <div className="class-filter-input-wrap" style={{ flex: 1.5 }}>
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'What are you looking for?' : 'நீங்கள் என்ன தேடுகிறீர்கள்?'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="class-filter-input-wrap">
            <i className="fas fa-tags"></i>
            <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
              <option value="all">{lang === 'en' ? 'All Categories (அனைத்து பிரிவுகள்)' : 'அனைத்துப் பிரிவுகள்'}</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="class-filter-input-wrap">
            <i className="fas fa-map-marker-alt"></i>
            <select value={selectedLoc} onChange={(e) => setSelectedLoc(e.target.value)}>
              <option value="all">{lang === 'en' ? 'All Districts (அனைத்து மாவட்டங்கள்)' : 'அனைத்து மாவட்டங்கள்'}</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.nameEn} - {d.nameTa}</option>
              ))}
            </select>
          </div>

          <button className="class-search-action-btn" onClick={loadAds}>
            {lang === 'en' ? 'Search' : 'தேடுக'}
          </button>
        </div>
      </div>

      {/* QUICK CATEGORIES CIRCLE ROW */}
      <div className="class-quick-cats-row">
        {categories.map(c => (
          <button 
            key={c.id} 
            className={`class-quick-cat-btn ${selectedCat === c.slug ? 'active' : ''}`}
            onClick={() => setSelectedCat(c.slug)}
          >
            <i className={`fas ${c.iconClass}`}></i>
            <span>{c.name.split('/')[0]}</span>
          </button>
        ))}
      </div>

      {/* THREE COLUMN GRID LAYOUT */}
      <div className="class-main-layout">
        
        {/* Left Column: Categories List */}
        <div className="class-sidebar-left">
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: '800', marginBottom: '12px' }}>{lang === 'en' ? 'Browse Categories' : 'வகைகளை உலாவுக'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div 
                className="class-category-sidebar-item" 
                style={{ background: selectedCat === 'all' ? '#f1f5f9' : 'none', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => setSelectedCat('all')}
              >
                <div className="class-category-sidebar-item-left">
                  <i className="fas fa-border-all"></i>
                  <span>{lang === 'en' ? 'All Categories' : 'அனைத்தும்'}</span>
                </div>
              </div>

              {categories.map(c => (
                <div 
                  className="class-category-sidebar-item" 
                  key={c.id} 
                  style={{ background: selectedCat === c.slug ? '#eff6ff' : 'none', borderLeft: selectedCat === c.slug ? '3px solid #4f46e5' : 'none', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={() => setSelectedCat(c.slug)}
                >
                  <div className="class-category-sidebar-item-left">
                    <i className={`fas ${c.iconClass}`}></i>
                    <span style={{ fontSize: '12.5px', fontWeight: selectedCat === c.slug ? 'bold' : 'normal' }}>{c.name}</span>
                  </div>
                  <span className="class-category-sidebar-item-right">{c.activeAdCount || 10}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Main listings content */}
        <div className="class-middle-content">
          
          {/* Featured Ads section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '850', color: '#1e293b' }}>
              {lang === 'en' ? 'Featured Ads' : 'சிறப்பு விளம்பரங்கள்'}
            </h2>
            <span style={{ fontSize: '12.5px', color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setSelectedCat('all')}>
              {lang === 'en' ? 'View all' : 'அனைத்தையும் பார்க்க'} &rarr;
            </span>
          </div>

          <div className="featured-ads-grid">
            {ads.slice(0, 4).map(ad => (
              <div className="featured-ad-card" key={ad.id} onClick={() => handleOpenDetails(ad)}>
                <div className="featured-ad-img-box" style={{ backgroundImage: `url(${ad.imageUrl})` }}>
                  <span className="featured-ad-badge">Featured</span>
                  <span className="featured-ad-heart" onClick={(e) => { e.stopPropagation(); alert('Ad Saved to Favorites!'); }}>
                    <i className="far fa-heart"></i>
                  </span>
                </div>
                <div className="featured-ad-body">
                  <h3 className="featured-ad-title">{ad.title}</h3>
                  <div className="featured-ad-price">{ad.priceDetail}</div>
                  <div className="featured-ad-loc">
                    <i className="fas fa-map-marker-alt"></i> {ad.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Latest Ads section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px 0', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '850', color: '#1e293b' }}>
              {lang === 'en' ? 'Confirmed & Active Ads' : 'உறுதிசெய்யப்பட்ட விளம்பரங்கள்'}
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select 
                value={selectedSort} 
                onChange={(e) => setSelectedSort(e.target.value)}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', color: '#475569', fontWeight: '600' }}
              >
                <option value="newest">{lang === 'en' ? 'Sort by: Newest First' : 'வரிசைப்படுத்து: சமீபத்தியது'}</option>
                <option value="price_asc">{lang === 'en' ? 'Price: Low to High' : 'விலை: குறைவு முதல் அதிகம்'}</option>
                <option value="price_desc">{lang === 'en' ? 'Price: High to Low' : 'விலை: அதிகம் முதல் குறைவு'}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', color: '#4f46e5' }}></i>
              <p style={{ marginTop: '10px' }}>{lang === 'en' ? 'Loading classifieds list...' : 'விளம்பரங்கள் ஏற்றப்படுகின்றன...'}</p>
            </div>
          ) : ads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <i className="fas fa-search" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '12px' }}></i>
              <h3 style={{ margin: 0, fontSize: '15px' }}>{lang === 'en' ? 'No confirmed ads found in this selection.' : 'விளம்பரங்கள் எதுவும் கிடைக்கவில்லை.'}</h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{lang === 'en' ? 'Try changing filters or post a new ad!' : 'வடிகட்டிகளை மாற்றவும் அல்லது புதிய விளம்பரத்தைப் பதியவும்!'}</p>
            </div>
          ) : (
            <div className="latest-ads-list">
              {ads.map(ad => (
                <div className="latest-ad-row" key={ad.id} onClick={() => handleOpenDetails(ad)}>
                  <div className="latest-ad-left">
                    <div className="latest-ad-img" style={{ backgroundImage: `url(${ad.imageUrl})` }}></div>
                    <div className="latest-ad-details">
                      <div className="latest-ad-title-row">
                        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0 }}>{ad.title}</h3>
                        <span className="latest-ad-negotiable-badge">Verified</span>
                      </div>
                      <div className="latest-ad-pills-row">
                        <span className="latest-ad-price-lbl">{ad.priceDetail}</span>
                        <span><i className="fas fa-map-marker-alt"></i> {ad.location}</span>
                        <span><i className="fas fa-clock"></i> {ad.createdAt || 'Active'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    <i className="far fa-heart" style={{ cursor: 'pointer', fontSize: '16px' }}></i>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Post Ad & Hot Deals */}
        <div className="class-sidebar-right">
          
          {/* Post Free Ad CTA card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <i className="fas fa-bullhorn" style={{ fontSize: '36px', color: '#ec4899', marginBottom: '12px' }}></i>
            <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 4px 0' }}>Post Your Ad with Preview</h4>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 16px 0' }}>Preview your listing, submit for admin approval, and get published!</p>
            <button 
              onClick={() => setShowPostModal(true)}
              style={{ width: '100%', background: '#ec4899', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              + Post New Ad
            </button>
          </div>

          {/* Hot Deals */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#ef4444' }}><i className="fas fa-fire"></i> Hot Deals</span>
              <span style={{ fontSize: '10.5px', color: '#4f46e5', fontWeight: 'bold' }}>View All</span>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="hot-deal-timer-row">
                <div className="hot-deal-timer-box">
                  <span className="hot-deal-timer-num">{timeLeft.days}</span>
                  <span className="hot-deal-timer-lbl">Days</span>
                </div>
                <div className="hot-deal-timer-box">
                  <span className="hot-deal-timer-num">{timeLeft.hours}</span>
                  <span className="hot-deal-timer-lbl">Hrs</span>
                </div>
                <div className="hot-deal-timer-box">
                  <span className="hot-deal-timer-num">{timeLeft.mins}</span>
                  <span className="hot-deal-timer-lbl">Mins</span>
                </div>
                <div className="hot-deal-timer-box">
                  <span className="hot-deal-timer-num">{timeLeft.secs}</span>
                  <span className="hot-deal-timer-lbl">Secs</span>
                </div>
              </div>
              
              <div style={{ margin: '14px 0 8px 0', width: '100%', height: '90px', borderRadius: '8px', backgroundImage: 'url("https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <strong style={{ fontSize: '12px', textAlign: 'center' }}>Samsung 55" 4K Smart TV</strong>
              <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold', marginTop: '4px' }}>₹39,999 <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontWeight: 'normal', fontSize: '10px' }}>₹62,999</span></div>
            </div>
          </div>

          {/* Search by Filters widget */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: '800', margin: 0 }}>Price Range Filter</h4>
              <span style={{ fontSize: '11px', color: '#4f46e5', cursor: 'pointer' }} onClick={() => setPriceMax(1000000)}>Reset</span>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="1000000" 
              value={priceMax} 
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#4f46e5', marginTop: '6px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              <span>₹0</span>
              <span>Max: ₹{priceMax.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>

      {/* CLASSIFIED DETAILS VIEW MODAL */}
      {selectedAd && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '750px', width: '90%', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{selectedAd.title}</h3>
              <button className="modal-close" onClick={() => setSelectedAd(null)}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ height: '260px', borderRadius: '12px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${selectedAd.imageUrl})` }}></div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', fontSize: '13px' }}>
                <div><strong>Price:</strong> <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>{selectedAd.priceDetail}</span></div>
                <div><strong>Location:</strong> {selectedAd.location}</div>
                <div><strong>Category:</strong> {selectedAd.categoryName || 'Classifieds'}</div>
                {selectedAd.whatsappNumber && (
                   <div style={{ gridColumn: 'span 2' }}>
                     <a href={`https://wa.me/${selectedAd.whatsappNumber}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: '#25D366', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}>
                       <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                     </a>
                   </div>
                )}
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0' }}>Product Description</h4>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 }}>{selectedAd.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                {phoneRevealed ? (
                  <a 
                    href={`tel:${selectedAd.contactPhone}`}
                    style={{ flex: 1, textDecoration: 'none', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <i className="fas fa-phone-alt"></i> {selectedAd.contactPhone}
                  </a>
                ) : (
                  <button 
                    onClick={() => setPhoneRevealed(true)}
                    style={{ flex: 1, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    <i className="fas fa-eye"></i> Show Phone Number
                  </button>
                )}
                <button 
                  onClick={() => { setShareAdObj(selectedAd); setShowShareModal(true); }}
                  style={{ flex: 1, background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <i className="far fa-share-square"></i> Share Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST NEW AD FORM MODAL */}
      {showPostModal && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '650px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '0', borderRadius: '12px' }}>
            <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#ec4899', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '17px' }}>{lang === 'en' ? 'Post New Ad' : 'புதிய விளம்பரம் பதியவும்'}</h3>
              <button className="modal-close" onClick={() => setShowPostModal(false)} style={{ color: 'white', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '24px' }}>
              <form onSubmit={handleOpenPreview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                    {lang === 'en' ? 'Product Title *' : 'பொருள் தலைப்பு *'}
                  </label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required 
                    placeholder={lang === 'en' ? 'e.g. iPhone 14 Pro Max / Honda City' : 'எ.கா: Splendor பைக் விற்பனைக்கு'}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                      {lang === 'en' ? 'Category *' : 'வகை *'}
                    </label>
                    <select 
                      value={newCatId}
                      onChange={handleCategoryChange}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                      {lang === 'en' ? 'Subcategory' : 'துணை வகை'}
                    </label>
                    <select 
                      value={newSubcatId}
                      onChange={(e) => setNewSubcatId(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      {formSubcategories.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                      {lang === 'en' ? 'Price (INR) *' : 'விலை (INR) *'}
                      <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} /> {lang === 'en' ? 'Free' : 'இலவசம்'}
                      </label>
                    </label>
                    <input 
                      type="number" 
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required={!isFree}
                      disabled={isFree}
                      placeholder={lang === 'en' ? 'e.g. 85000' : 'எ.கா: 85000'}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black', background: isFree ? '#f1f5f9' : 'white' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                      {lang === 'en' ? 'District / Location *' : 'மாவட்டம் / இடம் *'}
                    </label>
                    <select 
                      value={newDistrictId}
                      onChange={(e) => setNewDistrictId(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      {districts.map(d => (
                        <option key={d.id} value={d.id}>{d.nameEn} - {d.nameTa}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={newNegotiable}
                      onChange={(e) => setNewNegotiable(e.target.checked)}
                    />
                    {lang === 'en' ? 'Price is negotiable' : 'விலை பேசித் தீர்மானிக்கலாம்'}
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                      {lang === 'en' ? 'Contact Phone *' : 'தொடர்பு எண் *'}
                    </label>
                    <input 
                      type="text" 
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      required 
                      placeholder="e.g. 9876543210"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                      {lang === 'en' ? 'WhatsApp Number' : 'வாட்ஸ்அப் எண்'}
                    </label>
                    <input 
                      type="text" 
                      value={newWhatsapp}
                      onChange={(e) => setNewWhatsapp(e.target.value)}
                      placeholder="e.g. 9876543210"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                    {lang === 'en' ? 'Product Description *' : 'விளம்பரம் விளக்கம் *'}
                  </label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required 
                    rows="3"
                    placeholder={lang === 'en' ? 'Provide details about condition, specifications...' : 'பொருளின் நிலை, மாடல் அல்லது நிபந்தனைகள்...'}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black' }}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                    {lang === 'en' ? 'Upload Photos' : 'புகைப்படங்களை பதிவேற்றவும்'}
                  </label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileSelection}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px dashed #cbd5e1', color: 'black' }}
                  />
                  {imagePreviewUrl && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={imagePreviewUrl} alt="Preview thumbnail" style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '12px', color: '#10b981' }}>Photo attached ready for preview</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    type="submit"
                    style={{ flex: 1, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <i className="fas fa-eye"></i> {lang === 'en' ? 'Preview Ad First' : 'விளம்பரத்தை முன்னோட்டம் பார்க்க'}
                  </button>

                  <button 
                    type="button"
                    onClick={handleConfirmSubmit}
                    disabled={uploadingMedia}
                    style={{ flex: 1, background: '#ec4899', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {uploadingMedia ? 'Posting...' : (lang === 'en' ? 'Submit Direct' : 'நேரடியாக சமர்ப்பிக்க')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AD PREVIEW MODAL BEFORE SUBMISSION */}
      {showPreviewModal && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1100' }}>
          <div className="modal-content" style={{ maxWidth: '650px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '0', borderRadius: '16px' }}>
            <div className="modal-header" style={{ padding: '16px 24px', background: '#3b82f6', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>👁️ {lang === 'en' ? 'Ad Preview Mode' : 'விளம்பர முன்னோட்டம்'}</h3>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>{lang === 'en' ? 'This is how your ad will appear to buyers once approved by Admin' : 'நிர்வாகி ஒப்புதல் அளித்த பின் விளம்பரம் இவ்வாறு தோன்றும்'}</div>
              </div>
              <button className="modal-close" onClick={() => setShowPreviewModal(false)} style={{ color: 'white', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ height: '240px', borderRadius: '12px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${imagePreviewUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'})`, position: 'relative' }}>
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#f59e0b', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>PENDING ADMIN APPROVAL</span>
              </div>

              <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{newTitle}</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '12px', fontSize: '13px' }}>
                <div><strong>Price:</strong> <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>{isFree ? 'FREE' : `₹${parseFloat(newPrice || '0').toLocaleString()}`}</span> {newNegotiable && <span style={{ fontSize: '11px', color: '#10b981' }}>(Negotiable)</span>}</div>
                <div><strong>Location:</strong> {districts.find(d => String(d.id) === String(newDistrictId))?.nameEn || 'Tamil Nadu'}</div>
                <div><strong>Category:</strong> {categories.find(c => String(c.id) === String(newCatId))?.name || 'Classifieds'}</div>
                <div><strong>Contact Phone:</strong> {newPhone}</div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Description</h4>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 }}>{newDesc}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  style={{ flex: 1, background: '#cbd5e1', color: '#1e293b', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ✏️ Edit Details
                </button>
                <button 
                  onClick={handleConfirmSubmit}
                  disabled={uploadingMedia}
                  style={{ flex: 1.5, background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🚀 Confirm & Submit for Admin Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && shareAdObj && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1100' }}>
          <div className="modal-content" style={{ maxWidth: '400px', width: '90%', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Share Deal' : 'பகிர்'}</h3>
              <button className="modal-close" onClick={() => { setShowShareModal(false); setShareAdObj(null); }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '16px 0' }}>
              <button onClick={() => handleShareClick(shareAdObj, 'whatsapp')} style={{ padding: '10px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-whatsapp"></i> WhatsApp
              </button>
              <button onClick={() => handleShareClick(shareAdObj, 'facebook')} style={{ padding: '10px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
            </div>
            <button 
              onClick={() => handleShareClick(shareAdObj, 'copy')} 
              style={{ width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              <i className="far fa-copy"></i> {lang === 'en' ? 'Copy Link' : 'நகலெடுக்க'}
            </button>
          </div>
        </div>
      )}

    </main>
  );
};

export default Classifieds;
