package com.kingstv.services;

import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class VideoTranscoderService {

    private static final Logger LOGGER = Logger.getLogger(VideoTranscoderService.class.getName());

    /**
     * Transcodes a raw video file locally to HLS format.
     * Returns the local directory path containing index.m3u8 and segments, or null if it fails.
     */
    public File transcodeToHls(File sourceFile, String targetDirName) {
        LOGGER.info("Starting video HLS transcoding for: " + sourceFile.getAbsolutePath());
        
        // Target directory in temporary uploads
        Path targetPath = Paths.get("uploads", "hls", targetDirName);
        try {
            Files.createDirectories(targetPath);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Failed to create HLS target directories", e);
            return null;
        }

        File targetDir = targetPath.toFile();
        File playlistFile = new File(targetDir, "index.m3u8");

        // FFmpeg command to scale to 720p HLS format
        String[] cmd = {
            "ffmpeg",
            "-y", // overwrite output files
            "-i", sourceFile.getAbsolutePath(),
            "-vf", "scale=w=-2:h=720", // scale maintaining aspect ratio to 720p height
            "-c:v", "libx264",
            "-crf", "23",
            "-preset", "veryfast", // fast preset for local development transcoding speed
            "-c:a", "aac",
            "-ar", "48000",
            "-b:a", "128k",
            "-hls_time", "6", // HLS chunk segment time in seconds
            "-hls_playlist_type", "vod",
            "-hls_segment_filename", new File(targetDir, "segment_%03d.ts").getAbsolutePath(),
            playlistFile.getAbsolutePath()
        };

        try {
            LOGGER.info("Executing FFmpeg command: " + String.join(" ", cmd));
            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Read output logs to prevent buffer blocking
            java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                // Verbose logs can be enabled for debugging
                // LOGGER.fine(line);
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                LOGGER.info("HLS transcoding completed successfully. Created: " + playlistFile.getAbsolutePath());
                return targetDir;
            } else {
                LOGGER.severe("FFmpeg HLS transcoding failed with exit code: " + exitCode);
                return null;
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "FFmpeg execution failed (FFmpeg might not be installed on the system path). Fallback to raw upload.", e);
            return null;
        }
    }
}
