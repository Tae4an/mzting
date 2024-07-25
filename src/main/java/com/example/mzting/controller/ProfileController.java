package com.example.mzting.controller;

import com.example.mzting.entity.Profile;
import com.example.mzting.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;


    @GetMapping
    public List<Profile> getProfiles() {
        return profileService.getAllProfiles();
    }

    @GetMapping("/mbti/{type}")
    public List<Profile> getProfilesByMbti(@PathVariable String type) {
        return profileService.getProfilesByMbti(type);
    }
}
