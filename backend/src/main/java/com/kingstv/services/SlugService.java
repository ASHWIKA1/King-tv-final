package com.kingstv.services;

import com.kingstv.models.Article;
import com.kingstv.models.Category;
import com.kingstv.models.SubCategory;
import com.kingstv.repository.ArticleRepository;
import com.kingstv.repository.CategoryRepository;
import com.kingstv.repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class SlugService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    public String generateAndSetSlug(Article article) {
        String slug = article.getSlug();
        if (slug != null && !slug.trim().isEmpty()) {
            slug = cleanSlug(slug);
        } else {
            String title = article.getTitleEn();
            if (title == null || title.trim().isEmpty()) {
                title = article.getTitleTa();
            }
            if (title == null || title.trim().isEmpty()) {
                title = "article-" + System.currentTimeMillis();
            }
            slug = cleanSlug(title);
        }

        // Handle duplication resolution
        String finalSlug = slug;
        int counter = 1;
        while (true) {
            Optional<Article> existing = articleRepository.findBySlug(finalSlug);
            if (existing.isPresent()) {
                // If it is the same article, keep it
                if (article.getId() != null && existing.get().getId().equals(article.getId())) {
                    break;
                }
                finalSlug = slug + "-" + counter;
                counter++;
            } else {
                break;
            }
        }

        article.setSlug(finalSlug);
        return finalSlug;
    }

    public String generateAndSetSlug(Category category) {
        String slug = category.getSlug();
        if (slug != null && !slug.trim().isEmpty()) {
            slug = cleanSlug(slug);
        } else {
            String name = category.getName();
            if (name == null || name.trim().isEmpty()) {
                name = category.getNameTa();
            }
            if (name == null || name.trim().isEmpty()) {
                name = "category-" + System.currentTimeMillis();
            }
            slug = cleanSlug(name);
        }

        String finalSlug = slug;
        int counter = 1;
        while (true) {
            Optional<Category> existing = categoryRepository.findBySlug(finalSlug);
            if (existing.isPresent()) {
                if (category.getId() != null && existing.get().getId().equals(category.getId())) {
                    break;
                }
                finalSlug = slug + "-" + counter;
                counter++;
            } else {
                break;
            }
        }

        category.setSlug(finalSlug);
        return finalSlug;
    }

    public String generateAndSetSlug(SubCategory subCategory) {
        String slug = subCategory.getSlug();
        if (slug != null && !slug.trim().isEmpty()) {
            slug = cleanSlug(slug);
        } else {
            String name = subCategory.getName();
            if (name == null || name.trim().isEmpty()) {
                name = subCategory.getNameTa();
            }
            if (name == null || name.trim().isEmpty()) {
                name = "subcategory-" + System.currentTimeMillis();
            }
            slug = cleanSlug(name);
        }

        String finalSlug = slug;
        int counter = 1;
        while (true) {
            Optional<SubCategory> existing = subCategoryRepository.findBySlug(finalSlug);
            if (existing.isPresent()) {
                if (subCategory.getSubcategoryId() != null && existing.get().getSubcategoryId().equals(subCategory.getSubcategoryId())) {
                    break;
                }
                finalSlug = slug + "-" + counter;
                counter++;
            } else {
                break;
            }
        }

        subCategory.setSlug(finalSlug);
        return finalSlug;
    }

    private String cleanSlug(String text) {
        if (text == null) return "";
        // Keep English, numbers, Tamil characters (\u0B80-\u0BFF), space, hyphen
        String cleaned = text.replaceAll("[^a-zA-Z0-9\\u0B80-\\u0BFF\\s\\-]", "");
        cleaned = cleaned.trim().replaceAll("\\s+", "-").replaceAll("-+", "-").toLowerCase();
        if (cleaned.isEmpty()) {
            cleaned = "news-" + System.currentTimeMillis();
        }
        return cleaned;
    }
}
