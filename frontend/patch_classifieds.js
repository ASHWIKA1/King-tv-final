const fs = require('fs');
let content = fs.readFileSync('/Users/hkmac/kingstv/King-tv-final/frontend/src/pages/Classifieds.jsx', 'utf8');

// 1. Add Subcategories state
content = content.replace(
  "const [categories, setCategories] = useState([]);",
  "const [categories, setCategories] = useState([]);\n  const [subcategories, setSubcategories] = useState([]);\n  const [formSubcategories, setFormSubcategories] = useState([]);"
);

// 2. Add File upload and geo states, remove manual image URLs
content = content.replace(
  "  const [imageUrl1, setImageUrl1] = useState('');\n  const [imageUrl2, setImageUrl2] = useState('');",
  "  const [uploadingMedia, setUploadingMedia] = useState(false);\n  const [imageFiles, setImageFiles] = useState([]);\n  const [newLatitude, setNewLatitude] = useState(null);\n  const [newLongitude, setNewLongitude] = useState(null);\n  const [phoneRevealed, setPhoneRevealed] = useState(false);\n  const [isFree, setIsFree] = useState(false);"
);

// 3. Reset states on modal close
content = content.replace(
  "setNewTitle('');\n        setNewPrice('');",
  "setNewTitle('');\n        setNewPrice('');\n        setImageFiles([]);\n        setPhoneRevealed(false);\n        setIsFree(false);\n        setNewLatitude(null);\n        setNewLongitude(null);"
);

// 4. Update the Load Ads filter
content = content.replace(
  "      if (selectedSort !== 'newest') {\n        params.push(`sort=${selectedSort}`);\n      }\n    }",
  "      if (selectedSort !== 'newest') {\n        params.push(`sort=${selectedSort}`);\n      }\n      if (conditionNew && !conditionUsed) params.push('condition=New');\n      if (!conditionNew && conditionUsed) params.push('condition=Used');\n      if (priceMax < 1000000) params.push(`priceMax=${priceMax}`);\n    }"
);

// 5. Open details - reset phone revealed
content = content.replace(
  "const handleOpenDetails = (ad) => {\n    setSelectedAd(ad);",
  "const handleOpenDetails = (ad) => {\n    setSelectedAd(ad);\n    setPhoneRevealed(false);"
);

// 6. API call for subcategories when category changes
content = content.replace(
  "const handlePostAdSubmit = (e) => {",
  `const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setNewCatId(catId);
    setNewSubcatId('');
    if (catId) {
      fetchApi(\`/classifieds/subcategories?categoryId=\${catId}\`)
        .then(data => setFormSubcategories(Array.isArray(data) ? data : []))
        .catch(() => setFormSubcategories([]));
    } else {
      setFormSubcategories([]);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setNewLatitude(pos.coords.latitude);
          setNewLongitude(pos.coords.longitude);
          alert(lang === 'en' ? 'Location captured successfully!' : 'இடம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!');
        },
        () => alert(lang === 'en' ? 'Unable to retrieve your location.' : 'உங்கள் இருப்பிடத்தை மீட்டெடுக்க முடியவில்லை.')
      );
    }
  };

  const handlePostAdSubmit = async (e) => {`
);

// 7. Update Submit logic for file uploads
content = content.replace(
  "  const handlePostAdSubmit = (e) => {\n    e.preventDefault();\n    if (!newTitle || !newPrice || !newPhone || !newDesc) {\n      alert(lang === 'en' ? 'Please fill all required fields.' : 'தேவையான அனைத்து புலங்களையும் நிரப்பவும்.');\n      return;\n    }\n\n    const payload = {\n      title: newTitle,\n      description: newDesc,\n      price: parseFloat(newPrice),\n      negotiable: newNegotiable,\n      categoryId: newCatId || null,\n      subcategoryId: newSubcatId || null,\n      districtId: newDistrictId || null,\n      pincode: newPincode,\n      contactPhone: newPhone,\n      whatsappNumber: newWhatsapp,\n      email: newEmail,\n      status: 'active'\n    };\n\n    const images = [];\n    if (imageUrl1) images.push(imageUrl1);\n    if (imageUrl2) images.push(imageUrl2);\n\n    fetchApi(`/classifieds?images=\${encodeURIComponent(images.join(','))}`, {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(payload)\n    })",
  `
    e.preventDefault();
    if (!newTitle || (!newPrice && !isFree) || !newPhone || !newDesc) {
      alert(lang === 'en' ? 'Please fill all required fields.' : 'தேவையான அனைத்து புலங்களையும் நிரப்பவும்.');
      return;
    }

    setUploadingMedia(true);
    let uploadedUrls = [];

    // Upload files
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
        console.warn("File upload failed", err);
      }
    }

    const payload = {
      title: newTitle,
      description: newDesc,
      price: isFree ? 0 : parseFloat(newPrice),
      negotiable: newNegotiable,
      categoryId: newCatId || null,
      subcategoryId: newSubcatId || null,
      districtId: newDistrictId || null,
      pincode: newPincode,
      contactPhone: newPhone,
      whatsappNumber: newWhatsapp,
      email: newEmail,
      latitude: newLatitude,
      longitude: newLongitude,
      status: 'active'
    };

    fetchApi(\`/classifieds?images=\${encodeURIComponent(uploadedUrls.join(','))}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).finally(() => setUploadingMedia(false))`
);


