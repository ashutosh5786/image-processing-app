package com.example.imageprocessor.controller;

import org.imgscalr.Scalr;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.DataBuffer;
import java.awt.image.DataBufferByte;
import java.awt.image.DataBufferInt;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/process-image")
public class ImageProcessingController {

    private static final Logger logger = LoggerFactory.getLogger(ImageProcessingController.class);

    @PostMapping
    public ResponseEntity<byte[]> processImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean grayscale,
            @RequestParam(defaultValue = "false") boolean rotate,
            @RequestParam(defaultValue = "false") boolean sepia,
            @RequestParam(defaultValue = "false") boolean edgeDetection,
            @RequestParam(defaultValue = "false") boolean gaussianBlur) {
        long startTime = System.currentTimeMillis();

        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(file.getBytes()));

            // Logging operation
            logger.info("Image processing started");

            // Basic manipulations with imgscalr
            if (grayscale) {
                img = Scalr.apply(img, Scalr.OP_GRAYSCALE);
                logger.info("Applied grayscale filter");
            }
            if (rotate) {
                img = Scalr.rotate(img, Scalr.Rotation.CW_90);
                logger.info("Rotated image");
            }
            if (sepia) {
                img = applySepiaFilter(img);
                logger.info("Applied sepia filter");
            }

            // Convert BufferedImage to Mat for OpenCV processing
            Mat source = bufferedImageToMat(img);
            Mat destination = new Mat(source.rows(), source.cols(), source.type());

            if (edgeDetection) {
                // Perform Canny edge detection
                Imgproc.Canny(source, destination, 50, 200);
                logger.info("Applied edge detection filter");
                img = matToBufferedImage(destination); // Convert back to BufferedImage for further processing
            }
            if (gaussianBlur) {
                Imgproc.GaussianBlur(source, source, new Size(45, 45), 0);
                logger.info("Applied Gaussian blur filter");
                img = matToBufferedImage(source); // Convert back to BufferedImage for further processing
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            long endTime = System.currentTimeMillis();
            long elapsedTime = endTime - startTime;
            logger.info("Image processing completed in {} ms", elapsedTime);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(baos.toByteArray());
        } catch (Exception e) {
            logger.error("Error processing image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private BufferedImage applySepiaFilter(BufferedImage img) {
        // Create a new BufferedImage with the same dimensions and type as the original
        BufferedImage newImg = new BufferedImage(img.getWidth(), img.getHeight(), img.getType());

        // Apply sepia transformation to each pixel
        for (int y = 0; y < img.getHeight(); y++) {
            for (int x = 0; x < img.getWidth(); x++) {
                int rgb = img.getRGB(x, y);

                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                int tr = (int) (0.393 * r + 0.769 * g + 0.189 * b);
                int tg = (int) (0.349 * r + 0.686 * g + 0.168 * b);
                int tb = (int) (0.272 * r + 0.534 * g + 0.131 * b);

                // Ensure values are within valid range (0-255)
                tr = Math.min(255, Math.max(0, tr));
                tg = Math.min(255, Math.max(0, tg));
                tb = Math.min(255, Math.max(0, tb));

                int newRgb = (tr << 16) | (tg << 8) | tb;

                newImg.setRGB(x, y, newRgb);
            }
        }

        return newImg;
    }

    private Mat bufferedImageToMat(BufferedImage bi) {
        Mat mat;

        switch (bi.getType()) {
            case BufferedImage.TYPE_3BYTE_BGR:
                // Handle BufferedImage with byte data (e.g., TYPE_3BYTE_BGR)
                byte[] data = ((DataBufferByte) bi.getRaster().getDataBuffer()).getData();
                mat = new Mat(bi.getHeight(), bi.getWidth(), CvType.CV_8UC3);
                mat.put(0, 0, data);
                break;
            case BufferedImage.TYPE_INT_RGB:
                // Handle BufferedImage with int data (e.g., TYPE_INT_RGB)
                int[] intData = ((DataBufferInt) bi.getRaster().getDataBuffer()).getData();
                byte[] bytes = new byte[intData.length * 3]; // 3 bytes per pixel (RGB)
                for (int i = 0; i < intData.length; i++) {
                    bytes[i * 3 + 0] = (byte) ((intData[i] >> 16) & 0xFF); // R
                    bytes[i * 3 + 1] = (byte) ((intData[i] >> 8) & 0xFF);  // G
                    bytes[i * 3 + 2] = (byte) (intData[i] & 0xFF);         // B
                }
                mat = new Mat(bi.getHeight(), bi.getWidth(), CvType.CV_8UC3);
                mat.put(0, 0, bytes);
                break;
            // Add cases for other BufferedImage types as needed
            default:
                throw new IllegalArgumentException("Unsupported BufferedImage type: " + bi.getType());
        }

        return mat;
    }


    private BufferedImage matToBufferedImage(Mat matrix) {
        int type = BufferedImage.TYPE_BYTE_GRAY;
        if (matrix.channels() > 1) {
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
