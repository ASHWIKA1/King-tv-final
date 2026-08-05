/**
 * Dummy news articles keyed by district (Tamil key).
 * Each district has 6-8 unique, locally-relevant articles.
 */
const districtDummyNews = {
  'சென்னை': [
    {
      id: 'chennai-1',
      titleTa: 'சென்னை மெட்ரோ இரண்டாம் கட்ட பணிகள் வேகமாக முன்னேற்றம்',
      titleEn: 'Chennai Metro Phase 2 construction progresses rapidly',
      shortDescTa: 'சென்னை மெட்ரோ ரயில் இரண்டாம் கட்ட நீட்டிப்புப் பணிகள் எதிர்பார்த்ததை விட வேகமாக நடைபெற்று வருகின்றன. ஷோலிங்கநல்லூர் முதல் சிப்காட் வரையிலான பகுதி 2027-ல் திறக்கப்படும் என அதிகாரிகள் தெரிவித்தனர்.',
      shortDescEn: 'Chennai Metro Rail Phase 2 extension work is progressing faster than expected. Officials confirmed the Sholinganallur to SIPCOT stretch will open by 2027.',
      category: 'politics',
      categoryTa: 'அரசியல்',
      categoryEn: 'Politics',
      featuredImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'chennai-2',
      titleTa: 'மெரினா கடற்கரையில் சர்வதேச மணல் சிற்ப விழா தொடக்கம்',
      titleEn: 'International Sand Sculpture Festival begins at Marina Beach',
      shortDescTa: '15 நாடுகளைச் சேர்ந்த கலைஞர்கள் பங்கேற்கும் சர்வதேச மணல் சிற்ப விழா மெரினா கடற்கரையில் இன்று தொடங்கியது.',
      shortDescEn: 'Artists from 15 countries participate in the International Sand Sculpture Festival that kicked off today at Marina Beach.',
      category: 'cinema',
      categoryTa: 'கலை',
      categoryEn: 'Art & Culture',
      featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'chennai-3',
      titleTa: 'சென்னையில் கனமழை எச்சரிக்கை - பள்ளிகளுக்கு விடுமுறை',
      titleEn: 'Heavy rain alert in Chennai - Schools declared holiday',
      shortDescTa: 'வானிலை ஆய்வு மையம் சென்னையில் அடுத்த 48 மணி நேரத்திற்கு கனமழை பெய்யும் என எச்சரிக்கை விடுத்துள்ளது. பள்ளிகளுக்கு விடுமுறை அறிவிக்கப்பட்டுள்ளது.',
      shortDescEn: 'Meteorological department warns of heavy rainfall in Chennai for next 48 hours. Schools declared holiday as a precautionary measure.',
      category: 'politics',
      categoryTa: 'செய்திகள்',
      categoryEn: 'News',
      featuredImage: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'chennai-4',
      titleTa: 'சென்னை ஐஐடி-யில் செயற்கை நுண்ணறிவு ஆராய்ச்சி மையம் தொடக்கம்',
      titleEn: 'IIT Madras launches new AI Research Centre',
      shortDescTa: 'சென்னை ஐஐடி-யில் புதிய செயற்கை நுண்ணறிவு ஆராய்ச்சி மையம் இன்று திறக்கப்பட்டது. ₹500 கோடி முதலீட்டில் அமைக்கப்படும் இந்த மையம் உலகத்தரம் வாய்ந்ததாக இருக்கும்.',
      shortDescEn: 'A new AI Research Centre was inaugurated at IIT Madras today. The ₹500 crore facility will be a world-class hub for artificial intelligence research.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Technology',
      featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'chennai-5',
      titleTa: 'சென்னை சூப்பர் கிங்ஸ் அபார வெற்றி - பிளே ஆஃப் உறுதி',
      titleEn: 'Chennai Super Kings secure stunning win - Playoff confirmed',
      shortDescTa: 'சென்னை சூப்பர் கிங்ஸ் அணி நேற்றைய போட்டியில் 8 விக்கெட் வித்தியாசத்தில் அபார வெற்றி பெற்று பிளே ஆஃப் சுற்றுக்கு தகுதி பெற்றது.',
      shortDescEn: 'CSK secured a dominating 8-wicket victory in yesterday\'s match, confirming their place in the playoffs.',
      category: 'sports',
      categoryTa: 'விளையாட்டு',
      categoryEn: 'Sports',
      featuredImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'chennai-6',
      titleTa: 'டி.நகர் ரங்கநாதன் தெருவில் புதிய ஸ்மார்ட் பார்க்கிங் முறை',
      titleEn: 'New smart parking system at T. Nagar Ranganathan Street',
      shortDescTa: 'டி.நகர் ரங்கநாதன் தெருவில் புதிய ஸ்மார்ட் பார்க்கிங் முறை அறிமுகம் செய்யப்பட்டுள்ளது. செயலி மூலம் பார்க்கிங் இடத்தை முன்பதிவு செய்யலாம்.',
      shortDescEn: 'A new smart parking system has been introduced at T. Nagar Ranganathan Street. Parking spots can now be reserved via mobile app.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Technology',
      featuredImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'கோயம்புத்தூர்': [
    {
      id: 'cbe-1',
      titleTa: 'கோயம்புத்தூர் ஜவுளி ஏற்றுமதி 20% அதிகரிப்பு - புதிய சாதனை',
      titleEn: 'Coimbatore textile exports surge 20% - New record',
      shortDescTa: 'கோயம்புத்தூர் ஜவுளி மற்றும் ஆடை ஏற்றுமதி கடந்த ஆண்டை விட 20% அதிகரித்து புதிய சாதனை படைத்துள்ளது. ₹15,000 கோடி ஏற்றுமதி எட்டப்பட்டுள்ளது.',
      shortDescEn: 'Coimbatore textile and garment exports surged 20% over last year, reaching a record ₹15,000 crore in exports.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Business',
      featuredImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cbe-2',
      titleTa: 'கோவை விமான நிலையத்தின் புதிய சர்வதேச முனையம் திறப்பு',
      titleEn: 'New international terminal inaugurated at Coimbatore Airport',
      shortDescTa: 'கோயம்புத்தூர் சர்வதேச விமான நிலையத்தின் புதிய முனையம் இன்று திறக்கப்பட்டது. இது ஆண்டுக்கு 50 லட்சம் பயணிகளை கையாளும் திறன் கொண்டது.',
      shortDescEn: 'The new terminal at Coimbatore International Airport was inaugurated today with a capacity to handle 5 million passengers annually.',
      category: 'politics',
      categoryTa: 'அரசியல்',
      categoryEn: 'Infrastructure',
      featuredImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cbe-3',
      titleTa: 'மருதமலையில் கோடை விழா கோலாகலமாக தொடக்கம்',
      titleEn: 'Summer festival begins grandly at Marudhamalai',
      shortDescTa: 'கோயம்புத்தூர் அருகே உள்ள மருதமலை முருகன் கோவிலில் ஆண்டு கோடை விழா கோலாகலமாக தொடங்கியது. ஆயிரக்கணக்கான பக்தர்கள் பங்கேற்றனர்.',
      shortDescEn: 'The annual summer festival at Marudhamalai Murugan Temple near Coimbatore began with grand celebrations. Thousands of devotees participated.',
      category: 'cinema',
      categoryTa: 'ஆன்மீகம்',
      categoryEn: 'Spiritual',
      featuredImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cbe-4',
      titleTa: 'கோவை PSG டெக் பார்க்கில் 5000 புதிய ஐடி வேலைவாய்ப்புகள்',
      titleEn: '5000 new IT jobs at Coimbatore PSG Tech Park',
      shortDescTa: 'கோவை PSG டெக் பார்க்கில் 5 புதிய ஐடி நிறுவனங்கள் அலுவலகங்களை அமைக்க உள்ளன. இதன்மூலம் 5000 புதிய வேலைவாய்ப்புகள் உருவாகும் என எதிர்பார்க்கப்படுகிறது.',
      shortDescEn: '5 new IT companies are setting up offices at PSG Tech Park in Coimbatore, expected to create 5000 new job opportunities.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Technology',
      featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cbe-5',
      titleTa: 'கோவையில் ஆர்கானிக் விவசாய கண்காட்சி - விவசாயிகளிடம் பெரும் வரவேற்பு',
      titleEn: 'Organic farming exhibition in Coimbatore receives huge response',
      shortDescTa: 'கோவையில் நடைபெற்ற ஆர்கானிக் விவசாய கண்காட்சியில் 500-க்கும் மேற்பட்ட விவசாயிகள் பங்கேற்றனர். இயற்கை விவசாய தொழில்நுட்பங்கள் காட்சிப்படுத்தப்பட்டன.',
      shortDescEn: 'Over 500 farmers participated in the organic farming exhibition in Coimbatore. Natural farming technologies were showcased.',
      category: 'business',
      categoryTa: 'விவசாயம்',
      categoryEn: 'Agriculture',
      featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cbe-6',
      titleTa: 'கோவை FC அரையிறுதிக்கு முன்னேற்றம் - ரசிகர்கள் உற்சாகம்',
      titleEn: 'Coimbatore FC advances to semi-finals - Fans celebrate',
      shortDescTa: 'ஐ-லீக் போட்டியில் கோவை FC அரையிறுதிக்கு முன்னேறியது. அணியின் அபார செயல்பாட்டால் ரசிகர்கள் உற்சாகம் அடைந்தனர்.',
      shortDescEn: 'Coimbatore FC advances to semi-finals in the I-League. Fans celebrate the team\'s stellar performance throughout the season.',
      category: 'sports',
      categoryTa: 'விளையாட்டு',
      categoryEn: 'Sports',
      featuredImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'மதுரை': [
    {
      id: 'mdu-1',
      titleTa: 'மீனாட்சி அம்மன் கோவில் சித்திரை திருவிழா - 10 லட்சம் பக்தர்கள் எதிர்பார்ப்பு',
      titleEn: 'Meenakshi Amman Temple Chithirai Festival - 10 lakh devotees expected',
      shortDescTa: 'மதுரை மீனாட்சி அம்மன் கோவிலில் சித்திரை திருவிழா கோலாகலமாக தொடங்கியது. இந்த ஆண்டு 10 லட்சம் பக்தர்கள் வருவார்கள் என எதிர்பார்க்கப்படுகிறது.',
      shortDescEn: 'The grand Chithirai Festival at Meenakshi Amman Temple began. 10 lakh devotees are expected to visit this year.',
      category: 'cinema',
      categoryTa: 'ஆன்மீகம்',
      categoryEn: 'Spiritual',
      featuredImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mdu-2',
      titleTa: 'மதுரை AIIMS மருத்துவமனை கட்டுமானம் 80% நிறைவு',
      titleEn: 'Madurai AIIMS construction reaches 80% completion',
      shortDescTa: 'மதுரையில் கட்டப்பட்டு வரும் AIIMS மருத்துவமனையின் கட்டுமானப் பணிகள் 80% நிறைவடைந்துள்ளன. 2027-ல் செயல்பாட்டுக்கு வரும் என எதிர்பார்க்கப்படுகிறது.',
      shortDescEn: 'Construction of AIIMS Madurai has reached 80% completion. The hospital is expected to become operational by 2027.',
      category: 'politics',
      categoryTa: 'அரசியல்',
      categoryEn: 'Health',
      featuredImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mdu-3',
      titleTa: 'மதுரை ஜல்லிக்கட்டு போட்டியில் 700 காளைகள் பங்கேற்பு',
      titleEn: '700 bulls participate in Madurai Jallikattu event',
      shortDescTa: 'அலங்காநல்லூர் ஜல்லிக்கட்டு போட்டியில் 700 காளைகள் பங்கேற்றன. சாகச விளையாட்டில் 300-க்கும் மேற்பட்ட வீரர்கள் பங்கேற்றனர்.',
      shortDescEn: '700 bulls participated in the Alanganallur Jallikattu event. Over 300 tamers showcased their skills in the traditional sport.',
      category: 'sports',
      categoryTa: 'விளையாட்டு',
      categoryEn: 'Sports',
      featuredImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mdu-4',
      titleTa: 'மதுரை-சென்னை இடையே புதிய வந்தே பாரத் ரயில் சேவை தொடக்கம்',
      titleEn: 'New Vande Bharat train service launched between Madurai and Chennai',
      shortDescTa: 'மதுரை-சென்னை இடையே புதிய வந்தே பாரத் ரயில் சேவை இன்று தொடங்கப்பட்டது. பயண நேரம் 6 மணி நேரமாக குறைக்கப்பட்டுள்ளது.',
      shortDescEn: 'A new Vande Bharat Express service between Madurai and Chennai was launched today, reducing travel time to 6 hours.',
      category: 'politics',
      categoryTa: 'போக்குவரத்து',
      categoryEn: 'Transport',
      featuredImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mdu-5',
      titleTa: 'மதுரை காமராஜர் பல்கலைக்கழகத்தில் AI ஆராய்ச்சி திட்டம்',
      titleEn: 'AI research program launched at Madurai Kamaraj University',
      shortDescTa: 'மதுரை காமராஜர் பல்கலைக்கழகம் புதிய AI ஆராய்ச்சி திட்டத்தை தொடங்கியுள்ளது. மத்திய அரசின் ₹100 கோடி நிதி ஒதுக்கீடு.',
      shortDescEn: 'Madurai Kamaraj University has launched a new AI research program with ₹100 crore funding from the central government.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Technology',
      featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mdu-6',
      titleTa: 'மதுரை ஜிகா மாவட்டத்தில் மல்லிகை பூ விளைச்சல் அதிகரிப்பு',
      titleEn: 'Jasmine flower yield increases in Madurai district',
      shortDescTa: 'மதுரை மாவட்டத்தில் இந்த பருவத்தில் மல்லிகை பூ விளைச்சல் 30% அதிகரித்துள்ளது. விலை கிலோவுக்கு ₹800-ல் இருந்து ₹500-ஆக குறைந்துள்ளது.',
      shortDescEn: 'Jasmine flower yield in Madurai district has increased by 30% this season. Prices dropped from ₹800 to ₹500 per kg.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Agriculture',
      featuredImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'சேலம்': [
    {
      id: 'slm-1',
      titleTa: 'சேலம் எஃகு ஆலையில் ₹2000 கோடி விரிவாக்கத் திட்டம் அறிவிப்பு',
      titleEn: 'Salem Steel Plant announces ₹2000 crore expansion plan',
      shortDescTa: 'சேலம் எஃகு ஆலையின் உற்பத்தி திறனை இரட்டிப்பாக்கும் ₹2000 கோடி விரிவாக்கத் திட்டம் அறிவிக்கப்பட்டுள்ளது.',
      shortDescEn: 'Salem Steel Plant announces a ₹2000 crore expansion plan to double its production capacity.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Business',
      featuredImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'slm-2',
      titleTa: 'சேலம் 8-வழிச் சாலை திட்டம் விரைவாக முன்னேற்றம்',
      titleEn: 'Salem 8-lane highway project progressing swiftly',
      shortDescTa: 'சேலம்-சென்னை 8-வழிச் சாலை திட்டம் 70% நிறைவடைந்துள்ளது. 2027 இறுதிக்குள் முழுமையாக திறக்கப்படும் என அதிகாரிகள் தெரிவித்தனர்.',
      shortDescEn: 'Salem-Chennai 8-lane highway project has reached 70% completion. Officials confirmed it will fully open by end of 2027.',
      category: 'politics',
      categoryTa: 'அரசியல்',
      categoryEn: 'Infrastructure',
      featuredImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'slm-3',
      titleTa: 'சேலம் யேற்காடு மலையில் சுற்றுலா பயணிகள் எண்ணிக்கை அதிகரிப்பு',
      titleEn: 'Tourist footfall increases at Salem Yercaud hills',
      shortDescTa: 'சேலம் அருகே உள்ள யேற்காடு மலைப்பகுதியில் கோடை விடுமுறை காலத்தில் சுற்றுலா பயணிகள் எண்ணிக்கை 40% அதிகரித்துள்ளது.',
      shortDescEn: 'Tourist footfall at Yercaud hills near Salem has increased by 40% during the summer vacation period.',
      category: 'cinema',
      categoryTa: 'சுற்றுலா',
      categoryEn: 'Tourism',
      featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'slm-4',
      titleTa: 'சேலம் மாவட்டத்தில் மாம்பழ ஏற்றுமதி புதிய உச்சம்',
      titleEn: 'Mango exports from Salem district hit new peak',
      shortDescTa: 'சேலம் மாவட்டத்தில் இருந்து இந்த பருவத்தில் 5000 டன் மாம்பழம் ஏற்றுமதி செய்யப்பட்டுள்ளது. முக்கியமாக அமெரிக்கா, ஐரோப்பா நாடுகளுக்கு அனுப்பப்படுகிறது.',
      shortDescEn: '5000 tonnes of mangoes exported from Salem this season, primarily to the US and European markets.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Agriculture',
      featuredImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'slm-5',
      titleTa: 'சேலம் சோனா தொழில்நுட்பக் கல்லூரியில் ஹேக்கத்தான் போட்டி',
      titleEn: 'Hackathon competition at Salem Sona College of Technology',
      shortDescTa: 'சோனா தொழில்நுட்பக் கல்லூரியில் 48 மணி நேர ஹேக்கத்தான் போட்டி நடைபெற்றது. 200 அணிகள் பங்கேற்றன.',
      shortDescEn: '48-hour hackathon competition held at Sona College of Technology, Salem. 200 teams participated from across Tamil Nadu.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Technology',
      featuredImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'slm-6',
      titleTa: 'சேலம் கபடி அணி தேசிய போட்டியில் தங்கம் வென்றது',
      titleEn: 'Salem Kabaddi team wins gold at national championship',
      shortDescTa: 'தேசிய கபடி போட்டியில் சேலம் மாவட்ட அணி தங்கப் பதக்கம் வென்று சாதனை படைத்தது. இறுதிப் போட்டியில் ஹரியானாவை வீழ்த்தியது.',
      shortDescEn: 'Salem district team won gold at the National Kabaddi Championship, defeating Haryana in an exciting final.',
      category: 'sports',
      categoryTa: 'விளையாட்டு',
      categoryEn: 'Sports',
      featuredImage: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'திருச்சி': [
    {
      id: 'tcy-1',
      titleTa: 'திருச்சி ரங்கநாதர் கோவிலில் வைகுண்ட ஏகாதசி - பக்தர்கள் வெள்ளம்',
      titleEn: 'Vaikunta Ekadasi at Trichy Ranganathar Temple - Devotees throng',
      shortDescTa: 'திருச்சி ஸ்ரீரங்கம் ரங்கநாதர் கோவிலில் வைகுண்ட ஏகாதசி விழா கோலாகலமாக கொண்டாடப்பட்டது. 5 லட்சம் பக்தர்கள் வருகை.',
      shortDescEn: 'Vaikunta Ekadasi celebrated grandly at Srirangam Ranganathar Temple. Over 5 lakh devotees visited.',
      category: 'cinema',
      categoryTa: 'ஆன்மீகம்',
      categoryEn: 'Spiritual',
      featuredImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tcy-2',
      titleTa: 'திருச்சி விமான நிலையத்தில் இருந்து சிங்கப்பூருக்கு நேரடி விமானம்',
      titleEn: 'Direct flight from Trichy to Singapore launched',
      shortDescTa: 'திருச்சி சர்வதேச விமான நிலையத்திலிருந்து சிங்கப்பூருக்கு புதிய நேரடி விமான சேவை தொடங்கப்பட்டது.',
      shortDescEn: 'A new direct flight service from Trichy International Airport to Singapore has been launched.',
      category: 'politics',
      categoryTa: 'போக்குவரத்து',
      categoryEn: 'Transport',
      featuredImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tcy-3',
      titleTa: 'திருச்சி BHEL ஆலையில் புதிய சூரிய மின் உபகரணம் உற்பத்தி',
      titleEn: 'Trichy BHEL plant starts solar equipment manufacturing',
      shortDescTa: 'திருச்சி BHEL ஆலையில் சூரிய மின் பேனல் உபகரணங்களின் உற்பத்தி தொடங்கப்பட்டுள்ளது. ₹800 கோடி முதலீட்டில் புதிய பிரிவு.',
      shortDescEn: 'BHEL Trichy starts solar panel equipment manufacturing with ₹800 crore investment in a new division.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Business',
      featuredImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tcy-4',
      titleTa: 'திருச்சி NIT கல்லூரி தேசிய ரோபோட்டிக்ஸ் போட்டியில் முதலிடம்',
      titleEn: 'NIT Trichy wins first place in national robotics competition',
      shortDescTa: 'தேசிய ரோபோட்டிக்ஸ் போட்டியில் திருச்சி NIT கல்லூரி மாணவர்கள் முதலிடத்தைப் பிடித்தனர். செயற்கை நுண்ணறிவு ரோபோ வடிவமைப்பில் சிறந்து விளங்கினர்.',
      shortDescEn: 'NIT Trichy students secured first place at the National Robotics Competition with their AI-powered robot design.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Technology',
      featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tcy-5',
      titleTa: 'திருச்சி மாநகராட்சியில் ₹500 கோடி குடிநீர் திட்டம் தொடக்கம்',
      titleEn: 'Trichy corporation launches ₹500 crore drinking water project',
      shortDescTa: 'திருச்சி மாநகராட்சியின் புதிய ₹500 கோடி குடிநீர் விநியோக திட்டம் இன்று தொடங்கப்பட்டது. 24 மணி நேர குடிநீர் வழங்கல் இலக்கு.',
      shortDescEn: 'Trichy corporation\'s new ₹500 crore drinking water distribution project was launched today targeting 24/7 water supply.',
      category: 'politics',
      categoryTa: 'அரசியல்',
      categoryEn: 'Governance',
      featuredImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tcy-6',
      titleTa: 'திருச்சி காவிரி ஆற்றில் படகு சவாரி சுற்றுலா திட்டம் தொடக்கம்',
      titleEn: 'Boat tourism project launched on Cauvery River in Trichy',
      shortDescTa: 'திருச்சி காவிரி ஆற்றில் புதிய படகு சவாரி சுற்றுலா திட்டம் தொடங்கியுள்ளது. சுற்றுலா பயணிகளை ஈர்க்கும் நோக்கில் அமைக்கப்பட்டுள்ளது.',
      shortDescEn: 'A new boat ride tourism project has been launched on the Cauvery River in Trichy to attract more tourists.',
      category: 'cinema',
      categoryTa: 'சுற்றுலா',
      categoryEn: 'Tourism',
      featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'திருநெல்வேலி': [
    {
      id: 'tnv-1',
      titleTa: 'திருநெல்வேலி அல்வா உற்பத்தி GI குறியீடு பெற்றது',
      titleEn: 'Tirunelveli Halwa receives GI tag recognition',
      shortDescTa: 'திருநெல்வேலி அல்வா GI (புவிசார் குறியீடு) அங்கீகாரம் பெற்றது. இது உள்ளூர் உற்பத்தியாளர்களுக்கு சர்வதேச சந்தையில் பெரும் வாய்ப்பை ஏற்படுத்தும்.',
      shortDescEn: 'Tirunelveli Halwa has been granted Geographical Indication (GI) tag, opening international market opportunities for local producers.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Business',
      featuredImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnv-2',
      titleTa: 'நெல்லை மாவட்டத்தில் காற்றாலை மின் உற்பத்தி 500 MW எட்டியது',
      titleEn: 'Wind energy production in Tirunelveli reaches 500 MW',
      shortDescTa: 'திருநெல்வேலி மாவட்டத்தில் காற்றாலை மின் உற்பத்தி 500 மெகாவாட்டை எட்டியது. புதிய காற்றாலைகள் நிறுவப்பட்டு வருகின்றன.',
      shortDescEn: 'Wind energy production in Tirunelveli district has reached 500 MW with new wind farms being installed.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Energy',
      featuredImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnv-3',
      titleTa: 'நெல்லையப்பர் கோவிலில் தேரோட்டம் - பக்தர்கள் பரவசம்',
      titleEn: 'Chariot festival at Nellaiappar Temple - Devotees rejoice',
      shortDescTa: 'திருநெல்வேலி நெல்லையப்பர் கோவிலில் ஆண்டுத் தேரோட்டம் கோலாகலமாக நடைபெற்றது. ஆயிரக்கணக்கான பக்தர்கள் பங்கேற்றனர்.',
      shortDescEn: 'The annual chariot festival at Nellaiappar Temple was celebrated grandly with thousands of devotees participating.',
      category: 'cinema',
      categoryTa: 'ஆன்மீகம்',
      categoryEn: 'Spiritual',
      featuredImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnv-4',
      titleTa: 'திருநெல்வேலி மணப்பாறையில் புதிய தொழிற்பேட்டை அமைப்பு',
      titleEn: 'New industrial estate set up at Tirunelveli Manaparai',
      shortDescTa: 'திருநெல்வேலி மாவட்டத்தில் புதிய தொழிற்பேட்டை அமைக்கப்படுகிறது. 200 சிறு தொழில் நிறுவனங்களுக்கு இடம் ஒதுக்கப்படும்.',
      shortDescEn: 'A new industrial estate is being set up in Tirunelveli district with space for 200 small-scale industries.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Business',
      featuredImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnv-5',
      titleTa: 'நெல்லை மாவட்டம் - தாமிரபரணி ஆற்றில் வெள்ள அபாய எச்சரிக்கை',
      titleEn: 'Flood alert issued for Thamiraparani River in Tirunelveli',
      shortDescTa: 'தொடர் மழை காரணமாக தாமிரபரணி ஆற்றில் நீர்மட்டம் உயர்ந்துள்ளது. ஆற்றங்கரை பகுதி மக்களுக்கு வெள்ள அபாய எச்சரிக்கை.',
      shortDescEn: 'Water level in Thamiraparani River has risen due to continuous rain. Flood alert issued for riverside area residents.',
      category: 'politics',
      categoryTa: 'செய்திகள்',
      categoryEn: 'News',
      featuredImage: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnv-6',
      titleTa: 'நெல்லை அரசு மருத்துவக் கல்லூரி மாணவர்கள் தேசிய விருது பெற்றனர்',
      titleEn: 'Tirunelveli Govt Medical College students win national award',
      shortDescTa: 'திருநெல்வேலி அரசு மருத்துவக் கல்லூரி மாணவர்கள் சமூக சுகாதார திட்டத்திற்கு தேசிய விருது பெற்றனர்.',
      shortDescEn: 'Students of Tirunelveli Govt Medical College received a national award for their community health initiative.',
      category: 'tech',
      categoryTa: 'கல்வி',
      categoryEn: 'Education',
      featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'வேலூர்': [
    {
      id: 'vlr-1',
      titleTa: 'வேலூர் தோல் தொழிற்சாலை ஏற்றுமதி ₹10,000 கோடி தாண்டியது',
      titleEn: 'Vellore leather industry exports cross ₹10,000 crore',
      shortDescTa: 'வேலூர் மாவட்ட தோல் தொழிற்சாலைகளின் ஏற்றுமதி ₹10,000 கோடியை தாண்டி புதிய சாதனை. ஐரோப்பிய நாடுகளுக்கு முக்கிய சந்தை.',
      shortDescEn: 'Vellore leather industry exports crossed ₹10,000 crore mark, with European countries being the primary market.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Business',
      featuredImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'vlr-2',
      titleTa: 'வேலூர் கோட்டையில் ஒளி மற்றும் ஒலி காட்சி - சுற்றுலா ஈர்ப்பு',
      titleEn: 'Light and Sound show at Vellore Fort attracts tourists',
      shortDescTa: 'வேலூர் கோட்டையில் புதிய ஒளி மற்றும் ஒலி காட்சி தொடங்கப்பட்டுள்ளது. வரலாற்றை உயிர்ப்பிக்கும் வகையில் நவீன தொழில்நுட்பத்தில் அமைக்கப்பட்டுள்ளது.',
      shortDescEn: 'New Light and Sound show launched at historic Vellore Fort. Modern technology brings history alive for tourists.',
      category: 'cinema',
      categoryTa: 'சுற்றுலா',
      categoryEn: 'Tourism',
      featuredImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'vlr-3',
      titleTa: 'VIT பல்கலைக்கழகம் உலக தரவரிசையில் முன்னேற்றம்',
      titleEn: 'VIT University climbs global rankings',
      shortDescTa: 'வேலூர் VIT பல்கலைக்கழகம் QS உலக தரவரிசையில் 150 இடங்கள் முன்னேறியுள்ளது. பொறியியல் பிரிவில் இந்தியாவில் முதல் 10-ல் இடம்.',
      shortDescEn: 'VIT Vellore has climbed 150 places in QS World Rankings, now ranked among top 10 in India for engineering.',
      category: 'tech',
      categoryTa: 'கல்வி',
      categoryEn: 'Education',
      featuredImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'vlr-4',
      titleTa: 'வேலூர் ஆம்பூர் பகுதியில் புதிய எலக்ட்ரிக் வாகன ஆலை',
      titleEn: 'New electric vehicle plant at Vellore Ambur',
      shortDescTa: 'வேலூர் ஆம்பூர் பகுதியில் புதிய எலக்ட்ரிக் வாகன உற்பத்தி ஆலை அமைக்கப்படுகிறது. 2000 வேலைவாய்ப்புகள் உருவாகும்.',
      shortDescEn: 'A new electric vehicle manufacturing plant is being set up at Ambur in Vellore district, creating 2000 jobs.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Automobile',
      featuredImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'vlr-5',
      titleTa: 'வேலூர் மாவட்ட கிராமங்களில் 100% இணைய இணைப்பு',
      titleEn: '100% internet connectivity in Vellore district villages',
      shortDescTa: 'வேலூர் மாவட்டத்தின் அனைத்து கிராமங்களிலும் 100% இணைய இணைப்பு வழங்கப்பட்டுள்ளது. டிஜிட்டல் இந்தியா திட்டத்தின் கீழ் சாதனை.',
      shortDescEn: '100% internet connectivity has been provided to all villages in Vellore district under the Digital India initiative.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Technology',
      featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'vlr-6',
      titleTa: 'வேலூர் மாவட்ட தடகள போட்டியில் புதிய சாதனை',
      titleEn: 'New record set at Vellore district athletics meet',
      shortDescTa: 'வேலூர் மாவட்ட தடகள போட்டியில் 100 மீட்டர் ஓட்டத்தில் புதிய சாதனை படைக்கப்பட்டது. 17 வயது மாணவி 11.2 வினாடிகளில் ஓடி சாதனை.',
      shortDescEn: 'New record set in 100m sprint at Vellore district athletics meet. A 17-year-old student clocked 11.2 seconds.',
      category: 'sports',
      categoryTa: 'விளையாட்டு',
      categoryEn: 'Sports',
      featuredImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'ஈரோடு': [
    {
      id: 'erd-1',
      titleTa: 'ஈரோடு மஞ்சள் சந்தையில் விலை 30% உயர்வு',
      titleEn: 'Turmeric prices surge 30% in Erode market',
      shortDescTa: 'ஈரோடு மஞ்சள் சந்தையில் விலை கடந்த மாதத்தை விட 30% உயர்ந்துள்ளது. குவிண்டாலுக்கு ₹18,000 என்ற புதிய உச்சம்.',
      shortDescEn: 'Turmeric prices in Erode market have surged 30% from last month, hitting a new high of ₹18,000 per quintal.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Agriculture',
      featuredImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'erd-2',
      titleTa: 'ஈரோடு அருகே புதிய தொழில்நுட்ப பூங்கா அறிவிப்பு',
      titleEn: 'New tech park near Erode announced',
      shortDescTa: 'ஈரோடு அருகே ₹300 கோடி மதிப்பில் புதிய தொழில்நுட்ப பூங்கா அமைக்கப்படுகிறது. 3000 ஐடி வேலைவாய்ப்புகள் உருவாக்கப்படும்.',
      shortDescEn: 'A ₹300 crore tech park is being set up near Erode, expected to create 3000 IT jobs.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Technology',
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'erd-3',
      titleTa: 'ஈரோடு பவானி ஆற்றில் புதிய பாலம் கட்டுமானம் தொடக்கம்',
      titleEn: 'New bridge construction begins over Bhavani River in Erode',
      shortDescTa: 'ஈரோடு பவானி ஆற்றின் குறுக்கே புதிய 4 வழிப்பாதை பாலம் கட்டுமானம் தொடங்கியுள்ளது. ₹150 கோடி செலவில் அமைக்கப்படுகிறது.',
      shortDescEn: 'Construction of a new 4-lane bridge across Bhavani River in Erode has begun at a cost of ₹150 crore.',
      category: 'politics',
      categoryTa: 'அரசியல்',
      categoryEn: 'Infrastructure',
      featuredImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'erd-4',
      titleTa: 'ஈரோடு ஜவுளி தொழில் - ₹5000 கோடி ஏற்றுமதி இலக்கு',
      titleEn: 'Erode textile industry targets ₹5000 crore exports',
      shortDescTa: 'ஈரோடு ஜவுளி தொழில் இந்த நிதியாண்டில் ₹5000 கோடி ஏற்றுமதி இலக்கை நிர்ணயித்துள்ளது. கைத்தறி மற்றும் ஆயத்த ஆடை துறை வளர்ச்சி.',
      shortDescEn: 'Erode textile industry has set an export target of ₹5000 crore for this financial year with handloom and readymade garment growth.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Business',
      featuredImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'erd-5',
      titleTa: 'ஈரோடு மாவட்டத்தில் இயற்கை விவசாய கிராமம் அறிவிப்பு',
      titleEn: 'Organic farming village announced in Erode district',
      shortDescTa: 'ஈரோடு மாவட்டத்தில் முழுமையான இயற்கை விவசாய கிராமம் அமைக்கப்படுகிறது. 100 விவசாயிகள் இயற்கை முறைக்கு மாறியுள்ளனர்.',
      shortDescEn: 'A fully organic farming village is being set up in Erode district with 100 farmers switching to organic methods.',
      category: 'business',
      categoryTa: 'விவசாயம்',
      categoryEn: 'Agriculture',
      featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'erd-6',
      titleTa: 'ஈரோடு கிரிக்கெட் வீரர் IPL-ல் அறிமுகம்',
      titleEn: 'Erode cricketer makes IPL debut',
      shortDescTa: 'ஈரோடு மாவட்டத்தைச் சேர்ந்த 20 வயது கிரிக்கெட் வீரர் IPL போட்டியில் அறிமுகமானார். முதல் போட்டியிலேயே 3 விக்கெட்டுகள் வீழ்த்தினார்.',
      shortDescEn: 'A 20-year-old cricketer from Erode made his IPL debut, taking 3 wickets in his very first match.',
      category: 'sports',
      categoryTa: 'விளையாட்டு',
      categoryEn: 'Sports',
      featuredImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'தஞ்சாவூர்': [
    {
      id: 'tnj-1',
      titleTa: 'தஞ்சாவூர் பெரிய கோவிலில் 1000 ஆண்டு கொண்டாட்டம்',
      titleEn: 'Thanjavur Big Temple celebrates 1000th anniversary',
      shortDescTa: 'தஞ்சாவூர் பெரிய கோவிலின் 1000 ஆண்டு கொண்டாட்ட விழா கோலாகலமாக தொடங்கியது. UNESCO உலகப் பாரம்பரிய தளமாக அங்கீகரிக்கப்பட்ட கோவில்.',
      shortDescEn: 'The Big Temple (Brihadeshwara) celebrates its 1000th anniversary. The UNESCO World Heritage Site hosts grand celebrations.',
      category: 'cinema',
      categoryTa: 'ஆன்மீகம்',
      categoryEn: 'Heritage',
      featuredImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnj-2',
      titleTa: 'தஞ்சாவூர் டெல்டா பகுதியில் நெல் உற்பத்தி அதிகரிப்பு',
      titleEn: 'Rice production increases in Thanjavur Delta region',
      shortDescTa: 'தஞ்சாவூர் டெல்டா பகுதியில் இந்த பருவத்தில் நெல் உற்பத்தி 25% அதிகரித்துள்ளது. காவிரி நீர் போதுமான அளவு கிடைத்ததே முக்கிய காரணம்.',
      shortDescEn: 'Rice production in Thanjavur Delta region increased by 25% this season due to adequate Cauvery water supply.',
      category: 'business',
      categoryTa: 'விவசாயம்',
      categoryEn: 'Agriculture',
      featuredImage: 'https://images.unsplash.com/photo-1530507629858-e4505d530939?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnj-3',
      titleTa: 'தஞ்சாவூர் ஓவிய கலை கண்காட்சி - 200 கலைஞர்கள் பங்கேற்பு',
      titleEn: 'Thanjavur Art Exhibition - 200 artists participate',
      shortDescTa: 'தஞ்சாவூரில் நடைபெற்ற பாரம்பரிய ஓவிய கலை கண்காட்சியில் 200-க்கும் மேற்பட்ட கலைஞர்கள் பங்கேற்றனர். தஞ்சாவூர் ஓவியக் கலைக்கு சர்வதேச மரியாதை.',
      shortDescEn: 'Over 200 artists participated in the traditional art exhibition in Thanjavur, celebrating the world-renowned Tanjore painting art form.',
      category: 'cinema',
      categoryTa: 'கலை',
      categoryEn: 'Art & Culture',
      featuredImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnj-4',
      titleTa: 'தஞ்சாவூரில் புதிய மருத்துவ கல்லூரி கட்டிடம் திறப்பு',
      titleEn: 'New medical college building inaugurated in Thanjavur',
      shortDescTa: 'தஞ்சாவூர் அரசு மருத்துவ கல்லூரியின் புதிய கட்டிடம் திறக்கப்பட்டது. 200 புதிய மாணவர் சேர்க்கை இடங்கள் அதிகரிப்பு.',
      shortDescEn: 'New building of Thanjavur Government Medical College inaugurated, adding 200 new student intake seats.',
      category: 'politics',
      categoryTa: 'கல்வி',
      categoryEn: 'Education',
      featuredImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnj-5',
      titleTa: 'தஞ்சாவூர் பொம்மை உற்பத்தியாளர்களுக்கு ஏற்றுமதி ஊக்கம்',
      titleEn: 'Export incentives for Thanjavur doll manufacturers',
      shortDescTa: 'தஞ்சாவூர் தலையாட்டி பொம்மை உற்பத்தியாளர்களுக்கு அரசு புதிய ஏற்றுமதி ஊக்கத்தொகை வழங்கியுள்ளது. சர்வதேச சந்தையில் தேவை அதிகரிப்பு.',
      shortDescEn: 'Government provides new export incentives for Thanjavur bobblehead doll manufacturers as international demand grows.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Business',
      featuredImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tnj-6',
      titleTa: 'தஞ்சாவூர் நடராஜா அருங்காட்சியகத்தில் புதிய பிரிவு',
      titleEn: 'New wing at Thanjavur Natarajah Museum',
      shortDescTa: 'தஞ்சாவூர் நடராஜா அருங்காட்சியகத்தில் சோழர் கால சிற்பங்களுக்கான புதிய பிரிவு திறக்கப்பட்டது.',
      shortDescEn: 'A new wing dedicated to Chola-era sculptures has been opened at the Thanjavur Natarajah Museum.',
      category: 'cinema',
      categoryTa: 'வரலாறு',
      categoryEn: 'History',
      featuredImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'கன்னியாகுமரி': [
    {
      id: 'kk-1',
      titleTa: 'கன்னியாகுமரி கடலோர சுற்றுலா - 50 லட்சம் பயணிகள் வருகை',
      titleEn: 'Kanyakumari coastal tourism - 50 lakh visitors this year',
      shortDescTa: 'கன்னியாகுமரி கடலோர சுற்றுலா இந்த ஆண்டு 50 லட்சம் பயணிகளை ஈர்த்துள்ளது. விவேகானந்த மண்டபம், திருவள்ளுவர் சிலை முக்கிய ஈர்ப்பு.',
      shortDescEn: 'Kanyakumari coastal tourism attracted 50 lakh visitors this year. Vivekananda Memorial and Thiruvalluvar Statue are key attractions.',
      category: 'cinema',
      categoryTa: 'சுற்றுலா',
      categoryEn: 'Tourism',
      featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'kk-2',
      titleTa: 'கன்னியாகுமரி கடல் மீனவர்களுக்கு புதிய படகுகள் வழங்கல்',
      titleEn: 'New boats distributed to Kanyakumari fishermen',
      shortDescTa: 'கன்னியாகுமரி மாவட்ட கடல் மீனவர்களுக்கு 100 புதிய மீன்பிடி படகுகள் அரசு வழங்கியுள்ளது. ₹50 லட்சம் மானியத்துடன்.',
      shortDescEn: '100 new fishing boats distributed to Kanyakumari fishermen with a ₹50 lakh subsidy from the government.',
      category: 'politics',
      categoryTa: 'அரசியல்',
      categoryEn: 'Governance',
      featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'kk-3',
      titleTa: 'கன்னியாகுமரியில் சூரிய மின் திட்டம் - 200 MW இலக்கு',
      titleEn: 'Solar power project in Kanyakumari - 200 MW target',
      shortDescTa: 'கன்னியாகுமரி மாவட்டத்தில் 200 MW சூரிய மின் திட்டம் அமைக்கப்படுகிறது. ₹1200 கோடி முதலீடு.',
      shortDescEn: '200 MW solar power project being set up in Kanyakumari district with ₹1200 crore investment.',
      category: 'tech',
      categoryTa: 'தொழில்நுட்பம்',
      categoryEn: 'Energy',
      featuredImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'kk-4',
      titleTa: 'கன்னியாகுமரி ரப்பர் விளைச்சல் அதிகரிப்பு - விவசாயிகள் மகிழ்ச்சி',
      titleEn: 'Rubber yield increases in Kanyakumari - Farmers rejoice',
      shortDescTa: 'கன்னியாகுமரி மாவட்டத்தில் ரப்பர் விளைச்சல் 15% அதிகரித்துள்ளது. விலையும் கிலோவுக்கு ₹220 ஆக உயர்ந்துள்ளது.',
      shortDescEn: 'Rubber yield in Kanyakumari increased by 15% with prices rising to ₹220 per kg, delighting farmers.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Agriculture',
      featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'kk-5',
      titleTa: 'கன்னியாகுமரி கடற்கரையில் ஆமை முட்டை பாதுகாப்பு திட்டம்',
      titleEn: 'Sea turtle egg conservation project at Kanyakumari coast',
      shortDescTa: 'கன்னியாகுமரி கடற்கரையில் அரிய வகை கடல் ஆமை முட்டைகள் பாதுகாக்கப்படுகின்றன. இந்த ஆண்டு 5000 குஞ்சுகள் கடலில் விடப்பட்டன.',
      shortDescEn: 'Rare sea turtle eggs being conserved at Kanyakumari coast. 5000 hatchlings released into the sea this year.',
      category: 'politics',
      categoryTa: 'சுற்றுச்சூழல்',
      categoryEn: 'Environment',
      featuredImage: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'kk-6',
      titleTa: 'கன்னியாகுமரி மாணவி சர்வதேச கணித ஒலிம்பியாட்டில் தங்கம்',
      titleEn: 'Kanyakumari student wins gold at International Math Olympiad',
      shortDescTa: 'கன்னியாகுமரி மாவட்டத்தைச் சேர்ந்த 16 வயது மாணவி சர்வதேச கணித ஒலிம்பியாட்டில் தங்கப் பதக்கம் வென்றார்.',
      shortDescEn: 'A 16-year-old student from Kanyakumari won gold medal at the International Mathematics Olympiad.',
      category: 'tech',
      categoryTa: 'கல்வி',
      categoryEn: 'Education',
      featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
    }
  ],

  'நாமக்கல்': [
    {
      id: 'nmk-1',
      titleTa: 'நாமக்கல் கோழி வளர்ப்பு தொழிலில் புதிய மைல்கல் - தினமும் 4 கோடி முட்டை',
      titleEn: 'Namakkal poultry industry milestone - 4 crore eggs daily',
      shortDescTa: 'நாமக்கல் மாவட்ட கோழிப்பண்ணைகள் தினமும் 4 கோடி முட்டைகள் உற்பத்தி செய்கின்றன. இந்தியாவின் முட்டை தலைநகரம் என்ற பெருமை நிலைத்துள்ளது.',
      shortDescEn: 'Namakkal poultry farms produce 4 crore eggs daily, reinforcing its title as the Egg Capital of India.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Agriculture',
      featuredImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'nmk-2',
      titleTa: 'நாமக்கல் லாரி போக்குவரத்து தொழிலில் ₹20,000 கோடி வருவாய்',
      titleEn: 'Namakkal lorry transport industry earns ₹20,000 crore revenue',
      shortDescTa: 'நாமக்கல் மாவட்டத்தின் லாரி போக்குவரத்து தொழில் ₹20,000 கோடி ஆண்டு வருவாயை எட்டியுள்ளது. 50,000 லாரிகள் பதிவு.',
      shortDescEn: 'Namakkal lorry transport industry reaches ₹20,000 crore annual revenue with 50,000 registered lorries.',
      category: 'business',
      categoryTa: 'வணிகம்',
      categoryEn: 'Transport',
      featuredImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'nmk-3',
      titleTa: 'நாமக்கல் கோலாப்பட்டி முனிவர் கோவிலில் கும்பாபிஷேகம்',
      titleEn: 'Kumbabishekam at Namakkal Kolapatti Munivar Temple',
      shortDescTa: 'நாமக்கல் கோலாப்பட்டி முனிவர் கோவிலில் கும்பாபிஷேகம் கோலாகலமாக நடைபெற்றது. ஆயிரக்கணக்கான பக்தர்கள் பங்கேற்றனர்.',
      shortDescEn: 'Kumbabishekam ceremony was held grandly at Kolapatti Munivar Temple in Namakkal. Thousands of devotees participated.',
      category: 'cinema',
      categoryTa: 'ஆன்மீகம்',
      categoryEn: 'Spiritual',
      featuredImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'nmk-4',
      titleTa: 'நாமக்கல் மாவட்டத்தில் புதிய அரசு கலைக் கல்லூரி',
      titleEn: 'New government arts college in Namakkal district',
      shortDescTa: 'நாமக்கல் மாவட்டத்தில் புதிய அரசு கலைக் கல்லூரி தொடங்கப்பட்டுள்ளது. 1000 மாணவர்கள் சேர்க்கை.',
      shortDescEn: 'A new government arts college has been established in Namakkal district with an intake of 1000 students.',
      category: 'politics',
      categoryTa: 'கல்வி',
      categoryEn: 'Education',
      featuredImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'nmk-5',
      titleTa: 'நாமக்கல் தொல்பொருள் ஆராய்ச்சியில் 2000 ஆண்டு பழமையான சிலைகள் கண்டுபிடிப்பு',
      titleEn: '2000-year-old stone sculptures discovered near Namakkal',
      shortDescTa: 'நாமக்கல் அருகே தொல்பொருள் ஆராய்ச்சியில் 2000 ஆண்டு பழைய கற்சிலைகள் கண்டுபிடிக்கப்பட்டுள்ளன.',
      shortDescEn: '2000-year-old stone sculptures discovered in archaeological excavation near Namakkal.',
      category: 'cinema',
      categoryTa: 'வரலாறு',
      categoryEn: 'History',
      featuredImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'nmk-6',
      titleTa: 'நாமக்கல் மாவட்ட கிரிக்கெட் லீக் தொடக்கம்',
      titleEn: 'Namakkal District Cricket League kicks off',
      shortDescTa: 'நாமக்கல் மாவட்ட கிரிக்கெட் லீக் போட்டி தொடங்கியுள்ளது. 32 அணிகள் பங்கேற்கின்றன. ₹5 லட்சம் பரிசுத்தொகை.',
      shortDescEn: 'Namakkal District Cricket League started with 32 teams participating. Prize money of ₹5 lakh up for grabs.',
      category: 'sports',
      categoryTa: 'விளையாட்டு',
      categoryEn: 'Sports',
      featuredImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'
    }
  ]
};

export default districtDummyNews;
