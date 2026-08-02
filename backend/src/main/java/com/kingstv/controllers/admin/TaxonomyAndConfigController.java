package com.kingstv.controllers.admin;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import com.kingstv.security.RequiresPermission;
import com.kingstv.services.SlugService;
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
    @Autowired private SlugService slugService;
    @Autowired private NavigationMenuRepository navigationMenuRepository;
    @Autowired private HomeLayoutConfigRepository homeLayoutConfigRepository;

    private void syncWebsiteNavigation() {
        try {
            List<NavigationMenu> allActive = navigationMenuRepository.findByIsActiveOrderByDisplayOrderAsc(true);
            List<Map<String, Object>> hierarchicalMenus = new ArrayList<>();
            Map<Long, Map<String, Object>> lookup = new HashMap<>();

            for (NavigationMenu menu : allActive) {
                Map<String, Object> node = new HashMap<>();
                node.put("id", menu.getId());
                node.put("titleTa", menu.getTitleTa());
                node.put("titleEn", menu.getTitleEn());
                node.put("linkUrl", menu.getLinkUrl());
                node.put("displayOrder", menu.getDisplayOrder());
                node.put("parentId", menu.getParentId());
                node.put("isActive", menu.getIsActive());
                node.put("subcategories", new ArrayList<>());

                lookup.put(menu.getId(), node);
            }

            for (NavigationMenu menu : allActive) {
                Map<String, Object> node = lookup.get(menu.getId());
                if (menu.getParentId() != null && lookup.containsKey(menu.getParentId())) {
                    Map<String, Object> parentNode = lookup.get(menu.getParentId());
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> subs = (List<Map<String, Object>>) parentNode.get("subcategories");
                    subs.add(node);
                } else if (menu.getParentId() == null) {
                    hierarchicalMenus.add(node);
                }
            }

            Optional<HomeLayoutConfig> optSec = homeLayoutConfigRepository.findBySectionKey("website_navigation");
            HomeLayoutConfig navSection = optSec.orElseGet(() -> {
                HomeLayoutConfig newSec = new HomeLayoutConfig();
                newSec.setSectionKey("website_navigation");
                newSec.setSectionLabel("⚡ Website Navigation");
                newSec.setLayoutType("WEB");
                newSec.setDisplayOrder(0);
                newSec.setIsVisible(true);
                return newSec;
            });

            Map<String, Object> config = new HashMap<>();
            String currentJson = navSection.getConfigJson();
            if (currentJson != null && !currentJson.trim().isEmpty()) {
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    config = mapper.readValue(currentJson, Map.class);
                } catch (Exception e) {}
            }

            config.put("navItems", hierarchicalMenus);
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            navSection.setConfigJson(mapper.writeValueAsString(config));
            homeLayoutConfigRepository.save(navSection);
        } catch (Exception e) {
            // Ignore sync errors to avoid breaking category CRUD
        }
    }

    // --- Taxonomy: Categories (#18) ---
    @GetMapping("/taxonomy/categories")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> listCategories() { 
        return ResponseEntity.ok(categoryRepository.findAllByOrderByDisplayOrderAsc()); 
    }

    @PutMapping("/taxonomy/categories/reorder")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> reorderCategories(@RequestBody List<Map<String, Object>> items) {
        try {
            for (Map<String, Object> item : items) {
                if (item.containsKey("id") && item.containsKey("displayOrder")) {
                    Long id = ((Number) item.get("id")).longValue();
                    Integer order = ((Number) item.get("displayOrder")).intValue();
                    categoryRepository.findById(id).ifPresent(cat -> {
                        cat.setDisplayOrder(order);
                        categoryRepository.save(cat);

                        navigationMenuRepository.findAll().stream()
                            .filter(m -> ("/category/" + cat.getSlug()).equals(m.getLinkUrl()))
                            .forEach(m -> {
                                m.setDisplayOrder(order);
                                navigationMenuRepository.save(m);
                            });
                    });
                }
            }
            syncWebsiteNavigation();
            return ResponseEntity.ok(Map.of("message", "Category order updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/taxonomy/categories")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> createCategory(@RequestBody Map<String, Object> req) {
        try {
            Category cat = new Category();
            cat.setName((String) req.get("name"));
            cat.setNameTa((String) req.get("nameTa"));
            cat.setSlug((String) req.get("slug"));
            cat.setDisplayOrder(req.containsKey("displayOrder") ? (Integer) req.get("displayOrder") : 0);
            cat.setIcon((String) req.get("icon"));
            if (req.containsKey("color")) cat.setColor((String) req.get("color"));
            cat.setIsNav(req.containsKey("isNav") ? (Boolean) req.get("isNav") : true);
            cat.setIsActive(req.containsKey("isActive") ? (Boolean) req.get("isActive") : true);
            
            slugService.generateAndSetSlug(cat);
            Category savedCat = categoryRepository.save(cat);

            // Sync with Navigation Menu if isNav is true
            if (savedCat.getIsNav()) {
                NavigationMenu menu = new NavigationMenu();
                menu.setTitleTa(savedCat.getNameTa());
                menu.setTitleEn(savedCat.getName());
                menu.setLinkUrl("/category/" + savedCat.getSlug());
                menu.setDisplayOrder(savedCat.getDisplayOrder() != null ? savedCat.getDisplayOrder() : 0);
                menu.setIsActive(savedCat.getIsActive() != null ? savedCat.getIsActive() : true);
                navigationMenuRepository.save(menu);
            }

            syncWebsiteNavigation();
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCat);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Category with this name or slug already exists."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/taxonomy/categories/{id}")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        try {
            Optional<Category> catOpt = categoryRepository.findById(id);
            if (catOpt.isEmpty()) return ResponseEntity.notFound().build();
            Category cat = catOpt.get();
            String oldSlug = cat.getSlug();
            if (req.containsKey("name")) cat.setName((String) req.get("name"));
            if (req.containsKey("nameTa")) cat.setNameTa((String) req.get("nameTa"));
            if (req.containsKey("slug")) cat.setSlug((String) req.get("slug"));
            if (req.containsKey("displayOrder")) cat.setDisplayOrder((Integer) req.get("displayOrder"));
            if (req.containsKey("icon")) cat.setIcon((String) req.get("icon"));
            if (req.containsKey("color")) cat.setColor((String) req.get("color"));
            if (req.containsKey("isNav")) cat.setIsNav((Boolean) req.get("isNav"));
            if (req.containsKey("isActive")) cat.setIsActive((Boolean) req.get("isActive"));
            
            slugService.generateAndSetSlug(cat);
            Category savedCat = categoryRepository.save(cat);

            // Sync updates directly with Navigation Menu
            try {
                List<NavigationMenu> menus = navigationMenuRepository.findAll();
                NavigationMenu existingNav = menus.stream()
                    .filter(m -> ("/category/" + oldSlug).equals(m.getLinkUrl()) || 
                                 ("/category/" + savedCat.getSlug()).equals(m.getLinkUrl()) || 
                                 ("/category/" + id).equals(m.getLinkUrl()))
                    .findFirst().orElse(null);

                if (Boolean.TRUE.equals(savedCat.getIsNav())) {
                    if (existingNav == null) {
                        existingNav = new NavigationMenu();
                    }
                    existingNav.setTitleEn(savedCat.getName());
                    existingNav.setTitleTa(savedCat.getNameTa());
                    existingNav.setLinkUrl("/category/" + savedCat.getSlug());
                    existingNav.setDisplayOrder(savedCat.getDisplayOrder() != null ? savedCat.getDisplayOrder() : 0);
                    existingNav.setIsActive(Boolean.TRUE.equals(savedCat.getIsActive()));
                    navigationMenuRepository.save(existingNav);
                } else if (existingNav != null) {
                    existingNav.setIsActive(false);
                    navigationMenuRepository.save(existingNav);
                }
            } catch (Exception syncEx) {
                // Ignore sync errors to prevent breaking category updates
            }

            syncWebsiteNavigation();
            return ResponseEntity.ok((Object) savedCat);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Category with this name or slug already exists."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/taxonomy/categories/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN})
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id).map(c -> {
            String slugUrl = "/category/" + c.getSlug();
            categoryRepository.delete(c);
            
            // Attempt to remove from NavigationMenu
            try {
                java.util.List<NavigationMenu> menus = navigationMenuRepository.findAll();
                for (NavigationMenu m : menus) {
                    if (slugUrl.equals(m.getLinkUrl())) {
                        navigationMenuRepository.delete(m);
                    }
                }
            } catch (Exception ex) {
                // Ignore errors during sync to avoid breaking category deletion
            }
            
            syncWebsiteNavigation();
            return ResponseEntity.ok((Object) Map.of("message", "Category deleted"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Taxonomy: Subcategories ---
    @GetMapping("/taxonomy/subcategories")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> listSubCategories() { return ResponseEntity.ok(subCategoryRepository.findAll()); }

    @PostMapping("/taxonomy/subcategories")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> createSubCategory(@RequestBody SubCategory subcat) {
        try {
            if (subcat.getStatus() == null || subcat.getStatus().trim().isEmpty()) {
                subcat.setStatus("active");
            } else if (!List.of("active", "inactive", "deleted").contains(subcat.getStatus().toLowerCase())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value: " + subcat.getStatus()));
            }
            subcat.setStatus(subcat.getStatus().toLowerCase());
            slugService.generateAndSetSlug(subcat);
            return ResponseEntity.status(HttpStatus.CREATED).body(subCategoryRepository.save(subcat));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Subcategory with this name or slug already exists."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/taxonomy/subcategories/{id}")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> updateSubCategory(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        try {
            Optional<SubCategory> subOpt = subCategoryRepository.findById(id);
            if (subOpt.isEmpty()) return ResponseEntity.notFound().build();
            SubCategory sub = subOpt.get();
            if (req.containsKey("name")) sub.setName((String) req.get("name"));
            if (req.containsKey("nameTa")) sub.setNameTa((String) req.get("nameTa"));
            if (req.containsKey("slug")) sub.setSlug((String) req.get("slug"));
            if (req.containsKey("displayOrder")) sub.setDisplayOrder((Integer) req.get("displayOrder"));
            if (req.containsKey("categoryId")) sub.setCategoryId(Long.valueOf(req.get("categoryId").toString()));
            if (req.containsKey("parentId")) sub.setParentId(req.get("parentId") != null ? Long.valueOf(req.get("parentId").toString()) : null);
            if (req.containsKey("status")) {
                String statusVal = (String) req.get("status");
                if (statusVal != null && !statusVal.trim().isEmpty()) {
                    if (!List.of("active", "inactive", "deleted").contains(statusVal.toLowerCase())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value: " + statusVal));
                    }
                    sub.setStatus(statusVal.toLowerCase());
                } else {
                    sub.setStatus("active");
                }
            }
            
            slugService.generateAndSetSlug(sub);
            SubCategory savedSub = subCategoryRepository.save(sub);

            // Sync updates with Navigation Menu if present
            try {
                List<NavigationMenu> menus = navigationMenuRepository.findAll();
                NavigationMenu existingSubNav = menus.stream()
                    .filter(m -> m.getLinkUrl() != null && m.getLinkUrl().contains("/sub/" + savedSub.getSubcategoryId()))
                    .findFirst().orElse(null);
                if (existingSubNav != null) {
                    existingSubNav.setTitleEn(savedSub.getName());
                    existingSubNav.setTitleTa(savedSub.getNameTa());
                    existingSubNav.setIsActive("active".equalsIgnoreCase(savedSub.getStatus()));
                    navigationMenuRepository.save(existingSubNav);
                }
            } catch (Exception syncEx) {
                // Ignore sync errors to prevent breaking subcategory updates
            }

            return ResponseEntity.ok((Object) savedSub);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Subcategory with this name or slug already exists."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
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
        try {
            District d = new District();
            d.setNameEn(req.get("nameEn"));
            d.setNameTa(req.get("nameTa"));
            return ResponseEntity.status(HttpStatus.CREATED).body(districtRepository.save(d));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "District with this name already exists."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/taxonomy/districts/{id}")
    @RequiresPermission(Permission.TAXONOMY_MANAGE)
    public ResponseEntity<?> updateDistrict(@PathVariable Long id, @RequestBody Map<String, String> req) {
        try {
            Optional<District> dOpt = districtRepository.findById(id);
            if (dOpt.isEmpty()) return ResponseEntity.notFound().build();
            District d = dOpt.get();
            if (req.containsKey("nameEn")) d.setNameEn(req.get("nameEn"));
            if (req.containsKey("nameTa")) d.setNameTa(req.get("nameTa"));
            return ResponseEntity.ok((Object) districtRepository.save(d));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "District with this name already exists."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
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

        List<Map<String, Object>> engines = new ArrayList<>();
        boolean overallSuccess = false;

        // Google
        engines.add(Map.of(
            "name", "Google",
            "status", "skipped",
            "message", "Google sitemap ping service has been retired (deprecated since December 2023)."
        ));

        // Google News
        engines.add(Map.of(
            "name", "Google News",
            "status", "skipped",
            "message", "Google News sitemap ping service has been retired (deprecated since December 2023)."
        ));

        // Submit sitemap to Bing
        Map<String, Object> bingResult = new LinkedHashMap<>();
        bingResult.put("name", "Bing");
        try {
            String bingPingUrl = "https://www.bing.com/ping?sitemap=" + URLEncoder.encode(sitemapUrl, StandardCharsets.UTF_8);
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest req = HttpRequest.newBuilder().uri(URI.create(bingPingUrl)).GET().build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            int statusCode = res.statusCode();
            bingResult.put("status", statusCode == 200 ? "success" : "failed");
            bingResult.put("statusCode", statusCode);
            if (statusCode == 200) {
                bingResult.put("message", "Sitemap successfully submitted to Bing.");
                overallSuccess = true;
            } else if (statusCode == 410) {
                bingResult.put("message", "Bing sitemap ping service has been retired (HTTP 410 Gone). Use IndexNow or Webmaster Tools instead.");
            } else {
                bingResult.put("message", "Bing returned HTTP status " + statusCode);
            }
        } catch (Exception e) {
            bingResult.put("status", "failed");
            bingResult.put("message", "Could not connect to Bing: " + e.getMessage());
        }
        engines.add(bingResult);

        Map<String, Object> response = Map.of(
            "success", overallSuccess,
            "message", overallSuccess ? "Sitemaps submitted successfully." : "Search engine ping service is no longer supported or failed.",
            "engines", engines
        );

        if (overallSuccess) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(response);
        }
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
