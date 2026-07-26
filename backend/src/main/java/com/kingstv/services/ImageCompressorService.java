package com.kingstv.services;

import org.springframework.stereotype.Service;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.IIOImage;
import javax.imageio.ImageWriteParam;
import javax.imageio.stream.FileImageOutputStream;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.InputStream;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class ImageCompressorService {

    private static final Logger LOGGER = Logger.getLogger(ImageCompressorService.class.getName());

    /**
     * Resizes the image to a maximum width of 1920px (preserving aspect ratio)
     * and compresses it to WebP format. Returns the resulting WebP file.
     */
    public File compressAndResizeToWebp(InputStream inputImageStream, File tempTargetFile) {
        LOGGER.info("Starting image processing and WebP compression...");
        try {
            BufferedImage originalImage = ImageIO.read(inputImageStream);
            if (originalImage == null) {
                LOGGER.warning("Could not parse image input stream. Skipping compression.");
                return null;
            }

            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();
            BufferedImage processedImage = originalImage;

            // 1. Resize if width is larger than 1920px
            if (originalWidth > 1920) {
                int targetWidth = 1920;
                int targetHeight = (originalHeight * 1920) / originalWidth;
                LOGGER.info("Resizing high-res image from " + originalWidth + "x" + originalHeight + " to " + targetWidth + "x" + targetHeight);

                BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
                Graphics2D g = resizedImage.createGraphics();
                
                // Set high quality interpolation hints
                g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
                g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
                g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                g.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
                g.dispose();
                processedImage = resizedImage;
            }

            // 2. Search for registered WebP writer
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("webp");
            if (writers.hasNext()) {
                ImageWriter writer = writers.next();
                ImageWriteParam writeParam = writer.getDefaultWriteParam();
                
                // Configure compression parameters (quality: 75%)
                if (writeParam.canWriteCompressed()) {
                    writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                    writeParam.setCompressionType(writeParam.getCompressionTypes()[0]);
                    writeParam.setCompressionQuality(0.75f);
                }

                LOGGER.info("Writing WebP image to: " + tempTargetFile.getAbsolutePath());
                try (FileImageOutputStream outputStream = new FileImageOutputStream(tempTargetFile)) {
                    writer.setOutput(outputStream);
                    writer.write(null, new IIOImage(processedImage, null, null), writeParam);
                } finally {
                    writer.dispose();
                }
                return tempTargetFile;
            } else {
                LOGGER.warning("No WebP ImageWriter registered on the platform. Falling back to high-compression JPEG.");
                // Fallback to high compression JPEG
                Iterator<ImageWriter> jpegWriters = ImageIO.getImageWritersByFormatName("jpeg");
                if (jpegWriters.hasNext()) {
                    ImageWriter writer = jpegWriters.next();
                    ImageWriteParam writeParam = writer.getDefaultWriteParam();
                    writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                    writeParam.setCompressionQuality(0.75f);

                    try (FileImageOutputStream outputStream = new FileImageOutputStream(tempTargetFile)) {
                        writer.setOutput(outputStream);
                        writer.write(null, new IIOImage(processedImage, null, null), writeParam);
                    } finally {
                        writer.dispose();
                    }
                    return tempTargetFile;
                }
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to compress/resize image. Fallback to raw copy.", e);
        }
        return null;
    }
}
