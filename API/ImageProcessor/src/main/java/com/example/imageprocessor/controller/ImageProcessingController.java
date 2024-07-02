package com.example.imageprocessor.controller;

import org.imgscalr.Scalr;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/process-image")
public class ImageProcessingController {

    @PostMapping
    public ResponseEntity<byte[]> processImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean grayscale,
            @RequestParam(defaultValue = "false") boolean rotate,
            @RequestParam(defaultValue = "false") boolean sepia,
            @RequestParam(defaultValue = "false") boolean edgeDetection,
            @RequestParam(defaultValue = "false") boolean gaussianBlur) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(file.getBytes()));

            // Basic manipulations with imgscalr
            if (grayscale) {
                img = Scalr.apply(img, Scalr.OP_GRAYSCALE);
            }
            if (rotate) {
                img = Scalr.rotate(img, Scalr.Rotation.CW_90);
            }
            if (sepia) {
                img = applySepiaFilter(img);
            }

            // Convert BufferedImage to Mat for OpenCV processing
            if (edgeDetection || gaussianBlur) {
                Mat source = bufferedImageToMat(img);
                if (edgeDetection) {
                    Imgproc.Canny(source, source, 50, 200);
                }
                if (gaussianBlur) {
                    Imgproc.GaussianBlur(source, source, new Size(45, 45), 0);
                }
                img = matToBufferedImage(source);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(baos.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private BufferedImage applySepiaFilter(BufferedImage img) {
        // Apply sepia logic here 
        return img;
    }

    private Mat bufferedImageToMat(BufferedImage bi) {
        Mat mat = new Mat(bi.getHeight(), bi.getWidth(), CvType.CV_8UC3);
        byte[] data = ((DataBufferByte) bi.getRaster().getDataBuffer()).getData();
        mat.put(0, 0, data);
        return mat;
    }

    private BufferedImage matToBufferedImage(Mat matrix) {
        int type = BufferedImage.TYPE_BYTE_GRAY;
        if ( matrix.channels() > 1 ) {
            type = BufferedImage.TYPE_3BYTE_BGR;
        }
        int bufferSize = matrix.channels() * matrix.cols() * matrix.rows();
        byte[] b = new byte[bufferSize];
        matrix.get(0, 0, b); // Get all the pixels
        BufferedImage image = new BufferedImage(matrix.cols(), matrix.rows(), type);
        byte[] targetPixels = ((DataBufferByte) image.getRaster().getDataBuffer()).getData();
        System.arraycopy(b, 0, targetPixels, 0, b.length);
        return image;
    }
}
