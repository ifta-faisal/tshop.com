package com.roboxpressbd.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banners")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String linkUrl;

    @Column(length = 30)
    private String placement; // HERO, PROMOTION

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Integer sortOrder = 0;
}
