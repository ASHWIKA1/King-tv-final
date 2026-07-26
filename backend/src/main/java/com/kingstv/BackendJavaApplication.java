package com.kingstv;

import com.kingstv.repository.ClassifiedCategoryRepository;
import com.kingstv.models.ClassifiedCategory;
import com.kingstv.repository.ClassifiedSubcategoryRepository;
import com.kingstv.models.ClassifiedSubcategory;

import com.kingstv.repository.JobCategoryRepository;
import com.kingstv.models.JobCategory;
import com.kingstv.repository.CompanyRepository;
import com.kingstv.models.Company;

import com.kingstv.repository.ObituaryFrameTemplateRepository;
import com.kingstv.models.ObituaryFrameTemplate;

import com.kingstv.models.User;
import com.kingstv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@SpringBootApplication
@EnableCaching
@EnableScheduling
public class BackendJavaApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.kingstv.repository.WishCategoryRepository wishCategoryRepository;

    @Autowired
    private com.kingstv.repository.WishFrameTemplateRepository wishFrameTemplateRepository;

    @Autowired
    private ObituaryFrameTemplateRepository obituaryFrameTemplateRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private ClassifiedCategoryRepository classifiedCategoryRepository;

    @Autowired
    private ClassifiedSubcategoryRepository classifiedSubcategoryRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public static void main(String[] args) {
        System.setOut(new com.kingstv.services.MaskingPrintStream(System.out, System.out));
        System.setErr(new com.kingstv.services.MaskingPrintStream(System.err, System.err));
        SpringApplication.run(BackendJavaApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        updatePasswordIfPresent("admin@king24x7.com", "admin123");
        updatePasswordIfPresent("vendor@king24x7.com", "vendor123");
        updatePasswordIfPresent("editor@king24x7.com", "editor123");
        updatePasswordIfPresent("reporter@king24x7.com", "reporter123");
        updatePasswordIfPresent("user@king24x7.com", "user123");

        seedCategories();
        seedFrameTemplates();
        seedObituaryFrameTemplates();
        seedJobCategoriesAndCompanies();
        seedClassifiedCategoriesAndSubcategories();
    }

    private void seedCategories() {
        if (wishCategoryRepository.count() == 0) {
            saveCategory("birthday", "Birthday", "பிறந்தநாள்", "fa-birthday-cake", "bg-pink-50 text-pink-500");
            saveCategory("anniversary", "Anniversary", "திருமண ஆண்டு", "fa-heart", "bg-red-50 text-red-500");
            saveCategory("wedding", "Wedding", "திருமணம்", "fa-ring", "bg-rose-50 text-rose-500");
            saveCategory("achievement", "Achievement", "சாதனை", "fa-trophy", "bg-yellow-50 text-yellow-500");
            saveCategory("graduation", "Graduation", "படிப்பு சாதனை", "fa-graduation-cap", "bg-indigo-50 text-indigo-500");
            saveCategory("festival", "Festival", "விழா வாழ்த்து", "fa-star", "bg-orange-50 text-orange-500");
            saveCategory("house-warming", "House Warming", "வீடு புகுவிழா", "fa-home", "bg-teal-50 text-teal-500");
            saveCategory("retirement", "Retirement", "ஓய்வு பெறுதல்", "fa-user-tie", "bg-blue-50 text-blue-500");
            saveCategory("newborn", "Newborn", "புதிய குழந்தை", "fa-baby", "bg-cyan-50 text-cyan-500");
            saveCategory("general", "General", "பொது வாழ்த்து", "fa-smile", "bg-gray-50 text-gray-500");
            System.out.println("Default wish categories seeded.");
        }
    }

    private void saveCategory(String slug, String name, String nameTa, String icon, String color) {
        com.kingstv.models.WishCategory cat = new com.kingstv.models.WishCategory();
        cat.setSlug(slug);
        cat.setName(name);
        cat.setNameTa(nameTa);
        cat.setIcon(icon);
        cat.setColor(color);
        wishCategoryRepository.save(cat);
    }

    private void seedFrameTemplates() {
        if (wishFrameTemplateRepository.count() == 0) {
            saveTemplate("birthday-frame", "Birthday Frame", "#ec4899", "#ec4899");
            saveTemplate("anniversary-frame", "Anniversary Frame", "#ef4444", "#ef4444");
            saveTemplate("graduation-frame", "Graduation Frame", "#6366f1", "#6366f1");
            saveTemplate("achievement-frame", "Achievement Frame", "#eab308", "#eab308");
            System.out.println("Default wish frame templates seeded.");
        }
    }

    private void saveTemplate(String slug, String name, String borderColor, String textColor) {
        com.kingstv.models.WishFrameTemplate t = new com.kingstv.models.WishFrameTemplate();
        t.setSlug(slug);
        t.setName(name);
        t.setBorderColor(borderColor);
        t.setTextColor(textColor);
        wishFrameTemplateRepository.save(t);
    }

    private void updatePasswordIfPresent(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            System.out.println("Updated password for " + email);
        }
    }


    private void seedObituaryFrameTemplates() {
        if (obituaryFrameTemplateRepository.count() == 0) {
            saveObitTemplate("floral", "Floral Frame");
            saveObitTemplate("golden", "Golden Frame");
            saveObitTemplate("traditional", "Traditional Frame");
            saveObitTemplate("white", "White Memorial Frame");
            saveObitTemplate("premium", "Premium Frame");
            System.out.println("Default obituary frame templates seeded.");
        }
    }

    private void saveObitTemplate(String category, String name) {
        ObituaryFrameTemplate t = new ObituaryFrameTemplate();
        t.setCategory(category);
        t.setName(name);
        t.setIsActive(true);
        t.setDisplayOrder(0);
        obituaryFrameTemplateRepository.save(t);
    }


    private void seedJobCategoriesAndCompanies() {
        if (jobCategoryRepository.count() == 0) {
            saveJobCategory("IT & Software", "it-software", "fa-laptop-code", 2845, 120);
            saveJobCategory("Sales & Marketing", "sales-marketing", "fa-bullhorn", 4126, 180);
            saveJobCategory("Education", "education", "fa-book-reader", 3245, 95);
            saveJobCategory("Healthcare", "healthcare", "fa-heartbeat", 2087, 60);
            saveJobCategory("Engineering", "engineering", "fa-cog", 3789, 140);
            saveJobCategory("Government", "government", "fa-landmark", 1678, 20);
            saveJobCategory("Banking & Finance", "banking-finance", "fa-money-check-alt", 2345, 75);
            saveJobCategory("Others", "others", "fa-th-large", 5678, 300);
            System.out.println("Default job categories seeded.");
        }

        if (companyRepository.count() == 0) {
            saveCompany("Tata Consultancy Services", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100", "Coimbatore, Tamil Nadu", "it");
            saveCompany("Zoho Corporation", "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100", "Chennai, Tamil Nadu", "it");
            saveCompany("HDFC Bank", "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=100", "Salem, Tamil Nadu", "finance");
            saveCompany("Apollo Hospitals", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100", "Trichy, Tamil Nadu", "healthcare");
            System.out.println("Default companies seeded.");
        }
    }

    private void saveJobCategory(String name, String slug, String icon, int jobs, int companies) {
        JobCategory c = new JobCategory();
        c.setName(name);
        c.setSlug(slug);
        c.setIcon(icon);
        c.setActiveJobCount(jobs);
        c.setCompaniesHiringCount(companies);
        jobCategoryRepository.save(c);
    }

    private void saveCompany(String name, String logo, String address, String industry) {
        Company c = new Company();
        c.setCompanyName(name);
        c.setLogo(logo);
        c.setAddress(address);
        c.setIndustry(industry);
        c.setVerified(true);
        companyRepository.save(c);
    }


    private void seedClassifiedCategoriesAndSubcategories() {
        if (classifiedCategoryRepository.count() == 0) {
            ClassifiedCategory v = saveClassifiedCategory("Vehicles", "vehicles", "fa-car", 12458);
            saveClassifiedSubcat(v, "Cars", "cars");
            saveClassifiedSubcat(v, "Bikes", "bikes");

            ClassifiedCategory p = saveClassifiedCategory("Property", "property", "fa-home", 8923);
            saveClassifiedSubcat(p, "Apartments", "apartments");
            saveClassifiedSubcat(p, "Houses", "houses");

            ClassifiedCategory m = saveClassifiedCategory("Mobiles & Tablets", "mobiles-tablets", "fa-mobile-alt", 15267);
            saveClassifiedSubcat(m, "Mobiles", "mobiles");
            saveClassifiedSubcat(m, "Tablets", "tablets");

            ClassifiedCategory e = saveClassifiedCategory("Electronics", "electronics", "fa-laptop", 6482);
            saveClassifiedSubcat(e, "Laptops", "laptops");
            saveClassifiedSubcat(e, "TVs", "tvs");

            ClassifiedCategory h = saveClassifiedCategory("Home & Furniture", "home-furniture", "fa-couch", 7351);
            saveClassifiedSubcat(h, "Furniture", "furniture");
            saveClassifiedSubcat(h, "Home Appliances", "appliances");

            ClassifiedCategory f = saveClassifiedCategory("Fashion & Lifestyle", "fashion-lifestyle", "fa-tshirt", 5632);
            saveClassifiedSubcat(f, "Clothing", "clothing");

            ClassifiedCategory s = saveClassifiedCategory("Services", "services", "fa-tools", 9845);
            saveClassifiedSubcat(s, "Electrician", "electrician");

            ClassifiedCategory j = saveClassifiedCategory("Jobs", "jobs", "fa-briefcase", 2341);
            ClassifiedCategory pets = saveClassifiedCategory("Pets & Animals", "pets-animals", "fa-paw", 1254);
            ClassifiedCategory b = saveClassifiedCategory("Books & Education", "books-education", "fa-book", 3278);
            ClassifiedCategory ag = saveClassifiedCategory("Agriculture", "agriculture", "fa-tractor", 1987);
            ClassifiedCategory bi = saveClassifiedCategory("Business & Industrial", "business-industrial", "fa-industry", 2156);
            ClassifiedCategory hs = saveClassifiedCategory("Hobbies & Sports", "hobbies-sports", "fa-running", 2315);

            System.out.println("Default classified categories seeded.");
        }
    }

    private ClassifiedCategory saveClassifiedCategory(String name, String slug, String icon, int count) {
        ClassifiedCategory c = new ClassifiedCategory();
        c.setName(name);
        c.setSlug(slug);
        c.setIconClass(icon);
        c.setActiveAdCount(count);
        return classifiedCategoryRepository.save(c);
    }

    private void saveClassifiedSubcat(ClassifiedCategory cat, String name, String slug) {
        ClassifiedSubcategory s = new ClassifiedSubcategory();
        s.setCategory(cat);
        s.setName(name);
        s.setSlug(slug);
        classifiedSubcategoryRepository.save(s);
    }
}

