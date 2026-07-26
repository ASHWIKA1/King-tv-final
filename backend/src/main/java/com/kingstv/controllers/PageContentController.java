package com.kingstv.controllers;

import com.kingstv.models.PageContent;
import com.kingstv.repository.PageContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/pages")
public class PageContentController {

    @Autowired
    private PageContentRepository pageContentRepository;

    @GetMapping("/{pageKey}")
    public ResponseEntity<?> getPageContent(@PathVariable String pageKey) {
        Optional<PageContent> pageOpt = pageContentRepository.findById(pageKey);
        if (pageOpt.isPresent()) {
            return ResponseEntity.ok(pageOpt.get());
        }

        // Return a dynamic placeholder template to prevent UI crashes if DB is unseeded
        PageContent fallback = new PageContent();
        fallback.setPageKey(pageKey);
        
        if ("about-us".equalsIgnoreCase(pageKey)) {
            fallback.setTitleTa("எங்களைப் பற்றி - KINGS 24x7");
            fallback.setTitleEn("About Us - KINGS 24x7");
            fallback.setContentTa("கிங்ஸ் 24x7 என்பது தமிழ்நாட்டைச் சேர்ந்த ஒரு முன்னணி டிஜிட்டல் செய்தி போர்டல் மற்றும் தொலைக்காட்சி ஊடகமாகும். நடுநிலையான, விரைவான மற்றும் துல்லியமான செய்திகளை வழங்குவதை லட்சியமாகக் கொண்டு, அரசியல், வணிகம், விளையாட்டு, பொழுதுபோக்கு, தொழில்நுட்பம் மற்றும் உள்ளூர் நிகழ்வுகளை 24 மணி நேரமும் உடனுக்குடன் வழங்கி வருகிறோம். எங்களது தாரக மந்திரம்: உண்மை. பொறுப்புடன். தமிழில்.");
            fallback.setContentEn("KINGS 24x7 is a premier digital news portal and television library broadcaster based in Tamil Nadu. Founded with a vision to deliver unbiased, prompt, and accurate news, we provide round-the-clock coverage of politics, business, sports, entertainment, technology, and regional updates. Our motto: Truth. Responsibility. In Tamil.");
            fallback.setContactPhone("+91 98765 43210");
            fallback.setContactEmail("contact@kingstv.com");
            fallback.setContactAddress("123, Anna Salai, Chennai, Tamil Nadu, India");
            fallback.setGoogleMapUrl("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8522384501725!2d80.25828457593673!3d13.044983013280456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52663b6a95fdf5%3A0x6b63d76e737c355c!2sAnna%20Salai%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1720420000000!5m2!1sen!2sin");
        } else if ("contact".equalsIgnoreCase(pageKey)) {
            fallback.setTitleTa("தொடர்புக்கு");
            fallback.setTitleEn("Contact Us");
            fallback.setContentTa("கிங்ஸ் 24x7 செய்தி நிறுவனத்தைத் தொடர்பு கொள்ளவும். உங்களிடம் ஏதேனும் செய்தி குறிப்புகள், விளம்பரத் தேவைகள், பின்னூட்டங்கள் இருந்தால் அல்லது எங்களது ஆதரவு தேவைப்பட்டால், கீழே உள்ள விவரங்கள் மூலம் எங்களது ஆசிரியர் மற்றும் தொழில்நுட்ப ஆதரவு குழுவைத் தொடர்பு கொள்ளலாம்.");
            fallback.setContentEn("Get in touch with KINGS 24x7. Whether you have a news tip, query, advertising requirement, feedback, or need technical support, our editorial and support desks are here to assist you.");
            fallback.setContactPhone("+91 98765 43210");
            fallback.setContactEmail("contact@kingstv.com");
            fallback.setContactAddress("123, Anna Salai, Chennai, Tamil Nadu, India");
            fallback.setGoogleMapUrl("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8522384501725!2d80.25828457593673!3d13.044983013280456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52663b6a95fdf5%3A0x6b63d76e737c355c!2sAnna%20Salai%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1720420000000!5m2!1sen!2sin");
        } else if ("advertise".equalsIgnoreCase(pageKey)) {
            fallback.setTitleTa("விளம்பரம் செய்ய");
            fallback.setTitleEn("Advertise with Us");
            fallback.setContentTa("உங்கள் பிராண்டை கிங்ஸ் 24x7 மூலம் மக்களிடம் கொண்டு சேர்க்கவும். எங்களது இணையதளம், மொபைல் செயலி மற்றும் லைவ் டிவி மூலமாக தினமும் லட்சக்கணக்கான வாசகர்களைச் சென்றடைய சிறந்த விளம்பரத் திட்டங்களை வழங்குகிறோம். வணிக ரீதியான தொடர்புகளுக்கு எங்களது விளம்பரக் குழுவினரைத் தொடர்பு கொள்ளவும்.");
            fallback.setContentEn("Promote your brand with KINGS 24x7. We offer tailored advertising packages across our web portal, mobile app, and Live TV stream to help you reach millions of active viewers daily. Contact our ad sales team for custom business proposals.");
            fallback.setContactPhone("+91 98765 43211");
            fallback.setContactEmail("ads@kingstv.com");
            fallback.setContactAddress("Marketing Dept, 123, Anna Salai, Chennai, Tamil Nadu, India");
        } else if ("careers".equalsIgnoreCase(pageKey)) {
            fallback.setTitleTa("வேலைவாய்ப்பு - எங்களோடு இணையுங்கள்");
            fallback.setTitleEn("Careers - Join Our Team");
            fallback.setContentTa("கிங்ஸ் 24x7 உடன் இணைந்து டிஜிட்டல் இதழியல் துறையின் எதிர்காலத்தை உருவாக்குங்கள். ஊடகம், வீடியோ எடிட்டிங் மற்றும் மென்பொருள் மேம்பாட்டுத் துறையில் ஆர்வம் கொண்ட திறமையான இளைஞர்களிடம் இருந்து விண்ணப்பங்களை வரவேற்கிறோம். தகுதியான நபர்கள் தங்கள் சுயவிவரத்தை careers@kingstv.com என்ற மின்னஞ்சலுக்கு அனுப்பலாம்.");
            fallback.setContentEn("Build the future of digital journalism with KINGS 24x7. We look forward to talented journalists, video editors, anchors, and software engineers who are passionate about storytelling and technology. Qualified candidates can send their resumes to careers@kingstv.com.");
        } else if ("privacy-policy".equalsIgnoreCase(pageKey)) {
            fallback.setTitleTa("தனியுரிமைக் கொள்கை");
            fallback.setTitleEn("Privacy Policy");
            fallback.setContentTa("எங்கள் வாசகர்களின் தரவுப் பாதுகாப்பு மற்றும் தனியுரிமையை நாங்கள் மதிக்கிறோம். கிங்ஸ் 24x7 உங்கள் தனிப்பட்ட தரவைப் பாதுகாக்கவும், பாதுகாப்பான உலாவல் சூழலை உறுதி செய்யவும், மற்றும் குக்கீகளை வெளிப்படைத்தன்மையுடன் கையாளவும் கடமைப்பட்டுள்ளது. உங்கள் அனுமதியின்றி உங்களது விவரங்கள் யாரிடமும் பகிரப்பட மாட்டாது.");
            fallback.setContentEn("Your privacy is important to us. KINGS 24x7 is committed to protecting your personal data, ensuring secure transactions, and transparently handling cookies and tracking tools on our web portal. Your data will never be shared without your explicit consent.");
        } else if ("terms-of-use".equalsIgnoreCase(pageKey)) {
            fallback.setTitleTa("பயன்பாட்டு விதிமுறைகள்");
            fallback.setTitleEn("Terms of Use");
            fallback.setContentTa("கிங்ஸ் 24x7 சேவைகளை நீங்கள் அணுகும்போது இந்த பயன்பாட்டு விதிமுறைகளை ஏற்றுக்கொள்கிறீர்கள். இங்குள்ள அனைத்து செய்திகள், வீடியோக்கள், கட்டுரைகள் மற்றும் லோகோக்கள் கிங்ஸ் 24x7 நிறுவனத்தின் பதிப்புரிமை பெற்ற சொத்துக்களாகும். எங்களது எழுத்துப்பூர்வ அனுமதியின்றி இவற்றை மறுபிரசுரம் செய்ய அனுமதி இல்லை.");
            fallback.setContentEn("By accessing the KINGS 24x7 portal, you agree to comply with our Terms of Use. All content, articles, trademarks, logos, and video streams are the intellectual property of KINGS 24x7 and cannot be reproduced without prior written permission.");
        } else {
            fallback.setTitleTa("செய்திகள்");
            fallback.setTitleEn("Page");
            fallback.setContentTa("விவரங்கள் விரைவில் பதிவேற்றப்படும்.");
            fallback.setContentEn("Content will be updated shortly.");
        }

        return ResponseEntity.ok(fallback);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> saveUpdate(@RequestBody PageContent pageContent) {
        if (pageContent.getPageKey() == null || pageContent.getTitleTa() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "pageKey and Title (Tamil) are required"));
        }
        PageContent saved = pageContentRepository.save(pageContent);
        return ResponseEntity.ok(saved);
    }
}
