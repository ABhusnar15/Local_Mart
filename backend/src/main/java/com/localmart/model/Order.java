package com.localmart.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String shippingAddress;

    // Custom order properties (if direct custom order)
    private String shape; // Classic, Tapered, Fluted
    private String size; // S, M, L
    private String glazeColor;
    private String engraving;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Builder.Default
    private String status = "PENDING"; // PENDING, IN_PRODUCTION, SHIPPED, DELIVERED

    private Long sellerId; // Associated artisan seller if applicable

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    private LocalDateTime orderDate;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}
