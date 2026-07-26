package com.kingstv.controllers;

import com.kingstv.models.AggregatedNews;
import com.kingstv.services.RssAggregatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rss-aggregator")
public class RssAggregatorController {

    @Autowired
    private RssAggregatorService rssAggregatorService;

    @GetMapping
    public ResponseEntity<List<AggregatedNews>> getLatestFeeds() {
        return ResponseEntity.ok(rssAggregatorService.getLatestItems());
    }

    @PostMapping("/sync")
    @com.kingstv.security.RequiresPermission(anyOf = {com.kingstv.models.Role.SUPER_ADMIN, com.kingstv.models.Role.CHIEF_EDITOR})
    public ResponseEntity<?> triggerSync() {
        rssAggregatorService.fetchAggregatedFeeds();
        return ResponseEntity.ok().build();
    }
}
