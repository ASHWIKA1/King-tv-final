package com.kingstv.controllers;

import com.kingstv.models.District;
import com.kingstv.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/districts")
public class DistrictController {

    @Autowired
    private DistrictRepository districtRepository;

    @GetMapping
    public List<District> getDistricts() {
        return districtRepository.findAll();
    }
}