// 8. Replace form category select to use handleCategoryChange and add subcategory
content = content.replace(
  `<select 
                          value={newCatId}
                          onChange={(e) => setNewCatId(e.target.value)}`,
  `<select 
                          value={newCatId}
                          onChange={handleCategoryChange}`
);

// 9. Add Subcategory select under Category
content = content.replace(
  `{categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">`,
  `{categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Subcategory</label>
                        <select 
                          value={newSubcatId}
                          onChange={(e) => setNewSubcatId(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        >
                          <option value="">-- Choose Subcategory --</option>
                          {formSubcategories.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">`
);

// 10. Pricing 'Free' logic in UI
content = content.replace(
  `<label style={{ fontSize: '13px', fontWeight: 'bold' }}>Price (INR) *</label>
                        <input 
                          type="number" 
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          required 
                          placeholder="e.g. 85000"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />`,
  `<label style={{ fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                          Price (INR) *
                          <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} /> Free
                          </label>
                        </label>
                        <input 
                          type="number" 
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          required={!isFree}
                          disabled={isFree}
                          placeholder="e.g. 85000"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black', background: isFree ? '#f1f5f9' : 'white' }}
                        />`
);

// 11. Replace old manual images with real file upload and geolocation
content = content.replace(
  `<div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Image URL 1</label>
                        <input 
                          type="text" 
                          value={imageUrl1}
                          onChange={(e) => setImageUrl1(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/..."
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Image URL 2</label>
                        <input 
                          type="text" 
                          value={imageUrl2}
                          onChange={(e) => setImageUrl2(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/..."
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>`,
  `<div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Upload Photos (Up to 8)</label>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={(e) => setImageFiles(Array.from(e.target.files).slice(0, 8))}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px dashed #cbd5e1', color: 'black' }}
                        />
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Selected {imageFiles.length} file(s)</div>
                      </div>
                      
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Location Pin (Optional)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                            <button type="button" onClick={handleGeolocation} style={{ background: '#e2e8f0', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                <i className="fas fa-map-marker-alt" style={{ color: '#ef4444' }}></i> Use My Location
                            </button>
                            {newLatitude && <span style={{ fontSize: '12px', color: '#10b981' }}><i className="fas fa-check-circle"></i> Captured</span>}
                        </div>
                      </div>`
);

// 12. Upload loading text in submit button
content = content.replace(
  `>
                        Publish Listing
                      </button>`,
  ` disabled={uploadingMedia}>
                        {uploadingMedia ? 'Uploading...' : 'Publish Listing'}
                      </button>`
);

// 13. Masking phone number in Modal
content = content.replace(
  `<a 
                  href={\`tel:\${selectedAd.contactPhone}\`}
                  style={{ flex: 1, textDecoration: 'none', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                >
                  <i className="fas fa-phone-alt"></i> Call Seller
                </a>`,
  `{phoneRevealed ? (
                  <a 
                    href={\`tel:\${selectedAd.contactPhone}\`}
                    style={{ flex: 1, textDecoration: 'none', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <i className="fas fa-phone-alt"></i> {selectedAd.contactPhone}
                  </a>
                ) : (
                  <button 
                    onClick={() => setPhoneRevealed(true)}
                    style={{ flex: 1, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    <i className="fas fa-eye"></i> Show Number
                  </button>
                )}`
);

// 14. Add WhatsApp button if enabled
content = content.replace(
  `<div><strong>Condition:</strong> Used</div>`,
  `<div><strong>Condition:</strong> Used</div>
                {selectedAd.whatsappNumber && (
                   <div style={{ gridColumn: 'span 2' }}>
                     <a href={\`https://wa.me/\${selectedAd.whatsappNumber}\`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: '#25D366', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}>
                       <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                     </a>
                   </div>
                )}`
);

// 15. WhatsApp Number input field in form Step 3
content = content.replace(
  `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Contact Phone *</label>`,
  `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Contact Phone *</label>`
);

content = content.replace(
  `style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>District Locality</label>`,
  `style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>WhatsApp Number</label>
                        <input 
                          type="text" 
                          value={newWhatsapp}
                          onChange={(e) => setNewWhatsapp(e.target.value)}
                          placeholder="e.g. 9876543210"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>District Locality</label>`
);

fs.writeFileSync('/Users/hkmac/kingstv/King-tv-final/frontend/src/pages/Classifieds.jsx', content, 'utf8');
