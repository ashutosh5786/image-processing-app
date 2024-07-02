package com.example.imageprocessor.controller;

import org.imgscalr.Scalr;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/process-image")
public class ImageProcessingController {

    @PostMapping
    public ResponseEntity<byte[]> processImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam(name = "grayscale", defaultValue = "false") boolean grayscale,
            @RequestParam(name = "resize", defaultValue = "") String resize,
            @RequestParam(name = "sharpen", defaultValue = "false") boolean sharpen,
            @RequestParam(name = "sepia", defaultValue = "false") boolean sepia) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(file.getBytes()));

            // Apply grayscale
            if (grayscale) {
                img = Scalr.apply(img, Scalr.OP_GRAYSCALE);
            }

            // Apply resize
            if (!resize.isEmpty()) {
                String[] dimensions = resize.split("x");
                int width = Integer.parseInt(dimensions[0]);
                int height = Integer.parseInt(dimensions[1]);
                img = Scalr.resize(img, Scalr.Mode.AUTOMATIC, width, height);
            }

            // Additional filters can be added here

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(baos.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
