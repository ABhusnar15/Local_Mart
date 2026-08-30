package com.localmart.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String category; // e.g. "Vases", "Pots", "Mugs", "Bowls", "Custom"

    private String shape; // "Classic", "Tapered", "Fluted"

    private String size; // "S", "M", "L"

    private String glazeColor;

    @Column(length = 500)
    private String imageUrl;

    @Builder.Default
    private Integer stockQuantity = 10;

    @Builder.Default
    private Boolean inStock = true;

    private Long sellerId;

    private String sellerName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
