package com.kingstv.controllers.admin;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Taxonomy CRUD (#18) - categories, subcategories, locations, sub-locations.
 * SEO config (#12), Sitemap config (#15), Font manager (#16).
 * Survey/Poll builder (#19), Webstore CRUD (#20).
 */
@RestController
@RequestMapping("/api/v1/admin")
public class TaxonomyAndConfigController {

    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SubCategoryRepository subCategoryRepository;
    @Autowired private DistrictRepository districtRepository;
    @Autowired private SeoTemplateRepository seoTemplateRepository;
    @Autowired private SitemapConfigRepository sitemapConfigRepository;
    @Autowired private FontConfigRepository fontConfigRepository;
    @Autowired private SurveyPollRepository surveyPollRepository;
    @Autowired private WebstoreItemRepository webstoreItemRepository;

    // --- Taxonomy: Categories (#18) ---
    @GetMapping("/taxonomy/categories")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> listCategories() { return ResponseEntity.ok(categoryRepository.findAll()); }

    @PostMapping("/taxonomy/categories")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> createCategory(@RequestBody Map<String, Object> req) {
        Category cat = new Category();
        cat.setName((String) req.get("name"));
        cat.setNameTa((String) req.get("nameTa"));
        cat.setSlug((String) req.get("slug"));
        cat.setDisplayOrder(req.containsKey("displayOrder") ? (Integer) req.get("displayOrder") : 0);
        cat.setIcon((String) req.get("icon"));
        if (req.containsKey("color")) cat.setColor((String) req.get("color"));
        cat.setIsNav(req.containsKey("isNav") ? (Boolean) req.get("isNav") : true);
        cat.setIsActive(req.containsKey("isActive") ? (Boolean) req.get("isActive") : true);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryRepository.save(cat));
    }

    @PutMapping("/taxonomy/categories/{id}")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return categoryRepository.findById(id).map(cat -> {
            if (req.containsKey("name")) cat.setName((String) req.get("name"));
            if (req.containsKey("nameTa")) cat.setNameTa((String) req.get("nameTa"));
            if (req.containsKey("slug")) cat.setSlug((String) req.get("slug"));
            if (req.containsKey("displayOrder")) cat.setDisplayOrder((Integer) req.get("displayOrder"));
            if (req.containsKey("icon")) cat.setIcon((String) req.get("icon"));
            if (req.containsKey("color")) cat.setColor((String) req.get("color"));
            if (req.containsKey("isNav")) cat.setIsNav((Boolean) req.get("isNav"));
            if (req.containsKey("isActive")) cat.setIsActive((Boolean) req.get("isActive"));
            return ResponseEntity.ok((Object) categoryRepository.save(cat));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/taxonomy/categories/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN})
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted"));
    }

    // --- Taxonomy: Subcategories ---
    @GetMapping("/taxonomy/subcategories")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> listSubCategories() { return ResponseEntity.ok(subCategoryRepository.findAll()); }

    @PostMapping("/taxonomy/subcategories")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> createSubCategory(@RequestBody SubCategory subcat) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subCategoryRepository.save(subcat));
    }

    @PutMapping("/taxonomy/subcategories/{id}")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> updateSubCategory(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return subCategoryRepository.findById(id).map(sub -> {
            if (req.containsKey("name")) sub.setName((String) req.get("name"));
            if (req.containsKey("nameTa")) sub.setNameTa((String) req.get("nameTa"));
            if (req.containsKey("slug")) sub.setSlug((String) req.get("slug"));
            if (req.containsKey("displayOrder")) sub.setDisplayOrder((Integer) req.get("displayOrder"));
            if (req.containsKey("categoryId")) sub.setCategoryId(Long.valueOf(req.get("categoryId").toString()));
            if (req.containsKey("parentId")) sub.setParentId(req.get("parentId") != null ? Long.valueOf(req.get("parentId").toString()) : null);
            if (req.containsKey("status")) sub.setStatus((String) req.get("status"));
            return ResponseEntity.ok((Object) subCategoryRepository.save(sub));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/taxonomy/subcategories/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN})
    public ResponseEntity<?> deleteSubCategory(@PathVariable Long id) {
        if (!subCategoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        subCategoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "SubCategory deleted"));
    }

    // --- Taxonomy: Districts ---
    @GetMapping("/taxonomy/districts")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> listDistricts() { return ResponseEntity.ok(districtRepository.findAll()); }

    @PostMapping("/taxonomy/districts")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> createDistrict(@RequestBody Map<String, String> req) {
        District d = new District();
        d.setNameEn(req.get("nameEn"));
        d.setNameTa(req.get("nameTa"));
        return ResponseEntity.status(HttpStatus.CREATED).body(districtRepository.save(d));
    }

    @DeleteMapping("/taxonomy/districts/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN})
    public ResponseEntity<?> deleteDistrict(@PathVariable Long id) {
        if (!districtRepository.existsById(id)) return ResponseEntity.notFound().build();
        districtRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "District deleted"));
    }

    // --- SEO Config (#12) ---
    @GetMapping("/seo-config")
    @RequiresPermission(Permission.SEO_CONFIG_MANAGE)
    public ResponseEntity<?> listSeoTemplates() { return ResponseEntity.ok(seoTemplateRepository.findAll()); }

    @PostMapping("/seo-config")
    @RequiresPermission(Permission.SEO_CONFIG_MANAGE)
    public ResponseEntity<?> createSeoTemplate(@RequestBody SeoTemplate template) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seoTemplateRepository.save(template));
    }

    @PutMapping("/seo-config/{id}")
    @RequiresPermission(Permission.SEO_CONFIG_MANAGE)
    public ResponseEntity<?> updateSeoTemplate(@PathVariable Long id, @RequestBody Map<String, String> req) {
        return seoTemplateRepository.findById(id).map(t -> {
            if (req.containsKey("titleTemplate")) t.setTitleTemplate(req.get("titleTemplate"));
            if (req.containsKey("descriptionTemplate")) t.setDescriptionTemplate(req.get("descriptionTemplate"));
            if (req.containsKey("keywordsTemplate")) t.setKeywordsTemplate(req.get("keywordsTemplate"));
            if (req.containsKey("promptTemplate")) t.setPromptTemplate(req.get("promptTemplate"));
            return ResponseEntity.ok((Object) seoTemplateRepository.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Sitemap Config (#15) ---
    @GetMapping("/sitemap-config")
    @RequiresPermission(Permission.SITEMAP_MANAGE)
    public ResponseEntity<?> listSitemapConfig() { return ResponseEntity.ok(sitemapConfigRepository.findAll()); }

    @PutMapping("/sitemap-config/{id}")
    @RequiresPermission(Permission.SITEMAP_MANAGE)
    public ResponseEntity<?> toggleSitemapExclude(@PathVariable Long id, @RequestBody Map<String, Boolean> req) {
        return sitemapConfigRepository.findById(id).map(c -> {
            c.setIsExcluded(req.getOrDefault("isExcluded", false));
            return ResponseEntity.ok((Object) sitemapConfigRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/sitemap-config/ping")
    @RequiresPermission(Permission.SITEMAP_MANAGE)
    public ResponseEntity<?> pingSearchEngines(HttpServletRequest request) {
        String baseUrl = getFrontendBaseUrl(request);
        String sitemapUrl = baseUrl + "/sitemap.xml";
        String newsSitemapUrl = baseUrl + "/sitemap-news.xml";

        List<String> logs = new ArrayList<>();
        HttpClient client = HttpClient.newHttpClient();

        // Submit main sitemap to Google
        try {
            String googlePingUrl = "https://www.google.com/ping?sitemap=" + URLEncoder.encode(sitemapUrl, StandardCharsets.UTF_8);
            HttpRequest req = HttpRequest.newBuilder().uri(URI.create(googlePingUrl)).GET().build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            logs.add("Google sitemap ping: " + res.statusCode());
        } catch (Exception e) {
            logs.add("Google sitemap ping error: " + e.getMessage());
        }

        // Submit news sitemap to Google (for Google News Publisher Center indexing)
        try {
            String googleNewsPingUrl = "https://www.google.com/ping?sitemap=" + URLEncoder.encode(newsSitemapUrl, StandardCharsets.UTF_8);
            HttpRequest req = HttpRequest.newBuilder().uri(URI.create(googleNewsPingUrl)).GET().build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            logs.add("Google News ping: " + res.statusCode());
        } catch (Exception e) {
            logs.add("Google News ping error: " + e.getMessage());
        }

        // Submit main sitemap to Bing
        try {
            String bingPingUrl = "https://www.bing.com/ping?sitemap=" + URLEncoder.encode(sitemapUrl, StandardCharsets.UTF_8);
            HttpRequest req = HttpRequest.newBuilder().uri(URI.create(bingPingUrl)).GET().build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            logs.add("Bing sitemap ping: " + res.statusCode());
        } catch (Exception e) {
            logs.add("Bing sitemap ping error: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Ping request submitted successfully to Google and Bing.", "logs", logs));
    }

    private String getFrontendBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int port = request.getServerPort();
        
        String portStr = "";
        if (port == 5000) {
            portStr = ":5173"; // Map to frontend Vite dev server locally
        } else if (port != 80 && port != 443) {
            portStr = ":" + port;
        }
        return scheme + "://" + serverName + portStr;
    }

    // --- Font Manager (#16) ---
    @GetMapping("/fonts")
    @RequiresPermission(Permission.FONT_MANAGE)
    public ResponseEntity<?> listFonts() { return ResponseEntity.ok(fontConfigRepository.findAll()); }

    @PutMapping("/fonts/{id}")
    @RequiresPermission(Permission.FONT_MANAGE)
    public ResponseEntity<?> updateFont(@PathVariable Long id, @RequestBody Map<String, String> req) {
        return fontConfigRepository.findById(id).map(f -> {
            if (req.containsKey("fontFamily")) f.setFontFamily(req.get("fontFamily"));
            if (req.containsKey("fontSource")) f.setFontSource(req.get("fontSource"));
            if (req.containsKey("fontWeight")) f.setFontWeight(req.get("fontWeight"));
            if (req.containsKey("fontUrl")) f.setFontUrl(req.get("fontUrl"));
            return ResponseEntity.ok((Object) fontConfigRepository.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/fonts")
    @RequiresPermission(Permission.FONT_MANAGE)
    public ResponseEntity<?> addFont(@RequestBody FontConfig font) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fontConfigRepository.save(font));
    }

    // --- Survey/Poll Builder (#19) ---
    @GetMapping("/surveys")
    @RequiresPermission(Permission.SURVEY_MANAGE)
    public ResponseEntity<?> listSurveys(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(surveyPollRepository.findAll(org.springframework.data.domain.PageRequest.of(page, size)));
    }

    @PostMapping("/surveys")
    @RequiresPermission(Permission.SURVEY_MANAGE)
    public ResponseEntity<?> createSurvey(@RequestBody SurveyPoll survey) {
        return ResponseEntity.status(HttpStatus.CREATED).body(surveyPollRepository.save(survey));
    }

    @PutMapping("/surveys/{id}")
    @RequiresPermission(Permission.SURVEY_MANAGE)
    public ResponseEntity<?> updateSurvey(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return surveyPollRepository.findById(id).map(s -> {
            if (req.containsKey("title")) s.setTitle((String) req.get("title"));
            if (req.containsKey("description")) s.setDescription((String) req.get("description"));
            if (req.containsKey("optionsJson")) s.setOptionsJson((String) req.get("optionsJson"));
            if (req.containsKey("status")) s.setStatus((String) req.get("status"));
            if (req.containsKey("targetModule")) s.setTargetModule((String) req.get("targetModule"));
            return ResponseEntity.ok((Object) surveyPollRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Webstore CRUD (#20) ---
    @GetMapping("/webstore")
    @RequiresPermission(Permission.WEBSTORE_MANAGE)
    public ResponseEntity<?> listWebstore(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(webstoreItemRepository.findAll(org.springframework.data.domain.PageRequest.of(page, size)));
    }

    @PostMapping("/webstore")
    @RequiresPermission(Permission.WEBSTORE_MANAGE)
    public ResponseEntity<?> createWebstoreItem(@RequestBody WebstoreItem item) {
        return ResponseEntity.status(HttpStatus.CREATED).body(webstoreItemRepository.save(item));
    }

    @PutMapping("/webstore/{id}")
    @RequiresPermission(Permission.WEBSTORE_MANAGE)
    public ResponseEntity<?> updateWebstoreItem(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return webstoreItemRepository.findById(id).map(item -> {
            if (req.containsKey("name")) item.setName((String) req.get("name"));
            if (req.containsKey("description")) item.setDescription((String) req.get("description"));
            if (req.containsKey("price")) item.setPrice(new java.math.BigDecimal(req.get("price").toString()));
            if (req.containsKey("status")) item.setStatus((String) req.get("status"));
            if (req.containsKey("stockQty")) item.setStockQty((Integer) req.get("stockQty"));
            return ResponseEntity.ok((Object) webstoreItemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/webstore/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN})
    public ResponseEntity<?> deleteWebstoreItem(@PathVariable Long id) {
        if (!webstoreItemRepository.existsById(id)) return ResponseEntity.notFound().build();
        webstoreItemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Item deleted"));
    }
}
