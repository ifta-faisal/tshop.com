package com.roboxpressbd.controller;

import com.roboxpressbd.service.CsvImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/products")
public class AdminProductController {

    private final CsvImportService csvImportService;

    public AdminProductController(CsvImportService csvImportService) {
        this.csvImportService = csvImportService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please select a CSV file to upload."));
        }

        try {
            csvImportService.importCsv(file);
            return ResponseEntity.ok(Map.of("message", "Products imported successfully."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to import products: " + e.getMessage()));
        }
    }
}
