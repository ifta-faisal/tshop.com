package com.roboxpressbd.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "brands")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(unique = true, length = 120)
    private String slug;

    @Column(length = 500)
    private String logoUrl;
}
