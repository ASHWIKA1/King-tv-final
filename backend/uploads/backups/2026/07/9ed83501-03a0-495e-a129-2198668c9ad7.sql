mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com    Database: kings_tv_db
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v8.5.3-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `advertisements`
--

DROP TABLE IF EXISTS `advertisements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advertisements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `click_count` int DEFAULT NULL,
  `cost_per_click` double DEFAULT NULL,
  `cost_per_impression` double DEFAULT NULL,
  `impression_count` int DEFAULT NULL,
  `placement` varchar(255) DEFAULT NULL,
  `remaining_budget` double DEFAULT NULL,
  `target_device` varchar(255) DEFAULT NULL,
  `target_geo` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `clicks_count` int NOT NULL,
  `custom_html` text DEFAULT NULL,
  `impressions_count` int NOT NULL,
  `placement_id` varchar(255) NOT NULL,
  `target_district` varchar(255) DEFAULT NULL,
  `target_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advertisements`
--

LOCK TABLES `advertisements` WRITE;
/*!40000 ALTER TABLE `advertisements` DISABLE KEYS */;
INSERT INTO `advertisements` VALUES (1,'2026-07-20 18:34:10.130940',NULL,NULL,'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000','https://github.com/google/gemini-api',NULL,'active','Learn Java Coding - Premium Bootcamp','2026-07-20 18:34:10.130991',NULL,0,0.15,0.01,0,'header',150,'all','all',_binary '\0',0,NULL,0,'',NULL,NULL),(2,'2026-07-20 18:34:10.880841',NULL,NULL,'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000','https://developer.android.com',NULL,'active','Develop Android Apps - Zero to Hero','2026-07-20 18:34:10.880863',NULL,0,0.2,0.02,0,'sidebar',80,'all','all',_binary '\0',0,NULL,0,'',NULL,NULL),(3,'2026-07-20 18:34:11.565940',NULL,NULL,'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000','https://cloud.google.com',NULL,'active','Cloud Computing Solutions with AWS & Google Cloud','2026-07-20 18:34:11.565968',NULL,0,0.25,0.03,0,'mid-article',200,'all','all',_binary '\0',0,NULL,0,'',NULL,NULL);
/*!40000 ALTER TABLE `advertisements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aggregated_news`
--

DROP TABLE IF EXISTS `aggregated_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aggregated_news` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `external_link` varchar(512) NOT NULL,
  `noindex` bit(1) NOT NULL,
  `published_time` datetime(6) DEFAULT NULL,
  `source_logo` varchar(512) DEFAULT NULL,
  `source_name` varchar(255) NOT NULL,
  `title` varchar(512) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `idx_agg_pub_time` (`published_time`),
  KEY `idx_agg_link` (`external_link`),
  UNIQUE KEY `UK_9f9q8qnqjiv3l3t28ec5mukk` (`external_link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aggregated_news`
--

LOCK TABLES `aggregated_news` WRITE;
/*!40000 ALTER TABLE `aggregated_news` DISABLE KEYS */;
INSERT INTO `aggregated_news` VALUES (1,'2026-07-21 09:00:05.979636','டெல்லியில் போராட்டத்தில் ஈடுபட்ட  இளைஞர்கள் மீது தடியடி நடத்தியிருப்பதற்கு இந்திய நாடாளுமன்றம் மட்டுமின்றி, சர்வதேச அளவில் கண்டனக் குரல்கள் எழுந்துள்ளன. அதேநேரத்தில், டெல்லியில் விவசாய அமைப்புகள் ஏற்பாடு செய்துள்ள மகாபஞ்சாயத்தும் பதற்றத்தை அதிகரித்துள்ளது. என்ன நடக்கிறது? ','https://www.bbc.com/tamil/articles/ce8kxg246m6o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 08:56:39.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','சர்வதேச அளவில் கவனம் பெறும் சிஜேபி போராட்டம் - என்ன நடக்கிறது?'),(2,'2026-07-21 09:00:06.886722','\"அவர்கள் மீது தடியடி நடத்தி, பலப்பிரயோகம் செய்யப்பட்டது.  அதையும் மீறி, அவர்கள் மீண்டும் திரும்பி வந்து அவர்களை எதிர்கொண்டனர். இது அரசுக்கு ஒரு தீவிரமான எச்சரிக்கையாகும்.  அதாவது ஒருவித ஏமாற்றமும் விரக்தியும் நிலவுகிறது, அதைக் கேட்காவிட்டால், இன்று ஒரு பலூனைப் போல வெடித்தது, வரும் நாட்களிலும் மீண்டும் வெடிக்கக்கூடும்\"','https://www.bbc.com/tamil/articles/cyvl3e9y6m2o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 05:25:19.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','டெல்லியில் தடியடியை மீறி திரண்ட இளைஞர் கூட்டம் மோதி அரசுக்கு சொல்லும் சேதி'),(3,'2026-07-21 09:00:07.762827','\"வழக்கமாக எனக்கு இரு மாதங்களுக்கு 4,000 ரூபாய் என்ற அளவில் கட்டணம் வரும். இப்போது இருமடங்கு, அதாவது 8,000 ரூபாய் என்ற அளவில் கட்டணம் வந்துள்ளது. திடீரென இவ்வளவு உயர்ந்தது ஆச்சர்யமாக உள்ளது. எப்படி புகார் அளிப்பது என தெரியவில்லை.\"','https://www.bbc.com/tamil/articles/c9w0r4qwvgyo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 08:21:36.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','அதிக கட்டணம் வந்திருந்தால் மின் வாரியத்திடம் முறையிட்டு நிவாரணம் பெறுவது எப்படி?'),(4,'2026-07-21 09:00:08.623164','இரவுப் பணிகளால் ஏற்படும் பாதிப்புகளைக் குறைப்பதிலும், சீர்குலைந்த இரவு தூக்கத்தினால் ஏற்படும் தீமைகளைத் தணிப்பதிலும் நாம் தூங்கும் முறையை மாற்றுவது ஏதேனும் பங்காற்ற முடியுமா என்பது குறித்து விஞ்ஞானிகள் இப்போது ஆராயத் தொடங்கியுள்ளனர். ','https://www.bbc.com/tamil/articles/c89nvgd91zvo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 02:09:16.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','இரவுப் பணியில் இருப்பவர்கள் உடல்நலனை பேண உதவும் \'இருமுறை தூக்கம்\' பற்றி தெரியுமா?'),(5,'2026-07-21 09:00:09.486325','2026 உலகக் கோப்பை இறுதிப் போட்டி முடிந்த பிறகு, ஸ்பெயின் வீரர்களுடன் ஏற்பட்ட மோதலில் ஆர்ஜென்டினா வீரர்கள் மற்றும் உதவிப்  பணியாளர்கள் வன்முறையில் ஈடுபட்டது குறித்து ஃபிஃபா முறைப்படி விசாரணையைத் தொடங்கியுள்ளது.','https://www.bbc.com/tamil/articles/cg4dz5p6q53o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 07:01:08.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','மெஸ்ஸியின் சக வீரர்கள் மீது பிஃபா நடவடிக்கை பாயுமா? ஆர்ஜென்டினா அணிக்கு புதிய சிக்கல்'),(6,'2026-07-21 09:00:10.391917','கால்பந்து உலகக் கோப்பை இறுதிப் போட்டி முடிந்ததும், ஸ்பெயினின் இளம் வீரரான லமின் யாமல் கண்ணீர் மல்கிய லியோனல் மெஸ்ஸியை கட்டியணைத்த தருணம்,  ஒரு தலைமுறையிலிருந்து அடுத்த தலைமுறையிடம் பொறுப்பு மாறுவதை உணர்த்தும் ஒரு அடையாளப்பூர்வ நிகழ்வாக உணரப்பட்டது. \n','https://www.bbc.com/tamil/articles/c8enk8pew2do?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 02:51:46.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','மெஸ்ஸியை கைவிட்ட ஆர்ஜென்டினா: 19 வயதில் கால்பந்து உலகில் \'அனைத்தையும் சாதித்த\' லமின் யாமல்'),(7,'2026-07-21 09:00:11.284332','\"அது கும்பகோணம் மறைமாவட்டத்துக்குச் சொந்தமான கல்லறை. அங்கு பட்டியல் சாதி கிறிஸ்தவர்களைப் புதைப்பதற்கு அனுமதியில்லை. இதை எதிர்த்து என் தந்தை நீதிமன்ற உத்தரவை வாங்கினார். ஆனால், அவரைப் புதைப்பதற்கே 15 மணிநேரம் போராடினோம்\" என்கிறார் திருச்சி, துறையூரில் வசிக்கும் ராஜ் நோபிலி.\n\n','https://www.bbc.com/tamil/articles/c0km8lk08y6o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 02:27:14.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','திருச்சி: \'தலித்\' கிறித்தவர் உடலை அடக்கம் செய்வதில் என்ன சர்ச்சை? 3 நாட்களுக்குப் பிறகு அடக்கம்'),(8,'2026-07-21 09:00:12.171872','விளாத்திகுளம் திமுக சட்டப்பேரவை உறுப்பினர் மார்க்கண்டேயன், கோவில்பட்டியில் நடந்த பொது நிகழ்ச்சி ஒன்றில் முதலமைச்சர் விஜய் மற்றும் தவெக குறித்தும் சில கருத்துகளை தெரிவித்திருந்தார்.','https://www.bbc.com/tamil/articles/cj03j6e60v8o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 03:17:24.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','விளாத்திகுளம் திமுக எம்.எல்.ஏ கைது செய்யப்பட்டதன் பின்னணி'),(9,'2026-07-21 09:00:13.064325','நமது வரலாற்றின் ஏதோ ஒரு கட்டத்தில், இத்தகைய பஞ்சவர்ணக் கிளி வகைகளும் மனிதர்களும் பொதுவான மூதாதையர்களைக் கொண்டிருந்தனர். அப்படியிருக்க, மனிதர்களுக்குத் தட்டையான, இளஞ்சிவப்பு நிறத் தசை (நாக்கு) அமைந்த நிலையில், இந்தக் கிளிகள் மட்டும் எப்படி தங்கள் வாய்க்குள் விரல் போன்ற ஒரு உறுப்பைப் பெற்றன? நாக்கு எப்போது பரிணாம வளர்ச்சி அடையத் தொடங்கியது?','https://www.bbc.com/tamil/articles/cm2g0xkm5mno?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 05:39:21.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','பசு, பூனை, நாய் உள்பட ஒவ்வொரு உயிரினத்தின் நாக்கும் வித்தியாசமாக இருப்பது ஏன்?'),(10,'2026-07-21 09:00:13.974953','நாடாளுமன்றத்தின் பருவமழைக் கூட்டத்தொடர் ஜூலை 20-ஆம் தேதி (இன்று) தொடங்குகிறது. மோதி அரசின் மூன்றாவது பதவிக்காலத்தில் நடைபெறும் இந்தப் பருவமழைக் கூட்டத்தொடர், நாடாளுமன்றத்தின் அரசியல் சூழல் முற்றிலும் மாறியிருப்பதால் முந்தைய கூட்டத்தொடர்களிலிருந்து முற்றிலும் மாறுபட்டதாக இருக்கும்.','https://www.bbc.com/tamil/articles/c4g4p9kznn1o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-20 02:47:25.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','மாறும் கணக்குகள்: தொகுதி மறுவரையறை மசோதா நிறைவேற பாஜகவுக்கு திமுக ஒத்துழைக்குமா?'),(11,'2026-07-21 09:00:14.859296','மிகச்சிறந்த வீரரான லியோனல் மெஸ்ஸியின் உலகக் கோப்பை பயணத்தின் கடைசிப் போட்டி இதுவென்றால், நடப்பு சாம்பியனான அர்ஜென்டினா பட்டத்தை இழந்த ஏமாற்றத்துடனும், போட்டியில் மெஸ்ஸியால் எந்தத் தாக்கத்தையும் ஏற்படுத்த முடியாத நிலையிலும் தான் இப்போட்டி முடிவடைந்துள்ளது.\n\n','https://www.bbc.com/tamil/articles/cjd4lpp4g87o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-20 08:36:58.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','ஆர்ஜென்டினா தோல்விக்கு என்ன காரணம்? 5 முக்கிய விஷயங்கள்'),(12,'2026-07-21 09:00:15.724956','கோவையில் 23 ஆண்டுகளுக்கு முன் காணாமல் போன பிரகாசம், பஞ்சாப் மாநிலத்தில், பாகிஸ்தான் எல்லையில் இருக்கும் ஒரு கிராமத்தில், விவசாயி ஒருவரது வீட்டில் 15 ஆண்டுகள் கொத்தடிமையாக இருந்துள்ளார். அவர் மீட்கப்பட்டது எப்படி? என்ன நடந்தது?','https://www.bbc.com/tamil/articles/c0rd8gv2pl0o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-17 14:17:56.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','கோவை இளைஞர் பாகிஸ்தான் எல்லையில் கொத்தடிமையாக 15 ஆண்டுகள் சிக்கியிருந்து, மீண்டது எப்படி?'),(13,'2026-07-21 09:00:16.679574','\"எனது பதின்ம வயது முழுவதும், ஒரு தெளிவான செய்தி மட்டுமே வலியுறுத்தப்பட்டது. ஆணுறை இல்லாமல் உடலுறவு கொள்ளக் கூடாது, இல்லையெனில் ஒரு பெண் கர்ப்பமாகிவிடக்கூடும் என்பதுதான் அச்செய்தி. எனவே, நீங்கள் வளரும்போது, அனைத்தும் சுமூகமாக நடக்கும் என்று எதிர்பார்க்கிறீர்கள். அவ்வாறு நடக்காதபோது, என்ன செய்வது அல்லது யாரிடம் செல்வது என்று உங்களுக்குத் தெரிவதில்லை\" ','https://www.bbc.com/tamil/articles/c8jn77z7mwyo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-19 02:39:49.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','குழந்தையின்மைக்கு பெண்  மட்டுமே காரணமா? அதிகம் கவனம் பெறாத ஆணின் பிரச்னைகள்'),(14,'2026-07-21 09:00:17.670681','தமிழக முதல்வரும், தவெக தலைவருமான  விஜய் நடித்த ஜனநாயகன் படம் ஜூலை 23-ஆம் தேதி உலகம் முழுவதும் வெளியாகிறது. இந்த படத்தை குழந்தைகள் திரையரங்கில் பார்க்க முடியாது என்பது ஏன்? படம் கடந்து வந்த பாதை','https://www.bbc.com/tamil/articles/c9d81z19g9qo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-17 06:16:25.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','\'ஜனநாயகன்\' பார்க்க குழந்தைகளுடன் திரையரங்கு செல்ல முடியாது - ஏன்? விஜய் படம் கடந்து வந்த பாதை'),(15,'2026-07-21 09:00:18.670281','கிறிஸ்டோபர் நோலன் இயக்கத்தில் வெளியாகியுள்ள பிரமாண்ட திரைப்படமான \'தி ஒடிஸி\'யில் அவர் காட்டியுள்ள கவனிக்க வேண்டிய சிறப்பு அம்சங்கள் என்னென்ன?','https://www.bbc.com/tamil/articles/cn4nzdnx27lo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-19 02:00:36.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','\'தி ஒடிஸி\' படத்தில் கவனிக்க வேண்டிய 5 முக்கிய அம்சங்கள்'),(16,'2026-07-21 09:00:19.702504','\"நாங்கள் குறிப்பாக உணர்ச்சிவசப்படும் நபர்கள் என்று நான் சொல்ல மாட்டேன், ஆனால் அது வார்த்தைகள் வெளிவராத அளவு ஒரு தீவிரமான மற்றும் உணர்ச்சிகரமான தருணம். நாங்கள் ஒருவரையொருவர் கட்டிப்பிடித்து அழுதோம். அது வரலாற்றிலேயே மிகவும் அமைதியான ஒரு விமானப் பயணமாக இருந்தது, ஏனென்றால் எங்களால் அப்போது வேறு என்ன பேசமுடியும்?\"','https://www.bbc.com/tamil/articles/czxqlv2d9gvo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-17 07:22:02.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','தாயை கொன்றவரை கண்டறிய நாடு விட்டு நாடு சென்று 3 மகன்கள் 17 ஆண்டு நடத்திய போராட்டம்'),(17,'2026-07-21 09:00:20.598366','பழனி மலை அடிவாரத்தில் தண்டாயுதபாணி  சுவாமி மடத்துக்குச் சொந்தமான நிலத்தை தனி நபர்களுக்கு பத்திரப்பதிவு செய்ததாக 4 பேர் மீது  காவல்நிலையத்தில் வழக்குப் பதிவு செய்யப்பட்டுள்ளது. இந்த விவகாரத்தில் என்ன நடந்தது? \n\n','https://www.bbc.com/tamil/articles/cwy0y5e7w88o?at_medium=RSS&at_campaign=rss',_binary '','2026-07-19 09:27:26.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','பழனி முருகன் கோவில் மடத்தின் நில முறைகேடு வழக்கில் என்ன நடந்தது?பின்னணி விவரம்'),(18,'2026-07-21 09:00:21.463145','நூற்றுக்கும் மேற்பட்ட விஞ்ஞானிகள் ராஜினாமா செய்ததைத் தொடர்ந்து, பதவி விலகல்களை ஏற்கும் தனது விதிகளை இஸ்ரோ மாற்றியுள்ளது. என்ன நடக்கிறது? வெளியேறும் விஞ்ஞானிகள் எங்கே செல்கிறார்கள்?','https://www.bbc.com/tamil/articles/cpd7qnqv67eo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-18 02:30:17.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','இஸ்ரோ விஞ்ஞானிகளுக்கு தனியார் விண்வெளி நிறுவனங்கள் குறியா? நூற்றுக்கும் மேற்பட்டோர் ராஜினாமா'),(19,'2026-07-21 09:00:22.335633','வியட்நாம் படகு விபத்தில் பாதிக்கப்பட்டவர்களுக்கு உதவ தமிழ்நாடு அரசு சார்பில் உதவிகள் எண்கள் அறிவிக்கப்பட்டுள்ளன. விபத்துக்குள்ளான படகில் அனைவரும் உயிர் காக்கும் கவசம் அணிந்திருந்தும் 15 பேர் பலியானது எப்படி? ','https://www.bbc.com/tamil/articles/cy8w365x5ngo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-12 13:46:49.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','உயிர் காக்கும் கவசம் அணிந்தும் 15 பேர் பலியானது எப்படி? வியட்நாம் படகு விபத்தில் உயிர் தப்பிய தமிழர் தகவல்'),(20,'2026-07-21 09:00:23.202702','நுகர்வோர் ஒருவரின் புகாரைத் தொடர்ந்து, மாருதி சுசூகி இந்தியா லிமிடெட் நிறுவனம் 45 நாட்களுக்குள் அதே மாடலின் புதிய இ20 எரிபொருளில் இயங்கும் காரை புகார்தாரருக்கு வழங்க வேண்டும் என்று சத்தீஷ்கரில் மாவட்ட நுகர்வோர் குறைதீர் ஆணையம் உத்தரவிட்டுள்ளது.','https://www.bbc.com/tamil/articles/cvg9xy3v30lo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-17 03:20:03.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','இ20 பெட்ரோலால் பிரச்னையா? வாடிக்கையாளருக்கு புதிய கார் வழங்க ஆணையம் உத்தரவு'),(21,'2026-07-21 09:00:24.095984','மருத்துவ நிபுணர்களின் கூற்றுப்படி, உடல் உழைப்பின் போது ஏற்படும் மூச்சுத்திணறலானது இதய நோய், நுரையீரல் நோய், ரத்த சோகை, தைராய்டு கோளாறுகள் அல்லது பிற ஆரோக்கியக் குறைபாடுகளின் ஆரம்ப அறிகுறியாக இருக்கலாம். \n','https://www.bbc.com/tamil/articles/c235l7kp8dlo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-17 01:48:37.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','நடந்தாலோ அல்லது படிக்கட்டு ஏறினாலோ மூச்சுத்திணறல் வருகிறதா? அலட்சியம் செய்யாதீர்'),(22,'2026-07-21 09:00:25.068941','இந்தியாவில் குழந்தைகள் மீதான பாலியல் வன்கொடுமை தொடர்பான உள்ளடக்கங்களை ஊக்குவிக்கும் கட்டண விளம்பரங்களை இன்ஸ்டாகிராம் வெளியிட்டு வருவதாக \'பிபிசி ஐ\'  புலனாய்வில் கண்டறியப்பட்டுள்ளது. என்ன நடக்கிறது? ','https://www.bbc.com/tamil/articles/cz6v7gd17qgo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-03 06:28:04.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','இந்தியா: இன்ஸ்டாகிராமில் குழந்தைகள் பாலியல் வன்கொடுமை உள்ளடக்கத்தை ஊக்குவிக்கும் விளம்பரங்கள் - பிபிசி புலனாய்வு'),(23,'2026-07-21 09:00:25.960189','பொதுவாக புதிய உணவுப் பொருட்களுக்குத்தான் அதிக மதிப்பு இருக்கும். ஆனால் அரிசி விஷயத்தில் மட்டும் இதற்கு நேர்மாறான நிலை காணப்படுகிறது. புதிதாக அறுவடை செய்யப்பட்ட அரிசியை விட, ஒரு வருடம் அல்லது அதற்கு மேல் சேமித்து வைக்கப்பட்ட புழுங்கல் அரிசிக்கு அதிக விலை கொடுக்க பலர் தயாராக இருக்கின்றனர்.','https://www.bbc.com/tamil/articles/cpd3y82jx89o?at_medium=RSS&at_campaign=rss',_binary '','2026-06-30 02:38:41.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','பழைய புழுங்கல் அரிசிக்கு அதிக மவுசு ஏன்? சமைக்கும் போது என்ன நடக்கிறது?'),(30001,'2026-07-21 12:00:04.928370','உலகின் மிகவும் புகழ்பெற்ற மற்றும் மதிப்புமிக்க ஆண் குதிரையாக ஷெர்கார் திகழ்ந்தது. \n1983ம் ஆண்டு பிப்ரவரி மாதம் 8ம் தேதி அன்று, அயர்லாந்தின் குதிரை வளர்ப்புப் பண்ணையிலிருந்து ஆயுதம் ஏந்திய நபர்கள் அதைக் கடத்திச்சென்றனர்.\n','https://www.bbc.com/tamil/articles/cp9eze427zyo?at_medium=RSS&at_campaign=rss',_binary '','2026-07-21 09:57:39.000000','https://news.files.bbci.co.uk/ws/shared/img/lis/tamil.png','BBC News Tamil','உலகப் புகழ்பெற்ற பந்தய குதிரையை கடத்திய ஆயுத கும்பல் - 43 ஆண்டுகளாக தீராத மர்மம்');
/*!40000 ALTER TABLE `aggregated_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_configuration`
--

DROP TABLE IF EXISTS `ai_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_configuration` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `api_key` text DEFAULT NULL,
  `base_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `enable_ai` bit(1) NOT NULL,
  `enable_cache` bit(1) NOT NULL,
  `enable_keywords` bit(1) NOT NULL,
  `enable_logging` bit(1) NOT NULL,
  `enable_rewrite` bit(1) NOT NULL,
  `enable_seo` bit(1) NOT NULL,
  `enable_summary` bit(1) NOT NULL,
  `enable_tags` bit(1) NOT NULL,
  `enable_translation` bit(1) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `is_encrypted` bit(1) NOT NULL,
  `max_tokens` int NOT NULL,
  `model` varchar(100) DEFAULT NULL,
  `provider` varchar(50) NOT NULL,
  `retry_attempts` int NOT NULL,
  `temperature` double NOT NULL,
  `timeout` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_gnm4mavkd35vqfg0p17a4s08o` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_configuration`
--

