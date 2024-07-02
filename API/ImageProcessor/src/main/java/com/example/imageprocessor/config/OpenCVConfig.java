package com.example.imageprocessor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import nu.pattern.OpenCV;

@Configuration
public class OpenCVConfig {
    @Bean
    public Object loadOpenCVLibrary() {
        OpenCV.loadLocally(); // Ensures OpenCV native libraries are loaded.
        return new Object(); // Return a dummy object.
    }
}
