package com.roboxpressbd.config;

import com.roboxpressbd.entity.Category;
import com.roboxpressbd.entity.Product;
import com.roboxpressbd.entity.User;
import com.roboxpressbd.entity.Brand;
import com.roboxpressbd.repository.CategoryRepository;
import com.roboxpressbd.repository.ProductRepository;
import com.roboxpressbd.repository.UserRepository;
import com.roboxpressbd.repository.BrandRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BrandRepository brandRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, BrandRepository brandRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.brandRepository = brandRepository;
    }

    @Override
    public void run(String... args) {
        var adminOpt = userRepository.findByEmail("admin@roboxpressbd.com");
        User admin;
        if (adminOpt.isEmpty()) {
            admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@roboxpressbd.com");
        } else {
            admin = adminOpt.get();
        }
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRoles(new java.util.HashSet<>(Set.of("ROLE_USER", "ROLE_ADMIN")));
        userRepository.save(admin);
        System.out.println("Seeded/Updated Admin User!");

        List<String> vendorNames = List.of(
                "Anycubic", "AOS RC", "Arduino", "Axisflying", "Bambu Lab", "BETAFPV", "Caddx", "CUAV", "CubePilot", "DarwinFPV", "Diatone", "DJI", "Eachine", "Fat Shark", "ISDT", "FLSUN", "Flysky", "FlyFishRC", "Flywoo", "Gemfan", "GEPRC", "HDZero", "HEX", "HGLRC", "HOTA", "Hobbywing", "Holybro", "Hummingbird", "iFlight", "ImmersionRC", "Lumenier", "Maestro", "MicoAir", "NVIDIA®", "Radio Master", "RCINPOWER", "RFDesign", "Runcam", "RushTank", "SpeedyBee", "Sunlu", "Tattu GensAce", "TBS", "T-Motor", "Turnigy", "ToolKitRC", "XTAR"
        );

        for (String name : vendorNames) {
            String slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
            if (brandRepository.findBySlug(slug).isEmpty()) {
                Brand brand = new Brand();
                brand.setName(name);
                brand.setSlug(slug);
                brandRepository.save(brand);
            }
        }

        if (categoryRepository.findBySlug("3d-printing-designs").isEmpty()) {
            Category cat = new Category();
            cat.setName("3D Printing Designs");
            cat.setSlug("3d-printing-designs");
            categoryRepository.save(cat);

            // Double Helix Lamp
            Product p1 = new Product();
            p1.setName("Double Helix Lamp");
            p1.setSlug("double-helix-lamp");
            p1.setPrice(new BigDecimal("2280"));
            p1.getCategories().add(cat);
            p1.setStock(10);
            p1.setImageUrl("https://robohub.com.bd/assets/images/product/thumb_693062a6edfa51764778662.jpg");
            productRepository.save(p1);

            // Modern & Minimalistic Lamp
            Product p2 = new Product();
            p2.setName("Modern & Minimalistic Lamp");
            p2.setSlug("modern-minimalistic-lamp");
            p2.setPrice(new BigDecimal("17385"));
            p2.getCategories().add(cat);
            p2.setStock(10);
            p2.setImageUrl("https://placehold.co/400x400?text=Modern+Lamp");
            productRepository.save(p2);

            // Fractal Flake Vase
            Product p3 = new Product();
            p3.setName("Fractal Flake Vase");
            p3.setSlug("fractal-flake-vase");
            p3.setPrice(new BigDecimal("690"));
            p3.getCategories().add(cat);
            p3.setStock(20);
            p3.setImageUrl("https://placehold.co/400x400?text=Fractal+Vase");
            productRepository.save(p3);

            // Clamp Holder
            Product p4 = new Product();
            p4.setName("Clamp Holder");
            p4.setSlug("clamp-holder");
            p4.setPrice(new BigDecimal("2790"));
            p4.getCategories().add(cat);
            p4.setStock(50);
            p4.setImageUrl("https://placehold.co/400x400?text=Clamp+Holder");
            productRepository.save(p4);

            // Wave Lamp
            Product p5 = new Product();
            p5.setName("Wave Lamp");
            p5.setSlug("wave-lamp");
            p5.setPrice(new BigDecimal("1890"));
            p5.getCategories().add(cat);
            p5.setStock(15);
            p5.setImageUrl("https://placehold.co/400x400?text=Wave+Lamp");
            productRepository.save(p5);
            
            System.out.println("Seeded 3D Printing Products!");
        }
    }
}