LOCK TABLES `ai_configuration` WRITE;
/*!40000 ALTER TABLE `ai_configuration` DISABLE KEYS */;
INSERT INTO `ai_configuration` VALUES (1,'PP95WZtd7b4IJp3G8zPVCeslUVXl55oexawVTBueDGdE42f03kYoqcZpgTiWsNasmo4ezohuFbS77ZR2G+fVAnj3GJQM6NyiWsYQXK13PzEK','https://generativelanguage.googleapis.com/v1beta','2026-07-22 14:24:54.624284',NULL,_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',1024,'gemini-2.5-pro','gemini',3,0.3,30,'2026-07-22 19:21:34.046482',1),(2,NULL,'https://api.openai.com/v1','2026-07-22 14:24:55.426581',NULL,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',1024,'gpt-4o-mini','openai',3,0.3,30,'2026-07-22 19:21:34.046486',1),(3,NULL,'https://api.anthropic.com/v1','2026-07-22 14:24:55.972981',NULL,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',1024,'claude-3-5-sonnet-20241022','anthropic',3,0.3,30,'2026-07-22 19:21:34.046487',1),(4,NULL,'https://api.groq.com/openai/v1','2026-07-22 14:24:56.632501',NULL,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',1024,'llama-3.3-70b-versatile','groq',3,0.3,30,'2026-07-22 19:21:34.046488',1),(5,NULL,'https://openrouter.ai/api/v1','2026-07-22 14:24:57.115830',NULL,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',1024,'google/gemini-2.0-flash-exp:free','openrouter',3,0.3,30,'2026-07-22 19:21:34.046489',1),(6,NULL,'http://localhost:11434/api/chat','2026-07-22 14:24:57.644469',NULL,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',1024,'llama3','ollama',3,0.3,30,'2026-07-22 19:21:34.046489',1);
/*!40000 ALTER TABLE `ai_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article_views`
--

DROP TABLE IF EXISTS `article_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `article_id` bigint NOT NULL,
  `author_id` bigint DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `is_counted_for_earnings` bit(1) DEFAULT NULL,
  `user_agent` varchar(512) DEFAULT NULL,
  `view_date` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `idx_view_article` (`article_id`),
  KEY `idx_view_ip` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_views`
--

LOCK TABLES `article_views` WRITE;
/*!40000 ALTER TABLE `article_views` DISABLE KEYS */;
INSERT INTO `article_views` VALUES (1,5,NULL,'162.158.54.186',_binary '\0','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','2026-07-21 15:09:11.306082'),(30001,3,NULL,'172.69.131.205',_binary '\0','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','2026-07-22 11:30:26.785900'),(30002,240002,NULL,'162.158.54.186',_binary '\0','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','2026-07-22 16:38:59.226367');
/*!40000 ALTER TABLE `article_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `article_id` bigint NOT NULL AUTO_INCREMENT,
  `author_name` varchar(255) DEFAULT NULL,
  `canonical_url` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `content_ta` text NOT NULL,
  `district_id` bigint DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `seo_status` varchar(255) DEFAULT NULL,
  `short_desc_en` text DEFAULT NULL,
  `short_desc_ta` text DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `views_count` int DEFAULT NULL,
  `visibility_radius_km` double DEFAULT NULL,
  `constituency` varchar(255) DEFAULT NULL,
  `subcategory_id` bigint DEFAULT NULL,
  `focus_keywords` varchar(255) DEFAULT NULL,
  `reading_time` int DEFAULT NULL,
  `telegram_sent` bit(1) DEFAULT NULL,
  `featured_category` varchar(255) DEFAULT NULL,
  `is_plugged_in` bit(1) DEFAULT NULL,
  `priority_score` double DEFAULT NULL,
  `show_right_column` bit(1) DEFAULT NULL,
  `readability_score` int DEFAULT NULL,
  `reporter_name` varchar(255) DEFAULT NULL,
  `seo_score` int DEFAULT NULL,
  `allow_comments` bit(1) DEFAULT NULL,
  `allow_pingbacks` bit(1) DEFAULT NULL,
  PRIMARY KEY (`article_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_sn7al9fwhgtf98rvn8nxhjt4f` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=270001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'Kings TV News Desk','http://localhost:5000/articles/tn-budget-session-updates',1,'Important budget allocations and welfare schemes announced during the state assembly session. Additional funds have been setup for education, health, and urban infrastructure projects.','பட்ஜெட் கூட்டத்தொடரில் முக்கிய துறைகளுக்கான நிதி ஒதுக்கீடுகள் மற்றும் புதிய திட்டங்கள் குறித்த தகவல்கள் வெளியிடப்பட்டன. கல்வி, சுகாதாரம் மற்றும் உட்கட்டமைப்பு மேம்பாட்டிற்காக கூடுதல் நிதி ஒதுக்கப்பட்டுள்ளது.',NULL,'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800','https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800',NULL,NULL,'Tamil Nadu state assembly budget session announcements.','tn, budget, session, updates','TN assembly budget session new announcements - live reports','2026-07-17 20:15:16.127459','ready','Tamil Nadu state assembly budget session announcements.','தமிழக பட்ஜெட் கூட்டத்தொடர் முக்கிய அறிவிப்புகள்.','tn-budget-session-updates','published','TN assembly budget session new announcements - live reports','தமிழக சட்டமன்றக் கூட்டத்தொடர் புதிய பட்ஜெட் அறிவிப்புகள் – நேரடித் தகவல்கள்','2026-07-23 02:00:00.188960',152,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,5.0531016493823815,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Kings TV News Desk','http://localhost:5000/articles/national-elections-all-party-meet',1,'Opposition and ruling parties meet to deliberate on parliamentary updates and guidelines. Senior political leaders have joined the discussion to resolve the parliamentary schedule.','எதிர்வரும் பாராளுமன்றக் கூட்டத்தொடரை சுமுகமாக நடத்துவது குறித்து முக்கிய விவாதங்கள் நடைபெறுகின்றன. எதிர்கட்சிகள் மற்றும் ஆளுங்கட்சியினர் முக்கிய பிரச்சனைகள் குறித்து ஆலோசிக்கின்றனர்.',NULL,'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800','https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800',NULL,NULL,'All-party meeting in New Delhi today.','national, elections, all, party, meet','National elections: all-party meet in New Delhi today','2026-07-17 20:15:16.813000','ready','All-party meeting in New Delhi today.','புது தில்லியில் அனைத்துக் கட்சிக் கூட்டம் இன்று.','national-elections-all-party-meet','published','National elections: all-party meet in New Delhi today','தேசிய தேர்தல் களம்: புது தில்லியில் அனைத்துக் கட்சிக் கூட்டம் இன்று','2026-07-23 02:00:00.188960',122,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,5.04262106068849,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Kings TV News Desk','http://localhost:5000/articles/stock-markets-record-highs',2,'Tech and Banking sector shares register major gains as domestic markets hit new historic milestones. Favorable global trade signals have fueled the rally.','தொழில்நுட்ப மற்றும் வங்கி பங்குகள் பெரும் லாபம் ஈட்டியதை அடுத்து முதலீட்டாளர்கள் மகிழ்ச்சி அடைந்துள்ளனர். உலகளாவிய சாதகமான சூழல் சந்தை உயர்வுக்கு வழிவகுத்தது.',NULL,'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800','https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',NULL,NULL,'Stock markets hit new records.','stock, markets, record, highs','Stock markets reach record highs - Sensex crosses 83,000 points','2026-07-17 20:15:17.496684','ready','Stock markets hit new records.','பங்குச்சந்தை புதிய உச்சம்.','stock-markets-record-highs','published','Stock markets reach record highs - Sensex crosses 83,000 points','பங்குச்சந்தை வரலாறு காணாத உயர்வு – சென்செக்ஸ் 83,000 புள்ளிகளைத் தாண்டியது','2026-07-23 02:00:00.188960',223,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,5.077905709291257,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Kings TV News Desk','http://localhost:5000/articles/india-england-odi-squad',3,'The selection committee has presented the new ODI squad focusing on young talent and resting senior players for the upcoming series.','இளம் வீரர்களுக்கு வாய்ப்பளிக்கும் வகையில் புதிய இந்திய அணி தேர்வு செய்யப்பட்டுள்ளது. சீனியர் வீரர்களுக்கு ஓய்வளிக்கப்பட்டுள்ளது.',NULL,'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',NULL,NULL,'India vs England ODI squad details.','india, england, odi, squad','India vs England ODI Series: New Squad Announced','2026-07-17 20:15:18.174489','ready','India vs England ODI squad details.','இந்தியா vs இங்கிலாந்து ஒருநாள் தொடர் அணி விவரம்.','india-england-odi-squad','published','India vs England ODI Series: New Squad Announced','இந்தியா vs இங்கிலாந்து ஒருநாள் தொடர்: புதிய அணி விவரம் வெளியீடு','2026-07-23 02:00:00.188960',314,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,5.109696828329394,NULL,NULL,NULL,NULL,NULL,NULL),(5,'Kings TV News Desk','http://localhost:5000/articles/vijay-final-movie-grand-news',4,'As it marks the final cinematic outing of Thalapathy Vijay before his political entry, expectations are running high globally.','அரசியல் பிரவேசத்திற்கு முன்னதாக நடிகர் விஜய் நடிக்கும் இறுதித் திரைப்படம் என்பதால் உலகம் முழுவதும் பெரும் எதிர்பார்ப்பு நிலவி வருகிறது.',NULL,'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800','https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',NULL,NULL,'Vijay\'s final movie expectations.','vijay, final, movie, grand, news','Thalapathy Vijay final movie: Huge expectations among fans','2026-07-17 20:15:18.853918','ready','Vijay\'s final movie expectations.','விஜய்யின் இறுதித் திரைப்படம் பெரும் எதிர்பார்ப்பு.','vijay-final-movie-grand-news','draft','Thalapathy Vijay final movie: Huge expectations among fans','தளபதி விஜய்யின் இறுதித் திரைப்படம்: ரசிகர்களிடையே பெரும் எதிர்பார்ப்பு','2026-07-23 02:00:00.188960',503,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,5.1757245371009075,NULL,NULL,NULL,NULL,NULL,NULL),(30001,'Kings TV News Desk','https://kings-tv.onrender.com/news/test-news',3,'','',NULL,'','',NULL,NULL,'hello','news, Tamil news, Kings TV, ','test news','2026-07-18 03:54:43.942513','ready','','hello','test-news','deleted','','test news','2026-07-23 02:00:00.188960',3,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,0.0011410886614690962,NULL,NULL,NULL,NULL,NULL,NULL),(60001,'Kings TV News Desk','https://kings-tv.onrender.com/news/test',1,'','',3,'','',NULL,NULL,'','news, Tamil news, Kings TV, ','test','2026-07-18 07:16:44.734510','ready','','','test','deleted','','test','2026-07-23 02:00:00.188960',1,NULL,'',1,NULL,1,NULL,NULL,NULL,0.0004002054702091635,NULL,NULL,NULL,NULL,NULL,NULL),(90001,'Kings TV News Desk','https://kings-tv.onrender.com/news/ஜப்பானில்-செயற்கை-நுண்ணறிவு-மற்றும்-ரோபோடிக்ஸ்-துறையில்-புதிய-கூட்டணி',5,'','<p class=\"PDq2pG_selectionAnchorContainer\" data-start=\"108\" data-end=\"534\">செயற்கை நுண்ணறிவு (AI) மற்றும் ரோபோடிக்ஸ் துறையை அடுத்த கட்டத்திற்கு கொண்டு செல்லும் நோக்கில், NVIDIA நிறுவனம் ஜப்பானின் முன்னணி தொழில்நுட்ப மற்றும் ரோபோடிக்ஸ் நிறுவனங்களுடன் புதிய கூட்டணியை அறிவித்துள்ளது. இந்த முயற்சியின் மூலம் தொழிற்சாலைகள், மருத்துவமனைகள், கிடங்குகள் மற்றும் பல்வேறு தொழில்துறைகளில் மனிதர்களுடன் இணைந்து செயல்படும் திறமையான \"Physical AI\" ரோபோக்கள் உருவாக்கப்பட உள்ளன.</p>\n<p data-start=\"536\" data-end=\"886\">இந்த புதிய தொழில்நுட்பம், சுற்றுப்புற சூழலை புரிந்து கொண்டு, மனிதர்களுடன் பாதுகாப்பாக இணைந்து செயல்படக்கூடிய ரோபோக்களை உருவாக்க உதவும். குறிப்பாக தொழிலாளர் பற்றாக்குறை அதிகரித்து வரும் ஜப்பானில், இந்த ரோபோக்கள் உற்பத்தித் திறனை உயர்த்துவதோடு, பல கடினமான பணிகளை தானியக்கமாக மேற்கொள்ளும் என எதிர்பார்க்கப்படுகிறது.</p>\n<p data-start=\"888\" data-end=\"1188\">NVIDIA நிறுவனத்தின் தலைமை நிர்வாக அதிகாரி ஜென்சன் ஹுவாங், \"செயற்கை நுண்ணறிவு தொழில்துறையின் எதிர்காலத்தை மாற்றும் முக்கிய தொழில்நுட்பமாக இருக்கும்\" என்று தெரிவித்துள்ளார். இந்த கூட்டணியின் முதல் கட்ட பணிகள் இந்த ஆண்டிலேயே தொடங்கும் என்றும் தகவல் வெளியாகியுள்ளது.</p>',1,'https://kings-tv.onrender.com/uploads/articles/article_1784364973645_213.jpg','https://kings-tv.onrender.com/uploads/articles/article_1784364973645_213.jpg',NULL,NULL,'','news, Tamil news, Kings TV, ','ஜப்பானில் செயற்கை நுண்ணறிவு மற்றும் ரோபோடிக்ஸ் துறையில் புதிய கூட்டணி','2026-07-18 08:56:17.146800','ready','','','ஜப்பானில்-செயற்கை-நுண்ணறிவு-மற்றும்-ரோபோடிக்ஸ்-துறையில்-புதிய-கூட்டணி','deleted','','ஜப்பானில் செயற்கை நுண்ணறிவு மற்றும் ரோபோடிக்ஸ் துறையில் புதிய கூட்டணி','2026-07-23 02:00:00.188960',3,NULL,'',19,NULL,1,NULL,NULL,NULL,5.001216310619444,NULL,NULL,NULL,NULL,NULL,NULL),(90002,'Kings TV News Desk','https://kings-tv.onrender.com/news/india-won-the-world-cup-',3,'','<div class=\"\" data-bfc=\"\" data-ved=\"2ahUKEwjwwdfQ-NyVAxVpklYBHY2wI4IQi4wTegoIAggACAAIBRAZ\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 400; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"><span class=\"T286Pc\" data-sfc-cp=\"\" data-sfc-root=\"ep\" data-sfc-cb=\"\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 400; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"><strong class=\"Yjhzub\" data-sfc-root=\"ep\" data-sfc-cb=\"\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 700; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\">2007:<!--TgQPHd||[]--></strong> India won the inaugural Men\'s T20 World Cup held in South Africa, defeating Pakistan in the final.<!--TgQPHd||[]--></span><!--TgQPHd||[]--></div>\n<div class=\"\" data-bfc=\"\" data-ved=\"2ahUKEwjwwdfQ-NyVAxVpklYBHY2wI4IQi4wTegoIAggACAAIFhAA\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 400; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"><span class=\"T286Pc\" data-sfc-cp=\"\" data-sfc-root=\"ep\" data-sfc-cb=\"\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 400; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"><strong class=\"Yjhzub\" data-sfc-root=\"ep\" data-sfc-cb=\"\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 700; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\">2024:<!--TgQPHd||[]--></strong> India clinched its second T20 World Cup title by defeating South Africa in a thrilling final in Barbados.<!--TgQPHd||[]--></span><!--TgQPHd||[]--></div>\n<div class=\"\" data-bfc=\"\" data-ved=\"2ahUKEwjwwdfQ-NyVAxVpklYBHY2wI4IQi4wTegoIAggACAAIFhAC\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 400; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"><span class=\"T286Pc\" data-sfc-cp=\"\" data-sfc-root=\"ep\" data-sfc-cb=\"\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 400; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"><strong class=\"Yjhzub\" data-sfc-root=\"ep\" data-sfc-cb=\"\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 700; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"><span class=\"yADgie\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 700; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\">2026:</span><!--TgQPHd||[]--></strong><span class=\"yADgie\" data-copy-service-computed-style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif; font-size: 16px; font-weight: 400; margin: 0px; text-decoration: none; border-bottom: 0px rgb(230, 232, 240);\"> India claimed their third T20 World Cup title, winning the tournament and cementing their dominance in the format.</span><!--TgQPHd||[]--></span> [<a href=\"https://en.wikipedia.org/wiki/India_national_cricket_team\">1</a>, <a href=\"https://www.youtube.com/watch?v=sDA6hjrEKXo&amp;t=78\">2</a>, <a href=\"https://www.facebook.com/TNCricketAssociation/posts/onthisday-in-2007-india-were-crowned-champions-of-the-world-lifting-the-inaugura/1238095041455633/\">3</a>, <a href=\"https://www.icc-cricket.com/about/members/associate/board-of-control-for-cricket-in-india\">4</a>, <a href=\"https://en.wikipedia.org/wiki/India_at_the_Men%27s_T20_World_Cup\">5</a>]</div>',NULL,'https://kings-tv.onrender.com/uploads/articles/article_1784365667626_13.jpg','https://kings-tv.onrender.com/uploads/articles/article_1784365667626_13.jpg',NULL,NULL,'ரோஹித் ஷர்மா இந்தியாவை உலகக் கோப்பையை வெல்ல வழிநடத்தினார்.','indian cricet team ','india won the world cup ','0006-07-18 14:35:00.000000','ready','rohith sharma leads india to win the world cup ','ரோஹித் ஷர்மா இந்தியாவை உலகக் கோப்பையை வெல்ல வழிநடத்தினார்.','india-won-the-world-cup-','published','india won the world cup ','இந்தியா உலகக் கோப்பையை வென்றது','2026-07-18 19:19:08.139150',6,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(120001,'Kings TV News Desk','https://kings-tv.onrender.com/news/test1',60005,'','<p>இளம் வீரர்களுக்கு வாய்ப்பளிக்கும் வகையில் புதிய இந்திய அணி தேர்வு செய்யப்பட்டுள்ளது. சீனியர் வீரர்களுக்கு ஓய்வளிக்கப்பட்டுள்ளது.</p>',NULL,'','',NULL,NULL,'இளம் வீரர்களுக்கு வாய்ப்பளிக்கும் வகையில் புதிய இந்திய அணி தேர்வு செய்யப்பட்டுள்ளது. சீனியர் வீரர்களுக்கு ஓய்வளிக்கப்பட்டுள்ளது.','news, Tamil news, Kings TV, ','test1','2026-07-18 11:02:19.215686','ready','','இளம் வீரர்களுக்கு வாய்ப்பளிக்கும் வகையில் புதிய இந்திய அணி தேர்வு செய்யப்பட்டுள்ளது. சீனியர் வீரர்களுக்கு ஓய்வளிக்கப்பட்டுள்ளது.','test1','deleted','','test1','2026-07-21 15:00:00.522892',0,NULL,'',NULL,NULL,1,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL),(150001,'Kings TV News Desk','https://kings-tv.onrender.com/news/d',4,'','<p><img src=\"https://kings-tv.onrender.com/uploads/articles/article_1784459441920_880.jpg\"></p>',1,'https://kings-tv.onrender.com/uploads/articles/article_1784459715880_705.png','https://kings-tv.onrender.com/uploads/articles/article_1784459715880_705.png',NULL,NULL,'','news, Tamil news, Kings TV, dhanush news','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...   ','2026-07-19 11:15:24.526098','ready','','','d','deleted','dhanush news','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...   ','2026-07-21 15:00:00.523008',0,NULL,'',13,'',1,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL),(150002,'Kings TV News Desk','https://kings-tv.onrender.com/news/d-1',4,'','<p><img src=\"https://kings-tv.onrender.com/uploads/articles/article_1784459441920_880.jpg\"></p>',1,'','',NULL,NULL,'','news, Tamil news, Kings TV, dhanush news','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...   ','2026-07-19 11:15:34.840912','ready','','','d-1','deleted','dhanush news','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...   ','2026-07-23 02:00:00.189965',4,NULL,'',13,'',1,NULL,NULL,NULL,0.0024227354131319367,NULL,NULL,NULL,NULL,NULL,NULL),(180001,'Kings TV News Desk','https://kings-tv.onrender.com/article/பிரதமர்-இல்லம்-முன்பு-ராகுல்-காந்தி-ஆர்ப்பாட்டம்',1,'','<p class=\"wp-block-paragraph\">நீட் தேர்வு வினாத்தாள் கசிவு உள்ளிட்ட குளறுபடிக்கு பொறுபேற்று மத்திய கல்வி அமைச்சர் தர்மேந்திர பிரதான் பதவி விலக வேண்டும் என்று வலியுறுத்தி கரப்பான் பூச்சி ஜனதா கட்சியினர் டெல்லி ஜந்தர் மந்தரில் கடந்த ஜூன் மாதம் 20-ஆம் தேதி முதல் போராட்டத்தில் ஈடுபட்டு வருகின்றனர். இந்த போராட்டத்திற்கு ஆதரவாக சமூக ஆர்வலர் சோனம் வாங்சுக் உண்ணாவிரதப் போராட்டத்தில் ஈடுபட்டு வந்தார்.</p>\n<p class=\"wp-block-paragraph\">இந்த நிலையில் கடந்த இரண்டு நாட்களுக்கு முன்பு சோனம் வாங்சுக்கின் உடல் நிலை மோசமடைந்த நிலையில் டெல்லி போலீசார் அவரை வலுக்கட்டாயமாக மருத்துவமமைக்கு அழைத்துச் சென்றனர். இதற்கு பல்வேறு தரப்பினரும் கண்டனம் தெரிவித்து வந்தனர்.</p>\n<div class=\"code-block code-block-3\">&nbsp;</div>\n<p class=\"wp-block-paragraph\">இந்த நிலையில் நேற்று நாடாளுமன்ற மழைக்கால கூட்டத்தொடர் தொடங்கிய நிலையில் கரப்பான் பூச்சி கட்சியினர் நாடாளுமன்றம் நோக்கி பேரணியாக சென்றனர். அப்போது பேரணி சென்ற மாணவர்கள் மீது துணை ராணுவத்தினர் தடியடி மற்றும் கண்ணீர் புகை குண்டுகளை வீசி தாக்குதல் நடத்தினர். இதில் பலரும் காயமடைந்தனர். இதனைத் தொடர்ந்து சிஜேபி கட்சியினருக்கு ஆதரவாக நாடுமுழுவதும் பல்வேறு பகுதிகளில் மாணவர்கள் மற்றும் இளைஞர்கள் போராட்டத்தில் ஈடுபட்டனர்.</p>\n<p class=\"wp-block-paragraph\">இந்த நிலையில் இன்று மக்களைவை எதிர்க்கட்சித் தலைவர் ராகுல்காந்தி, பிரியங்கா காந்தி உள்ளிட்ட காங்கிரஸ் எம்.பிக்கள் டெல்லி பிரதமர் இல்லம் நோக்கி பேரணியாக சென்று சிஜேபி இளைஞர்களுக்கு ஆதரவாக போராட்டத்தில் ஈடுபட்டனர். அப்போது மாணவர்கள் மீது ராணுவத்தினர் அத்துமீறலில் ஈடுபட்டதற்கு பொறுப்பேற்று பிரதமர் மோடி மற்றும் உள்துறை அமைச்சர் அமித்ஷா ஆகியோர் பதவி விலக வேண்டும் என முழக்கங்கள் எழுப்பினர். அப்போது காங்கிரஸ் எம்.பிக்களிடம் போலீசார் பேச்சுவார்த்தையில் ஈடுபட்டனர். இதனால் அப்பகுதியில் சிறிய சலசலப்பு ஏற்பட்டது.</p>\n<p class=\"wp-block-paragraph\">இதுகுறித்து ராகுல்காந்தி வெளியிட்டுள்ள எக்ஸ் தளப் பதிவில் கூறியிருப்பதாவது, &ldquo;நேற்று இளம் மாணவர்கள் மீது நடத்தப்பட்ட வன்முறைச் செயல்கள் குறித்துப் பதிலளிக்கக் கோரி, நாங்கள் பிரதமர் மோடியின் இல்லத்தை நோக்கிப் பேரணியாகச் சென்றோம்.</p>\n<p class=\"wp-block-paragraph\">இவ்விவகாரத்தில் எந்தப் பொறுப்பையும் ஏற்கவோ அல்லது நாடாளுமன்றத்தில் இது குறித்து விவாதிக்கவோ அரசு விரும்பவில்லை.</p>\n<p class=\"wp-block-paragraph\">இந்திய இளைஞர்களின் எதிர்காலத்தை சீரழித்ததற்காக பிரதமரும், உள்துறை மந்திரியும் பதவி விலக வேண்டும்&rdquo; என்று அவர் தெரிவித்துள்ளா</p>',2,'/uploads/articles/2026/07/ee35fbad-0c21-49d6-a61d-a19b1a80c40a.webp','/uploads/articles/2026/07/ee35fbad-0c21-49d6-a61d-a19b1a80c40a.webp',NULL,NULL,'நீட் தேர்வு வினாத்தாள் கசிவு உள்ளிட்ட குளறுபடிக்கு பொறுபேற்று மத்திய கல்வி அமைச்சர் தர்மேந்திர பிரதான் பதவி விலக வேண்டும் என்று வலியுறுத்தி கரப்பான் பூச...','news, KINGS 24x7, Tamil news, பரதமர, இலலம, மனப, ரகல, கநத, ஆரபபடடம','பிரதமர் இல்லம் முன்பு ராகுல் காந்தி ஆர்ப்பாட்டம்! | KINGS 24x7','2026-07-21 19:49:09.754857','ready','','நீட் தேர்வு வினாத்தாள் கசிவு உள்ளிட்ட குளறுபடிக்கு பொறுபேற்று மத்திய கல்வி அமைச்சர் தர்மேந்திர பிரதான் பதவி விலக வேண்டும் என்று வலியுறுத்தி கரப்பான் பூச்சி ஜனதா கட்சியினர் டெல்லி ஜந்தர் மந்தரில் கடந்த ஜூன் மாதம் 20-ஆம் தேதி முதல் போராட்டத்தில் ஈடுபட்டு வருகின்றனர். இந்த போராட்டத்திற்கு ஆதரவாக சமூக ஆர்வலர் சோனம் வாங்சுக் உண்ணாவிரதப் போராட்டத்தில் ஈடுபட்டு வந்தார்.\n\nஇந்த நிலையில் கடந்த இரண்டு நாட்களுக்கு முன்பு சோனம் வாங்சுக்கின் உடல் நிலை மோசமடைந்த நிலையில் டெல்லி போலீசார் அவரை வலுக்கட்டாயமாக மருத்துவமமைக்கு அழைத்துச் சென்றனர். இதற்கு பல்வேறு தரப்பினரும் கண்டனம் தெரிவித்து வந்தனர்.','பிரதமர்-இல்லம்-முன்பு-ராகுல்-காந்தி-ஆர்ப்பாட்டம்','deleted','','பிரதமர் இல்லம் முன்பு ராகுல் காந்தி ஆர்ப்பாட்டம்!','2026-07-23 02:00:00.189965',4,NULL,'',2,'',2,_binary '','60005',_binary '',5.01104854345604,_binary '',NULL,NULL,NULL,NULL,NULL),(180002,'Kings TV News Desk','https://kings-tv.onrender.com/article/பிரதமர்-இல்லம்-முன்பு-ராகுல்-காந்தி-ஆர்ப்பாட்டம்-1',1,'','<p class=\"wp-block-paragraph\">நீட் தேர்வு வினாத்தாள் கசிவு உள்ளிட்ட குளறுபடிக்கு பொறுபேற்று மத்திய கல்வி அமைச்சர் தர்மேந்திர பிரதான் பதவி விலக வேண்டும் என்று வலியுறுத்தி கரப்பான் பூச்சி ஜனதா கட்சியினர் டெல்லி ஜந்தர் மந்தரில் கடந்த ஜூன் மாதம் 20-ஆம் தேதி முதல் போராட்டத்தில் ஈடுபட்டு வருகின்றனர். இந்த போராட்டத்திற்கு ஆதரவாக சமூக ஆர்வலர் சோனம் வாங்சுக் உண்ணாவிரதப் போராட்டத்தில் ஈடுபட்டு வந்தார்.</p>\n<p class=\"wp-block-paragraph\">இந்த நிலையில் கடந்த இரண்டு நாட்களுக்கு முன்பு சோனம் வாங்சுக்கின் உடல் நிலை மோசமடைந்த நிலையில் டெல்லி போலீசார் அவரை வலுக்கட்டாயமாக மருத்துவமமைக்கு அழைத்துச் சென்றனர். இதற்கு பல்வேறு தரப்பினரும் கண்டனம் தெரிவித்து வந்தனர்.</p>\n<div class=\"code-block code-block-3\">&nbsp;</div>\n<p class=\"wp-block-paragraph\">இந்த நிலையில் நேற்று நாடாளுமன்ற மழைக்கால கூட்டத்தொடர் தொடங்கிய நிலையில் கரப்பான் பூச்சி கட்சியினர் நாடாளுமன்றம் நோக்கி பேரணியாக சென்றனர். அப்போது பேரணி சென்ற மாணவர்கள் மீது துணை ராணுவத்தினர் தடியடி மற்றும் கண்ணீர் புகை குண்டுகளை வீசி தாக்குதல் நடத்தினர். இதில் பலரும் காயமடைந்தனர். இதனைத் தொடர்ந்து சிஜேபி கட்சியினருக்கு ஆதரவாக நாடுமுழுவதும் பல்வேறு பகுதிகளில் மாணவர்கள் மற்றும் இளைஞர்கள் போராட்டத்தில் ஈடுபட்டனர்.</p>\n<p class=\"wp-block-paragraph\">இந்த நிலையில் இன்று மக்களைவை எதிர்க்கட்சித் தலைவர் ராகுல்காந்தி, பிரியங்கா காந்தி உள்ளிட்ட காங்கிரஸ் எம்.பிக்கள் டெல்லி பிரதமர் இல்லம் நோக்கி பேரணியாக சென்று சிஜேபி இளைஞர்களுக்கு ஆதரவாக போராட்டத்தில் ஈடுபட்டனர். அப்போது மாணவர்கள் மீது ராணுவத்தினர் அத்துமீறலில் ஈடுபட்டதற்கு பொறுப்பேற்று பிரதமர் மோடி மற்றும் உள்துறை அமைச்சர் அமித்ஷா ஆகியோர் பதவி விலக வேண்டும் என முழக்கங்கள் எழுப்பினர். அப்போது காங்கிரஸ் எம்.பிக்களிடம் போலீசார் பேச்சுவார்த்தையில் ஈடுபட்டனர். இதனால் அப்பகுதியில் சிறிய சலசலப்பு ஏற்பட்டது.</p>\n<p class=\"wp-block-paragraph\">இதுகுறித்து ராகுல்காந்தி வெளியிட்டுள்ள எக்ஸ் தளப் பதிவில் கூறியிருப்பதாவது, &ldquo;நேற்று இளம் மாணவர்கள் மீது நடத்தப்பட்ட வன்முறைச் செயல்கள் குறித்துப் பதிலளிக்கக் கோரி, நாங்கள் பிரதமர் மோடியின் இல்லத்தை நோக்கிப் பேரணியாகச் சென்றோம்.</p>\n<p class=\"wp-block-paragraph\">இவ்விவகாரத்தில் எந்தப் பொறுப்பையும் ஏற்கவோ அல்லது நாடாளுமன்றத்தில் இது குறித்து விவாதிக்கவோ அரசு விரும்பவில்லை.</p>\n<p class=\"wp-block-paragraph\">இந்திய இளைஞர்களின் எதிர்காலத்தை சீரழித்ததற்காக பிரதமரும், உள்துறை மந்திரியும் பதவி விலக வேண்டும்&rdquo; என்று அவர் தெரிவித்துள்ளா</p>',2,'/uploads/articles/2026/07/ee35fbad-0c21-49d6-a61d-a19b1a80c40a.webp','/uploads/articles/2026/07/ee35fbad-0c21-49d6-a61d-a19b1a80c40a.webp',NULL,NULL,'நீட் தேர்வு வினாத்தாள் கசிவு உள்ளிட்ட குளறுபடிக்கு பொறுபேற்று மத்திய கல்வி அமைச்சர் தர்மேந்திர பிரதான் பதவி விலக வேண்டும் என்று வலியுறுத்தி கரப்பான் பூச...','news, KINGS 24x7, Tamil news, பரதமர, இலலம, மனப, ரகல, கநத, ஆரபபடடம','பிரதமர் இல்லம் முன்பு ராகுல் காந்தி ஆர்ப்பாட்டம்! | KINGS 24x7','2026-07-21 19:51:07.642834','ready','','நீட் தேர்வு வினாத்தாள் கசிவு உள்ளிட்ட குளறுபடிக்கு பொறுபேற்று மத்திய கல்வி அமைச்சர் தர்மேந்திர பிரதான் பதவி விலக வேண்டும் என்று வலியுறுத்தி கரப்பான் பூச்சி ஜனதா கட்சியினர் டெல்லி ஜந்தர் மந்தரில் கடந்த ஜூன் மாதம் 20-ஆம் தேதி முதல் போராட்டத்தில் ஈடுபட்டு வருகின்றனர். இந்த போராட்டத்திற்கு ஆதரவாக சமூக ஆர்வலர் சோனம் வாங்சுக் உண்ணாவிரதப் போராட்டத்தில் ஈடுபட்டு வந்தார்.\n\nஇந்த நிலையில் கடந்த இரண்டு நாட்களுக்கு முன்பு சோனம் வாங்சுக்கின் உடல் நிலை மோசமடைந்த நிலையில் டெல்லி போலீசார் அவரை வலுக்கட்டாயமாக மருத்துவமமைக்கு அழைத்துச் சென்றனர். இதற்கு பல்வேறு தரப்பினரும் கண்டனம் தெரிவித்து வந்தனர்.','பிரதமர்-இல்லம்-முன்பு-ராகுல்-காந்தி-ஆர்ப்பாட்டம்-1','deleted','','பிரதமர் இல்லம் முன்பு ராகுல் காந்தி ஆர்ப்பாட்டம்!','2026-07-23 02:00:00.189965',1,NULL,'',NULL,'',2,_binary '','60005',_binary '',5.0027621358640095,_binary '',NULL,NULL,NULL,NULL,NULL),(210001,'Kings TV News Desk','https://kings-tv.onrender.com/article/new-metro-connectivity-line-to-open-tomorrow-in-chennai',60004,'','<p>&nbsp;</p>\n<p><img src=\"https://kings-tv.onrender.com/uploads/articles/2026/07/c760b23c-97ae-4bfa-b7f1-2b29223352b3.webp\"></p>\n<p>&nbsp;</p>\n<p>சென்னை: நகரின் தென் பகுதியை மத்திய பகுதியுடன் இணைக்கும் புதிய மெட்ரோ பாதையின் திறப்பு விழா நாளை காலை நடைபெறும் என அதிகாரிகள் தெரிவித்துள்ளனர். இந்த திட்டம் கடந்த மூன்று ஆண்டுகளாக கட்டுமான கட்டத்தில் இருந்தது.</p>\n<p>முதற்கட்டமாக ஐந்து நிலையங்கள் பொதுமக்கள் பயன்பாட்டிற்கு திறக்கப்படும் என்றும், எஞ்சிய நிலையங்கள் அடுத்த ஆண்டு தொடக்கத்தில் இயங்கத் தொடங்கும் என்றும் மெட்ரோ ரயில் நிறுவன அதிகாரி ஒருவர் தெரிவித்தார்.</p>\n<p>தினமும் சராசரியாக 45,000 பயணிகள் இந்த பாதையைப் பயன்படுத்துவார்கள் என எதிர்பார்க்கப்படுகிறது. இதன் மூலம் சாலைகளில் வாகன நெரிசல் கணிசமாகக் குறையும் என அரசு தெரிவித்துள்ளது.</p>\n<p>நிலையங்களில் CCTV கண்காணிப்பு, மின்தூக்கி வசதி, மற்றும் மாற்றுத்திறனாளிகளுக்கான சிறப்பு வசதிகள் ஏற்பாடு செய்யப்பட்டுள்ளன. திறப்பு விழாவில் மாநில முதலமைச்சர் கலந்துகொள்வார் என்று அறிவிக்கப்பட்டுள்ளது.</p>\n<p>Chennai Metro Rail Limited (CMRL) அதிகாரிகளின் கூற்றுப்படி, டிக்கெட் விலைகள் தூர அடிப்படையில் ₹10 முதல் ₹50 வரை இருக்கும்.</p>',30009,'','',NULL,NULL,'&nbsp; &nbsp; சென்னை: நகரின் தென் பகுதியை மத்திய பகுதியுடன் இணைக்கும் புதிய மெட்ரோ பாதையின் திறப்பு விழா நாளை காலை நடைபெறும் என அதிகாரிகள் தெரிவித்துள்ளனர்...','nbsp, 45000, cctv, chennai, metro, rail, limited, cmrl','New Metro Connectivity Line to Open Tomorrow in Chennai','2026-07-22 08:28:16.956790','ready','','நகர போக்குவரத்து நெரிசலைக் குறைக்கும் நோக்கில் புதிய மெட்ரோ பாதை நாளை பொதுமக்கள் பயன்பாட்டிற்கு திறக்கப்படுகிறது. முதல் கட்டமாக ஐந்து நிலையங்கள் இயங்கத் தொடங்கும்.','new-metro-connectivity-line-to-open-tomorrow-in-chennai','deleted','New Metro Connectivity Line to Open Tomorrow in Chennai','சென்னையில் புதிய மெட்ரோ இணைப்பு பாதை திறப்பு விழா நாளை ','2026-07-23 02:00:00.189965',2,NULL,'',NULL,'nbsp, 45000, cctv, chennai, metro, rail, limited, cmrl',1,_binary '','',_binary '\0',0.012074512308976935,_binary '',34,'',55,NULL,NULL),(210002,'Kings TV News Desk','https://kings-tv.onrender.com/article/செயற்கை-நுண்ணறிவு-என்றால்-என்ன',60004,'','<p>செயற்கை நுண்ணறிவு (Artificial Intelligence) என்பது மனித நுண்ணறிவைப் பின்பற்றி செயல்படும் கணினி அமைப்புகளை உருவாக்கும் தொழில்நுட்பமாகும். இது இயந்திரக் கற்றல் (Machine Learning), இயற்கை மொழி செயலாக்கம் (Natural Language Processing), மற்றும் கணினி பார்வை (Computer Vision) போன்ற பல துறைகளை உள்ளடக்கியது. இன்று மருத்துவம், கல்வி, வணிகம், போக்குவரத்து உள்ளிட்ட பல துறைகளில் AI பரவலாக பயன்படுத்தப்படுகிறது. சரியான முறையில் பயன்படுத்தப்படும் போது, AI மனிதர்களின் வேலைகளை எளிதாக்கி உற்பத்தித் திறனை அதிகரிக்கிறது.</p>',3,'/uploads/articles/2026/07/9e5f53e6-a780-49a3-8a79-4d99c61e37b8.webp','',NULL,NULL,'செயற்கை நுண்ணறிவு (AI) என்பது கணினிகள் மனிதர்களைப் போல சிந்தித்து, கற்று, முடிவெடுக்க உதவும் தொழில்நுட்பமாகும்.','assembly','செயற்கை நுண்ணறிவு என்றால் என்ன? | KINGS 24x7','2026-07-22 09:02:19.721501','ready','','செயற்கை நுண்ணறிவு (AI) என்பது கணினிகள் மனிதர்களைப் போல சிந்தித்து, கற்று, முடிவெடுக்க உதவும் தொழில்நுட்பமாகும்.','செயற்கை-நுண்ணறிவு-என்றால்-என்ன','published','','செயற்கை நுண்ணறிவு என்றால் என்ன?','2026-07-23 02:00:00.189965',1,NULL,'madurai south',NULL,'',1,_binary '','',_binary '\0',0.006547285010986551,_binary '',31,'',30,NULL,NULL),(210003,'Kings TV News Desk','https://kings-tv.onrender.com/article/new-metro-connectivity-line-to-open-tomorrow-in-chennai-1',NULL,'','<p>&nbsp;</p>\n<p><img src=\"https://kings-tv.onrender.com/uploads/articles/2026/07/c760b23c-97ae-4bfa-b7f1-2b29223352b3.webp\"></p>\n<p>&nbsp;</p>\n<p>சென்னை: நகரின் தென் பகுதியை மத்திய பகுதியுடன் இணைக்கும் புதிய மெட்ரோ பாதையின் திறப்பு விழா நாளை காலை நடைபெறும் என அதிகாரிகள் தெரிவித்துள்ளனர். இந்த திட்டம் கடந்த மூன்று ஆண்டுகளாக கட்டுமான கட்டத்தில் இருந்தது.</p>\n<p>முதற்கட்டமாக ஐந்து நிலையங்கள் பொதுமக்கள் பயன்பாட்டிற்கு திறக்கப்படும் என்றும், எஞ்சிய நிலையங்கள் அடுத்த ஆண்டு தொடக்கத்தில் இயங்கத் தொடங்கும் என்றும் மெட்ரோ ரயில் நிறுவன அதிகாரி ஒருவர் தெரிவித்தார்.</p>\n<p>தினமும் சராசரியாக 45,000 பயணிகள் இந்த பாதையைப் பயன்படுத்துவார்கள் என எதிர்பார்க்கப்படுகிறது. இதன் மூலம் சாலைகளில் வாகன நெரிசல் கணிசமாகக் குறையும் என அரசு தெரிவித்துள்ளது.</p>\n<p>நிலையங்களில் CCTV கண்காணிப்பு, மின்தூக்கி வசதி, மற்றும் மாற்றுத்திறனாளிகளுக்கான சிறப்பு வசதிகள் ஏற்பாடு செய்யப்பட்டுள்ளன. திறப்பு விழாவில் மாநில முதலமைச்சர் கலந்துகொள்வார் என்று அறிவிக்கப்பட்டுள்ளது.</p>\n<p>Chennai Metro Rail Limited (CMRL) அதிகாரிகளின் கூற்றுப்படி, டிக்கெட் விலைகள் தூர அடிப்படையில் ₹10 முதல் ₹50 வரை இருக்கும்.</p>',NULL,'','',NULL,NULL,'&nbsp; &nbsp; சென்னை: நகரின் தென் பகுதியை மத்திய பகுதியுடன் இணைக்கும் புதிய மெட்ரோ பாதையின் திறப்பு விழா நாளை காலை நடைபெறும் என அதிகாரிகள் தெரிவித்துள்ளனர்...','nbsp, 45000, cctv, chennai, metro, rail, limited, cmrl','New Metro Connectivity Line to Open Tomorrow in Chennai','2026-07-22 09:10:11.478482','ready','','நகர போக்குவரத்து நெரிசலைக் குறைக்கும் நோக்கில் புதிய மெட்ரோ பாதை நாளை பொதுமக்கள் பயன்பாட்டிற்கு திறக்கப்படுகிறது. முதல் கட்டமாக ஐந்து நிலையங்கள் இயங்கத் தொடங்கும்.','new-metro-connectivity-line-to-open-tomorrow-in-chennai-1','published','New Metro Connectivity Line to Open Tomorrow in Chennai','சென்னையில் புதிய மெட்ரோ இணைப்பு பாதை திறப்பு விழா நாளை ','2026-07-23 02:00:00.189965',1,NULL,'',NULL,'nbsp, 45000, cctv, chennai, metro, rail, limited, cmrl',1,_binary '','',_binary '\0',0.006547285010986551,_binary '',34,'',55,NULL,NULL),(210004,'Kings TV News Desk','https://kings-tv.onrender.com/article/ajith-kumar-a-journey-of-passion-and-success',60004,'<p>Ajith Kumar, popularly known as \"Thala\" by his fans, is a celebrated Indian actor who primarily works in the Tamil film industry. He began his acting career in the early 1990s and has delivered numerous blockbuster films over the years. Apart from acting, Ajith is passionate about motorsports and has participated in several national and international racing events. He is widely respected for his simplicity, professionalism, and charitable nature. His dedication to both cinema and personal interests has earned him a loyal fan base across the world, making him one of the most influential personalities in Tamil cinema.</p>','<p>செயற்கை நுண்ணறிவு (Artificial Intelligence) என்பது மனித நுண்ணறிவைப் பின்பற்றி செயல்படும் கணினி அமைப்புகளை உருவாக்கும் தொழில்நுட்பமாகும். இது இயந்திரக் கற்றல் (Machine Learning), இயற்கை மொழி செயலாக்கம் (Natural Language Processing), மற்றும் கணினி பார்வை (Computer Vision) போன்ற பல துறைகளை உள்ளடக்கியது. இன்று மருத்துவம், கல்வி, வணிகம், போக்குவரத்து உள்ளிட்ட பல துறைகளில் AI பரவலாக பயன்படுத்தப்படுகிறது. சரியான முறையில் பயன்படுத்தப்படும் போது, AI மனிதர்களின் வேலைகளை எளிதாக்கி உற்பத்தித் திறனை அதிகரிக்கிறது.</p>',30010,'','',NULL,NULL,'செயற்கை நுண்ணறிவு (Artificial Intelligence) என்பது மனித நுண்ணறிவைப் பின்பற்றி செயல்படும் கணினி அமைப்புகளை உருவாக்கும் தொழில்நுட்பமாகும். இது இயந்திரக்...','artificial, intelligence, machine, learning, natural, language, processing, computer','Ajith Kumar – A Journey of Passion and Success','2026-07-22 09:26:32.716299','ready','Ajith Kumar is one of the most admired actors in Tamil cinema, known for his dedication, humility, and inspiring journey from a racing enthusiast to a leading film star.','செயற்கை நுண்ணறிவு (AI) என்பது கணினிகள் மனிதர்களைப் போல சிந்தித்து, கற்று, முடிவெடுக்க உதவும் தொழில்நுட்பமாகும்.','ajith-kumar-a-journey-of-passion-and-success','deleted','Ajith Kumar – A Journey of Passion and Success','செயற்கை நுண்ணறிவு என்றால் என்ன?','2026-07-22 09:26:44.674674',0,NULL,'chennai south',NULL,'artificial, intelligence, machine, learning, natural, language, processing, computer',1,_binary '\0','',_binary '\0',0,_binary '',31,'',55,NULL,NULL),(210005,'Kings TV News Desk','https://kings-tv.onrender.com/article/vij',2,'','<p>ஜேசன் சஞ்சய்யின் சிக்மா படம், விஜய்யின் ஜனநாயகன் படம் வெளியாகும் காலகட்டத்தில், இந்த குடும்பம் மீண்டும் ஒன்றாக இணையும். சங்கீதா நீதிமன்றம் சென்றது தற்காலிகமான ஒரு மன ஆற்றாமை மற்றும் கோபத்தினால் மட்டுமே தவிர, பிரியும் விருப்பம் 2 பேருக்குமே கிடையாது. பிள்ளைகளின் முயற்சியால் விரைவில் அம்மாவும் அப்பாவும் பேசி ஒன்று சேர்வார்கள்\" என்று மூத்த பத்திரிகையாளர் சேகுவேரா நம்பிக்கை தெரிவித்துள்ளார்.</p>',30009,'','',NULL,NULL,'ஜேசன் சஞ்சய்யின் சிக்மா படம், விஜய்யின் ஜனநாயகன் படம் வெளியாகும் காலகட்டத்தில், இந்த குடும்பம் மீண்டும் ஒன்றாக இணையும். சங்கீதா நீதிமன்றம் சென்றது தற்காலிக...','news, KINGS 24x7, Tamil news, vij','vij','2026-07-22 09:35:46.697463','ready','','ஜேசன் சஞ்சய்யின் சிக்மா படம், விஜய்யின் ஜனநாயகன் படம் வெளியாகும் காலகட்டத்தில், இந்த குடும்பம் மீண்டும் ஒன்றாக இணையும். சங்கீதா நீதிமன்றம் சென்றது தற்காலிகமான ஒரு மன ஆற்றாமை மற்றும் கோபத்தினால் மட்டுமே தவிர, பிரியும் விருப்பம் 2 பேருக்குமே கிடையாது. பிள்ளைகளின் முயற்சியால் விரைவில் அம்மாவும் அப்பாவும் பேசி ஒன்று சேர்வார்கள்\" என்று மூத்த பத்திரிகையாளர் சேகுவேரா நம்பிக்கை தெரிவித்துள்ளார்.','vij','draft','','vij','2026-07-22 09:35:46.697464',0,NULL,'',6,'',1,_binary '\0','60005',_binary '',0,_binary '',35,'ashwi',45,NULL,NULL),(210006,'Kings TV News Desk','https://kings-tv.onrender.com/article/vij-1',2,'','<p>ஜேசன் சஞ்சய்யின் சிக்மா படம், விஜய்யின் ஜனநாயகன் படம் வெளியாகும் காலகட்டத்தில், இந்த குடும்பம் மீண்டும் ஒன்றாக இணையும். சங்கீதா நீதிமன்றம் சென்றது தற்காலிகமான ஒரு மன ஆற்றாமை மற்றும் கோபத்தினால் மட்டுமே தவிர, பிரியும் விருப்பம் 2 பேருக்குமே கிடையாது. பிள்ளைகளின் முயற்சியால் விரைவில் அம்மாவும் அப்பாவும் பேசி ஒன்று சேர்வார்கள்\" என்று மூத்த பத்திரிகையாளர் சேகுவேரா நம்பிக்கை தெரிவித்துள்ளார்.</p>',30009,'','',NULL,NULL,'ஜேசன் சஞ்சய்யின் சிக்மா படம், விஜய்யின் ஜனநாயகன் படம் வெளியாகும் காலகட்டத்தில், இந்த குடும்பம் மீண்டும் ஒன்றாக இணையும். சங்கீதா நீதிமன்றம் சென்றது தற்காலிக...','news, KINGS 24x7, Tamil news, vij','vij','2026-07-22 09:35:48.670905','ready','','ஜேசன் சஞ்சய்யின் சிக்மா படம், விஜய்யின் ஜனநாயகன் படம் வெளியாகும் காலகட்டத்தில், இந்த குடும்பம் மீண்டும் ஒன்றாக இணையும். சங்கீதா நீதிமன்றம் சென்றது தற்காலிகமான ஒரு மன ஆற்றாமை மற்றும் கோபத்தினால் மட்டுமே தவிர, பிரியும் விருப்பம் 2 பேருக்குமே கிடையாது. பிள்ளைகளின் முயற்சியால் விரைவில் அம்மாவும் அப்பாவும் பேசி ஒன்று சேர்வார்கள்\" என்று மூத்த பத்திரிகையாளர் சேகுவேரா நம்பிக்கை தெரிவித்துள்ளார்.','vij-1','pending','','vij','2026-07-22 09:35:48.670906',0,NULL,'',6,'',1,_binary '\0','60005',_binary '',0,_binary '',35,'ashwi',45,NULL,NULL),(210007,'Kings TV News Desk','https://kings-tv.onrender.com/article/sonam-wangchuk-strikes-continues-day-22',60004,NULL,'',NULL,NULL,NULL,NULL,NULL,'','news, KINGS 24x7, Tamil news, 22வத, நளக, தடரம, சனம, வஙசககன, உணணவரதப, பரடடம','22வது நாளாக தொடரும் சோனம் வாங்சுக்கின் உண்ணாவிரதப் போராட்டம் | KINGS 24x7','2026-07-22 09:40:12.491316','ready',NULL,NULL,'sonam-wangchuk-strikes-continues-day-22','published','sonam wangchuk strikes continues day 22','22வது நாளாக தொடரும் சோனம் வாங்சுக்கின் உண்ணாவிரதப் போராட்டம்','2026-07-22 09:40:13.343668',0,NULL,NULL,NULL,NULL,1,_binary '',NULL,_binary '\0',0,_binary '',NULL,NULL,NULL,NULL,NULL),(210008,'Kings TV News Desk','https://kings-tv.onrender.com/article/sonam-wangchuk-strikes-continues-day-22-1',60004,NULL,'',NULL,NULL,NULL,NULL,NULL,'','news, KINGS 24x7, Tamil news, 22வத, நளக, தடரம, சனம, வஙசககன, உணணவரதப, பரடடம','22வது நாளாக தொடரும் சோனம் வாங்சுக்கின் உண்ணாவிரதப் போராட்டம் | KINGS 24x7','2026-07-22 09:41:28.562531','ready',NULL,NULL,'sonam-wangchuk-strikes-continues-day-22-1','published','sonam wangchuk strikes continues day 22','22வது நாளாக தொடரும் சோனம் வாங்சுக்கின் உண்ணாவிரதப் போராட்டம்','2026-07-22 09:41:29.390576',0,NULL,NULL,NULL,NULL,1,_binary '',NULL,_binary '\0',0,_binary '',NULL,NULL,NULL,NULL,NULL),(240001,'Kings TV News Desk','https://kings-tv.onrender.com/article/d-2',1,'','<p><img src=\"https://kings-tv.onrender.com/uploads/articles/article_1784459441920_880.jpg\"></p>',1,'/uploads/articles/2026/07/41327b4f-b1e4-4225-8b17-2a71e1e71850.webp','/uploads/articles/2026/07/41327b4f-b1e4-4225-8b17-2a71e1e71850.webp',NULL,NULL,'செய்தித்தாளில் வெளியான ஒரு பொருள்; கட்டுரை\nஅறி. ஆய்வுரை\nசுட்டிடைச் சொல் (இ); சுட்டு; சார்படை\nஎண்ணத்தக்க பொருள், பண்டம், இனம், உருப்படி, சரக்கு, விவரம், ...','#trending news','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...    | KINGS 24x7','2026-07-22 13:07:56.851759','ready','','செய்தித்தாளில் வெளியான ஒரு பொருள்; கட்டுரை\nஅறி. ஆய்வுரை\nசுட்டிடைச் சொல் (இ); சுட்டு; சார்படை\nஎண்ணத்தக்க பொருள், பண்டம், இனம், உருப்படி, சரக்கு, விவரம், சட்டம் உடன்படிக்கை முதலியவற்றின் வாசகம், விதி, ஒழுங்கு, பிரிவுக்கூறு, உறுப்பு, மூடப்பட்ட பகுதி, வேளை, இணைப்பு, கட்டுரை,\n(வினை.) கூறுகளாகப் பிரித்துக்காட்டு, குற்றம் சாட்டு, பணிபயில் ஒப்பந்த விதிகளினால் பிணைப்படுத்து, நிபந்தனைகூறு','d-2','draft','dhanush news','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...   ','2026-07-22 19:00:00.759281',0,NULL,'annanagar',1,'',1,_binary '\0',NULL,_binary '\0',5,_binary '',NULL,NULL,25,NULL,NULL),(240002,'Kings TV News Desk','https://kings-tv.onrender.com/article/d-3',1,'','<p><img src=\"https://kings-tv.onrender.com/uploads/articles/article_1784459441920_880.jpg\"></p>',1,'/uploads/articles/2026/07/41327b4f-b1e4-4225-8b17-2a71e1e71850.webp','/uploads/articles/2026/07/41327b4f-b1e4-4225-8b17-2a71e1e71850.webp',NULL,NULL,'செய்தித்தாளில் வெளியான ஒரு பொருள்; கட்டுரை\nஅறி. ஆய்வுரை\nசுட்டிடைச் சொல் (இ); சுட்டு; சார்படை\nஎண்ணத்தக்க பொருள், பண்டம், இனம், உருப்படி, சரக்கு, விவரம், ...','news, KINGS 24x7, Tamil news, ஒர, நடகரக, இத, எனத, மனறவத, தசய, வரத, ஒர, இயககனரக, எனத, மதல, தசய, வரத, தனஷ,','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...    | KINGS 24x7','2026-07-22 13:08:20.402237','ready','','செய்தித்தாளில் வெளியான ஒரு பொருள்; கட்டுரை\nஅறி. ஆய்வுரை\nசுட்டிடைச் சொல் (இ); சுட்டு; சார்படை\nஎண்ணத்தக்க பொருள், பண்டம், இனம், உருப்படி, சரக்கு, விவரம், சட்டம் உடன்படிக்கை முதலியவற்றின் வாசகம், விதி, ஒழுங்கு, பிரிவுக்கூறு, உறுப்பு, மூடப்பட்ட பகுதி, வேளை, இணைப்பு, கட்டுரை,\n(வினை.) கூறுகளாகப் பிரித்துக்காட்டு, குற்றம் சாட்டு, பணிபயில் ஒப்பந்த விதிகளினால் பிணைப்படுத்து, நிபந்தனைகூறு','d-3','published','dhanush news','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...   ','2026-07-23 02:00:00.189965',4,NULL,'annanagar',NULL,'',1,_binary '',NULL,_binary '\0',5.038180177416061,_binary '',NULL,NULL,25,NULL,NULL),(240003,'Kings TV News Desk','https://kings-tv.onrender.com/article/செந்தில்-பாலாஜி-மற்றும்-அசோக்-குமாரின்-மனுக்களை',60007,'','',NULL,'','',NULL,NULL,'செந்தில் பாலாஜி மற்றும் அசோக் குமாரின் மனுக்களை','news, KINGS 24x7, Tamil news, சநதல, பலஜ, மறறம, அசக, கமரன, மனககள','செந்தில் பாலாஜி மற்றும் அசோக் குமாரின் மனுக்களை','2026-07-22 13:09:16.120058','ready','','உண்மை செய்திகள் உடனுக்குடன். தமிழகம், இந்தியா, உலகம் வர்த்தகம், விளையாட்டு, சினிமா, ஆன்மிகம் போன்ற அனைத்து செய்திகளை','செந்தில்-பாலாஜி-மற்றும்-அசோக்-குமாரின்-மனுக்களை','pending','','செந்தில் பாலாஜி மற்றும் அசோக் குமாரின் மனுக்களை','2026-07-22 13:09:16.120066',0,NULL,'',NULL,'',1,_binary '\0','60005',_binary '\0',0,_binary '',NULL,'Mobile Journalist',30,NULL,NULL),(240004,'Kings TV News Desk','https://kings-tv.onrender.com/article/d-4',1,'','<p><img src=\"https://kings-tv.onrender.com/uploads/articles/article_1784459441920_880.jpg\"></p>',1,'/uploads/articles/2026/07/41327b4f-b1e4-4225-8b17-2a71e1e71850.webp','/uploads/articles/2026/07/41327b4f-b1e4-4225-8b17-2a71e1e71850.webp',NULL,NULL,'செய்தித்தாளில் வெளியான ஒரு பொருள்; கட்டுரை\nஅறி. ஆய்வுரை\nசுட்டிடைச் சொல் (இ); சுட்டு; சார்படை\nஎண்ணத்தக்க பொருள், பண்டம், இனம், உருப்படி, சரக்கு, விவரம், ...','news, KINGS 24x7, Tamil news, ஒர, நடகரக, இத, எனத, மனறவத, தசய, வரத, ஒர, இயககனரக, எனத, மதல, தசய, வரத, தனஷ,','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...    | KINGS 24x7','2026-07-22 13:10:05.047455','ready','testing','செய்தித்தாளில் வெளியான ஒரு பொருள்; கட்டுரை\nஅறி. ஆய்வுரை\nசுட்டிடைச் சொல் (இ); சுட்டு; சார்படை\nஎண்ணத்தக்க பொருள், பண்டம், இனம், உருப்படி, சரக்கு, விவரம், சட்டம் உடன்படிக்கை முதலியவற்றின் வாசகம், விதி, ஒழுங்கு, பிரிவுக்கூறு, உறுப்பு, மூடப்பட்ட பகுதி, வேளை, இணைப்பு, கட்டுரை,\n(வினை.) கூறுகளாகப் பிரித்துக்காட்டு, குற்றம் சாட்டு, பணிபயில் ஒப்பந்த விதிகளினால் பிணைப்படுத்து, நிபந்தனைகூறு','d-4','draft','articles','ஒரு நடிகராக இது எனது மூன்றாவது தேசிய விருது, ஒரு இயக்குனராக எனது முதல் தேசிய விருது!\" - தனுஷ்!...   ','2026-07-22 19:00:00.759281',0,NULL,'annanagar',1,'',1,_binary '\0',NULL,_binary '\0',5,_binary '',NULL,NULL,25,NULL,NULL);
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `audit_id` bigint NOT NULL AUTO_INCREMENT,
  `action_type` varchar(50) NOT NULL,
  `actor_email` varchar(100) DEFAULT NULL,
  `actor_id` bigint DEFAULT NULL,
  `actor_role` varchar(50) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `entity_id` bigint DEFAULT NULL,
  `entity_type` varchar(100) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL,
  PRIMARY KEY (`audit_id`) /*T![clustered_index] CLUSTERED */,
  KEY `idx_audit_actor` (`actor_id`),
  KEY `idx_audit_action` (`action_type`),
  KEY `idx_audit_entity` (`entity_type`),
  KEY `idx_audit_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=1200001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.243','2026-07-17 20:28:45.651103'),(2,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.186','2026-07-17 20:31:31.956185'),(3,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.186','2026-07-17 20:32:48.854403'),(4,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.206','2026-07-17 20:38:19.352738'),(5,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.187','2026-07-17 20:39:34.347110'),(6,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.102','2026-07-17 20:39:36.069085'),(7,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.102','2026-07-17 20:39:37.964692'),(8,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.187','2026-07-17 20:39:39.317118'),(30001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.46','2026-07-17 20:45:05.557849'),(60001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-18 02:59:58.244946'),(90001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.206','2026-07-18 03:08:55.985992'),(90002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-18 03:10:35.833794'),(120001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.217','2026-07-18 03:51:25.431581'),(120002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.217','2026-07-18 03:54:19.571738'),(150001,'LOGIN','editor@king24x7.com',2,'CHIEF_EDITOR','Logged in successfully via LOCAL credentials',2,'USER','172.69.131.206','2026-07-18 04:53:46.341839'),(180001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.206','2026-07-18 05:03:31.041646'),(210001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','104.23.160.139','2026-07-18 05:29:00.175868'),(210002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-18 05:39:47.091401'),(210003,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-18 05:41:42.637663'),(240001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.243','2026-07-18 06:38:25.962182'),(240002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.169','2026-07-18 06:41:10.029655'),(240003,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','104.23.160.80','2026-07-18 06:53:57.854724'),(240004,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.218','2026-07-18 07:19:47.796443'),(240005,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.242','2026-07-18 07:19:55.149106'),(240006,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.217','2026-07-18 07:20:14.497238'),(270001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.206','2026-07-18 07:33:09.689408'),(300001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.103','2026-07-18 08:21:42.107164'),(300002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.206','2026-07-18 08:21:49.185311'),(330001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-18 08:36:27.789946'),(330002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-18 08:38:16.376070'),(330003,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-18 08:38:31.976537'),(330004,'CREATE','admin@king24x7.com',1,'SUPER_ADMIN','Created user: thesharmitha17@gmail.com with role: MOBILE_JOURNALIST',30001,'User',NULL,'2026-07-18 08:42:17.244700'),(330005,'ASSIGN_DISTRICTS','admin@king24x7.com',1,'SUPER_ADMIN','Assigned 1 districts',30001,'User',NULL,'2026-07-18 08:42:21.150167'),(330006,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','Updated user: thesharmitha17@gmail.com',30001,'User',NULL,'2026-07-18 08:43:06.975838'),(330007,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','Updated user: thesharmitha17@gmail.com',30001,'User',NULL,'2026-07-18 08:43:11.001256'),(330008,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','Updated user: thesharmitha17@gmail.com',30001,'User',NULL,'2026-07-18 08:45:12.505766'),(330009,'DELETE','admin@king24x7.com',1,'SUPER_ADMIN','Deleted user: thesharmitha17@gmail.com',30001,'User',NULL,'2026-07-18 08:45:25.750510'),(330010,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.115','2026-07-18 08:51:47.731029'),(330011,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.243','2026-07-18 08:56:45.809218'),(330012,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.47','2026-07-18 09:00:10.747222'),(330013,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.187','2026-07-18 09:35:47.201951'),(330014,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-18 09:37:38.249706'),(330015,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-18 09:38:35.765470'),(330016,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','104.23.160.65','2026-07-18 09:40:33.274399'),(330017,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','104.23.160.196','2026-07-18 09:46:25.064441'),(360001,'CREATE','admin@king24x7.com',1,'SUPER_ADMIN','Added profanity term: worst',30001,'ProfanityWord',NULL,'2026-07-18 10:02:06.882355'),(390001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-18 10:28:48.981968'),(420001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.243','2026-07-18 20:33:51.372820'),(450001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.169','2026-07-19 07:30:05.510433'),(480001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.206','2026-07-19 10:01:19.716096'),(510001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.70.218.245','2026-07-19 11:04:28.778091'),(510002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.168','2026-07-19 11:24:04.739899'),(540001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.103','2026-07-19 16:47:58.988499'),(570001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.115','2026-07-20 04:32:26.251052'),(570002,'LOGIN','editor@king24x7.com',2,'CHIEF_EDITOR','Logged in successfully via LOCAL credentials',2,'USER','172.68.175.53','2026-07-20 04:35:01.986361'),(570003,'LOGIN','editor@king24x7.com',2,'CHIEF_EDITOR','Logged in successfully via LOCAL credentials',2,'USER','172.68.174.102','2026-07-20 04:35:16.684089'),(570004,'LOGIN','user@king24x7.com',6,'READER','Logged in successfully via LOCAL credentials',6,'USER','172.68.174.169','2026-07-20 04:39:31.511347'),(600001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.218','2026-07-20 04:47:08.444698'),(600002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.218','2026-07-20 04:47:14.091454'),(600003,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.71.198.4','2026-07-20 04:47:41.875258'),(600004,'LOGIN','editor@king24x7.com',2,'CHIEF_EDITOR','Logged in successfully via LOCAL credentials',2,'USER','104.23.160.197','2026-07-20 04:49:26.444944'),(600005,'LOGIN','editor@king24x7.com',2,'CHIEF_EDITOR','Logged in successfully via LOCAL credentials',2,'USER','172.68.174.46','2026-07-20 04:50:16.289874'),(600006,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.175.54','2026-07-20 04:51:05.348496'),(600007,'LOGIN','user@king24x7.com',6,'READER','Logged in successfully via LOCAL credentials',6,'USER','172.68.174.243','2026-07-20 04:51:55.040496'),(630001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.175.67','2026-07-20 05:06:21.675881'),(630002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.175.53','2026-07-20 05:10:34.357555'),(660001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.218','2026-07-20 06:56:15.031616'),(690001,'LOGIN','district@king24x7.com',3,'DISTRICT_ADMIN','Logged in successfully via LOCAL credentials',3,'USER','172.69.131.205','2026-07-20 08:16:34.455202'),(690002,'LOGIN','district@king24x7.com',3,'DISTRICT_ADMIN','Logged in successfully via LOCAL credentials',3,'USER','172.68.175.77','2026-07-20 08:17:08.211046'),(720001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.78','2026-07-20 11:44:13.264637'),(720002,'LOGIN','editor@king24x7.com',2,'CHIEF_EDITOR','Logged in successfully via LOCAL credentials',2,'USER','172.68.174.102','2026-07-20 11:44:13.450970'),(750001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.186','2026-07-20 13:12:41.295186'),(780001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.206','2026-07-20 13:50:28.086810'),(810001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.47','2026-07-21 05:06:01.327539'),(840001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.115','2026-07-21 07:11:59.954211'),(840002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.235.162','2026-07-21 07:12:31.061374'),(870001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-21 07:59:04.966930'),(900001,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',2,'SystemConfig','157.51.120.176','2026-07-21 08:39:38.101456'),(900002,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',1,'SystemConfig','157.51.120.176','2026-07-21 08:39:38.101456'),(930001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.47','2026-07-21 08:58:37.408336'),(930002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.115','2026-07-21 09:29:21.944670'),(930003,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:30:46.765903'),(930004,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:32:19.131636'),(930005,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:37:17.251714'),(930006,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-21 09:46:09.780338'),(930007,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',1,'SystemConfig','42.111.149.27','2026-07-21 09:56:19.099883'),(930008,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',2,'SystemConfig','42.111.149.27','2026-07-21 09:56:19.242179'),(930009,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',30006,'SystemConfig','42.111.149.27','2026-07-21 09:56:19.353532'),(930010,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:56:19.800421'),(930011,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:56:20.152040'),(930012,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:56:20.344242'),(930013,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:56:20.905807'),(930014,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:56:21.979963'),(930015,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',2,'SystemConfig','42.111.149.27','2026-07-21 09:56:51.277589'),(930016,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',1,'SystemConfig','42.111.149.27','2026-07-21 09:56:51.457381'),(930017,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',1,'SystemConfig','42.111.149.27','2026-07-21 09:58:33.853689'),(930018,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',2,'SystemConfig','42.111.149.27','2026-07-21 09:58:33.963263'),(930019,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setConfigValue - UPDATE SystemConfig',30006,'SystemConfig','42.111.149.27','2026-07-21 09:58:34.210721'),(930020,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:58:34.861996'),(930021,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:58:35.024649'),(930022,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:58:35.077046'),(930023,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:58:35.772587'),(930024,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','42.111.149.27','2026-07-21 09:58:36.027633'),(960001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','0:0:0:0:0:0:0:1','2026-07-21 18:52:50.425090'),(960002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-21 13:42:11.622461'),(960003,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-21 14:42:19.450673'),(960004,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-21 15:06:07.066292'),(960005,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.243','2026-07-21 15:06:58.910348'),(960006,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','104.23.160.154','2026-07-21 17:11:33.831261'),(960007,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.205','2026-07-21 17:11:35.907607'),(960008,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.175.53','2026-07-21 17:16:39.921964'),(990001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-21 18:42:35.557195'),(1020001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.218','2026-07-21 20:44:24.204121'),(1050001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.217','2026-07-22 03:42:58.831469'),(1080001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.169','2026-07-22 05:06:30.297212'),(1080002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.46','2026-07-22 05:06:59.466509'),(1080003,'LOGIN','user@king24x7.com',6,'READER','Logged in successfully via LOCAL credentials',6,'USER','172.68.174.46','2026-07-22 05:20:18.903556'),(1080004,'LOGIN','reporter@king24x7.com',4,'MOBILE_JOURNALIST','Logged in successfully via LOCAL credentials',4,'USER','172.68.174.221','2026-07-22 05:20:59.260941'),(1110001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.243','2026-07-22 06:41:53.401862'),(1110002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.243','2026-07-22 06:46:52.680255'),(1110003,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.103','2026-07-22 07:44:07.761773'),(1110004,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.187','2026-07-22 07:55:44.566934'),(1140001,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.47','2026-07-22 08:51:19.456572'),(1140002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.129.218','2026-07-22 08:55:06.577989'),(1140003,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.187','2026-07-22 09:16:41.964639'),(1140004,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.47','2026-07-22 09:18:01.541225'),(1140005,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','Updated user: user@king24x7.com',6,'User',NULL,'2026-07-22 09:47:30.008500'),(1140006,'ASSIGN_DISTRICTS','admin@king24x7.com',1,'SUPER_ADMIN','Assigned 1 districts',6,'User',NULL,'2026-07-22 09:47:33.753554'),(1140007,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','Updated user: user@king24x7.com',6,'User',NULL,'2026-07-22 09:47:36.112471'),(1140008,'ASSIGN_DISTRICTS','admin@king24x7.com',1,'SUPER_ADMIN','Assigned 1 districts',6,'User',NULL,'2026-07-22 09:47:40.280576'),(1140009,'CREATE','admin@king24x7.com',1,'SUPER_ADMIN','Created user: join@example.com with role: READER',60001,'User',NULL,'2026-07-22 09:49:08.259797'),(1140010,'ASSIGN_DISTRICTS','admin@king24x7.com',1,'SUPER_ADMIN','Assigned 1 districts',60001,'User',NULL,'2026-07-22 09:49:12.528466'),(1140011,'UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','Updated user: join@example.com',60001,'User',NULL,'2026-07-22 09:50:02.695754'),(1170001,'LOGIN','vishalav@gmail.com',60002,'READER','Logged in successfully via LOCAL credentials',60002,'USER','0:0:0:0:0:0:0:1','2026-07-22 17:33:44.341372'),(1170002,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.115','2026-07-22 12:19:56.988916'),(1170003,'LOGIN','vishalav@gmail.com',60002,'READER','Logged in successfully via LOCAL credentials',60002,'USER','0:0:0:0:0:0:0:1','2026-07-22 18:20:34.054152'),(1170004,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.68.174.114','2026-07-22 12:52:18.399612'),(1170005,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','106.192.73.95','2026-07-22 14:03:32.743061'),(1170006,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','106.192.73.95','2026-07-22 14:03:53.949530'),(1170007,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','172.69.131.206','2026-07-22 14:12:56.800823'),(1170008,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','106.192.73.95','2026-07-22 14:13:45.748077'),(1170009,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','106.192.73.95','2026-07-22 14:13:58.466691'),(1170010,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','106.192.73.95','2026-07-22 14:14:10.512422'),(1170011,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','106.192.73.95','2026-07-22 14:14:25.858304'),(1170012,'CREATE','admin@king24x7.com',1,'SUPER_ADMIN','Added profanity term: trigger',60001,'ProfanityWord',NULL,'2026-07-22 14:15:57.013941'),(1170013,'LOGIN','admin@king24x7.com',1,'SUPER_ADMIN','Logged in successfully via LOCAL credentials',1,'USER','162.158.54.186','2026-07-22 14:49:17.456277'),(1170014,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','157.51.100.179','2026-07-22 18:57:14.139171'),(1170015,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','157.51.100.179','2026-07-22 19:14:54.270304'),(1170016,'BULK_UPDATE','admin@king24x7.com',1,'SUPER_ADMIN','SystemConfigService.setMultipleConfigs - BULK_UPDATE SystemConfig',NULL,'SystemConfig','157.51.100.179','2026-07-22 19:15:05.993893'),(1170017,'LOGIN','vishalav@gmail.com',60002,'READER','Logged in successfully via LOCAL credentials',60002,'USER','0:0:0:0:0:0:0:1','2026-07-23 01:01:40.976952');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `breaking_news`
--

DROP TABLE IF EXISTS `breaking_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `breaking_news` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `breaking` bit(1) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `district_id` bigint DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subcategory_id` bigint DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_ta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `breaking_news`
--

LOCK TABLES `breaking_news` WRITE;
/*!40000 ALTER TABLE `breaking_news` DISABLE KEYS */;
/*!40000 ALTER TABLE `breaking_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_favorites`
--

DROP TABLE IF EXISTS `business_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `listing_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UKegpqtwgb5m6wdgyr5ym69c9a5` (`user_id`,`listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_favorites`
--

LOCK TABLES `business_favorites` WRITE;
/*!40000 ALTER TABLE `business_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_gallery`
--

DROP TABLE IF EXISTS `business_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_gallery` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `listing_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_gallery`
--

LOCK TABLES `business_gallery` WRITE;
/*!40000 ALTER TABLE `business_gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_reviews`
--

DROP TABLE IF EXISTS `business_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `listing_id` bigint NOT NULL,
  `rating` int NOT NULL,
  `reviewer_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_reviews`
--

LOCK TABLES `business_reviews` WRITE;
/*!40000 ALTER TABLE `business_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_profiles`
--

DROP TABLE IF EXISTS `candidate_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `education` text DEFAULT NULL,
  `expected_salary` double DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `headline` varchar(255) DEFAULT NULL,
  `preferred_location` varchar(255) DEFAULT NULL,
  `profile_completion` int DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_profiles`
--

LOCK TABLES `candidate_profiles` WRITE;
/*!40000 ALTER TABLE `candidate_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `display_order` int DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_nav` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `name_ta` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_t8o6pivur7nn124jehx7cygw5` (`name`),
  UNIQUE KEY `UK_oul14ho7bctbefv8jywp5v3i2` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,1,'fas fa-newspaper',_binary '',_binary '','Politics','அரசியல்','politics',NULL),(2,2,'fas fa-briefcase',_binary '',_binary '','Business','வணிகம்','business',NULL),(3,3,'fas fa-trophy',_binary '',_binary '','Sports','விளையாட்டு','sports',NULL),(4,4,'fas fa-film',_binary '',_binary '','Cinema','சினிமா','cinema',NULL),(5,5,'fas fa-laptop',_binary '',_binary '','Technology','தொழில்நுட்பம்','tech',NULL),(6,6,'fas fa-globe',_binary '',_binary '','International','சர்வதேசம்','international',NULL),(60004,7,'fas fa-map-marker-alt',_binary '',_binary '','Tamil Nadu','தமிழ்நாடு','tamilnadu',NULL),(60005,8,'fas fa-flag',_binary '',_binary '','India','இந்தியா','india',NULL),(60006,9,'fas fa-heartbeat',_binary '',_binary '','Lifestyle & Health','வாழ்க்கை முறை','lifestyle',NULL),(60007,10,'fas fa-gavel',_binary '',_binary '','Crime & Law','குற்றம்','crime',NULL),(60008,11,'fas fa-graduation-cap',_binary '',_binary '','Education & Jobs','கல்வி மற்றும் வேலைவாய்ப்பு','education',NULL),(60009,12,'fas fa-seedling',_binary '',_binary '','Agriculture','விவசாயம்','agriculture',NULL),(90001,5,'',_binary '',_binary '','Status','நிலைமை','Status','#3B82F6');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_categories`
--

DROP TABLE IF EXISTS `classified_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active_ad_count` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `icon_class` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_qkqciuc7vjptsywtigepl3aa2` (`name`),
  UNIQUE KEY `UK_kpoex0f6lfdtysji3ghd867yc` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_categories`
--

LOCK TABLES `classified_categories` WRITE;
/*!40000 ALTER TABLE `classified_categories` DISABLE KEYS */;
INSERT INTO `classified_categories` VALUES (1,12458,'2026-07-17 20:14:16.231071','fa-car','Vehicles','vehicles'),(2,8923,'2026-07-17 20:14:18.288848','fa-home','Property','property'),(3,15267,'2026-07-17 20:14:20.332910','fa-mobile-alt','Mobiles & Tablets','mobiles-tablets'),(4,6482,'2026-07-17 20:14:22.379815','fa-laptop','Electronics','electronics'),(5,7351,'2026-07-17 20:14:24.480928','fa-couch','Home & Furniture','home-furniture'),(6,5632,'2026-07-17 20:14:26.526641','fa-tshirt','Fashion & Lifestyle','fashion-lifestyle'),(7,9845,'2026-07-17 20:14:27.882620','fa-tools','Services','services'),(8,2341,'2026-07-17 20:14:29.241040','fa-briefcase','Jobs','jobs'),(9,1254,'2026-07-17 20:14:29.919731','fa-paw','Pets & Animals','pets-animals'),(10,3278,'2026-07-17 20:14:30.597383','fa-book','Books & Education','books-education'),(11,1987,'2026-07-17 20:14:31.275861','fa-tractor','Agriculture','agriculture'),(12,2156,'2026-07-17 20:14:31.961606','fa-industry','Business & Industrial','business-industrial'),(13,2315,'2026-07-17 20:14:32.639211','fa-running','Hobbies & Sports','hobbies-sports');
/*!40000 ALTER TABLE `classified_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_favourites`
--

DROP TABLE IF EXISTS `classified_favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_favourites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `classified_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_favourites`
--

LOCK TABLES `classified_favourites` WRITE;
/*!40000 ALTER TABLE `classified_favourites` DISABLE KEYS */;
/*!40000 ALTER TABLE `classified_favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_images`
--

DROP TABLE IF EXISTS `classified_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `classified_id` bigint NOT NULL,
  `display_order` int DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_images`
--

LOCK TABLES `classified_images` WRITE;
/*!40000 ALTER TABLE `classified_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `classified_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_listings`
--

DROP TABLE IF EXISTS `classified_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_listings` (
  `classified_id` bigint NOT NULL AUTO_INCREMENT,
  `brand_id` bigint DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `condition_id` bigint DEFAULT NULL,
  `contact_info` varchar(255) NOT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `description` text NOT NULL,
  `district_id` bigint DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `favourite_count` int DEFAULT NULL,
  `featured` bit(1) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `longitude` double DEFAULT NULL,
  `negotiable` bit(1) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `price_detail` varchar(255) NOT NULL,
  `seller_id` bigint DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `sponsored` bit(1) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `subcategory_id` bigint DEFAULT NULL,
  `taluk_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `uuid` varchar(255) NOT NULL,
  `view_count` int DEFAULT NULL,
  `whatsapp_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`classified_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_5s0o3sjgtve39ymu8xu1ls2dh` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_listings`
--

LOCK TABLES `classified_listings` WRITE;
/*!40000 ALTER TABLE `classified_listings` DISABLE KEYS */;
INSERT INTO `classified_listings` VALUES (1,NULL,'Properties',NULL,NULL,'9876543210','9876543210','2026-07-17 20:15:22.276652',_binary '\0','அடையாறில் உள்ள முக்கிய குடியிருப்பில் 1200 சதுர அடி கொண்ட புதிய 2 BHK பிளாட் விற்பனைக்கு உள்ளது. கார் பார்க்கிங் மற்றும் லிப்ட் வசதி கொண்டது.',NULL,NULL,0,_binary '\0',NULL,'அடையாறு, சென்னை',NULL,_binary '\0',NULL,0.65,'ரூ. 65 லட்சம்',NULL,'2-bhk-',_binary '\0','active',NULL,NULL,'2 BHK அடுக்குமாடி குடியிருப்பு விற்பனைக்கு','2026-07-17 20:15:22.445161','05d6203c-9798-47af-bf1f-aae15a791f1d',0,NULL),(2,NULL,'Vehicles',NULL,NULL,'9876543211','9876543211','2026-07-17 20:15:22.970804',_binary '\0','2020 மாடல் மாருதி ஸ்விஃப்ட் விஎக்ஸ்ஐ பெட்ரோல் கார் விற்பனைக்கு. சிங்கிள் ஓனர், சிறந்த நிலையில் உள்ளது.',NULL,NULL,0,_binary '\0',NULL,'பீளமேடு, கோயம்புத்தூர்',NULL,_binary '\0',NULL,0,'ரூ. 4.2 லட்சம்',NULL,'-',_binary '\0','active',NULL,NULL,'பயன்படுத்தப்பட்ட மாருதி ஸ்விஃப்ட் கார் விற்பனைக்கு','2026-07-17 20:15:23.139731','700ef035-616e-42a4-8548-288d70bb19b6',0,NULL);
/*!40000 ALTER TABLE `classified_listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_reports`
--

DROP TABLE IF EXISTS `classified_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `classified_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `reporter_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_reports`
--

LOCK TABLES `classified_reports` WRITE;
/*!40000 ALTER TABLE `classified_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `classified_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_reviews`
--

DROP TABLE IF EXISTS `classified_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int NOT NULL,
  `review` text DEFAULT NULL,
  `reviewer_id` bigint NOT NULL,
  `seller_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_reviews`
--

LOCK TABLES `classified_reviews` WRITE;
/*!40000 ALTER TABLE `classified_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `classified_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_seller_profiles`
--

DROP TABLE IF EXISTS `classified_seller_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_seller_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `member_since` datetime(6) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `review_count` int DEFAULT NULL,
  `seller_name` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `verified` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_jdm37rexokxdn7q4vmn008x4b` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_seller_profiles`
--

LOCK TABLES `classified_seller_profiles` WRITE;
/*!40000 ALTER TABLE `classified_seller_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `classified_seller_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_shares`
--

DROP TABLE IF EXISTS `classified_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_shares` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `classified_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_shares`
--

LOCK TABLES `classified_shares` WRITE;
/*!40000 ALTER TABLE `classified_shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `classified_shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_subcategories`
--

DROP TABLE IF EXISTS `classified_subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_subcategories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKi499svgp10lg214snov4hbmp8` (`category_id`),
  CONSTRAINT `FKi499svgp10lg214snov4hbmp8` FOREIGN KEY (`category_id`) REFERENCES `classified_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_subcategories`
--

LOCK TABLES `classified_subcategories` WRITE;
/*!40000 ALTER TABLE `classified_subcategories` DISABLE KEYS */;
INSERT INTO `classified_subcategories` VALUES (1,'2026-07-17 20:14:16.915995','Cars','cars',1),(2,'2026-07-17 20:14:17.602596','Bikes','bikes',1),(3,'2026-07-17 20:14:18.969422','Apartments','apartments',2),(4,'2026-07-17 20:14:19.654252','Houses','houses',2),(5,'2026-07-17 20:14:21.020017','Mobiles','mobiles',3),(6,'2026-07-17 20:14:21.699325','Tablets','tablets',3),(7,'2026-07-17 20:14:23.058865','Laptops','laptops',4),(8,'2026-07-17 20:14:23.739128','TVs','tvs',4),(9,'2026-07-17 20:14:25.158639','Furniture','furniture',5),(10,'2026-07-17 20:14:25.847771','Home Appliances','appliances',5),(11,'2026-07-17 20:14:27.204613','Clothing','clothing',6),(12,'2026-07-17 20:14:28.562874','Electrician','electrician',7);
/*!40000 ALTER TABLE `classified_subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_views`
--

DROP TABLE IF EXISTS `classified_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classified_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `classified_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_views`
--

LOCK TABLES `classified_views` WRITE;
/*!40000 ALTER TABLE `classified_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `classified_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` bigint NOT NULL AUTO_INCREMENT,
  `article_id` bigint NOT NULL,
  `comment_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentor_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commentor_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`comment_id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `about` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `employee_count` int DEFAULT NULL,
  `founded_year` int DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `uuid` varchar(255) NOT NULL,
  `verified` bit(1) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_hrul174ag7c4ca9tb3r60kbd4` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,NULL,'Coimbatore, Tamil Nadu','Tata Consultancy Services',NULL,'2026-07-17 20:14:12.485339',NULL,NULL,NULL,'it',NULL,'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100',NULL,'2026-07-17 20:14:12.653693',NULL,'73fbe1bc-8cef-4059-a888-1310eb3bf321',_binary '',NULL),(2,NULL,'Chennai, Tamil Nadu','Zoho Corporation',NULL,'2026-07-17 20:14:13.176916',NULL,NULL,NULL,'it',NULL,'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100',NULL,'2026-07-17 20:14:13.344844',NULL,'59298ae0-195e-4e59-b074-59eba8d22bda',_binary '',NULL),(3,NULL,'Salem, Tamil Nadu','HDFC Bank',NULL,'2026-07-17 20:14:13.860253',NULL,NULL,NULL,'finance',NULL,'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=100',NULL,'2026-07-17 20:14:14.028207',NULL,'4e395d92-a074-4ac1-bbc3-4a000c2012fd',_binary '',NULL),(4,NULL,'Trichy, Tamil Nadu','Apollo Hospitals',NULL,'2026-07-17 20:14:14.537542',NULL,NULL,NULL,'healthcare',NULL,'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100',NULL,'2026-07-17 20:14:14.705836',NULL,'847bdb12-a37c-410e-9e5f-b2a7603560fb',_binary '',NULL);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_requests`
--

DROP TABLE IF EXISTS `contact_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_requests`
--

LOCK TABLES `contact_requests` WRITE;
/*!40000 ALTER TABLE `contact_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_edit_log`
--

DROP TABLE IF EXISTS `content_edit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_edit_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content_id` bigint NOT NULL,
  `content_type` varchar(50) NOT NULL,
  `edit_count` int NOT NULL,
  `last_edited_at` datetime(6) DEFAULT NULL,
  `last_edited_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UKpxh95pupkmshbnsxqur58ahw7` (`content_type`,`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_edit_log`
--

LOCK TABLES `content_edit_log` WRITE;
/*!40000 ALTER TABLE `content_edit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_edit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deal_favorites`
--

DROP TABLE IF EXISTS `deal_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deal_favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `deal_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UKj5os8jh3jofd6e9gv9ynw7c87` (`user_id`,`deal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deal_favorites`
--

LOCK TABLES `deal_favorites` WRITE;
/*!40000 ALTER TABLE `deal_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `deal_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deal_redemptions`
--

DROP TABLE IF EXISTS `deal_redemptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deal_redemptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `deal_id` bigint NOT NULL,
  `redeemed_at` datetime(6) DEFAULT NULL,
  `redemption_code` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_sc1bt8ul4a7hl65bq54r7jy89` (`redemption_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deal_redemptions`
--

LOCK TABLES `deal_redemptions` WRITE;
/*!40000 ALTER TABLE `deal_redemptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `deal_redemptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deals`
--

DROP TABLE IF EXISTS `deals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `banner_url` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `discount_type` varchar(255) NOT NULL,
  `discount_value` double NOT NULL,
  `discounted_price` double DEFAULT NULL,
  `is_featured` bit(1) DEFAULT NULL,
  `listing_id` bigint NOT NULL,
  `original_price` double DEFAULT NULL,
  `redemption_count` int DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  `terms` text DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `valid_from` datetime(6) DEFAULT NULL,
  `valid_until` datetime(6) DEFAULT NULL,
  `view_count` int DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deals`
--

LOCK TABLES `deals` WRITE;
/*!40000 ALTER TABLE `deals` DISABLE KEYS */;
/*!40000 ALTER TABLE `deals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `district_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name_en` varchar(255) NOT NULL,
  `name_ta` varchar(255) NOT NULL,
  PRIMARY KEY (`district_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_nt8rxh8c5yrh2if51b6vwdvuc` (`name_en`),
  UNIQUE KEY `UK_j1t6bhjcwjd8r33i9fc3kjhco` (`name_ta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,NULL,'Chennai','சென்னை'),(2,NULL,'Coimbatore','கோயம்புத்தூர்'),(3,NULL,'Madurai','மதுரை'),(4,NULL,'Trichy','திருச்சி'),(5,NULL,'Salem','சேலம்'),(30001,NULL,'Tirunelveli','திருநெல்வேலி'),(30002,NULL,'Vellore','வேலூர்'),(30003,NULL,'Erode','ஈரோடு'),(30004,NULL,'Thoothukudi','தூத்துக்குடி'),(30005,NULL,'Tiruppur','திருப்பூர்'),(30006,NULL,'Tiruvallur','திருவள்ளூர்'),(30007,NULL,'Kanchipuram','காஞ்சிபுரம்'),(30008,NULL,'Chengalpattu','செங்கல்பட்டு'),(30009,NULL,'Villupuram','விழுப்புரம்'),(30010,NULL,'Cuddalore','கடலூர்'),(30011,NULL,'Nagapattinam','நாகப்பட்டினம்'),(30012,NULL,'Thanjavur','தஞ்சாவூர்'),(30013,NULL,'Pudukkottai','புதுக்கோட்டை'),(30014,NULL,'Sivaganga','சிவகங்கை'),(30015,NULL,'Ramanathapuram','ராமநாதபுரம்'),(30016,NULL,'Virudhunagar','விருதுநகர்'),(30017,NULL,'Namakkal','நாமக்கல்'),(30018,NULL,'Dharmapuri','தருமபுரி'),(30019,NULL,'Krishnagiri','கிருஷ்ணகிரி'),(30020,NULL,'Tiruvannamalai','திருவண்ணாமலை'),(30021,NULL,'Ranipet','ராணிப்பேட்டை'),(30022,NULL,'Tirupathur','திருப்பத்தூர்'),(30023,NULL,'Kallakurichi','கள்ளக்குறிச்சி'),(30024,NULL,'Ariyalur','அரியலூர்'),(30025,NULL,'Perambalur','பெரம்பலூர்'),(30026,NULL,'Karur','கரூர்'),(30027,NULL,'Dindigul','திண்டுக்கல்'),(30028,NULL,'Nilgiris','நீலகிரி'),(30029,NULL,'Tiruvarur','திருவாரூர்'),(30030,NULL,'Mayiladuthurai','மயிலாடுதுறை'),(30031,NULL,'Theni','தேனி'),(30032,NULL,'Tenkasi','தென்காசி'),(30033,NULL,'Kanyakumari','கன்னியாகுமரி');
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `earning_ledgers`
--

DROP TABLE IF EXISTS `earning_ledgers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `earning_ledgers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `article_id` bigint DEFAULT NULL,
  `author_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `transaction_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `earning_ledgers`
--

LOCK TABLES `earning_ledgers` WRITE;
/*!40000 ALTER TABLE `earning_ledgers` DISABLE KEYS */;
/*!40000 ALTER TABLE `earning_ledgers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_ta` text DEFAULT NULL,
  `event_date` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_ta` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `font_config`
--

DROP TABLE IF EXISTS `font_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `font_config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `font_family` varchar(200) NOT NULL,
  `font_role` varchar(30) NOT NULL,
  `font_source` varchar(30) DEFAULT NULL,
  `font_url` varchar(500) DEFAULT NULL,
  `font_weight` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_9pvvevm4hhh5r18nxa4gpy7d2` (`font_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `font_config`
--

LOCK TABLES `font_config` WRITE;
/*!40000 ALTER TABLE `font_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `font_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_layout_config`
--

DROP TABLE IF EXISTS `home_layout_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_layout_config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `config_json` text DEFAULT NULL,
  `delegated_to_chief_editor` bit(1) DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `is_visible` bit(1) DEFAULT NULL,
  `layout_type` varchar(20) DEFAULT NULL,
  `section_key` varchar(50) NOT NULL,
  `section_label` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_o2nv3t1ih6les7po07ua567ky` (`section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=90001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_layout_config`
--

LOCK TABLES `home_layout_config` WRITE;
/*!40000 ALTER TABLE `home_layout_config` DISABLE KEYS */;
INSERT INTO `home_layout_config` VALUES (1,NULL,_binary '\0',1,_binary '','WEB','news_ticker','⚡ Breaking News Ticker','2026-07-22 13:12:36.383184',NULL),(2,NULL,_binary '\0',3,_binary '','WEB','hero','📰 Hero Section','2026-07-21 08:24:44.118992',NULL),(3,NULL,_binary '\0',2,_binary '','WEB','quick_access','🔘 Quick Access Icons','2026-07-19 11:25:30.668017',NULL),(4,NULL,_binary '\0',4,_binary '','WEB','latest_news','🆕 Latest News','2026-07-17 20:33:56.195295',NULL),(5,NULL,_binary '\0',5,_binary '','WEB','video_news','🎥 Video News','2026-07-22 13:14:37.922055',NULL),(6,NULL,_binary '\0',7,_binary '','WEB','web_stories','📱 Web Stories','2026-07-22 13:12:59.581419',NULL),(7,NULL,_binary '\0',6,_binary '\0','WEB','trending_sidebar','🔥 Trending Sidebar','2026-07-22 13:12:57.885044',NULL),(8,NULL,_binary '\0',8,_binary '','WEB','weather','🌦️ Weather Widget','2026-07-17 20:16:40.225838',NULL),(9,NULL,_binary '\0',9,_binary '','WEB','live_tv','📺 Live TV Widget','2026-07-17 20:16:40.905556',NULL),(10,NULL,_binary '\0',10,_binary '','WEB','business_case','💼 Business Case Studies','2026-07-17 20:16:41.582646',NULL),(11,NULL,_binary '\0',11,_binary '','WEB','crowd_reporter','📢 Crowd Reporter','2026-07-19 11:25:44.770198',NULL),(12,NULL,_binary '\0',13,_binary '','WEB','news_digest','📑 News Digest','2026-07-22 13:14:50.745616',NULL),(13,NULL,_binary '\0',1,_binary '','MOBILE','mobile_hero','Trending Stories Feed','2026-07-17 20:16:43.619739',NULL),(14,NULL,_binary '\0',2,_binary '','MOBILE','mobile_live_tv','Live Broadcast','2026-07-17 20:16:44.303281',NULL),(60001,'{}',_binary '\0',14,_binary '\0','WEB','pop','test','2026-07-22 13:14:51.846750',NULL),(60002,'{}',_binary '\0',13,_binary '','WEB','news-ticker','test','2026-07-22 13:14:50.154699',NULL);
/*!40000 ALTER TABLE `home_layout_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_alerts`
--

DROP TABLE IF EXISTS `job_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_alerts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `search_keyword` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_alerts`
--

LOCK TABLES `job_alerts` WRITE;
/*!40000 ALTER TABLE `job_alerts` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_applications` (
  `application_id` bigint NOT NULL AUTO_INCREMENT,
  `applicant_name` varchar(255) DEFAULT NULL,
  `applicant_phone` varchar(255) DEFAULT NULL,
  `application_status` varchar(255) DEFAULT NULL,
  `applied_at` datetime(6) DEFAULT NULL,
  `candidate_id` bigint DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `interview_date` datetime(6) DEFAULT NULL,
  `job_id` bigint NOT NULL,
  `offer_status` varchar(255) DEFAULT NULL,
  `recruiter_notes` text DEFAULT NULL,
  `resume_id` bigint DEFAULT NULL,
  `summary` text DEFAULT NULL,
  PRIMARY KEY (`application_id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_categories`
--

DROP TABLE IF EXISTS `job_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active_job_count` int DEFAULT NULL,
  `companies_hiring_count` int DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_qyol2j6hcspl3raexk33q8067` (`name`),
  UNIQUE KEY `UK_g5chbbh2jpqb2pr3ju565jvcr` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_categories`
--

LOCK TABLES `job_categories` WRITE;
/*!40000 ALTER TABLE `job_categories` DISABLE KEYS */;
INSERT INTO `job_categories` VALUES (1,2845,120,'fa-laptop-code','IT & Software','it-software'),(2,4126,180,'fa-bullhorn','Sales & Marketing','sales-marketing'),(3,3245,95,'fa-book-reader','Education','education'),(4,2087,60,'fa-heartbeat','Healthcare','healthcare'),(5,3789,140,'fa-cog','Engineering','engineering'),(6,1678,20,'fa-landmark','Government','government'),(7,2345,75,'fa-money-check-alt','Banking & Finance','banking-finance'),(8,5678,300,'fa-th-large','Others','others');
/*!40000 ALTER TABLE `job_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_reports`
--

DROP TABLE IF EXISTS `job_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `job_id` bigint NOT NULL,
  `reason` text DEFAULT NULL,
  `reporter_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_reports`
--

LOCK TABLES `job_reports` WRITE;
/*!40000 ALTER TABLE `job_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_shares`
--

DROP TABLE IF EXISTS `job_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_shares` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `job_id` bigint NOT NULL,
  `platform` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_shares`
--

LOCK TABLES `job_shares` WRITE;
/*!40000 ALTER TABLE `job_shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_views`
--

DROP TABLE IF EXISTS `job_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `job_id` bigint NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_views`
--

LOCK TABLES `job_views` WRITE;
/*!40000 ALTER TABLE `job_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `applicant_count` int DEFAULT NULL,
  `application_deadline` date DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `description` text NOT NULL,
  `district_id` bigint DEFAULT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `experience_max` int DEFAULT NULL,
  `experience_min` int DEFAULT NULL,
  `featured` bit(1) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `preferred_skills` varchar(255) DEFAULT NULL,
  `recruiter_id` bigint DEFAULT NULL,
  `required_skills` varchar(255) DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `salary_max` double DEFAULT NULL,
  `salary_min` double DEFAULT NULL,
  `salary_range` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `state_id` bigint DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `taluk_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `uuid` varchar(255) NOT NULL,
  `vacancies` int DEFAULT NULL,
  `work_mode` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `company_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_fvsefjbqp71vkisrp337hmo3d` (`uuid`),
  KEY `FK6ix1ytp71kdj9g3l6guhqk54d` (`category_id`),
  KEY `FKrtmqcrktb6s7xq8djbs2a2war` (`company_id`),
  CONSTRAINT `FK6ix1ytp71kdj9g3l6guhqk54d` FOREIGN KEY (`category_id`) REFERENCES `job_categories` (`id`),
  CONSTRAINT `FKrtmqcrktb6s7xq8djbs2a2war` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,0,NULL,'IT / Tech','Kings Info Solutions','2026-07-17 20:15:23.689014',_binary '\0','குறைந்தபட்சம் 2 வருட அனுபவம் உள்ள ஜாவா ஸ்பிரிங் பூட் மென்பொருள் பொறியாளர் தேவை. சிறந்த நிரலாக்க அறிவு பெற்றிருக்க வேண்டும்.',NULL,'Full Time',10,0,_binary '\0',NULL,'சோழிங்கநல்லூர், சென்னை',NULL,NULL,NULL,NULL,NULL,12,3,'ரூ. 5 - 8 எல்பிஏ (LPA)','-java-developer-',NULL,'active',NULL,'ஜாவா மென்பொருள் பொறியாளர் (Java Developer)','2026-07-17 20:15:23.857472','fd129de6-55c4-4b54-914e-f926d47fdb2a',1,'Work From Office',NULL,NULL),(2,0,NULL,'Management','Royal Group','2026-07-17 20:15:24.424568',_binary '\0','நிறுவனத்தின் மனிதவள செயல்பாடுகள் மற்றும் பணியாளர் சேர்ப்பு பணிகளை நிர்வகிப்பதற்கான திறமை வாய்ந்த எச்.ஆர் மேலாளர் தேவை.',NULL,'Full Time',10,0,_binary '\0',NULL,'ஆர்.எஸ்.புரம், கோயம்புத்தூர்',NULL,NULL,NULL,NULL,NULL,12,3,'ரூ. 4 - 6 எல்பிஏ (LPA)','-hr-manager-',NULL,'active',NULL,'மனிதவள மேலாளர் (HR Manager)','2026-07-17 20:15:24.592396','a7e4673e-f162-41f6-a1c8-48895bc3ff1d',1,'Work From Office',NULL,NULL);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `latest_news`
--

DROP TABLE IF EXISTS `latest_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `latest_news` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `district_id` bigint DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `subcategory_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `title_ta` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `latest_news`
--

LOCK TABLES `latest_news` WRITE;
/*!40000 ALTER TABLE `latest_news` DISABLE KEYS */;
/*!40000 ALTER TABLE `latest_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `local_business_directory`
--

DROP TABLE IF EXISTS `local_business_directory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `local_business_directory` (
  `listing_id` bigint NOT NULL AUTO_INCREMENT,
  `address_locality` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_street` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `approved_by` bigint DEFAULT NULL,
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` bit(1) DEFAULT NULL,
  `is_premium` bit(1) DEFAULT NULL,
  `kyc_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating_avg` double DEFAULT NULL,
  `rating_count` int DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscription_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `working_hours` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kyc_document_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`listing_id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `local_business_directory`
--

LOCK TABLES `local_business_directory` WRITE;
/*!40000 ALTER TABLE `local_business_directory` DISABLE KEYS */;
INSERT INTO `local_business_directory` VALUES (1,'Anna Nagar, Chennai','5th Avenue, Anna Nagar','2026-07-22 09:00:08.900553',1,'King Cafe','Cafe / Restaurant',NULL,'2026-07-17 20:15:25.106498',NULL,NULL,NULL,NULL,NULL,_binary '\0',_binary '\0','approved',NULL,NULL,NULL,NULL,'9876543210',0,0,'active','free',NULL,'2026-07-17 20:15:25.106515',NULL,'08:00 AM - 11:00 PM',NULL),(2,'மயிலாப்பூர், சென்னை','கபாலீஸ்வரர் கோவில் தெரு','2026-07-21 21:54:20.769441',1,'அபிராமி பல்பொருள் அங்காடி','Retail / Grocery',NULL,'2026-07-17 20:15:25.807916',NULL,NULL,NULL,NULL,NULL,_binary '\0',_binary '\0','rejected',NULL,NULL,NULL,NULL,'044-24951234',0,0,'inactive','free',NULL,'2026-07-17 20:15:25.807936',NULL,'09:00 AM - 10:00 PM',NULL),(3,'காந்திபுரம், கோயம்புத்தூர்','நூறடி சாலை, காந்திபுரம்','2026-07-22 14:56:05.252718',1,'ஸ்ரீ பாலாஜி டென்டல் கிளினிக்','Healthcare / Dental',NULL,'2026-07-17 20:15:26.512598',NULL,NULL,NULL,NULL,NULL,_binary '\0',_binary '\0','rejected',NULL,NULL,NULL,NULL,'0422-2521234',0,0,'inactive','free',NULL,'2026-07-17 20:15:26.512617',NULL,'10:00 AM - 08:30 PM',NULL);
/*!40000 ALTER TABLE `local_business_directory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `local_obituaries`
--

DROP TABLE IF EXISTS `local_obituaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `local_obituaries` (
  `obit_id` bigint NOT NULL AUTO_INCREMENT,
  `age` int NOT NULL,
  `biography` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `date_of_passing` date DEFAULT NULL,
  `deceased_name` varchar(255) NOT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `demise_date` date DEFAULT NULL,
  `family_contact_name` varchar(255) DEFAULT NULL,
  `family_phone` varchar(255) DEFAULT NULL,
  `funeral_datetime` datetime(6) DEFAULT NULL,
  `funeral_details` text DEFAULT NULL,
  `funeral_venue` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `guestbook_count` int DEFAULT NULL,
  `is_celebrity` bit(1) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `longitude` double DEFAULT NULL,
  `map_link` varchar(255) DEFAULT NULL,
  `native_place` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `poster_relationship` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `report_count` int DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `taluk_id` bigint DEFAULT NULL,
  `tribute_count` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `uuid` varchar(255) NOT NULL,
  `district_id` bigint DEFAULT NULL,
  `frame_template_id` bigint DEFAULT NULL,
  `proof_document` varchar(255) DEFAULT NULL,
  `submitter_contact` varchar(255) DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`obit_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_ifl8v4plmrplg6xnvvevlx132` (`uuid`),
  KEY `FK1vkt4p1x8wytkbyx9m6wh8kea` (`district_id`),
  KEY `FKbvxm37kvxhpsx0uo0htw21iil` (`frame_template_id`),
  CONSTRAINT `FK1vkt4p1x8wytkbyx9m6wh8kea` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`),
  CONSTRAINT `FKbvxm37kvxhpsx0uo0htw21iil` FOREIGN KEY (`frame_template_id`) REFERENCES `obituary_frame_templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `local_obituaries`
--

LOCK TABLES `local_obituaries` WRITE;
/*!40000 ALTER TABLE `local_obituaries` DISABLE KEYS */;
INSERT INTO `local_obituaries` VALUES (1,78,'முன்னாள் அரசு அதிகாரிகள் சங்கத் தலைவர் கிருஷ்ணசாமி நடராஜன் அவர்கள் மயிலாப்பூரில் உள்ள அவரது இல்லத்தில் இயற்கை எய்தினார்.','2026-07-17 20:15:20.893050',NULL,NULL,'2026-07-15','கிருஷ்ணசாமி நடராஜன் (வயது 78)',_binary '\0','2026-07-15',NULL,NULL,NULL,'மின்கம்ப மயானத்தில் நாளை மாலை 4:00 மணியளவில் உடல் தகனம் செய்யப்படவுள்ளது.','மின்கம்ப மயானத்தில் நாளை மாலை 4:00 மணியளவில் உடல் தகனம் செய்யப்படவுள்ளது.',NULL,0,_binary '\0',NULL,'மயிலாப்பூர், சென்னை',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'முன்னாள் அரசு அதிகாரிகள் சங்கத் தலைவர் கிருஷ்ணசாமி நடராஜன் அவர்கள் மயிலாப்பூரில் உள்ள அவரது இல்லத்தில் இயற்கை எய்தினார்.','published',NULL,0,'2026-07-17 20:15:21.061801',NULL,'f8381884-c7dc-4bec-8b36-ae144a879179',NULL,NULL,NULL,NULL,NULL),(2,65,'அன்பான இல்லத்தரசி மற்றும் சமூக ஆர்வலர் மீனாட்சி சுப்பிரமணியன் அவர்கள் கோயம்புத்தூரில் காலமானார்.','2026-07-17 20:15:21.585502',NULL,NULL,'2026-07-16','மீனாட்சி சுப்பிரமணியன் (வயது 65)',_binary '\0','2026-07-16',NULL,NULL,NULL,'காந்திபுரம் மயானத்தில் இன்று காலை 11:30 மணியளவில் இறுதிச்சடங்கு நடைபெற்றது.','காந்திபுரம் மயானத்தில் இன்று காலை 11:30 மணியளவில் இறுதிச்சடங்கு நடைபெற்றது.',NULL,0,_binary '\0',NULL,'ஆர்.எஸ்.புரம், கோயம்புத்தூர்',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'அன்பான இல்லத்தரசி மற்றும் சமூக ஆர்வலர் மீனாட்சி சுப்பிரமணியன் அவர்கள் கோயம்புத்தூரில் காலமானார்.','published',NULL,0,'2026-07-17 20:15:21.753378',NULL,'c53ba220-b3b9-41a1-bbad-12ab5232f2ee',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `local_obituaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_assets`
--

DROP TABLE IF EXISTS `media_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_assets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `uploader_id` bigint DEFAULT NULL,
  `url` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_assets`
--

LOCK TABLES `media_assets` WRITE;
/*!40000 ALTER TABLE `media_assets` DISABLE KEYS */;
INSERT INTO `media_assets` VALUES (1,'document',200197,'king 24x7 (1).pdf','application/pdf','2026-07-21 20:48:35.826917',1,'/uploads/media/2026/07/51bc4246-383c-4676-8517-aa6c657c2e85.pdf');
/*!40000 ALTER TABLE `media_assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `navigation_menus`
--

DROP TABLE IF EXISTS `navigation_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `navigation_menus` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `display_order` int DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `link_url` varchar(255) NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_ta` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navigation_menus`
--

LOCK TABLES `navigation_menus` WRITE;
/*!40000 ALTER TABLE `navigation_menus` DISABLE KEYS */;
/*!40000 ALTER TABLE `navigation_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_subscribers`
--

DROP TABLE IF EXISTS `newsletter_subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter_subscribers` (
  `subscriber_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `verified` bit(1) DEFAULT NULL,
  PRIMARY KEY (`subscriber_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_qqdefkuupml4s7190ettcy6jy` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_subscribers`
--

LOCK TABLES `newsletter_subscribers` WRITE;
/*!40000 ALTER TABLE `newsletter_subscribers` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsletter_subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nfc_card_audit_logs`
--

DROP TABLE IF EXISTS `nfc_card_audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nfc_card_audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `card_id` bigint NOT NULL,
  `changed_at` datetime(6) NOT NULL,
  `changed_by` varchar(255) DEFAULT NULL,
  `from_status` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `to_status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nfc_card_audit_logs`
--

LOCK TABLES `nfc_card_audit_logs` WRITE;
/*!40000 ALTER TABLE `nfc_card_audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `nfc_card_audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nfc_cards`
--

DROP TABLE IF EXISTS `nfc_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nfc_cards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `card_status` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_payment_enabled` bit(1) DEFAULT NULL,
  `link_type` varchar(255) NOT NULL,
  `listing_id` bigint NOT NULL,
  `otp_hash` varchar(255) DEFAULT NULL,
  `short_code` varchar(255) NOT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `upi_id` varchar(255) DEFAULT NULL,
  `upi_name` varchar(255) DEFAULT NULL,
  `delivered_at` datetime(6) DEFAULT NULL,
  `issued_at` datetime(6) DEFAULT NULL,
  `processing_at` datetime(6) DEFAULT NULL,
  `requested_at` datetime(6) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `delivery_note` varchar(255) DEFAULT NULL,
  `failure_reason` varchar(255) DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_reference` varchar(255) DEFAULT NULL,
  `payment_status` enum('UNPAID','PAID','REFUNDED','FAILED') DEFAULT NULL,
  `refund_reason` varchar(255) DEFAULT NULL,
  `refunded_at` datetime(6) DEFAULT NULL,
  `payment_amount` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_2qgk0vt2l8kbbg0nka4bl6iu3` (`short_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nfc_cards`
--

LOCK TABLES `nfc_cards` WRITE;
/*!40000 ALTER TABLE `nfc_cards` DISABLE KEYS */;
INSERT INTO `nfc_cards` VALUES (1,'activated','2026-07-17 20:15:27.197238',_binary '','payment',1,'1234','KCARD-10024','TRK-987654321','2026-07-17 20:15:27.197252','kingcafe@upi','King Cafe',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `nfc_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nfc_tap_history`
--

DROP TABLE IF EXISTS `nfc_tap_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nfc_tap_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `card_id` bigint NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `location_city` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `tap_type` varchar(255) NOT NULL,
  `tapped_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nfc_tap_history`
--

LOCK TABLES `nfc_tap_history` WRITE;
/*!40000 ALTER TABLE `nfc_tap_history` DISABLE KEYS */;
INSERT INTO `nfc_tap_history` VALUES (1,250,1,'Hari Prakash','Anna Nagar, Chennai','success','payment','2026-07-17 18:15:27.880773'),(2,0,1,'Unknown','T. Nagar, Chennai','success','profile','2026-07-17 17:15:28.569740'),(3,1120,1,'Priya Sharma','Anna Nagar, Chennai','success','payment','2026-07-16 20:15:29.246414'),(4,560,1,'Vignesh R','Anna Nagar, Chennai','success','payment','2026-07-16 20:15:29.923047');
/*!40000 ALTER TABLE `nfc_tap_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` text NOT NULL,
  `message_ta` text NOT NULL,
  `status` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_ta` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obituary_frame_templates`
--

DROP TABLE IF EXISTS `obituary_frame_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obituary_frame_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `asset_url` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obituary_frame_templates`
--

LOCK TABLES `obituary_frame_templates` WRITE;
/*!40000 ALTER TABLE `obituary_frame_templates` DISABLE KEYS */;
INSERT INTO `obituary_frame_templates` VALUES (1,NULL,'floral','2026-07-17 20:14:01.282672',0,_binary '','Floral Frame',NULL),(2,NULL,'golden','2026-07-17 20:14:01.966874',0,_binary '','Golden Frame',NULL),(3,NULL,'traditional','2026-07-17 20:14:02.650971',0,_binary '','Traditional Frame',NULL),(4,NULL,'white','2026-07-17 20:14:03.331049',0,_binary '','White Memorial Frame',NULL),(5,NULL,'premium','2026-07-17 20:14:04.028040',0,_binary '','Premium Frame',NULL);
/*!40000 ALTER TABLE `obituary_frame_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obituary_gallery`
--

DROP TABLE IF EXISTS `obituary_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obituary_gallery` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `display_order` int DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `obituary_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obituary_gallery`
--

LOCK TABLES `obituary_gallery` WRITE;
/*!40000 ALTER TABLE `obituary_gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `obituary_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obituary_guestbook`
--

DROP TABLE IF EXISTS `obituary_guestbook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obituary_guestbook` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` text NOT NULL,
  `obituary_id` bigint NOT NULL,
  `status` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `visitor_name` varchar(255) NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKrkq33xs27bococtme9lbv8iot` (`parent_id`),
  CONSTRAINT `FKrkq33xs27bococtme9lbv8iot` FOREIGN KEY (`parent_id`) REFERENCES `obituary_guestbook` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obituary_guestbook`
--

LOCK TABLES `obituary_guestbook` WRITE;
/*!40000 ALTER TABLE `obituary_guestbook` DISABLE KEYS */;
/*!40000 ALTER TABLE `obituary_guestbook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obituary_guestbook_likes`
--

DROP TABLE IF EXISTS `obituary_guestbook_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obituary_guestbook_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obituary_guestbook_likes`
--

LOCK TABLES `obituary_guestbook_likes` WRITE;
/*!40000 ALTER TABLE `obituary_guestbook_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `obituary_guestbook_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obituary_notifications`
--

DROP TABLE IF EXISTS `obituary_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obituary_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `obituary_id` bigint NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obituary_notifications`
--

LOCK TABLES `obituary_notifications` WRITE;
/*!40000 ALTER TABLE `obituary_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `obituary_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obituary_reports`
--

DROP TABLE IF EXISTS `obituary_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obituary_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `obituary_id` bigint NOT NULL,
  `reason` text DEFAULT NULL,
  `reporter_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obituary_reports`
--

LOCK TABLES `obituary_reports` WRITE;
/*!40000 ALTER TABLE `obituary_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `obituary_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obituary_tributes`
--

DROP TABLE IF EXISTS `obituary_tributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obituary_tributes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `obituary_id` bigint NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `tribute_type` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obituary_tributes`
--

LOCK TABLES `obituary_tributes` WRITE;
/*!40000 ALTER TABLE `obituary_tributes` DISABLE KEYS */;
/*!40000 ALTER TABLE `obituary_tributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obituary_views`
--

DROP TABLE IF EXISTS `obituary_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obituary_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `obituary_id` bigint NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obituary_views`
--

LOCK TABLES `obituary_views` WRITE;
/*!40000 ALTER TABLE `obituary_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `obituary_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page_contents`
--

DROP TABLE IF EXISTS `page_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `page_contents` (
  `page_key` varchar(50) NOT NULL,
  `contact_address` text DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `content_ta` text DEFAULT NULL,
  `google_map_url` text DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`page_key`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page_contents`
--

LOCK TABLES `page_contents` WRITE;
/*!40000 ALTER TABLE `page_contents` DISABLE KEYS */;
/*!40000 ALTER TABLE `page_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_otps`
--

DROP TABLE IF EXISTS `password_reset_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_otps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `expiry_time` datetime(6) NOT NULL,
  `is_verified` bit(1) DEFAULT NULL,
  `otp_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_otps`
--

LOCK TABLES `password_reset_otps` WRITE;
/*!40000 ALTER TABLE `password_reset_otps` DISABLE KEYS */;
INSERT INTO `password_reset_otps` VALUES (7,'phone_8122089830','2026-07-22 23:10:46.464973',_binary '\0','540992');
/*!40000 ALTER TABLE `password_reset_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pdf_contents`
--

DROP TABLE IF EXISTS `pdf_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pdf_contents` (
  `pdf_id` bigint NOT NULL AUTO_INCREMENT,
  `file_size` varchar(255) DEFAULT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `publish_date` datetime(6) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_ta` varchar(255) NOT NULL,
  PRIMARY KEY (`pdf_id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdf_contents`
--

LOCK TABLES `pdf_contents` WRITE;
/*!40000 ALTER TABLE `pdf_contents` DISABLE KEYS */;
/*!40000 ALTER TABLE `pdf_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `permission_id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `module` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`permission_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_pnvtwliis6p05pn6i3ndjrqt2` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'Create user accounts','User Management','user:create'),(2,'View user accounts','User Management','user:read'),(3,'Update user accounts','User Management','user:update'),(4,'Delete user accounts','User Management','user:delete'),(5,'Suspend user accounts','User Management','user:suspend'),(6,'Create articles','Content','article:create'),(7,'Read articles','Content','article:read'),(8,'Update articles','Content','article:update'),(9,'Delete articles','Content','article:delete'),(10,'Publish articles','Content','article:publish'),(11,'Review articles','Content','article:review'),(12,'View system audit logs','System','audit:view'),(13,'Read system settings','System','config:read'),(14,'Write system settings','System','config:write'),(15,'Manage profanity dictionary','Profanity','profanity:manage'),(16,'View profanity reports','Profanity','profanity:view_reports'),(17,'Manage home screen layout','Layout','home_layout:manage'),(18,'Manage delegated home screen layout','Layout','home_layout:delegated'),(19,'Send push notifications','Marketing','push_notification:send'),(20,'Manage SEO settings','SEO','seo_config:manage'),(21,'Manage categories and districts','Taxonomy','taxonomy:manage'),(22,'Manage surveys and polls','Survey','survey:manage'),(23,'Manage webstore products','Webstore','webstore:manage'),(24,'Manage system typography','System','font:manage'),(25,'Manage sitemaps','SEO','sitemap:manage'),(26,'Manage mobile app layouts','Layout','mobile_app_layout:manage'),(27,'Create mobile journalists','District Admin','journalist:create'),(28,'Update mobile journalists','District Admin','journalist:update'),(29,'Suspend mobile journalists','District Admin','journalist:suspend'),(30,'Review editorial content','Chief Editor','content:review'),(31,'Review user generated content','Chief Editor','ugc:review'),(32,'View dashboard reports','Analytics','analytics:view'),(33,'Use AI assistant rewriter','Content','ai_rewriter:use');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photo_gallery`
--

DROP TABLE IF EXISTS `photo_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photo_gallery` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_ta` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photo_gallery`
--

LOCK TABLES `photo_gallery` WRITE;
/*!40000 ALTER TABLE `photo_gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `photo_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `polls`
--

DROP TABLE IF EXISTS `polls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `polls` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `option1` varchar(255) NOT NULL,
  `option1_ta` varchar(255) NOT NULL,
  `option1_votes` int DEFAULT NULL,
  `option2` varchar(255) NOT NULL,
  `option2_ta` varchar(255) NOT NULL,
  `option2_votes` int DEFAULT NULL,
  `option3` varchar(255) DEFAULT NULL,
  `option3_ta` varchar(255) DEFAULT NULL,
  `option3_votes` int DEFAULT NULL,
  `question` varchar(255) NOT NULL,
  `question_ta` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `polls`
--

LOCK TABLES `polls` WRITE;
/*!40000 ALTER TABLE `polls` DISABLE KEYS */;
/*!40000 ALTER TABLE `polls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profanity_dictionary`
--

DROP TABLE IF EXISTS `profanity_dictionary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profanity_dictionary` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `language` varchar(10) DEFAULT NULL,
  `term` varchar(200) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_sko78yrpnx1cm26emyx074thi` (`term`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=90001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profanity_dictionary`
--

LOCK TABLES `profanity_dictionary` WRITE;
/*!40000 ALTER TABLE `profanity_dictionary` DISABLE KEYS */;
INSERT INTO `profanity_dictionary` VALUES (1,'2026-07-17 20:16:33.302164',NULL,'ALL','abuse'),(2,'2026-07-17 20:16:33.984255',NULL,'ALL','spam'),(3,'2026-07-17 20:16:34.661560',NULL,'ALL','offensive'),(30001,'2026-07-18 10:02:06.210736',1,'ALL','worst'),(60001,'2026-07-22 14:15:56.351868',1,'ALL','trigger');
/*!40000 ALTER TABLE `profanity_dictionary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profanity_violations`
--

DROP TABLE IF EXISTS `profanity_violations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profanity_violations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_email` varchar(100) DEFAULT NULL,
  `author_id` bigint DEFAULT NULL,
  `content_id` bigint DEFAULT NULL,
  `content_title` varchar(255) DEFAULT NULL,
  `content_type` varchar(50) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `matched_terms` text DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  `reviewed_by` bigint DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profanity_violations`
--

LOCK TABLES `profanity_violations` WRITE;
/*!40000 ALTER TABLE `profanity_violations` DISABLE KEYS */;
/*!40000 ALTER TABLE `profanity_violations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_notification_records`
--

DROP TABLE IF EXISTS `push_notification_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `push_notification_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_url` varchar(500) DEFAULT NULL,
  `body` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `delivered_count` int DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `opened_count` int DEFAULT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `sent_count` int DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `target_type` varchar(30) NOT NULL,
  `target_value` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_notification_records`
--

LOCK TABLES `push_notification_records` WRITE;
/*!40000 ALTER TABLE `push_notification_records` DISABLE KEYS */;
INSERT INTO `push_notification_records` VALUES (1,'','Heavy rainfall has been forecast for Chennai and nearby districts. Stay updated with the latest weather alerts on KING24X7.','2026-07-18 09:29:36.073792',1,0,'',0,'2026-07-18 09:29:38.760439',1,'SENT','GLOBAL',NULL,'Breaking News: Heavy Rain Alert');
/*!40000 ALTER TABLE `push_notification_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_ghpmfn23vmxfu3spu3lfg4r2d` (`token`),
  UNIQUE KEY `UK_7tdcd6ab5wsgoudnvj7xf1b7l` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=1140001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (660002,'2026-07-27 08:17:07.381073','68a35118-0ea2-453f-962e-215d7dd26ea4',3),(690002,'2026-07-27 11:44:12.352157','6cfede3c-7ac8-4fcd-8b89-f420b9a30cf7',2),(1020003,'2026-07-29 05:20:18.031886','f8b14ec7-b539-46cf-a832-fd77092dd392',6),(1020004,'2026-07-29 05:20:58.410618','b6776f13-cca0-4b36-8347-d4ba56cc3c8e',4),(1110001,'2026-07-29 11:31:43.056236','c7902456-fe00-4ad1-89ff-913ad6245179',90001),(1110012,'2026-07-29 12:04:22.509078','f9cca50c-3fff-484a-a75c-9fabd55fc70d',90003),(1110020,'2026-07-29 14:49:16.536460','702a5818-b644-48c8-a981-65e54370c54a',1),(1110024,'2026-07-30 01:01:40.751149','351d7c85-5be0-43bc-bf54-391e8ee93c0c',60002);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_news`
--

DROP TABLE IF EXISTS `report_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_news` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `details` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `reporter_contact` varchar(255) NOT NULL,
  `reporter_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_news`
--

LOCK TABLES `report_news` WRITE;
/*!40000 ALTER TABLE `report_news` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resumes`
--

DROP TABLE IF EXISTS `resumes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resumes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ats_score` int DEFAULT NULL,
  `candidate_id` bigint NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `parsed_data` text DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resumes`
--

LOCK TABLES `resumes` WRITE;
/*!40000 ALTER TABLE `resumes` DISABLE KEYS */;
/*!40000 ALTER TABLE `resumes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfq_quotes`
--

DROP TABLE IF EXISTS `rfq_quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfq_quotes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `proposal_url` varchar(255) DEFAULT NULL,
  `quoted_price` double NOT NULL,
  `rfq_id` bigint NOT NULL,
  `seller_business_id` bigint NOT NULL,
  `status` varchar(255) NOT NULL,
  `timeline_days` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfq_quotes`
--

LOCK TABLES `rfq_quotes` WRITE;
/*!40000 ALTER TABLE `rfq_quotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `rfq_quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfqs`
--

DROP TABLE IF EXISTS `rfqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfqs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attachment_url` varchar(255) DEFAULT NULL,
  `budget` varchar(255) DEFAULT NULL,
  `buyer_id` bigint NOT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deadline` datetime(6) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `status` varchar(255) NOT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfqs`
--

LOCK TABLES `rfqs` WRITE;
/*!40000 ALTER TABLE `rfqs` DISABLE KEYS */;
/*!40000 ALTER TABLE `rfqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id`),
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`),
  CONSTRAINT `FKn5fotdgk8d1xvo8nav9uv3muc` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (2,1),(30001,1),(2,2),(3,2),(30001,2),(2,3),(30001,3),(30001,4),(30001,5),(2,6),(4,6),(5,6),(2,7),(3,7),(4,7),(5,7),(6,7),(30001,7),(2,8),(4,8),(5,8),(2,10),(2,11),(30001,11),(30001,13),(30001,14),(30001,15),(2,16),(2,18),(30001,18),(30001,19),(30001,21),(30002,21),(30001,22),(30001,23),(30001,25),(3,27),(30001,27),(3,28),(30001,28),(3,29),(2,30),(2,31),(30001,31),(2,32),(3,32),(30001,32),(2,33),(4,33),(5,33);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_ofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,NULL,'Super Administrator with full bypass access','SUPER_ADMIN'),(2,NULL,'Chief Editor managing content publish flows','CHIEF_EDITOR'),(3,NULL,'District Admin managing local journalists','DISTRICT_ADMIN'),(4,NULL,'Field Mobile Journalist submitting posts','MOBILE_JOURNALIST'),(5,NULL,'Institutional publisher account','INSTITUTION_LOGIN'),(6,NULL,'Standard public/reader account','READER'),(30001,NULL,'executive head','HEAD'),(30002,NULL,'department executive','DEPARTMENT');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rss_feed_configs`
--

DROP TABLE IF EXISTS `rss_feed_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rss_feed_configs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `auto_image_download` bit(1) DEFAULT NULL,
  `auto_publish` bit(1) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `feed_url` varchar(255) NOT NULL,
  `language` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rss_feed_configs`
--

LOCK TABLES `rss_feed_configs` WRITE;
/*!40000 ALTER TABLE `rss_feed_configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `rss_feed_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_jobs`
--

DROP TABLE IF EXISTS `saved_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_jobs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint NOT NULL,
  `job_id` bigint NOT NULL,
  `saved_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_jobs`
--

LOCK TABLES `saved_jobs` WRITE;
/*!40000 ALTER TABLE `saved_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seo_templates`
--

DROP TABLE IF EXISTS `seo_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seo_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description_template` text DEFAULT NULL,
  `keywords_template` text DEFAULT NULL,
  `prompt_template` text DEFAULT NULL,
  `template_key` varchar(100) NOT NULL,
  `template_type` varchar(30) DEFAULT NULL,
  `title_template` text DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_6wp90tf3bv4j1frftx7e87nny` (`template_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seo_templates`
--

LOCK TABLES `seo_templates` WRITE;
/*!40000 ALTER TABLE `seo_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `seo_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitemap_config`
--

DROP TABLE IF EXISTS `sitemap_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sitemap_config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `change_freq` varchar(20) DEFAULT NULL,
  `is_excluded` bit(1) DEFAULT NULL,
  `page_label` varchar(200) DEFAULT NULL,
  `page_path` varchar(255) NOT NULL,
  `priority` varchar(10) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_l3hdmr8vxqh369juod7scxfk` (`page_path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitemap_config`
--

LOCK TABLES `sitemap_config` WRITE;
/*!40000 ALTER TABLE `sitemap_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `sitemap_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_categories`
--

DROP TABLE IF EXISTS `sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_categories` (
  `subcategory_id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `name_ta` varchar(255) NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`subcategory_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_n683x888bxcnnnxlgvqp2geav` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,1,'2026-07-17 20:14:57.650853',1,'State','மாநிலம்',NULL,'state','active','2026-07-17 20:14:57.650886'),(2,1,'2026-07-17 20:14:58.346925',2,'National','தேசியம்',NULL,'national','active','2026-07-17 20:14:58.346952'),(3,1,'2026-07-17 20:14:59.025838',3,'International','சர்வதேசம்',NULL,'international','active','2026-07-17 20:14:59.025860'),(4,1,'2026-07-17 20:14:59.716866',4,'Governance','அரசு கொள்கைகள்',NULL,'governance','active','2026-07-17 20:14:59.716891'),(5,2,'2026-07-17 20:15:00.398930',1,'Markets','சந்தை',NULL,'markets','active','2026-07-17 20:15:00.398954'),(6,2,'2026-07-17 20:15:01.078690',2,'Companies','நிறுவனங்கள்',NULL,'companies','active','2026-07-17 20:15:01.078718'),(7,2,'2026-07-17 20:15:01.762516',3,'Investment','முதலீடு',NULL,'investment','active','2026-07-17 20:15:01.762542'),(8,2,'2026-07-17 20:15:02.484466',4,'Startups','ஸ்டார்ட்அப்',NULL,'startups','active','2026-07-17 20:15:02.484490'),(9,3,'2026-07-17 20:15:03.174486',1,'Cricket','கிரிக்கெட்',NULL,'cricket','active','2026-07-17 20:15:03.174510'),(10,3,'2026-07-17 20:15:03.860993',2,'Football','கால்பந்து',NULL,'football','active','2026-07-17 20:15:03.861015'),(11,3,'2026-07-17 20:15:04.546406',3,'Tennis','டென்னிஸ்',NULL,'tennis','active','2026-07-17 20:15:04.546432'),(12,3,'2026-07-17 20:15:05.227258',4,'Local Sports','உள்ளூர்',NULL,'local-sports','active','2026-07-17 20:15:05.227284'),(13,4,'2026-07-17 20:15:05.914237',1,'Kollywood','கோலிவுட்',NULL,'kollywood','active','2026-07-17 20:15:05.914264'),(14,4,'2026-07-17 20:15:06.595151',2,'Bollywood','பாலிவுட்',NULL,'bollywood','active','2026-07-17 20:15:06.595177'),(15,4,'2026-07-17 20:15:07.285887',3,'Reviews','விமர்சனங்கள்',NULL,'reviews','active','2026-07-17 20:15:07.285915'),(16,4,'2026-07-17 20:15:07.971182',4,'Music','இசை',NULL,'music','active','2026-07-17 20:15:07.971207'),(17,5,'2026-07-17 20:15:08.648671',1,'Smartphones','ஸ்மார்ட் போன்',NULL,'smartphones','active','2026-07-17 20:15:08.648701'),(18,5,'2026-07-17 20:15:09.326256',2,'Software','மென்பொருள்',NULL,'software','active','2026-07-17 20:15:09.326298'),(19,5,'2026-07-17 20:15:10.009511',3,'AI','செயற்கை நுண்ணறிவு',NULL,'ai','active','2026-07-17 20:15:10.009579'),(20,5,'2026-07-17 20:15:10.690751',4,'Space','விண்வெளி',NULL,'space','active','2026-07-17 20:15:10.690773'),(21,6,'2026-07-17 20:15:11.372869',1,'World News','உலக செய்திகள்',NULL,'world-news','active','2026-07-17 20:15:11.372890'),(22,6,'2026-07-17 20:15:12.054073',2,'Neighboring Countries','அண்டை நாடுகள்',NULL,'neighbors','active','2026-07-17 20:15:12.054137');
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `success_stories`
--

DROP TABLE IF EXISTS `success_stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `success_stories` (
  `story_id` bigint NOT NULL AUTO_INCREMENT,
  `author_name` varchar(255) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `details` text NOT NULL,
  `is_case_study` bit(1) DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`story_id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `success_stories`
--

LOCK TABLES `success_stories` WRITE;
/*!40000 ALTER TABLE `success_stories` DISABLE KEYS */;
/*!40000 ALTER TABLE `success_stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_polls`
--

DROP TABLE IF EXISTS `survey_polls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_polls` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ends_at` datetime(6) DEFAULT NULL,
  `options_json` text DEFAULT NULL,
  `poll_type` varchar(30) DEFAULT NULL,
  `starts_at` datetime(6) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `target_module` varchar(50) DEFAULT NULL,
  `target_post_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_polls`
--

LOCK TABLES `survey_polls` WRITE;
/*!40000 ALTER TABLE `survey_polls` DISABLE KEYS */;
INSERT INTO `survey_polls` VALUES (1,'2026-07-22 14:08:32.208248',NULL,'field to add additional context for the poll',NULL,'[\"Option 1\",\"Option 2\"]','POLL',NULL,'CLOSED','ARTICLE',NULL,'At the very top','2026-07-22 14:08:45.069176');
/*!40000 ALTER TABLE `survey_polls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_responses`
--

DROP TABLE IF EXISTS `survey_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_responses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `response_text` text DEFAULT NULL,
  `selected_option` varchar(255) DEFAULT NULL,
  `survey_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_responses`
--

LOCK TABLES `survey_responses` WRITE;
/*!40000 ALTER TABLE `survey_responses` DISABLE KEYS */;
/*!40000 ALTER TABLE `survey_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_config`
--

DROP TABLE IF EXISTS `system_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_config` (
  `config_id` bigint NOT NULL AUTO_INCREMENT,
  `config_group` varchar(50) DEFAULT NULL,
  `config_key` varchar(100) NOT NULL,
  `config_value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_encrypted` bit(1) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`config_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_npsxm1erd0lbetjn5d3ayrsof` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_config`
--

LOCK TABLES `system_config` WRITE;
/*!40000 ALTER TABLE `system_config` DISABLE KEYS */;
INSERT INTO `system_config` VALUES (1,'gps','gps.news_radius_km','20','GPS news radius in km',_binary '\0','2026-07-21 09:56:50.785780',1),(2,'video','video.max_duration_seconds','55','Max video duration in seconds',_binary '\0','2026-07-21 08:39:37.300280',1),(3,'pwa','pwa.name','KING24X7 News',NULL,_binary '\0','2026-07-22 14:13:55.225843',1),(4,'pwa','pwa.short_name','KING24X7',NULL,_binary '\0','2026-07-22 14:13:56.931834',1),(5,'pwa','pwa.theme_color','#1e3a8a',NULL,_binary '\0','2026-07-22 14:13:56.075734',1),(6,'pwa','pwa.background_color','#ffffff',NULL,_binary '\0','2026-07-22 14:13:57.787692',1),(30001,'youtube','youtube.api_key','AIzaSyA-LasNGo1npF8LnaAnqe5Z21DZVYufqSY',NULL,_binary '\0','2026-07-22 05:03:36.000000',1),(30002,'youtube','youtube.channel_id','@king24x7',NULL,_binary '\0','2026-07-22 05:03:36.000000',1),(30003,'telegram','telegram.enabled','false',NULL,_binary '\0','2026-07-21 09:56:18.500987',1),(30004,'smtp','smtp.port','587',NULL,_binary '\0','2026-07-21 09:56:18.595738',1),(30005,'cdn','cdn.base_url','',NULL,_binary '\0','2026-07-21 09:56:18.647501',1),(30006,'firebase','firebase.config','','Firebase configuration JSON',_binary '\0','2026-07-21 09:56:18.691703',1),(30007,'sms','sms.gateway_url','',NULL,_binary '\0','2026-07-21 09:56:18.731107',1),(30008,'telegram','telegram.chat_id','',NULL,_binary '\0','2026-07-21 09:56:19.347673',1),(30009,'cdn','cdn.api_key','Co+nmWdPbkWHBXEEpLiK3t8/2RKQqH64oxecEISfzkzcquODbikBasI4SAGGZ1fVfu+03g==',NULL,_binary '','2026-07-22 14:14:09.150670',1),(30010,'smtp','smtp.host','',NULL,_binary '\0','2026-07-21 09:56:19.534388',1),(30011,'sms','sms.gateway_api_key','rlBdYBJr5cLjFkaF5XvQYLLFlb5t9jrZWRBcWeNtD9AfsDCWLk5kEjZ2h+st3GVlZ26vkw==',NULL,_binary '','2026-07-21 09:58:34.388282',1),(30012,'telegram','telegram.bot_token','lIWr7i3TMPW/ijdmeSbLSpRnf7nI4L9begN1VEdPHLR5OskfbjB2a42m2g19h5UW6KlBdQ==',NULL,_binary '','2026-07-21 09:58:35.108733',1),(30013,'smtp','smtp.username','',NULL,_binary '\0','2026-07-21 09:56:20.369524',1),(30014,'smtp','smtp.password','iAC+c4IVx17Ae5hlCOk3ewoPmeEwF/Ev4ORD92PAhiaarn+rLkxhkPIGDXko+NDilYjzvg==',NULL,_binary '','2026-07-22 14:13:44.392908',1),(60001,'ai','ai.llm_api_key','IHeFKr/q5R69T3Didf+EmUyX/X8G0PNtve71cOuCbSDdTl8tRSkAWmQb3HFwizLhVDb9uJL3p9dqAjy1oOD0V7+L3apziZjJn/Nwh49r0tWq',NULL,_binary '','2026-07-22 19:14:53.516984',1),(90001,'notifications','notify.sms.otp','true',NULL,_binary '\0','2026-07-22 14:03:29.274651',1),(90002,'notifications','notify.email.breaking','true',NULL,_binary '\0','2026-07-22 14:03:30.346855',1),(90003,'notifications','notify.email.daily','true',NULL,_binary '\0','2026-07-22 14:03:31.206977',1),(90004,'notifications','notify.sms.breaking','true',NULL,_binary '\0','2026-07-22 14:03:32.062282',1),(90005,'hosting','hosting.render_api_key','8jsjLLF56jydrU4rIa2vj+VjVlaNCG5tJYMwHA==',NULL,_binary '','2026-07-22 14:14:24.248734',1),(90006,'hosting','hosting.vercel_api_key','e+dB41U/tfAVMrZZfxLj/EULMVS7/FujZF7f4g==',NULL,_binary '','2026-07-22 14:14:25.167419',1),(90007,'ai','ai.llm_model','gemini-2.0-flash',NULL,_binary '\0','2026-07-22 18:57:11.459208',1),(90008,'ai','ai.llm_api_url','',NULL,_binary '\0','2026-07-22 18:57:12.644307',1);
/*!40000 ALTER TABLE `system_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ugc_submissions`
--

DROP TABLE IF EXISTS `ugc_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ugc_submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `district_id` bigint DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `published_article_id` bigint DEFAULT NULL,
  `review_reason` text DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `reviewed_by` bigint DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `submitter_email` varchar(100) DEFAULT NULL,
  `submitter_id` bigint DEFAULT NULL,
  `submitter_name` varchar(100) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ugc_submissions`
--

LOCK TABLES `ugc_submissions` WRITE;
/*!40000 ALTER TABLE `ugc_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ugc_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_categories`
--

DROP TABLE IF EXISTS `user_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_at` datetime(6) DEFAULT NULL,
  `assigned_by` bigint DEFAULT NULL,
  `category_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UKfrvl2gup718bsfbyobs5vv014` (`user_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_categories`
--

LOCK TABLES `user_categories` WRITE;
/*!40000 ALTER TABLE `user_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_districts`
--

DROP TABLE IF EXISTS `user_districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_districts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_at` datetime(6) DEFAULT NULL,
  `assigned_by` bigint DEFAULT NULL,
  `district_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK74o8nqpavvivcls4a03d48e0g` (`user_id`,`district_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_districts`
--

LOCK TABLES `user_districts` WRITE;
/*!40000 ALTER TABLE `user_districts` DISABLE KEYS */;
INSERT INTO `user_districts` VALUES (1,'2026-07-18 08:42:20.430378',1,1,30001),(30002,'2026-07-22 09:47:39.613873',1,30006,6),(30003,'2026-07-22 09:49:11.859045',1,30010,60001);
/*!40000 ALTER TABLE `user_districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_preferences`
--

DROP TABLE IF EXISTS `user_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_preferences` (
  `user_id` bigint NOT NULL,
  `font_size` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `primary_color` varchar(255) DEFAULT NULL,
  `slide_speed` int DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `widget_width` int DEFAULT NULL,
  PRIMARY KEY (`user_id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_preferences`
--

LOCK TABLES `user_preferences` WRITE;
/*!40000 ALTER TABLE `user_preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subscriptions`
--

DROP TABLE IF EXISTS `user_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_subscriptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `end_date` datetime(6) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `start_date` datetime(6) NOT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subscriptions`
--

LOCK TABLES `user_subscriptions` WRITE;
/*!40000 ALTER TABLE `user_subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `firebase_uid` varchar(128) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `interests` text DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_verified` bit(1) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `is_2fa_enabled` bit(1) DEFAULT NULL,
  `totp_secret` varchar(32) DEFAULT NULL,
  `two_factor_enabled` bit(1) DEFAULT NULL,
  `two_factor_secret` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'admin@king24x7.com',NULL,'Super Admin',NULL,_binary '',_binary '','2026-07-22 14:49:14.456995',NULL,'$2a$10$oDAbypaVDnHYqrJE8IQTKOcbygKYZK6vqCddASeIFJ46BRS1mmmkC',NULL,NULL,'LOCAL','SUPER_ADMIN',NULL,NULL,NULL,NULL,NULL,NULL),(2,NULL,'editor@king24x7.com',NULL,'Chief Editor',NULL,_binary '',_binary '','2026-07-20 11:44:08.653240',NULL,'$2a$10$9I.tS5Y7wiXulxJLGp9jgu3BUBADb/OKhVDbp/6VQztaeESvmZ0zm',NULL,NULL,'LOCAL','CHIEF_EDITOR',NULL,NULL,NULL,NULL,NULL,NULL),(3,NULL,'district@king24x7.com',NULL,'District Admin Coimbatore',NULL,_binary '',_binary '','2026-07-20 08:17:05.530755',NULL,'$2a$10$dUv5tfUxUlPWDwNciYg7M.gcDHlBbzKdymDScPoNYjq3AS5XPmbjq',NULL,NULL,'LOCAL','DISTRICT_ADMIN',NULL,NULL,NULL,NULL,NULL,NULL),(4,NULL,'reporter@king24x7.com',NULL,'Mobile Journalist',NULL,_binary '',_binary '','2026-07-22 05:20:57.197422',NULL,'$2a$10$I8AUixz6A8m79gtZYJrWw.m5G7DYwkPw.oiH5mhXXxId6WslYzCw6',NULL,NULL,'LOCAL','MOBILE_JOURNALIST',NULL,NULL,NULL,NULL,NULL,NULL),(5,NULL,'vendor@king24x7.com',NULL,'Government Institution',NULL,_binary '',_binary '',NULL,NULL,'$2a$10$lbea5BzffPUYxN/iyeuW9eUESug0cVCrRJhXlX5AXEYvtXe19xE62',NULL,NULL,'LOCAL','INSTITUTION_LOGIN',NULL,NULL,NULL,NULL,NULL,NULL),(6,NULL,'user@king24x7.com',NULL,'Public Reader',NULL,_binary '',_binary '','2026-07-22 05:20:16.096575','chennai','$2a$10$VJ0IAzJlez7r9tv4MrcPLuJ56/JyKfm45DpxnsPzPEcuOTAq4bgDK','9876543210',NULL,'LOCAL','READER',NULL,'',NULL,NULL,NULL,NULL),(60001,NULL,'join@example.com',NULL,'john',NULL,_binary '\0',_binary '',NULL,'chennai','$2a$10$T5HJOF4VSvUh46WugupjMePIREx2KDg1jLtV65yXEJiYnYGMZiLTS','9876543210',NULL,'LOCAL','READER',NULL,NULL,NULL,NULL,_binary '\0',NULL),(60002,NULL,'vishalav@gmail.com',NULL,'vishal',NULL,_binary '',_binary '\0','2026-07-23 01:01:40.408756',NULL,'$2a$10$.04Bkfnbgs5Tf0jSRNWeUuDZ29zG3l2DdrWw.1RbHKrlG2PQ9QWA6',NULL,NULL,'LOCAL','READER',NULL,NULL,NULL,NULL,_binary '\0',NULL),(90001,NULL,'ashwika1137@gmail.com',NULL,'ashwika',NULL,_binary '',_binary '\0','2026-07-22 11:31:41.195819',NULL,'$2a$10$uBz/5MZPcAgJgsRZ3InKjOmdNsRfb/dt2CW/lNaWz3ni7WQv1j0k.',NULL,NULL,'LOCAL','READER',NULL,NULL,NULL,NULL,_binary '\0',NULL),(90002,NULL,'google.tester@gmail.com',NULL,'Google Tester',NULL,_binary '',_binary '','2026-07-22 12:03:02.317296',NULL,'$2a$10$gnItprKiWvXR6yKVcJ.nruu5FzwvsT8keUi7LrU9bbKobSAdne14S',NULL,'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150','GOOGLE','READER',NULL,NULL,NULL,NULL,_binary '\0',NULL),(90003,NULL,'phone_8667739497@king24x7.com',NULL,'Phone User 9497',NULL,_binary '',_binary '','2026-07-22 12:04:22.214391',NULL,'$2a$10$KGDzkzj47WBjmhXyfx3nHOEZ6LhC9urdzTjaNjrDtSwcvN8zwMsaW',NULL,'','GOOGLE','READER',NULL,NULL,NULL,NULL,_binary '\0',NULL),(90005,NULL,'phone_9876543210@king24x7.com',NULL,'Phone User 3210',NULL,_binary '',_binary '','2026-07-22 22:48:35.083508',NULL,'$2a$10$QKrNTN5CGGTKX/KL1cCkleZJBvbU0d4luqbimDVa7h/MU8rbsLxku',NULL,'','PHONE','READER',NULL,NULL,NULL,NULL,_binary '\0',NULL),(90006,NULL,'phone_8122089830@king24x7.com',NULL,'Phone User 9830',NULL,_binary '',_binary '','2026-07-22 22:56:08.372838',NULL,'$2a$10$6MVzpWlxM2IvybsTZnT5qe8ZBU.ZjGe34a75eN.dT5k4yuuZftDsi',NULL,'','PHONE','READER',NULL,NULL,NULL,NULL,_binary '\0',NULL),(90007,NULL,'phone_918122089830@king24x7.com',NULL,'Phone User 9830',NULL,_binary '',_binary '','2026-07-23 00:37:33.402683',NULL,'$2a$10$FU8O6uY9ycOcYwQ3Tfz4..kwd2DZAsgE0Yd7uX2xi5bwXAeosCSHS',NULL,'','GOOGLE','READER',NULL,NULL,NULL,NULL,_binary '\0',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_contents`
--

DROP TABLE IF EXISTS `video_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_contents` (
  `video_id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration_seconds` int DEFAULT NULL,
  `is_live_tv` int DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `views_count` int DEFAULT NULL,
  `youtube_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`video_id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_contents`
--

LOCK TABLES `video_contents` WRITE;
/*!40000 ALTER TABLE `video_contents` DISABLE KEYS */;
INSERT INTO `video_contents` VALUES (1,1,'தமிழக பட்ஜெட் கூட்டத்தொடர் நேரடித் தகவல்கள்.',7200,1,'2026-07-17 20:15:19.532729','published','https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800','தமிழக சட்டமன்ற பட்ஜெட் உரை நேரடி ஒளிபரப்பு 2026',0,'https://www.youtube.com/watch?v=live1'),(2,3,'சென்னை சூப்பர் கிங்ஸ் அணியின் புதிய கேப்டன் தலைமையில் பயிற்சி.',300,0,'2026-07-17 20:15:20.216666','published','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800','ஐபிஎல் 2025: சிஎஸ்கே அணியின் புதிய வியூகங்கள் மற்றும் பயிற்சி ஆட்டங்கள்',0,'https://www.youtube.com/watch?v=csk1');
/*!40000 ALTER TABLE `video_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_stories`
--

DROP TABLE IF EXISTS `web_stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_stories` (
  `story_id` bigint NOT NULL AUTO_INCREMENT,
  `background_gradient` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badge` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `slides_json` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_en` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_ta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `views_count` int DEFAULT NULL,
  PRIMARY KEY (`story_id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_stories`
--

LOCK TABLES `web_stories` WRITE;
/*!40000 ALTER TABLE `web_stories` DISABLE KEYS */;
INSERT INTO `web_stories` VALUES (1,'linear-gradient(135deg, #FF5722, #FF9800)','NEW','sports',3,'2026-07-17 20:15:32.786887','2026-07-17 20:15:32.786870','[{\"titleTa\":\"ருதுராஜ் கெய்க்வாட் நியமனம்\",\"titleEn\":\"Ruturaj Gaikwad Appointed\",\"descTa\":\"சென்னை சூப்பர் கிங்ஸ் அணியின் புதிய கேப்டனாக ருதுராஜ் கெய்க்வாட் நியமிக்கப்பட்டுள்ளார்.\",\"descEn\":\"Ruturaj Gaikwad has been officially appointed as the new captain of Chennai Super Kings.\"},{\"titleTa\":\"தோனியின் ஆலோசனை\",\"titleEn\":\"Dhoni Advises\",\"descTa\":\"ருதுராஜின் தலைமைப் பண்பை வளர்க்கும் வகையில் தோனி அவருக்கு முக்கிய ஆலோசனைகளை வழங்கியுள்ளார்.\",\"descEn\":\"Dhoni has shared key leadership strategies with Gaikwad to ensure a smooth transition.\"},{\"titleTa\":\"ரசிகர்களின் எதிர்பார்ப்பு\",\"titleEn\":\"Fans Expectations\",\"descTa\":\"புதிய கேப்டனின் தலைமையில் சென்னை அணி மீண்டும் சாம்பியன் கோப்பையை வெல்லும் என ரசிகர்கள் நம்புகின்றனர்.\",\"descEn\":\"Fans are highly optimistic that Chennai will lift the cup again under the new captaincy.\"}]','published','IPL 2025: Who is the next captain of CSK?','IPL 2025: Who is the next captain of CSK?','ஐபிஎல் 2025: சிஎஸ்கே புதிய கேப்டன் யார்?','2026-07-17 20:15:32.786889',0),(2,'linear-gradient(135deg, #E91E63, #9C27B0)','HOT','cinema',4,'2026-07-17 20:15:33.479557','2026-07-17 20:15:33.479544','[{\"titleTa\":\"மாபெரும் எதிர்பார்ப்புகள்\",\"titleEn\":\"High Expectations\",\"descTa\":\"தளபதி விஜய் நடிக்கும் கடைசி திரைப்படம் என்பதால் தமிழகம் முழுவதும் பெரும் எதிர்பார்ப்பு கிளம்பியுள்ளது.\",\"descEn\":\"As it marks the final on-screen outing of Thalapathy Vijay, expectations are soaring sky-high.\"},{\"titleTa\":\"வெங்கட் பிரபு இயக்கம்\",\"titleEn\":\"Direction by Venkat Prabhu\",\"descTa\":\"புதுமையான பாணியில் திரைக்கதை அமைப்பதில் வல்லவரான வெங்கட் பிரபு இந்த படத்தை இயக்குகிறார்.\",\"descEn\":\"Director Venkat Prabhu known for his screenplay tricks is handling this political action entertainer.\"},{\"titleTa\":\"அனிருத் இசையமைப்பு\",\"titleEn\":\"Musical Scores by Anirudh\",\"descTa\":\"திரைப்படத்தின் பாடல்கள் மற்றும் பின்னணி இசையை ராக்ஸ்டார் அனிருத் வடிவமைக்கிறார்.\",\"descEn\":\"Rockstar Anirudh is scoring the tracks, promising a massive audio treat for fans.\"}]','published','Vijay final movie: What can we expect?','Vijay final movie: What can we expect?','விஜய்யின் கடைசி படம்: என்ன எதிர்பார்ப்பு?','2026-07-17 20:15:33.479559',0);
/*!40000 ALTER TABLE `web_stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webstore_items`
--

DROP TABLE IF EXISTS `webstore_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `webstore_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `stock_qty` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webstore_items`
--

LOCK TABLES `webstore_items` WRITE;
/*!40000 ALTER TABLE `webstore_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `webstore_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish`
--

DROP TABLE IF EXISTS `wish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_count` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `is_sponsored` bit(1) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `message` text NOT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `reaction_count` int DEFAULT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `recipient_photo` varchar(255) DEFAULT NULL,
  `relationship` varchar(255) DEFAULT NULL,
  `scheduled_publish_at` datetime(6) DEFAULT NULL,
  `sender_name` varchar(255) NOT NULL,
  `sender_profile` varchar(255) DEFAULT NULL,
  `share_count` int DEFAULT NULL,
  `sponsor_logo` varchar(255) DEFAULT NULL,
  `sponsor_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `taluk_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `uuid` varchar(255) NOT NULL,
  `view_count` int DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `district_id` bigint DEFAULT NULL,
  `frame_template_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_15yf3l44ovlck2u09ddjxjwa9` (`uuid`),
  KEY `FKi0lwfqkkc1bu4ocqvxvj1n9s` (`category_id`),
  KEY `FKnrsgfh1enw3c48whtsjut6gis` (`district_id`),
  KEY `FKbiqj6l2x35yo76e8mggdxdlm4` (`frame_template_id`),
  CONSTRAINT `FKi0lwfqkkc1bu4ocqvxvj1n9s` FOREIGN KEY (`category_id`) REFERENCES `wish_categories` (`id`),
  CONSTRAINT `FKnrsgfh1enw3c48whtsjut6gis` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`),
  CONSTRAINT `FKbiqj6l2x35yo76e8mggdxdlm4` FOREIGN KEY (`frame_template_id`) REFERENCES `wish_frame_templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish`
--

LOCK TABLES `wish` WRITE;
/*!40000 ALTER TABLE `wish` DISABLE KEYS */;
INSERT INTO `wish` VALUES (1,0,'2026-07-17 20:15:30.619508',NULL,_binary '\0',_binary '\0',NULL,NULL,'அன்பான கார்த்திகேயன் மற்றும் அனிதா தம்பதியினருக்கு எங்களது இனிய திருமண நாள் நல்வாழ்த்துக்கள்! உங்கள் வாழ்வில் மகிழ்ச்சி என்றும் நிலைக்கட்டும்.',NULL,'2026-07-17 20:15:30.619484',0,'கார்த்திகேயன் - அனிதா தம்பதியினர்',NULL,NULL,NULL,'சுரேஷ் மற்றும் குடும்பத்தினர்',NULL,0,NULL,NULL,'published',NULL,'2026-07-17 20:15:30.619513',NULL,'06e6a781-a042-4826-8f4a-9cfb232d57a2',0,10,NULL,NULL),(2,0,'2026-07-17 20:15:31.694141',NULL,_binary '\0',_binary '\0',NULL,NULL,'அன்பு மகன் சஞ்சய் ராஜுக்கு இனிய பிறந்தநாள் நல்வாழ்த்துக்கள்! கல்வியிலும் ஒழுக்கத்திலும் சிறந்து விளங்க வாழ்த்துகிறோம்.',NULL,'2026-07-17 20:15:31.694103',0,'செல்வன். சஞ்சய் ராஜ் (வயது 12)',NULL,NULL,NULL,'பெற்றோர்கள் மற்றும் உறவினர்கள்',NULL,0,NULL,NULL,'published',NULL,'2026-07-17 20:15:31.694144',NULL,'9fab3af3-82b9-44fe-9425-e86773643487',0,10,NULL,NULL);
/*!40000 ALTER TABLE `wish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_categories`
--

DROP TABLE IF EXISTS `wish_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `color` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `name_ta` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_v8jrbp5akhnvl2vy96ljkxfm` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_categories`
--

LOCK TABLES `wish_categories` WRITE;
/*!40000 ALTER TABLE `wish_categories` DISABLE KEYS */;
INSERT INTO `wish_categories` VALUES (1,'bg-pink-50 text-pink-500','2026-07-17 20:13:48.843256',_binary '\0','fa-birthday-cake','Birthday','பிறந்தநாள்','birthday','2026-07-17 20:13:48.843281'),(2,'bg-red-50 text-red-500','2026-07-17 20:13:50.020133',_binary '\0','fa-heart','Anniversary','திருமண ஆண்டு','anniversary','2026-07-17 20:13:50.020166'),(3,'bg-rose-50 text-rose-500','2026-07-17 20:13:50.790762',_binary '\0','fa-ring','Wedding','திருமணம்','wedding','2026-07-17 20:13:50.790785'),(4,'bg-yellow-50 text-yellow-500','2026-07-17 20:13:51.485151',_binary '\0','fa-trophy','Achievement','சாதனை','achievement','2026-07-17 20:13:51.485176'),(5,'bg-indigo-50 text-indigo-500','2026-07-17 20:13:52.202859',_binary '\0','fa-graduation-cap','Graduation','படிப்பு சாதனை','graduation','2026-07-17 20:13:52.202885'),(6,'bg-orange-50 text-orange-500','2026-07-17 20:13:52.985072',_binary '\0','fa-star','Festival','விழா வாழ்த்து','festival','2026-07-17 20:13:52.985096'),(7,'bg-teal-50 text-teal-500','2026-07-17 20:13:53.716916',_binary '\0','fa-home','House Warming','வீடு புகுவிழா','house-warming','2026-07-17 20:13:53.716937'),(8,'bg-blue-50 text-blue-500','2026-07-17 20:13:54.485487',_binary '\0','fa-user-tie','Retirement','ஓய்வு பெறுதல்','retirement','2026-07-17 20:13:54.485509'),(9,'bg-cyan-50 text-cyan-500','2026-07-17 20:13:55.162431',_binary '\0','fa-baby','Newborn','புதிய குழந்தை','newborn','2026-07-17 20:13:55.162453'),(10,'bg-gray-50 text-gray-500','2026-07-17 20:13:55.841131',_binary '\0','fa-smile','General','பொது வாழ்த்து','general','2026-07-17 20:13:55.841160');
/*!40000 ALTER TABLE `wish_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_comment_likes`
--

DROP TABLE IF EXISTS `wish_comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_comment_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `comment_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKda9v91vis976vtlrx6eou4xls` (`comment_id`),
  CONSTRAINT `FKda9v91vis976vtlrx6eou4xls` FOREIGN KEY (`comment_id`) REFERENCES `wish_comments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_comment_likes`
--

LOCK TABLES `wish_comment_likes` WRITE;
/*!40000 ALTER TABLE `wish_comment_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_comments`
--

DROP TABLE IF EXISTS `wish_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` text NOT NULL,
  `commenter_name` varchar(255) NOT NULL,
  `commenter_photo` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `like_count` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  `wish_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK38v18j3dtv625eii3343nyy4s` (`parent_id`),
  KEY `FKainp446nami728yhi33xsmg57` (`wish_id`),
  CONSTRAINT `FK38v18j3dtv625eii3343nyy4s` FOREIGN KEY (`parent_id`) REFERENCES `wish_comments` (`id`),
  CONSTRAINT `FKainp446nami728yhi33xsmg57` FOREIGN KEY (`wish_id`) REFERENCES `wish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_comments`
--

LOCK TABLES `wish_comments` WRITE;
/*!40000 ALTER TABLE `wish_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_frame_templates`
--

DROP TABLE IF EXISTS `wish_frame_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_frame_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `background_url` varchar(255) DEFAULT NULL,
  `border_color` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `overlay_url` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `text_color` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_svrstq89dc2aix9dhf5p0d6pc` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_frame_templates`
--

LOCK TABLES `wish_frame_templates` WRITE;
/*!40000 ALTER TABLE `wish_frame_templates` DISABLE KEYS */;
INSERT INTO `wish_frame_templates` VALUES (1,NULL,'#ec4899','2026-07-17 20:13:57.530293',_binary '\0','Birthday Frame',NULL,'birthday-frame','#ec4899','2026-07-17 20:13:57.530318'),(2,NULL,'#ef4444','2026-07-17 20:13:58.214446',_binary '\0','Anniversary Frame',NULL,'anniversary-frame','#ef4444','2026-07-17 20:13:58.214468'),(3,NULL,'#6366f1','2026-07-17 20:13:58.904297',_binary '\0','Graduation Frame',NULL,'graduation-frame','#6366f1','2026-07-17 20:13:58.904321'),(4,NULL,'#eab308','2026-07-17 20:13:59.582310',_binary '\0','Achievement Frame',NULL,'achievement-frame','#eab308','2026-07-17 20:13:59.582335');
/*!40000 ALTER TABLE `wish_frame_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_gallery`
--

DROP TABLE IF EXISTS `wish_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_gallery` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `wish_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKer983jvx308jwbq860fhgkvpd` (`wish_id`),
  CONSTRAINT `FKer983jvx308jwbq860fhgkvpd` FOREIGN KEY (`wish_id`) REFERENCES `wish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_gallery`
--

LOCK TABLES `wish_gallery` WRITE;
/*!40000 ALTER TABLE `wish_gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_notifications`
--

DROP TABLE IF EXISTS `wish_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `message` text NOT NULL,
  `recipient_user_id` bigint NOT NULL,
  `type` varchar(255) NOT NULL,
  `wish_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK44xfm6macct59mg5hvn5xpby7` (`wish_id`),
  CONSTRAINT `FK44xfm6macct59mg5hvn5xpby7` FOREIGN KEY (`wish_id`) REFERENCES `wish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_notifications`
--

LOCK TABLES `wish_notifications` WRITE;
/*!40000 ALTER TABLE `wish_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_reactions`
--

DROP TABLE IF EXISTS `wish_reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_reactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `reaction_type` varchar(255) NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `wish_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKpx426o14jmbkx82jx1ypkqcap` (`wish_id`),
  CONSTRAINT `FKpx426o14jmbkx82jx1ypkqcap` FOREIGN KEY (`wish_id`) REFERENCES `wish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_reactions`
--

LOCK TABLES `wish_reactions` WRITE;
/*!40000 ALTER TABLE `wish_reactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_reports`
--

DROP TABLE IF EXISTS `wish_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `reason` text NOT NULL,
  `reporter_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `wish_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKhgif051lic9vxxv2jpdhwlj3q` (`wish_id`),
  CONSTRAINT `FKhgif051lic9vxxv2jpdhwlj3q` FOREIGN KEY (`wish_id`) REFERENCES `wish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_reports`
--

LOCK TABLES `wish_reports` WRITE;
/*!40000 ALTER TABLE `wish_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_saved`
--

DROP TABLE IF EXISTS `wish_saved`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_saved` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `wish_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKkgdlo2yhtojn0wxnvsgxh40cj` (`wish_id`),
  CONSTRAINT `FKkgdlo2yhtojn0wxnvsgxh40cj` FOREIGN KEY (`wish_id`) REFERENCES `wish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_saved`
--

LOCK TABLES `wish_saved` WRITE;
/*!40000 ALTER TABLE `wish_saved` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_saved` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_shares`
--

DROP TABLE IF EXISTS `wish_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_shares` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `wish_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKfa6919xcogb6h5mfspjlj7x8h` (`wish_id`),
  CONSTRAINT `FKfa6919xcogb6h5mfspjlj7x8h` FOREIGN KEY (`wish_id`) REFERENCES `wish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_shares`
--

LOCK TABLES `wish_shares` WRITE;
/*!40000 ALTER TABLE `wish_shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_views`
--

DROP TABLE IF EXISTS `wish_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `wish_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK480nvd35din63j2179e1vyo8` (`wish_id`),
  CONSTRAINT `FK480nvd35din63j2179e1vyo8` FOREIGN KEY (`wish_id`) REFERENCES `wish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_views`
--

LOCK TABLES `wish_views` WRITE;
/*!40000 ALTER TABLE `wish_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_views` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-23  2:01:41
