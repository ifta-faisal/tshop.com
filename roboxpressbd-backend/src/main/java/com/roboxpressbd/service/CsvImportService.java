package com.roboxpressbd.service;

import com.roboxpressbd.entity.Brand;
import com.roboxpressbd.entity.Category;
import com.roboxpressbd.entity.Product;
import com.roboxpressbd.repository.BrandRepository;
import com.roboxpressbd.repository.CategoryRepository;
import com.roboxpressbd.repository.ProductRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class CsvImportService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public CsvImportService(ProductRepository productRepository, CategoryRepository categoryRepository, BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    public void importCsv(MultipartFile file) throws Exception {
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                // Ignore empty or invalid rows (e.g. variable product variations that don't have enough info)
                String name = csvRecord.isSet("Name") ? csvRecord.get("Name") : null;
                if (name == null || name.trim().isEmpty()) {
                    continue;
                }

                String type = csvRecord.isSet("Type") ? csvRecord.get("Type") : "simple";
                if ("variation".equalsIgnoreCase(type)) {
                    continue; // Skip variations for simplicity
                }

                String slug = makeSlug(name);
                
                // Parse Price
                BigDecimal regularPrice = parsePrice(csvRecord, "Regular price");
                BigDecimal salePrice = parsePrice(csvRecord, "Sale price");
                BigDecimal price = regularPrice != null ? regularPrice : BigDecimal.ZERO;
                BigDecimal oldPrice = null;

                if (salePrice != null && salePrice.compareTo(BigDecimal.ZERO) > 0) {
                    price = salePrice;
                    oldPrice = regularPrice;
                }
                
                // Parse Stock
                int stock = 10; // Default
                if (csvRecord.isSet("Stock") && !csvRecord.get("Stock").trim().isEmpty()) {
                    try {
                        stock = (int) Double.parseDouble(csvRecord.get("Stock").trim());
                    } catch (NumberFormatException ignored) {}
                }

                // Parse Image
                String images = csvRecord.isSet("Images") ? csvRecord.get("Images") : "";
                String imageUrl = "";
                if (!images.isEmpty()) {
                    imageUrl = images.split(",")[0].trim();
                }
                if (imageUrl.length() > 500) {
                    imageUrl = imageUrl.substring(0, 500);
                }

                // Parse Categories
                String categoriesStr = csvRecord.isSet("Categories") ? csvRecord.get("Categories") : "Uncategorized";
                java.util.Set<Category> productCategories = new java.util.HashSet<>();
                for (String catStr : categoriesStr.split(",")) {
                    if (!catStr.trim().isEmpty()) {
                        productCategories.add(getOrCreateCategory(catStr.trim()));
                    }
                }
                if (productCategories.isEmpty()) {
                    productCategories.add(getOrCreateCategory("Uncategorized"));
                }

                // Parse Brand
                String brandsStr = csvRecord.isSet("Brands") ? csvRecord.get("Brands") : null;
                Brand brand = null;
                if (brandsStr != null && !brandsStr.isEmpty()) {
                    brand = getOrCreateBrand(brandsStr);
                }

                // Parse description
                String desc = csvRecord.isSet("Description") ? csvRecord.get("Description") : "";
                String shortDesc = csvRecord.isSet("Short description") ? csvRecord.get("Short description") : "";

                String sku = csvRecord.isSet("SKU") ? csvRecord.get("SKU") : "";

                // Check if product already exists
                Optional<Product> existing = productRepository.findBySlug(slug);
                Product product;
                if (existing.isPresent()) {
                    product = existing.get();
                } else {
                    product = new Product();
                    product.setSlug(slug);
                }

                if (name.length() > 250) name = name.substring(0, 250);
                product.setName(name);
                product.setPrice(price);
                product.setOldPrice(oldPrice);
                product.setStock(stock);
                product.setImageUrl(imageUrl);
                product.setCategories(productCategories);
                product.setBrand(brand);
                product.setDescription(desc);
                product.setSpecifications(shortDesc);
                product.setSku(sku);

                productRepository.save(product);
            }
        }
    }

    private BigDecimal parsePrice(CSVRecord csvRecord, String columnName) {
        if (csvRecord.isSet(columnName)) {
            String val = csvRecord.get(columnName).trim();
            if (!val.isEmpty()) {
                try {
                    return new BigDecimal(val);
                } catch (NumberFormatException ignored) {}
            }
        }
        return null;
    }

    private Category getOrCreateCategory(String firstCat) {
        if (firstCat.contains(">")) {
            String[] parts = firstCat.split(">");
            firstCat = parts[parts.length - 1].trim();
        }
        if (firstCat.isEmpty()) firstCat = "Uncategorized";

        String slug = makeSlug(firstCat);
        if (slug.isEmpty()) slug = "uncategorized";

        final String finalFirstCat = firstCat;
        final String finalSlug = slug;

        return categoryRepository.findBySlug(finalSlug).orElseGet(() -> {
            Category c = new Category();
            String catName = finalFirstCat;
            if (catName.length() > 100) catName = catName.substring(0, 100);
            c.setName(catName);
            c.setSlug(finalSlug.length() > 120 ? finalSlug.substring(0, 120) : finalSlug);
            return categoryRepository.save(c);
        });
    }

    private Brand getOrCreateBrand(String brandsStr) {
        String firstBrand = brandsStr.split(",")[0].trim();
        if (firstBrand.isEmpty()) return null;

        String slug = makeSlug(firstBrand);
        if (slug.isEmpty()) return null;

        return brandRepository.findBySlug(slug).orElseGet(() -> {
            Brand b = new Brand();
            String brandName = firstBrand;
            if (brandName.length() > 100) brandName = brandName.substring(0, 100);
            b.setName(brandName);
            b.setSlug(slug.length() > 120 ? slug.substring(0, 120) : slug);
            return brandRepository.save(b);
        });
    }

    public static String makeSlug(String input) {
        if (input == null)
            return "";
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
    }
}
