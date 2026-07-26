-- ==========================================
-- KINGS TV & NEWS PORTAL (KING 24x7)
-- MySQL Database Re-initialization & Seed Script
-- Aligning JPA Entities with Database Schema
-- ==========================================

DROP DATABASE IF EXISTS kings_tv_db;
CREATE DATABASE kings_tv_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kings_tv_db;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE `users` (
    `user_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NULL,
    `role` VARCHAR(50) DEFAULT 'user',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `districts`
-- -----------------------------------------------------
CREATE TABLE `districts` (
    `district_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name_ta` VARCHAR(50) NOT NULL UNIQUE,
    `name_en` VARCHAR(50) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `categories`
-- -----------------------------------------------------
CREATE TABLE `categories` (
    `category_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `name_ta` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `user_preferences`
-- -----------------------------------------------------
CREATE TABLE `user_preferences` (
    `preference_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `theme` VARCHAR(10) DEFAULT 'light',
    `primary_color` VARCHAR(7) DEFAULT '#0057FF',
    `font_size` VARCHAR(15) DEFAULT 'medium',
    `widget_width` INT DEFAULT 640,
    `slide_speed` INT DEFAULT 8,
    `language` VARCHAR(2) DEFAULT 'ta',
    `default_district_id` BIGINT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`default_district_id`) REFERENCES `districts` (`district_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `user_section_visibility`
-- -----------------------------------------------------
CREATE TABLE `user_section_visibility` (
    `user_id` BIGINT NOT NULL,
    `section_id` VARCHAR(50) NOT NULL,
    `is_visible` BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (`user_id`, `section_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `articles`
-- -----------------------------------------------------
CREATE TABLE `articles` (
    `article_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title_ta` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NULL,
    `short_desc_ta` TEXT NULL,
    `short_desc_en` TEXT NULL,
    `content_ta` LONGTEXT NOT NULL,
    `content_en` LONGTEXT NULL,
    `image_url` VARCHAR(255) NULL,
    `category_id` BIGINT NOT NULL,
    `district_id` BIGINT NULL,
    `views_count` INT DEFAULT 0,
    `status` VARCHAR(20) DEFAULT 'published',
    `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `video_contents`
-- -----------------------------------------------------
CREATE TABLE `video_contents` (
    `video_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `youtube_url` VARCHAR(255) NOT NULL,
    `thumbnail_url` VARCHAR(255) NULL,
    `duration_seconds` INT NOT NULL DEFAULT 0,
    `category_id` BIGINT NOT NULL,
    `is_live_tv` INT DEFAULT 0,
    `views_count` INT DEFAULT 0,
    `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `web_stories`
-- -----------------------------------------------------
CREATE TABLE `web_stories` (
    `story_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category_id` BIGINT NOT NULL,
    `badge` VARCHAR(20) DEFAULT 'NEW',
    `background_gradient` VARCHAR(100) DEFAULT 'linear-gradient(135deg, #1E40AF, #3B82F6)',
    `views_count` INT DEFAULT 0,
    `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `breaking_news`
-- -----------------------------------------------------
CREATE TABLE `breaking_news` (
    `breaking_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `link_url` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `expires_at` TIMESTAMP NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `comments`
-- -----------------------------------------------------
CREATE TABLE `comments` (
    `comment_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `article_id` BIGINT NOT NULL,
    `user_id` BIGINT NULL,
    `commentor_name` VARCHAR(100) NOT NULL,
    `commentor_email` VARCHAR(100) NOT NULL,
    `comment_text` TEXT NOT NULL,
    `status` VARCHAR(20) DEFAULT 'approved',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `newsletter_subscribers`
-- -----------------------------------------------------
CREATE TABLE `newsletter_subscribers` (
    `subscriber_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `local_business_directory`
-- -----------------------------------------------------
CREATE TABLE `local_business_directory` (
    `listing_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `business_name` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `address_locality` VARCHAR(100) NOT NULL,
    `address_street` VARCHAR(255) NOT NULL,
    `working_hours` VARCHAR(100) NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `rating` DECIMAL(2,1) DEFAULT 5.0,
    `created_by` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `classified_listings`
-- -----------------------------------------------------
CREATE TABLE `classified_listings` (
    `classified_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `price_detail` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `contact_info` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `created_by` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `local_wishes`
-- -----------------------------------------------------
CREATE TABLE `local_wishes` (
    `wish_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `recipient_name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `message` TEXT NOT NULL,
    `sender_name` VARCHAR(100) NOT NULL,
    `created_by` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `local_obituaries`
-- -----------------------------------------------------
CREATE TABLE `local_obituaries` (
    `obit_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `deceased_name` VARCHAR(100) NOT NULL,
    `age` INT NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `demise_date` DATE NOT NULL,
    `funeral_details` VARCHAR(255) NOT NULL,
    `short_description` TEXT NOT NULL,
    `tribute_count` INT DEFAULT 0,
    `created_by` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `jobs_board`
-- -----------------------------------------------------
CREATE TABLE `jobs_board` (
    `job_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `company_name` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `salary_range` VARCHAR(100) NOT NULL,
    `employment_type` VARCHAR(50) DEFAULT 'Full Time',
    `description` TEXT NOT NULL,
    `created_by` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `job_applications`
-- -----------------------------------------------------
CREATE TABLE `job_applications` (
    `application_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `job_id` BIGINT NOT NULL,
    `applicant_name` VARCHAR(100) NOT NULL,
    `applicant_phone` VARCHAR(20) NOT NULL,
    `experience` VARCHAR(20) NOT NULL,
    `summary` TEXT NULL,
    `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`job_id`) REFERENCES `jobs_board` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `success_stories`
-- -----------------------------------------------------
CREATE TABLE `success_stories` (
    `story_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `author_name` VARCHAR(100) NOT NULL,
    `business_name` VARCHAR(150) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `details` TEXT NOT NULL,
    `is_case_study` BOOLEAN DEFAULT FALSE,
    `pdf_url` VARCHAR(255) NULL,
    `created_by` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `pdf_contents`
-- -----------------------------------------------------
CREATE TABLE `pdf_contents` (
    `pdf_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `title_ta` VARCHAR(255) NOT NULL,
    `pdf_url` VARCHAR(255) NOT NULL,
    `file_size` VARCHAR(50) NULL,
    `publish_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `page_contents`
-- -----------------------------------------------------
CREATE TABLE `page_contents` (
    `page_key` VARCHAR(50) PRIMARY KEY,
    `title_ta` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NULL,
    `content_ta` TEXT NULL,
    `content_en` TEXT NULL,
    `contact_phone` VARCHAR(20) NULL,
    `contact_email` VARCHAR(100) NULL,
    `contact_address` TEXT NULL,
    `google_map_url` TEXT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =====================================================
-- SEED DATA INSERT STATEMENTS
-- =====================================================

-- Districts
INSERT INTO `districts` (`district_id`, `name_ta`, `name_en`) VALUES
(1, 'சென்னை', 'Chennai'),
(2, 'கோயம்புத்தூர்', 'Coimbatore'),
(3, 'மதுரை', 'Madurai'),
(4, 'திருச்சிராப்பள்ளி', 'Tiruchirappalli'),
(5, 'சேலம்', 'Salem'),
(6, 'ஈரோடு', 'Erode');

-- Users
INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`) VALUES
(1, 'admin', 'admin@king24x7.com', '$2a$10$wN9P31K9LpQxW3qY54b6TeW6b3aO.c/p8k349dld3hM46vD9rD2Gq', 'admin'),
(2, 'vendor', 'vendor@king24x7.com', '$2a$10$wN9P31K9LpQxW3qY54b6TeW6b3aO.c/p8k349dld3hM46vD9rD2Gq', 'vendor'),
(3, 'editor', 'editor@king24x7.com', '$2a$10$wN9P31K9LpQxW3qY54b6TeW6b3aO.c/p8k349dld3hM46vD9rD2Gq', 'editor'),
(4, 'reporter', 'reporter@king24x7.com', '$2a$10$wN9P31K9LpQxW3qY54b6TeW6b3aO.c/p8k349dld3hM46vD9rD2Gq', 'reporter'),
(5, 'user', 'user@king24x7.com', '$2a$10$wN9P31K9LpQxW3qY54b6TeW6b3aO.c/p8k349dld3hM46vD9rD2Gq', 'user');

-- Categories
INSERT INTO `categories` (`category_id`, `slug`, `name`, `name_ta`) VALUES
(1, 'politics', 'Politics', 'அரசியல்'),
(2, 'business', 'Business', 'வணிகம்'),
(3, 'sports', 'Sports', 'விளையாட்டு'),
(4, 'cinema', 'Cinema', 'பொழுதுபோக்கு'),
(5, 'tech', 'Tech', 'தொழில்நுட்பம்'),
(6, 'regional', 'Regional', 'மாநில செய்திகள்'),
(7, 'international', 'International', 'சர்வதேச செய்திகள்');

-- Articles
INSERT INTO `articles` (`article_id`, `title_ta`, `title_en`, `short_desc_ta`, `short_desc_en`, `content_ta`, `content_en`, `category_id`, `district_id`, `views_count`, `image_url`) VALUES
(1, 'தமிழக பட்ஜெட் 2026 முக்கிய அம்சங்கள் அறிவிப்பு', 'Tamil Nadu Budget 2026 Key Highlights Released', 'கல்வி, விவசாயம் மற்றும் சமூக நலத்திட்டங்களுக்கு கூடுதல் நிதி ஒதுக்கீடுகளை உள்ளடக்கிய பட்ஜெட் அறிக்கை வெளியிடப்பட்டது.', 'The budget report was released containing additional financial allocations for education, agriculture and social welfare schemes.', 'தமிழக சட்டமன்றத்தில் நிதியமைச்சர் 2026-27 ஆம் ஆண்டிற்கான பட்ஜெட்டைத் தாக்கல் செய்தார். இதில் கல்வித்துறைக்கு 45,000 கோடி ரூபாயும், விவசாய வளர்ச்சிக்கு 15,000 கோடி ரூபாயும் நிதி ஒதுக்கீடு செய்யப்பட்டுள்ளது. மகளிர் உரிமைத் தொகை திட்டம் தொடர்ந்து செயல்படுத்தப்படும் எனவும் உறுதியளிக்கப்பட்டுள்ளது.', 'The Finance Minister presented the budget for 2026-27 in the Tamil Nadu Legislative Assembly. It includes allocations of 45,000 crores for education and 15,000 crores for agricultural growth.', 1, 1, 350, 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&auto=format&fit=crop&q=60'),
(2, 'தேசிய தேர்தல் களம்: புது தில்லியில் அனைத்துக்கட்சி கூட்டம் இன்று', 'National elections: all-party meet in New Delhi today', 'எதிர்வரும் பாராளுமன்ற கூட்டத்தொடரை சுமுகமாக நடத்துவது குறித்து முக்கிய விவாதங்கள் நடைபெறுகின்றன.', 'Key discussions are held on conducting the upcoming parliamentary session smoothly.', 'புது தில்லியில் இன்று அனைத்துக்கட்சித் தலைவர்கள் பங்கேற்கும் ஆலோசனைக் கூட்டம் நடைபெறுகிறது. நாடாளுமன்ற மழைக்கால கூட்டத்தொடரை சுமுகமாக நடத்துவதற்கும், முக்கிய மசோதாக்களை நிறைவேற்றுவதற்கும் ஒத்துழைப்பு தருமாறு அரசுத் தரப்பில் கோரப்படவுள்ளது.', 'An all-party advisory meeting is being held today in New Delhi. Government asks for support to pass key bills.', 1, NULL, 120, 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&auto=format&fit=crop&q=60'),
(3, 'சென்னையில் தங்கம் விலை இன்று அதிரடி வீழ்ச்சி', 'Gold Price Falls Sharply in Chennai Today', 'ஒரு சவரன் தங்கம் விலையில் 450 ரூபாய் குறைந்து ஏழை எளிய மக்களுக்கு மகிழ்ச்சியை ஏற்படுத்தியுள்ளது.', 'Gold price drops by 450 rupees per sovereign bringing happiness to the common man.', 'சென்னையில் இன்று தங்கம் விலையில் பெரும் வீழ்ச்சி காணப்பட்டது. 22 கேரட் தங்கம் சவரனுக்கு 450 ரூபாய் சரிந்து, நடுத்தர மக்களின் வாங்கும் சக்தியை அதிகரித்துள்ளது. உலகளாவிய சந்தை மாற்றங்களே இதற்கு முக்கிய காரணம் என நகை வியாபாரிகள் சங்கத்தினர் தெரிவித்தனர்.', 'Gold price crashed in Chennai today, dropping by 450 rupees per sovereign for 22 carat gold.', 2, 1, 480, 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60'),
(4, 'விம்பிள்டன் 2026: இறுதிப்போட்டிக்கு தகுதி பெற்றார் இளம் வீரர்', 'Wimbledon 2026: Young Player Qualifies for Finals', 'மிகவும் விறுவிறுப்பான அரையிறுதி ஆட்டத்தில் வென்று தனது முதல் விம்பிள்டன் இறுதிப்போட்டி கனவை நனவாக்கினார்.', 'Won a thrilling semi-finals clash to secure dream Wimbledon finals berth.', 'லண்டனில் நடைபெற்று வரும் விம்பிள்டன் டென்னிஸ் தொடரில், நேற்று நடைபெற்ற அரையிறுதிப் போட்டியில் இந்தியாவின் இளம் நட்சத்திரம் அபார ஆட்டத்தை வெளிப்படுத்தி இறுதிப்போட்டிக்குத் தகுதி பெற்று சாதனை படைத்தார்.', 'In the Wimbledon tennis tournament, India\'s young star performed exceptionally to reach the finals.', 3, NULL, 90, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=60'),
(5, 'ஆஸ்கார் பந்தயத்தில் தமிழ் திரைப்படம்: அதிகாரப்பூர்வ அறிவிப்பு', 'Tamil Film in Oscar Race: Official Announcement', 'சுயாதீன திரைப்பட தயாரிப்பாளர்களின் சிறந்த படைப்பான இப்படம் ஆஸ்கார் சிறந்த சர்வதேச படப் பிரிவுக்கு பரிந்துரைக்கப்பட்டுள்ளது.', 'Acclaimed independent Tamil feature chosen as India\'s entry for the Best International Feature Category at Oscars.', 'இந்தியத் திரை உலகிற்கு பெருமை சேர்க்கும் வகையில், தமிழ் சினிமா தயாரிப்பாளர்களின் சிறந்த கலைப் படைப்பு ஒன்று ஆஸ்கார் விருதுக்கான இந்தியாவின் அதிகாரப்பூர்வ பரிந்துரையாகத் தேர்வு செய்யப்பட்டுள்ளது.', 'A major Tamil artistic cinema is selected as India\'s official submission for the prestigious Oscar awards.', 4, NULL, 600, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=60');

-- Video Contents
INSERT INTO `video_contents` (`video_id`, `title`, `description`, `youtube_url`, `category_id`, `is_live_tv`, `views_count`) VALUES
(1, '24x7 நேரடி செய்தி ஒளிபரப்பு - KINGS TV', 'நேரடி செய்திகள் மற்றும் விவாதங்கள் உடனுக்குடன் தமிழில்.', 'https://www.youtube.com/embed/live_stream?channel=UC_fake_live', 1, 1, 1500),
(2, 'தமிழக பட்ஜெட் 2026 - நேரடி அலசல்', 'தமிழக பட்ஜெட் அறிவிப்புகள் குறித்த விரிவான கலந்துரையாடல் மற்றும் பொருளாதார வல்லுநர்களின் கருத்துக்கள்.', 'https://www.youtube.com/embed/fake_vid_1', 1, 0, 420),
(3, 'தங்கம் விலை வீழ்ச்சி - வணிக நேரடி அறிக்கை', 'தங்கத்தின் விலை திடீரென வீழ்ச்சியடைந்தது ஏன்? சந்தை நிலவரங்கள் பற்றிய நேரடி செய்தித்தொகுப்பு.', 'https://www.youtube.com/embed/fake_vid_2', 2, 0, 310);

-- Local Wishes
INSERT INTO `local_wishes` (`wish_id`, `recipient_name`, `category`, `message`, `sender_name`) VALUES
(1, 'செல்வன். தருண் குமார்', 'birthday', 'நமது அண்ணா நகரைச் சேர்ந்த செல்வன். தருண் குமார் தனது 10-வது பிறந்தநாளை இன்று கொண்டாடுகிறார். அவர் எல்லா வளமும் பெற்று நீண்ட ஆயுளுடன் வாழ வாழ்த்துகிறோம்!', 'பெற்றோர் மற்றும் உறவினர்கள்'),
(2, 'திரு & திருமதி. விவேகானந்தன்', 'wedding', 'தங்களது 25-வது வெள்ளி விழா திருமண நாளை இன்று கொண்டாடும் தாரமங்கலம் விவேகானந்தன்-கலா தம்பதியினர் மென்மேலும் இன்புற்று வாழ வாழ்த்துகிறோம்!', 'அன்பு மகன்கள் மற்றும் குடும்பத்தினர்'),
(3, 'செல்வி. கார்த்திகா தேவி', 'achievement', 'பத்தாம் வகுப்பு பொதுத்தேர்வில் 492 மதிப்பெண்கள் பெற்று பள்ளியில் முதலிடம் பெற்ற நமது ஊரைச் சேர்ந்த மாணவி கார்த்திகா தேவிக்கு மனமார்ந்த வாழ்த்துகள்!', 'நமது ஊர் மக்கள் மற்றும் ஆசிரியர்கள்');

-- Local Obituaries
INSERT INTO `local_obituaries` (`obit_id`, `deceased_name`, `age`, `location`, `demise_date`, `funeral_details`, `short_description`, `tribute_count`) VALUES
(1, 'தர்மலிங்கம்', 72, 'சேலம்', '2026-06-30', '02-07-2026, மாலை 4:00 மணி', 'முன்னாள் அரசு பள்ளி தலைமை ஆசிரியர். அன்னார் தாரமங்கலம் அரசு உயர்நிலைப்பள்ளியில் 30 ஆண்டுகள் பணியாற்றியவர். இவரது இழப்பு குடும்பத்தாருக்கும் மாணவர்களுக்கும் ஈடுசெய்ய முடியாத ஒன்றாகும்.', 118),
(2, 'மீனாம்பாள்', 68, 'கோயம்புத்தூர்', '2026-06-29', '01-07-2026, காலை 10:00 மணி', 'பாலசுப்ரமணியன் அவர்களின் தர்மபத்தினி. சமூக ஆர்வலர் மற்றும் உதவும் கரங்கள் அறக்கட்டளையின் மூத்த உறுப்பினர். பல ஆதரவற்ற குழந்தைகளுக்கு கல்வி கற்க உதவியவர்.', 84),
(3, 'ராமநாதன் செட்டியார்', 85, 'காரைக்குடி', '2026-06-28', '30-06-2026 (முடிந்தது)', 'உள்ளூர் வணிக சங்கத் தலைவர். செட்டியார் நகைக்கடையின் நிறுவனர். காரைக்குடி பகுதியில் பல்வேறு ஆன்மிக மற்றும் தொண்டுப் பணிகளில் தன்னை ஈடுபடுத்திக் கொண்டவர்.', 230);

-- Jobs Board
INSERT INTO `jobs_board` (`job_id`, `title`, `company_name`, `category`, `location`, `salary_range`, `employment_type`, `description`) VALUES
(1, 'விற்பனை பிரதிநிதி (Sales Representative)', 'கண்ணன் சில்க்ஸ்', 'sales', 'ஈரோடு', '₹12,000 - ₹15,000', 'Full Time', 'உள்ளூர் ஜவுளிக்கடையில் வேலை செய்ய தகுதியான பெண்கள் மற்றும் ஆண்கள் தேவை. நல்ல பேச்சாற்றல் அவசியம்.'),
(2, 'கனரக வாகன ஓட்டுநர் (Heavy Driver)', 'ஆனந்த் லாஜிஸ்டிக்ஸ்', 'driver', 'சேலம்', '₹20,000 - ₹25,000', 'Full Time', 'சரக்கு லாரி ஓட்ட குறைந்தபட்சம் 3 வருட அனுபவமுள்ள ஓட்டுநர்கள் தேவை. பேட்ஜ் உரிமம் கட்டாயம்.'),
(3, 'உதவி கணக்காளர் (Assistant Accountant)', 'ஸ்ரீ நிவாஸ் ஏஜென்ஸிஸ்', 'office', 'மதுரை', '₹10,000 - ₹12,000', 'Part Time', 'Tally மென்பொருள் தெரிந்த மற்றும் தட்டச்சு தகுதியுடைய பெண் கணக்காளர்கள் தேவை.'),
(4, 'கணினி ஆபரேட்டர் (Data Entry Operator)', 'ஸ்மார்ட் சிஸ்டம்ஸ்', 'computer', 'திருச்சிராப்பள்ளி', '₹9,000 - ₹11,000', 'Full Time', 'தமிழ் மற்றும் ஆங்கில தட்டச்சு பயிற்சி பெற்றவர்கள் தேவை. MS Office அடிப்படை அறிவு அவசியம்.');

-- Classified Listings
INSERT INTO `classified_listings` (`classified_id`, `title`, `category`, `price_detail`, `location`, `contact_info`, `description`) VALUES
(1, '2 BHK சொகுசு வீடு வாடகைக்கு', 'property', '₹12,000 / மாதம்', 'சென்னை', 'ராமச்சந்திரன்: 98765 12345', 'அண்ணா நகர் மெயின் ரோடு. புதிய கட்டுமானம். கார் பார்க்கிங், குடிநீர் வசதியுடன்.'),
(2, 'விஜய் எலக்ட்ரானிக்ஸ் ஆடி அதிரடி சலுகை', 'discount', 'ஆடி தள்ளுபடி', 'சேலம்', 'விஜய் எலக்ட்ரானிக்ஸ்: 0427 244 1122', 'LED டிவிகள், ஏசி மற்றும் பிரிட்ஜ்களுக்கான நேரடி தள்ளுபடி சலுகைகள். வாராந்திர சிறப்பு தவணை முறை வசதி.'),
(3, 'Swift Dzire (2018 Model) விற்பனைக்கு', 'vehicle', '₹4,20,000', 'கோயம்புத்தூர்', 'சிவகுமார்: 99442 88776', 'சிங்கிள் ஓனர், நல்ல நிலையில் உள்ளது. 65,000 கிமீ ஓடியது. இன்சூரன்ஸ் நடப்பில் உள்ளது.'),
(4, 'Samsung Smart TV (43 inch) விற்பனைக்கு', 'appliance', '₹18,500', 'திருச்சிராப்பள்ளி', 'அகமது: 96321 07412', '1 வருடமே பயன்படுத்தப்பட்டது. மிக அருமையான கண்டிஷன். ஒரிஜினல் பில், பாக்ஸ் மற்றும் ரிமோட்டுடன்.');

-- Success Stories
INSERT INTO `success_stories` (`story_id`, `author_name`, `business_name`, `title`, `details`, `is_case_study`) VALUES
(1, 'முருகன்', 'முருகன் காபி ஒர்க்ஸ்', 'How We Built a Traditional Brand Online', 'Using simple social media marketing and localized packaging, we scaled our sales by 200% in Salem and Erode districts...', 0),
(2, 'ராதா கிருஷ்ணன்', 'ஆர்கானிக் ஃபார்ம்ஸ்', 'From Software Engineer to Successful Agro-Entrepreneur', ' राधा கிருஷ்ணன் describes how he set up integrated organic dairy and drip irrigation vegetable farms near Coimbatore...', 1);

-- PDF Contents
INSERT INTO `pdf_contents` (`pdf_id`, `title`, `title_ta`, `pdf_url`, `file_size`) VALUES
(1, 'E-Paper July 6 2026', 'மின்-இதழ் ஜூலை 6 2026', '/assets/pdf/epaper_20260706.pdf', '4.2 MB'),
(2, 'Business Guide 2026', 'வணிக வழிகாட்டி 2026', '/assets/pdf/business_guide_2026.pdf', '8.5 MB');

-- Page Contents
INSERT INTO `page_contents` (`page_key`, `title_ta`, `title_en`, `content_ta`, `content_en`, `contact_phone`, `contact_email`, `contact_address`, `google_map_url`, `updated_at`) VALUES
('about-us', 'எங்களைப் பற்றி - KINGS 24x7', 'About Us - KINGS 24x7', 'கிங்ஸ் 24x7 என்பது தமிழ்நாட்டைச் சேர்ந்த ஒரு முன்னணி டிஜிட்டல் செய்தி போர்டல் மற்றும் தொலைக்காட்சி ஊடகமாகும். நடுநிலையான, விரைவான மற்றும் துல்லியமான செய்திகளை வழங்குவதை லட்சியமாகக் கொண்டு, அரசியல், வணிகம், விளையாட்டு, பொழுதுபோக்கு, தொழில்நுட்பம் மற்றும் உள்ளூர் நிகழ்வுகளை 24 மணி நேரமும் உடனுக்குடன் வழங்கி வருகிறோம். எங்களது தாரக மந்திரம்: உண்மை. பொறுப்புடன். தமிழில்.', 'KINGS 24x7 is a premier digital news portal and television library broadcaster based in Tamil Nadu. Founded with a vision to deliver unbiased, prompt, and accurate news, we provide round-the-clock coverage of politics, business, sports, entertainment, technology, and regional updates. Our motto: Truth. Responsibility. In Tamil.', '+91 98765 43210', 'contact@kingstv.com', '123, Anna Salai, Chennai, Tamil Nadu, India', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8522384501725!2d80.25828457593673!3d13.044983013280456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52663b6a95fdf5%3A0x6b63d76e737c355c!2sAnna%20Salai%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1720420000000!5m2!1sen!2sin', NOW()),
('contact', 'தொடர்புக்கு', 'Contact Us', 'கிங்ஸ் 24x7 செய்தி நிறுவனத்தைத் தொடர்பு கொள்ளவும். உங்களிடம் ஏதேனும் செய்தி குறிப்புகள், விளம்பரத் தேவைகள், பின்னூட்டங்கள் இருந்தால் அல்லது எங்களது ஆதரவு தேவைப்பட்டால், கீழே உள்ள விவரங்கள் மூலம் எங்களது ஆசிரியர் மற்றும் தொழில்நுட்ப ஆதரவு குழுவைத் தொடர்பு கொள்ளலாம்.', 'Get in touch with KINGS 24x7. Whether you have a news tip, query, advertising requirement, feedback, or need technical support, our editorial and support desks are here to assist you.', '+91 98765 43210', 'contact@kingstv.com', '123, Anna Salai, Chennai, Tamil Nadu, India', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8522384501725!2d80.25828457593673!3d13.044983013280456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52663b6a95fdf5%3A0x6b63d76e737c355c!2sAnna%20Salai%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1720420000000!5m2!1sen!2sin', NOW()),
('advertise', 'விளம்பரம் செய்ய', 'Advertise with Us', 'உங்கள் பிராண்டை கிங்ஸ் 24x7 மூலம் மக்களிடம் கொண்டு சேர்க்கவும். எங்களது இணையதளம், மொபைல் செயலி மற்றும் லைவ் டிவி மூலமாக தினமும் லட்சக்கணக்கான வாசகர்களைச் சென்றடைய சிறந்த விளம்பரத் திட்டங்களை வழங்குகிறோம். வணிக ரீதியான தொடர்புகளுக்கு எங்களது விளம்பரக் குழுவினரைத் தொடர்பு கொள்ளவும்.', 'Promote your brand with KINGS 24x7. We offer tailored advertising packages across our web portal, mobile app, and Live TV stream to help you reach millions of active viewers daily. Contact our ad sales team for custom business proposals.', '+91 98765 43211', 'ads@kingstv.com', 'Marketing Dept, 123, Anna Salai, Chennai, Tamil Nadu, India', NULL, NOW()),
('careers', 'வேலைவாய்ப்பு - எங்களோடு இணையுங்கள்', 'Careers - Join Our Team', 'கிங்ஸ் 24x7 உடன் இணைந்து டிஜிட்டல் இதழியல் துறையின் எதிர்காலத்தை உருவாக்குங்கள். ஊடகம், வீடியோ எடிட்டிங் மற்றும் மென்பொருள் மேம்பாட்டுத் துறையில் ஆர்வம் கொண்ட திறமையான இளைஞர்களிடம் இருந்து விண்ணப்பங்களை வரவேற்கிறோம். தகுதியான நபர்கள் தங்கள் சுயவிவரத்தை careers@kingstv.com என்ற மின்னஞ்சலுக்கு அனுப்பலாம்.', 'Build the future of digital journalism with KINGS 24x7. We look forward to talented journalists, video editors, anchors, and software engineers who are passionate about storytelling and technology. Qualified candidates can send their resumes to careers@kingstv.com.', NULL, 'careers@kingstv.com', NULL, NULL, NOW()),
('privacy-policy', 'தனியுரிமைக் கொள்கை', 'Privacy Policy', 'எங்கள் வாசகர்களின் தரவுப் பாதுகாப்பு மற்றும் தனியுரிமையை நாங்கள் மதிக்கிறோம். கிங்ஸ் 24x7 உங்கள் தனிப்பட்ட தரவைப் பாதுகாக்கவும், பாதுகாப்பான உலாவல் சூழலை உறுதி செய்யவும், மற்றும் குக்கீகளை வெளிப்படைத்தன்மையுடன் கையாளவும் கடமைப்பட்டுள்ளது. உங்கள் அனுமதியின்றி உங்களது விவரங்கள் யாரிடமும் பகிரப்பட மாட்டாது.', 'Your privacy is important to us. KINGS 24x7 is committed to protecting your personal data, ensuring secure transactions, and transparently handling cookies and tracking tools on our web portal. Your data will never be shared without your explicit consent.', NULL, NULL, NULL, NULL, NOW()),
('terms-of-use', 'பயன்பாட்டு விதிமுறைகள்', 'Terms of Use', 'கிங்ஸ் 24x7 சேவைகளை நீங்கள் அணுகும்போது இந்த பயன்பாட்டு விதிமுறைகளை ஏற்றுக்கொள்கிறீர்கள். இங்குள்ள அனைத்து செய்திகள், வீடியோக்கள், கட்டுரைகள் மற்றும் லோகோக்கள் கிங்ஸ் 24x7 நிறுவனத்தின் பதிப்புரிமை பெற்ற சொத்துக்களாகும். எங்களது எழுத்துப்பூர்வ அனுமதியின்றி இவற்றை மறுபிரசுரம் செய்ய அனுமதி இல்லை.', 'By accessing the KINGS 24x7 portal, you agree to comply with our Terms of Use. All content, articles, trademarks, logos, and video streams are the intellectual property of KINGS 24x7 and cannot be reproduced without prior written permission.', NULL, NULL, NULL, NULL, NOW());
