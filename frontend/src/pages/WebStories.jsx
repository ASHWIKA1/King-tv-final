import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';
import './WebStories.css';

const WebStories = () => {
  const { lang, t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/web-stories/getAllWeb')
      .then(data => {
        const contentList = data && data.content ? data.content : (Array.isArray(data) ? data : []);
        if (contentList.length > 0) {
          const formatted = contentList.map(story => {
            let slides = [];
            try {
              slides = story.slidesJson ? JSON.parse(story.slidesJson) : [];
            } catch(e) {
              console.warn("Failed to parse slides JSON", e);
            }
            return {
              id: story.id,
              cat: story.cat || 'general',
              badge: story.badge || 'NEW',
              titleTa: story.titleTa,
              titleEn: story.titleEn || story.titleTa,
              views: story.viewsCount > 1000 ? `${(story.viewsCount/1000).toFixed(1)}K` : `${story.viewsCount}`,
              gradient: story.backgroundGradient || 'linear-gradient(135deg, #1E40AF, #3B82F6)',
              slides: slides
            };
          });
          setStories(formatted);
        } else {
          setStories(storiesList);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch stories from database, using fallback", err);
        setStories(storiesList);
        setLoading(false);
      });
  }, []);

  const storiesList = [
    {
      id: 1,
      cat: 'sports',
      badge: 'NEW',
      titleTa: 'ஐபிஎல் 2025: சிஎஸ்கே புதிய கேப்டன் யார்?',
      titleEn: 'IPL 2025: Who is the next captain of CSK?',
      views: '15.4K',
      gradient: 'linear-gradient(135deg, #FF5722, #FF9800)',
      slides: [
        {
          titleTa: 'ருதுராஜ் கெய்க்வாட் நியமனம்',
          titleEn: 'Ruturaj Gaikwad Appointed',
          descTa: 'சென்னை சூப்பர் கிங்ஸ் அணியின் புதிய கேப்டனாக ருதுராஜ் கெய்க்வாட் அதிகாரப்பூர்வமாக நியமிக்கப்பட்டுள்ளார்.',
          descEn: 'Ruturaj Gaikwad has been officially appointed as the new captain of Chennai Super Kings.'
        },
        {
          titleTa: 'எம்.எஸ். தோனியின் ஆலோசனை',
          titleEn: 'M.S. Dhoni Advises',
          descTa: 'ருதுராஜின் தலைமைப் பண்பை வளர்க்கும் வகையில் தோனி அவருக்கு முக்கிய ஆலோசனைகளை வழங்கியுள்ளார்.',
          descEn: 'Dhoni has shared key leadership strategies with Gaikwad to ensure a smooth transition.'
        },
        {
          titleTa: 'ரசிகர்களின் எதிர்பார்ப்பு',
          titleEn: 'Fans Expectations',
          descTa: 'புதிய கேப்டனின் தலைமையில் சென்னை அணி மீண்டும் சாம்பியன் கோப்பையை வெல்லும் என ரசிகர்கள் நம்புகின்றனர்.',
          descEn: 'Fans are highly optimistic that Chennai will lift the cup again under the new captaincy.'
        },
        {
          titleTa: 'விளையாட்டு வல்லுநர்களின் கருத்து',
          titleEn: 'Sports Experts View',
          descTa: 'ருதுராஜின் நிதானமான ஆட்டம் மற்றும் திட்டமிடல் அணிக்கு பெரும் பலமாக அமையும் என வல்லுநர்கள் கூறுகின்றனர்.',
          descEn: 'Experts suggest Ruturaj\'s calm demeanor and tactical awareness will benefit the team.'
        },
        {
          titleTa: 'முக்கிய சவால்கள்',
          titleEn: 'Key Challenges',
          descTa: 'தோனியின் இடத்தை நிரப்புவது மற்றும் இளைய வீரர்களை வழிநடத்துவது ருதுராஜின் முக்கிய சவாலாக இருக்கும்.',
          descEn: 'Filling Dhoni\'s shoes and managing young players will be Gaikwad\'s primary tests.'
        }
      ]
    },
    {
      id: 2,
      cat: 'cinema',
      badge: 'HOT',
      titleTa: 'விஜய்யின் கடைசி படம்: என்ன எதிர்பார்க்கலாம்?',
      titleEn: 'Vijay final movie: What can we expect?',
      views: '28.1K',
      gradient: 'linear-gradient(135deg, #E91E63, #9C27B0)',
      slides: [
        {
          titleTa: 'மாபெரும் எதிர்பார்ப்புகள்',
          titleEn: 'High Expectations',
          descTa: 'தளபதி விஜய் நடிக்கும் கடைசி திரைப்படம் என்பதால் தமிழகம் முழுவதும் பெரும் எதிர்பார்ப்பு கிளம்பியுள்ளது.',
          descEn: 'As it marks the final on-screen outing of Thalapathy Vijay, expectations are soaring sky-high.'
        },
        {
          titleTa: 'வெங்கட் பிரபு இயக்கம்',
          titleEn: 'Direction by Venkat Prabhu',
          descTa: 'புதுமையான பாணியில் திரைக்கதை அமைப்பதில் வல்லவரான வெங்கட் பிரபு இந்த படத்தை இயக்குகிறார்.',
          descEn: 'Director Venkat Prabhu known for his screenplay tricks is handling this political action entertainer.'
        },
        {
          titleTa: 'அனிருத் இசையமைப்பு',
          titleEn: 'Musical Scores by Anirudh',
          descTa: 'திரைப்படத்தின் பாடல்கள் மற்றும் பின்னணி இசையை ராக்ஸ்டார் அனிருத் வடிவமைக்கிறார்.',
          descEn: 'Rockstar Anirudh is scoring the tracks, promising a massive audio treat for fans.'
        },
        {
          titleTa: 'நட்சத்திரப் பட்டாளம்',
          titleEn: 'Supporting Star Cast',
          descTa: 'பிரபல முன்னணி நடிகர்கள் பலரும் இந்த படத்தில் முக்கிய கதாபாத்திரங்களில் நடிக்க ஒப்பந்தமாகியுள்ளனர்.',
          descEn: 'Top-tier actors from different languages have joined the stellar supporting cast.'
        },
        {
          titleTa: 'திரையரங்கு வெளியீடு',
          titleEn: 'Grand Release Plan',
          descTa: 'உலகெங்கிலும் ஆயிரக்கணக்கான திரையரங்குகளில் இந்த படத்தை பிரம்மாண்டமாக வெளியிட திட்டமிடப்பட்டுள்ளது.',
          descEn: 'The production house is aiming for a historic release across global box offices.'
        }
      ]
    },
    {
      id: 3,
      cat: 'politics',
      badge: 'NEW',
      titleTa: 'தமிழக கூட்டணி அரசியல் தற்போதைய நிலவரம்',
      titleEn: 'TN alliance politics current updates',
      views: '12.9K',
      gradient: 'linear-gradient(135deg, #2196F3, #00BCD4)',
      slides: [
        {
          titleTa: 'புதிய கூட்டணிகள்',
          titleEn: 'New Alignments',
          descTa: 'தமிழக அரசியல் கட்சிகள் தங்களின் தேர்தல் வெற்றியை உறுதி செய்ய புதிய கூட்டணிகளை அமைத்து வருகின்றன.',
          descEn: 'Political groups in Tamil Nadu are exploring fresh alliances to bolster their seat share.'
        },
        {
          titleTa: 'பிரச்சார வியூகங்கள்',
          titleEn: 'Campaign Strategies',
          descTa: 'மக்களைக் கவரும் வகையில் நவீன தொழில்நுட்பங்கள் மற்றும் சமூக ஊடகப் பிரச்சாரங்கள் திட்டமிடப்படுகின்றன.',
          descEn: 'High-tech campaigns and localized social media outreach are being developed.'
        },
        {
          titleTa: 'முக்கிய தொகுதிகள்',
          titleEn: 'Key Constituencies',
          descTa: 'கடுமையான போட்டி நிலவ வாய்ப்புள்ள நட்சத்திரத் தொகுதிகளில் வேட்பாளர் தேர்வு தீவிரம் அடைந்துள்ளது.',
          descEn: 'Selection of candidates is being finalized for high-stakes star constituencies.'
        },
        {
          titleTa: 'மக்கள் கருத்துக்கள்',
          titleEn: 'Public Feedback',
          descTa: 'அரசின் திட்டங்கள் மற்றும் எதிர்க்கட்சிகளின் அறிவிப்புகள் குறித்து மக்கள் தங்களின் கருத்துக்களைப் பகிர்ந்து வருகின்றனர்.',
          descEn: 'Voters are sharing mixed reactions about recent welfare schemes and opposition promises.'
        },
        {
          titleTa: 'தேர்தல் களம்',
          titleEn: 'Upcoming Polls',
          descTa: 'வரவிருக்கும் தேர்தலை எதிர்கொள்ள அனைத்து அரசியல் கட்சிகளும் முழு வீச்சில் தயாராகி வருகின்றன.',
          descEn: 'All major parties are fully geared up as the state inches closer to the polling season.'
        }
      ]
    },
    {
      id: 4,
      cat: 'tech',
      badge: 'HOT',
      titleTa: 'சாட்ஜிபிடி 5.6 புதிய வசதிகள் என்னென்ன?',
      titleEn: 'ChatGPT 5.6 what are the new features?',
      views: '32.5K',
      gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
      slides: [
        {
          titleTa: 'மனித உணர்வுகள்',
          titleEn: 'Humanlike Reasonings',
          descTa: 'புதிய சாட்ஜிபிடி 5.6 மாடல் மனித உரையாடல்களைப் புரிந்து கொண்டு உணர்வுபூர்வமாக பதிலளிக்கும்.',
          descEn: 'The new model demonstrates advanced emotional intelligence and contextual understanding.'
        },
        {
          titleTa: 'உடனடி குரல் பதில்',
          titleEn: 'Zero Latency Audio',
          descTa: 'குரல் வழியான தொடர்புகளுக்கு எந்தவித தாமதமுமின்றி உடனுக்குடன் மிக வேகமாகப் பதிலளிக்கும் வசதி.',
          descEn: 'Users can have dynamic voice conversations with virtually zero lag or delay.'
        },
        {
          titleTa: 'பார்வைத் திறன் மேம்பாடு',
          titleEn: 'Vision Updates',
          descTa: 'புகைப்படங்கள் மற்றும் வீடியோக்களை மிகவும் துல்லியமாக ஆய்வு செய்து விவரிக்கும் திறன் கொண்டது.',
          descEn: 'Computer vision capabilities are upgraded to detect and explain complex video layers.'
        },
        {
          titleTa: 'குறியீட்டு உதவி',
          titleEn: 'Code Assistance',
          descTa: 'மென்பொருள் உருவாக்குபவர்களுக்கு பிழைகளைக் கண்டறிந்து எளிதாகக் குறியீடு எழுத உதவுகிறது.',
          descEn: 'Developers will get enhanced code logic generations and automated debug solutions.'
        },
        {
          titleTa: 'வெளியீட்டுத் தகவல்',
          titleEn: 'Launch Availability',
          descTa: 'பயனர்கள் பயன்பாட்டிற்காக இந்த புதிய அப்டேட் இந்த வார இறுதியில் உலகளவில் வெளியிடப்படும்.',
          descEn: 'The fresh updates will roll out globally starting from this weekend for all premium subscribers.'
        }
      ]
    },
    {
      id: 5,
      cat: 'regional',
      badge: 'NEW',
      titleTa: 'சென்னை मेट्रो 2-ம் கட்ட வழித்தடம் எப்போது திறப்பு?',
      titleEn: 'Chennai Metro Phase 2 elevated stretch updates',
      views: '14.2K',
      gradient: 'linear-gradient(135deg, #795548, #9E9E9E)',
      slides: [
        {
          titleTa: 'வழித்தடப் பணிகள் நிறைவு',
          titleEn: 'Route Completion',
          descTa: 'சென்னை மெட்ரோ இரண்டாம் கட்டத்தின் முக்கிய மேம்பால வழித்தடப் பணிகள் வெற்றிகரமாக நிறைவடைந்துள்ளன.',
          descEn: 'Major elevated infrastructure works under Phase 2 of Chennai Metro have been completed.'
        },
        {
          titleTa: 'பாதுகாப்பு சோதனைகள்',
          titleEn: 'Security Checks',
          descTa: 'மெட்ரோ ரயில்வே பாதுகாப்பு ஆணையர் தலைமையிலான குழுவினர் தீவிர பாதுகாப்பு தணிக்கை மேற்கொண்டனர்.',
          descEn: 'CMRS commissioner and inspectoral teams performed strict security runs on track tracks.'
        },
        {
          titleTa: 'மேம்பால வழித்தடம்',
          titleEn: 'Elevated Stretch',
          descTa: 'பூந்தமல்லி முதல் வடபழனி வரையிலான தூரத்தை மக்கள் விரைவாகக் கடக்க இந்த வழித்தடம் உதவும்.',
          descEn: 'The Poonamallee to Vadapalani stretch will offer high-speed transit for commuters.'
        },
        {
          titleTa: 'பயண நேரக் குறைவு',
          titleEn: 'Travel Time Drop',
          descTa: 'இந்த புதிய வழித்தடம் பயன்பாட்டிற்கு வருவதால் சாலை வழிப் போக்குவரத்து நெரிசல் பெருமளவில் குறையும்.',
          descEn: 'Travel duration along the busy arterial roads is expected to reduce by nearly 40 minutes.'
        },
        {
          titleTa: 'மக்கள் வரவேற்பு',
          titleEn: 'Public Benefit',
          descTa: 'உள்ளூர் வாசிகள் மற்றும் அலுவலகம் செல்வோர் இந்த வழித்தடத்தின் திறப்பு விழாவை ஆவலோடு எதிர்பார்க்கின்றனர்.',
          descEn: 'Daily commuters are eagerly waiting for the official inauguration date.'
        }
      ]
    },
    {
      id: 6,
      cat: 'business',
      badge: 'HOT',
      titleTa: 'தங்கத்தின் விலை சரிவு: காரணங்கள் என்ன?',
      titleEn: 'Gold rates decrease: What are the reasons?',
      views: '18.7K',
      gradient: 'linear-gradient(135deg, #607D8B, #B0BEC5)',
      slides: [
        {
          titleTa: 'விலைச் சரிவு சாதனை',
          titleEn: 'Price Drop Record',
          descTa: 'கடந்த சில நாட்களாக தங்கத்தின் விலை தொடர்ந்து சரிந்து வருவது நுகர்வோரை மகிழ்ச்சியில் ஆழ்த்தியுள்ளது.',
          descEn: 'Gold prices continue to correct downwards, giving much-needed relief to domestic buyers.'
        },
        {
          titleTa: 'சர்வதேச சந்தை வீழ்ச்சி',
          titleEn: 'Global Markets Correct',
          descTa: 'அமெரிக்க டாலரின் மதிப்பு உயர்வு மற்றும் உலகளாவிய வட்டி விகித மாற்றங்கள் இந்த சரிவுக்கு முக்கிய காரணமாகும்.',
          descEn: 'A strengthening US Dollar index and treasury yields have triggered a global selloff in bullion.'
        },
        {
          titleTa: 'உள்ளூர் விலை நிலவரம்',
          titleEn: 'Local Bullion Rates',
          descTa: 'சென்னை மற்றும் பிற முக்கிய நகரங்களில் சவரனுக்கு ரூ.500 வரை விலை குறைந்து விற்பனையாகிறது.',
          descEn: 'Retail markets in Chennai saw jewelry rates falling by Rs.500 per sovereign.'
        },
        {
          titleTa: 'திருமண காலத் தேவை',
          titleEn: 'Wedding Season Demand',
          descTa: 'விலைக் குறைவு காரணமாக நகைக் கடைகளில் வாடிக்கையாளர்களின் வருகை கணிசமாக அதிகரித்துள்ளது.',
          descEn: 'Jewelry outlets are reporting high footfall due to wedding purchases.'
        },
        {
          titleTa: 'முதலீட்டு வாய்ப்புகள்',
          titleEn: 'Investment Outlook',
          descTa: 'தங்கத்தில் நீண்ட கால அடிப்படையில் முதலீடு செய்ய விரும்புபவர்களுக்கு இது ஒரு நல்ல வாய்ப்பாகும்.',
          descEn: 'Financial experts suggest this correction offers a healthy window for long-term gold ETFs.'
        }
      ]
    },
    {
      id: 7,
      cat: 'international',
      badge: 'NEW',
      titleTa: 'இஸ்ரோ ககன்யான் சால்வ் மோட்டார் சோதனை வெற்றி',
      titleEn: 'ISRO Gaganyaan SOLVE ground test success',
      views: '22.3K',
      gradient: 'linear-gradient(135deg, #9C27B0, #E040FB)',
      slides: [
        {
          titleTa: 'மோட்டார் தரை சோதனை வெற்றி',
          titleEn: 'Motor Ground Test',
          descTa: 'இஸ்ரோ ககன்யான் விண்கலத்திற்கான அதிநவீன மோட்டார் சோதனையை வெற்றிகரமாக முடித்துள்ளது.',
          descEn: 'ISRO successfully conducted static firing of the crew module recovery decelerator motors.'
        },
        {
          titleTa: 'மீட்பு அமைப்புகள்',
          titleEn: 'Deceleration Systems',
          descTa: 'விண்வெளி வீரர்கள் பூமிக்குத் திரும்பும்போது விண்கலத்தின் வேகத்தைக் குறைக்க இந்த மோட்டார்கள் உதவும்.',
          descEn: 'These thrusters are designed to safely decelerate the capsule during atmospheric re-entry.'
        },
        {
          titleTa: 'ஸ்ரீஹரிகோட்டா தளம்',
          titleEn: 'Sriharikota Launchpad',
          descTa: 'ஆந்திர மாநிலம் ஸ்ரீஹரிகோட்டாவில் உள்ள ஏவுதளத்தில் இந்த அதிநவீன சோதனை நடத்தப்பட்டது.',
          descEn: 'The critical ground testing was executed at Satish Dhawan Space Centre launch complex.'
        },
        {
          titleTa: 'விண்வெளி பாதுகாப்பு',
          titleEn: 'Crew Safety Measures',
          descTa: 'விண்வெளி வீரர்களின் பாதுகாப்பை 100% உறுதி செய்ய பல்வேறு கட்ட சோதனைகளை இஸ்ரோ மேற்கொள்கிறது.',
          descEn: 'Rigorous safety parameters are being validated to protect crew members under all emergency phases.'
        },
        {
          titleTa: 'எதிர்கால விண்கலப் பயணம்',
          titleEn: 'Future Space Flights',
          descTa: 'இந்த வெற்றி, மனிதர்களை விண்வெளிக்கு அனுப்பும் இந்தியாவின் ககன்யான் திட்டத்திற்கு முக்கிய மைல்கல்லாகும்.',
          descEn: 'This milestone accelerates India\'s timelines for its maiden manned spaceflight program.'
        }
      ]
    },
    {
      id: 8,
      cat: 'sports',
      badge: 'HOT',
      titleTa: 'ஜிம்பாப்வே தொடருக்கான இந்திய டி20 அணி விவரம்',
      titleEn: 'India T20 Squad updates for Zimbabwe tour',
      views: '21.5K',
      gradient: 'linear-gradient(135deg, #FF9800, #FFC107)',
      slides: [
        {
          titleTa: 'இளம் வீரர்கள் தேர்வு',
          titleEn: 'Young Squad Named',
          descTa: 'ஜிம்பாப்வே அணிக்கு எதிரான கிரிக்கெட் தொடரில் விளையாட இளம் வீரர்கள் பலருக்கு வாய்ப்பளிக்கப்பட்டுள்ளது.',
          descEn: 'BCCI selectors have announced a fresh squad full of domestic IPL performers.'
        },
        {
          titleTa: 'ஸ்ரேயாஸ் ஐயர் தலைமை',
          titleEn: 'Captain Shreyas Iyer',
          descTa: 'அனுபவம் வாய்ந்த பேட்ஸ்மேன் ஸ்ரேயாஸ் ஐயர் இந்த தொடரில் இந்திய அணியை வழிநடத்துவார்.',
          descEn: 'Senior batsman Shreyas Iyer has been chosen to captain the touring Indian side.'
        },
        {
          titleTa: 'தீவிரப் பயிற்சி',
          titleEn: 'Practice Sessions',
          descTa: 'வீரர்கள் தொடருக்கு தயாராகும் வகையில் பெங்களூர் தேசிய அகாடமியில் தீவிரப் பயிற்சி மேற்கொண்டு வருகின்றனர்.',
          descEn: 'Players are currently undergoing intensive training modules at the NCA in Bengaluru.'
        },
        {
          titleTa: 'கவனிக்க வேண்டிய வீரர்கள்',
          titleEn: 'Key Players to Watch',
          descTa: 'அதிவேக பந்துவீச்சாளர்கள் மற்றும் அதிரடி ஆல்ரவுண்டர்களின் ஆட்டத்தை பார்க்க ரசிகர்கள் ஆவலோடு உள்ளனர்.',
          descEn: 'Rookie speedsters and aggressive all-rounders are expected to make their debut.'
        },
        {
          titleTa: 'போட்டி அட்டவணை',
          titleEn: 'Series Schedule',
          descTa: 'இந்தியா-ஜிம்பாப்வே இடையேயான 5 போட்டிகள் கொண்ட டி20 தொடர் அடுத்த வாரம் முதல் தொடங்குகிறது.',
          descEn: 'The 5-match bilateral series begins next week in Harare.'
        }
      ]
    },
    {
      id: 9,
      cat: 'cinema',
      badge: 'NEW',
      titleTa: 'விடுதலை 2-ம் பாகம் வெளியீட்டுத் தகவல்கள்',
      titleEn: 'Viduthalai Part 2 theatrical release updates',
      views: '24.9K',
      gradient: 'linear-gradient(135deg, #E91E63, #FF4081)',
      slides: [
        {
          titleTa: 'வெற்றிமாறன் இயக்கம்',
          titleEn: 'Vetrimaaran Directorial',
          descTa: 'யதார்த்தமான மற்றும் ஆழமான திரைப்படங்களை இயக்கும் வெற்றிமாறன் இந்த படத்தை இயக்கியுள்ளார்.',
          descEn: 'Acclaimed filmmaker Vetrimaaran directs the highly anticipated sequel to Viduthalai.'
        },
        {
          titleTa: 'சேதுபதி - சூரி நடிப்பு',
          titleEn: 'Star Cast Performances',
          descTa: 'விஜய் சேதுபதி மற்றும் சூரி ஆகியோரின் நடிப்பு இந்த பாகத்தில் மிகவும் பேசப்படும் வகையில் இருக்கும்.',
          descEn: 'Vijay Sethupathy and Soori deliver top-tier intense performances in lead roles.'
        },
        {
          titleTa: 'யதார்த்தமான அதிரடிக் கதைக் களம்',
          titleEn: 'Raw Action Drama',
          descTa: 'மலைவாழ் மக்களின் வாழ்வியல் மற்றும் அதிகார வர்க்கத்தின் பின்னணியில் கதைக்களம் அமைக்கப்பட்டுள்ளது.',
          descEn: 'The sequel digs deeper into forest tribal conflicts, power struggles, and systemic politics.'
        },
        {
          titleTa: 'இசை மற்றும் ஒலிப்பதிவு',
          titleEn: 'Background Score',
          descTa: 'இளையராஜாவின் ஆன்மார்த்தமான இசை மற்றும் பின்னணி இசை படத்தின் உணர்வை மேம்படுத்துகிறது.',
          descEn: 'Isaignani Ilaiyaraaja\'s soulful background tracks capture the raw emotions of the screen.'
        },
        {
          titleTa: 'உலகளாவிய ரிலீஸ்',
          titleEn: 'Massive Screen Counts',
          descTa: 'விடுதலை இரண்டாம் பாகம் உலகம் முழுவதும் மிகப்பெரிய அளவில் வெளியிடப்பட உள்ளது.',
          descEn: 'The movie is set to debut across maximum screens in multiple regional languages.'
        }
      ]
    },
    {
      id: 10,
      cat: 'business',
      badge: 'NEW',
      titleTa: 'இந்தியா-இங்கிலாந்து வர்த்தக ஒப்பந்தம் ஜூலை 15 முதல் அமல்',
      titleEn: 'India-UK CETA trade pact starting July 15',
      views: '11.8K',
      gradient: 'linear-gradient(135deg, #009688, #4DB6AC)',
      slides: [
        {
          titleTa: 'விரிவான வர்த்தக ஒப்பந்தம்',
          titleEn: 'Comprehensive Trade Deal',
          descTa: 'இருநாடுகளுக்கும் இடையே பல கட்ட பேச்சுவார்த்தைகளுக்கு பின் இந்த ஒப்பந்தம் இறுதி செய்யப்பட்டுள்ளது.',
          descEn: 'After multiple rounds of negotiations, the landmark bilateral deal has been finalized.'
        },
        {
          titleTa: 'ஏற்றுமதி வரிக்குறைப்பு',
          titleEn: 'Export Tariff Cuts',
          descTa: 'இந்தியாவில் இருந்து ஏற்றுமதி செய்யப்படும் ஜவுளி, தோல் பொருட்களுக்கான வரிகள் குறைக்கப்படும்.',
          descEn: 'Indian exporters of textiles and leather goods will get duty-free access to UK markets.'
        },
        {
          titleTa: 'ஐடி - பார்மா துறை வளர்ச்சி',
          titleEn: 'IT and Pharma Boost',
          descTa: 'இந்திய தகவல் தொழில்நுட்ப நிபுணர்கள் மற்றும் மருந்து நிறுவனங்களுக்கு இங்கிலாந்தில் புதிய வாய்ப்புகள் கிட்டும்.',
          descEn: 'Technologists and pharmaceutical entities will benefit from simplified regulatory approvals.'
        },
        {
          titleTa: 'ஜூலை 15 முதல் அமல்',
          titleEn: 'Start Date July 15',
          descTa: 'வரலாற்று சிறப்புமிக்க இந்த ஒப்பந்தம் வரும் ஜூலை 15 முதல் அதிகாரப்பூர்வமாக நடைமுறைக்கு வருகிறது.',
          descEn: 'Both governments confirmed that the free trade parameters roll out on July 15.'
        },
        {
          titleTa: 'பொருளாதாரக் கூட்டாண்மை',
          titleEn: 'Strategic Partner Benefits',
          descTa: 'இந்த ஒப்பந்தம் இரு நாடுகளுக்கு இடையேயான வர்த்தகம் மற்றும் முதலீட்டை புதிய உச்சத்திற்கு கொண்டு செல்லும்.',
          descEn: 'The economic pact is designed to double bilateral trade values by the end of 2030.'
        }
      ]
    },
    {
      id: 11,
      cat: 'politics',
      badge: 'HOT',
      titleTa: 'வாக்கு எண்ணிக்கை நேரடி நிலவரம்',
      titleEn: 'Assembly election counting live updates',
      views: '38.4K',
      gradient: 'linear-gradient(135deg, #3F51B5, #2196F3)',
      slides: [
        {
          titleTa: 'வாக்கு எண்ணும் மையங்கள்',
          titleEn: 'Counting Centres',
          descTa: 'தேர்தல் ஆணையம் வாக்கு எண்ணும் மையங்களில் அனைத்து ஏற்பாடுகளையும் தயார் நிலையில் வைத்துள்ளது.',
          descEn: 'EC has set up state-of-the-art infrastructure across all counting zones.'
        },
        {
          titleTa: 'பலத்த பாதுகாப்பு',
          titleEn: 'Tight Security',
          descTa: 'மத்திய பாதுகாப்புப் படைகள் மற்றும் காவல்துறையினர் மையங்களைச் சுற்றி தீவிரப் பாதுகாப்புப் பணியில் ஈடுபட்டுள்ளனர்.',
          descEn: 'Three-tier security cordons and police forces are stationed near strongrooms.'
        },
        {
          titleTa: 'ஆரம்பக்கட்ட முன்னிலை',
          titleEn: 'Early Leads',
          descTa: 'முதல் ஒரு மணி நேர தபால் வாக்குகள் எண்ணிக்கையில் முன்னணி வேட்பாளர்கள் விபரம் தெரியவரும்.',
          descEn: 'Post-ballot paper counting trends will define the early leads.'
        },
        {
          titleTa: 'முக்கிய வேட்பாளர்கள்',
          titleEn: 'Key Competitors',
          descTa: 'முன்னணி அரசியல் தலைவர்கள் போட்டியிடும் நட்சத்திரத் தொகுதிகள் மீது மக்களின் கவனம் திரும்பியுள்ளது.',
          descEn: 'High-profile leaders are closely monitoring vote counts in their home districts.'
        },
        {
          titleTa: 'இறுதி முடிவுகள்',
          titleEn: 'Final Projections',
          descTa: 'மாலையில் புதிய அரசு அமைக்கப்போவது யார் என்பது குறித்தான தெளிவான படம் தெரியவரும்.',
          descEn: 'Clear mandate trends defining the next government will materialize by late evening.'
        }
      ]
    },
    {
      id: 12,
      cat: 'tech',
      badge: 'NEW',
      titleTa: 'ஆப்பிள் ஐபோன் 17 புதிய மெலிதான வடிவமைப்பு கசிவு',
      titleEn: 'Apple iPhone 17 series slim redesign leaks',
      views: '29.7K',
      gradient: 'linear-gradient(135deg, #673AB7, #9575CD)',
      slides: [
        {
          titleTa: 'மெலிதான வடிவமைப்பு',
          titleEn: 'Slim Redesign Leaks',
          descTa: 'ஆப்பிள் நிறுவனம் தனது அடுத்த அப்டேட்டான ஐபோன் 17 இல் மிகவும் மெலிதான வடிவமைப்பை அறிமுகம் செய்ய உள்ளது.',
          descEn: 'Apple iPhone 17 models are rumored to sport an ultra-thin metal chassis frame.'
        },
        {
          titleTa: 'மேம்பட்ட திரைத் தொழில்நுட்பம்',
          titleEn: 'Dynamic OLED Display',
          descTa: 'புதிய திரையின் மூலம் பேட்டரி நுகர்வு குறைக்கப்பட்டு கூடுதல் பிரகாசம் பெற முடியும்.',
          descEn: 'The screen integration will feature advanced low-temperature OLED efficiency controllers.'
        },
        {
          titleTa: 'கூடுதல் மின்கல ஆயுள்',
          titleEn: 'Battery Advancements',
          descTa: 'வடிவமைப்பு மெலிதாக இருந்தாலும், புதிய தொழில்நுட்ப பேட்டரிகள் கூடுதல் பேக்கப் தரும்.',
          descEn: 'Despite the slim form factor, newly stacked battery structures guarantee prolonged back-up.'
        },
        {
          titleTa: 'கேமரா சிறப்பம்சங்கள்',
          titleEn: 'Optical Camera Upgrades',
          descTa: 'அதிநவீன ஆப்டிகல் ஜூம் மற்றும் குறைந்த வெளிச்சத்தில் படம் பிடிக்கும் சென்சார்கள் இதிலிருக்கும்.',
          descEn: 'Triple camera rings will get upgraded image stabilization and enhanced aperture speeds.'
        },
        {
          titleTa: 'வெளியீட்டு விலை மதிப்பு',
          titleEn: 'Price Predictions',
          descTa: 'புதிய தொழில்நுட்ப மேம்பாடுகள் காரணமாக இதன் விலை முந்தைய மாடலை விட சற்று அதிகமாக இருக்கலாம்.',
          descEn: 'Tech tipsters project the dynamic iPhone Slim model will command a high premium cost.'
        }
      ]
    }
  ];

  const getCategoryDetails = (catSlug) => {
    const categories = {
      politics: { en: 'Politics', ta: 'அரசியல்', color: '#1E3A8A' },
      business: { en: 'Business', ta: 'வணிகம்', color: '#065F46' },
      sports: { en: 'Sports', ta: 'விளையாட்டு', color: '#C2410C' },
      cinema: { en: 'Cinema', ta: 'திரைப்படம்', color: '#BE185D' },
      tech: { en: 'Technology', ta: 'தொழில்நுட்பம்', color: '#6D28D9' },
      regional: { en: 'Regional', ta: 'மாநிலம்', color: '#4B5563' },
      international: { en: 'International', ta: 'சர்வதேசம்', color: '#0D9488' }
    };
    return categories[catSlug] || { en: catSlug, ta: catSlug, color: '#3B82F6' };
  };

  const filteredStories = activeTab === 'all'
    ? stories
    : stories.filter(story => story.cat === activeTab);

  // Handle open viewer
  const handleOpenViewer = (story, listIndex) => {
    setSelectedStory(story);
    setActiveStoryIndex(listIndex);
    setActiveSlideIndex(0);
    setProgress(0);
  };

  // Handle close viewer
  const handleCloseViewer = () => {
    setSelectedStory(null);
    setProgress(0);
  };

  // Navigate viewer between stories
  const handleNextStory = () => {
    if (activeStoryIndex < filteredStories.length - 1) {
      const nextIdx = activeStoryIndex + 1;
      setActiveStoryIndex(nextIdx);
      setSelectedStory(filteredStories[nextIdx]);
      setActiveSlideIndex(0);
      setProgress(0);
    } else {
      handleCloseViewer();
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      const prevIdx = activeStoryIndex - 1;
      setActiveStoryIndex(prevIdx);
      setSelectedStory(filteredStories[prevIdx]);
      // Set to the last slide of the previous story
      const prevStory = filteredStories[prevIdx];
      setActiveSlideIndex(prevStory.slides.length - 1);
      setProgress(0);
    }
  };

  // Slide navigation inside the current story
  const handleNextSlide = () => {
    if (selectedStory && activeSlideIndex < selectedStory.slides.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Last slide completed, move to next story
      handleNextStory();
    }
  };

  const handlePrevSlide = () => {
    if (selectedStory && activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
      setProgress(0);
    } else {
      // First slide, go to the previous story
      handlePrevStory();
    }
  };

  // Autoplay / Progress bar timer
  useEffect(() => {
    if (!selectedStory) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + 2; // Increments to hit 100% in 5 seconds
      });
    }, 100);

    return () => clearInterval(interval);
  }, [selectedStory, activeStoryIndex, activeSlideIndex, filteredStories]);

  return (
    <div className="web-stories-page">
      <div className="container">
        {/* Page Header */}
        <div className="stories-header">
          <div className="breadcrumbs">
            <Link to="/">{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '10px', margin: '0 8px' }}></i>
            <span>{lang === 'en' ? 'Web Stories' : 'வெப் ஸ்டோரிஸ்'}</span>
          </div>

          <h1>
            <i className="fas fa-bolt text-primary-gold"></i>
            {lang === 'en' ? ' Web Stories' : ' வெப் ஸ்டோரிஸ்'}
          </h1>
          <p className="subtitle">
            {lang === 'en'
              ? 'Swipe through short, visual news snapshots and quick updates.'
              : 'குறுகிய, காட்சிப் செய்திப் பதிவுகள் மற்றும் விரைவான தகவல்களை உடனுக்குடன் பாருங்கள்.'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="stories-tabs-container">
          <div className="stories-tabs">
            {['all', 'politics', 'business', 'sports', 'cinema', 'tech', 'regional', 'international'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' && (lang === 'en' ? 'All Stories' : 'அனைத்தும்')}
                {tab === 'politics' && (lang === 'en' ? 'Politics' : 'அரசியல்')}
                {tab === 'business' && (lang === 'en' ? 'Business' : 'வணிகம்')}
                {tab === 'sports' && (lang === 'en' ? 'Sports' : 'விளையாட்டு')}
                {tab === 'cinema' && (lang === 'en' ? 'Cinema' : 'திரைப்படம்')}
                {tab === 'tech' && (lang === 'en' ? 'Technology' : 'தொழில்நுட்பம்')}
                {tab === 'regional' && (lang === 'en' ? 'Regional' : 'மாநிலம்')}
                {tab === 'international' && (lang === 'en' ? 'International' : 'சர்வதேசம்')}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="stories-grid">
            {filteredStories.map((story, index) => {
              const catDetails = getCategoryDetails(story.cat);
              return (
                <div
                  key={story.id}
                  className="story-card-item"
                  style={{ background: story.gradient }}
                  onClick={() => handleOpenViewer(story, index)}
                >
                  <span className="badge-tag" style={{ background: story.badge === 'NEW' ? '#EF4444' : '#F97316' }}>
                    {story.badge}
                  </span>
                  <div className="story-card-overlay">
                    <span className="story-cat-badge" style={{ background: catDetails.color }}>
                      {lang === 'en' ? catDetails.en : catDetails.ta}
                    </span>
                    <h3>{lang === 'en' ? story.titleEn : story.titleTa}</h3>
                    <span className="story-views-badge"><i className="far fa-eye"></i> {story.views}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-stories">
            <i className="far fa-sticky-note fa-3x"></i>
            <p>{lang === 'en' ? 'No web stories found in this category.' : 'இவ்வகையில் வெப் ஸ்டோரிஸ் ஏதும் இல்லை.'}</p>
          </div>
        )}
      </div>

      {/* Fullscreen Story Viewer Modal */}
      {selectedStory && (
        <div className="story-viewer-modal">
          <div className="story-viewer-backdrop" onClick={handleCloseViewer}></div>
          
          {/* Main Story Card container */}
          <div className="story-viewer-card" style={{ background: selectedStory.gradient }}>
            {/* Top Progress bar representing slides in the selected story */}
            <div className="story-viewer-header">
              <div className="progress-bars-container">
                {selectedStory.slides.map((s, idx) => {
                  let widthPercent = 0;
                  if (idx < activeSlideIndex) widthPercent = 100;
                  else if (idx === activeSlideIndex) widthPercent = progress;
                  return (
                    <div className="progress-bar-bg" key={idx}>
                      <div className="progress-bar-fill" style={{ width: `${widthPercent}%` }}></div>
                    </div>
                  );
                })}
              </div>

              <div className="header-meta">
                <span className="category-pill" style={{ background: getCategoryDetails(selectedStory.cat).color }}>
                  {lang === 'en' ? getCategoryDetails(selectedStory.cat).en : getCategoryDetails(selectedStory.cat).ta}
                </span>
                <span className="views-pill"><i className="far fa-eye"></i> {selectedStory.views}</span>
                <button className="close-viewer-btn" onClick={handleCloseViewer} aria-label="Close stories">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Tap areas for next/prev navigation inside the slide deck */}
            <div className="story-tap-areas">
              <div className="tap-left" onClick={handlePrevSlide}></div>
              <div className="tap-right" onClick={handleNextSlide}></div>
            </div>

            {/* Story Text Content (Dynamic based on active slide) */}
            <div className="story-viewer-content">
              <h2>{lang === 'en' ? selectedStory.slides[activeSlideIndex].titleEn : selectedStory.slides[activeSlideIndex].titleTa}</h2>
              <p>{lang === 'en' ? selectedStory.slides[activeSlideIndex].descEn : selectedStory.slides[activeSlideIndex].descTa}</p>
            </div>

            {/* Bottom Navigation Indicators */}
            <div className="story-viewer-footer">
              <button 
                className="nav-btn prev" 
                onClick={handlePrevSlide} 
                disabled={activeStoryIndex === 0 && activeSlideIndex === 0}
                style={{ opacity: (activeStoryIndex === 0 && activeSlideIndex === 0) ? 0.3 : 1 }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="slide-indicator">
                {activeSlideIndex + 1} / {selectedStory.slides.length}
              </span>
              <button className="nav-btn next" onClick={handleNextSlide}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebStories;
