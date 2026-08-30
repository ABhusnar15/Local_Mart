package com.localmart.config;

import com.localmart.dto.RegisterRequest;
import com.localmart.model.Order;
import com.localmart.model.OrderItem;
import com.localmart.model.Product;
import com.localmart.repository.OrderRepository;
import com.localmart.repository.ProductRepository;
import com.localmart.repository.UserRepository;
import com.localmart.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthService authService;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Demo Seller
            RegisterRequest sellerReq = new RegisterRequest();
            sellerReq.setName("Master Artisan Raj");
            sellerReq.setEmail("artisan@localmart.com");
            sellerReq.setPassword("artisan123");
            sellerReq.setRole("SELLER");
            sellerReq.setPhone("+91 9876543210");
            sellerReq.setAddress("Craftsman Alley, Jaipur, India");
            sellerReq.setShopName("Jaipur Royal Clayware");
            authService.register(sellerReq);

            // Seed Demo Buyer
            RegisterRequest buyerReq = new RegisterRequest();
            buyerReq.setName("Aria Sharma");
            buyerReq.setEmail("buyer@localmart.com");
            buyerReq.setPassword("buyer123");
            buyerReq.setRole("BUYER");
            buyerReq.setPhone("+91 9123456789");
            buyerReq.setAddress("42 Blossom Heights, Bangalore");
            authService.register(buyerReq);
        }

        if (productRepository.count() == 0) {
            Long sellerId = userRepository.findByEmail("artisan@localmart.com").map(u -> u.getId()).orElse(1L);

            List<Product> sampleProducts = List.of(
                Product.builder()
                    .name("Classic Terracotta Amphora")
                    .description("Hand-thrown terracotta vase crafted using traditional wheel techniques. Perfect for dried florals.")
                    .price(new BigDecimal("49.99"))
                    .category("Vases")
                    .shape("Classic")
                    .size("L")
                    .glazeColor("Terracotta")
                    .imageUrl("https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800")
                    .stockQuantity(15)
                    .inStock(true)
                    .sellerId(sellerId)
                    .sellerName("Jaipur Royal Clayware")
                    .build(),

                Product.builder()
                    .name("Cobalt Blue Ceramic Pitcher")
                    .description("Stunning deep cobalt glaze over durable stoneware clay. Food-safe and dishwasher safe.")
                    .price(new BigDecimal("65.00"))
                    .category("Tableware")
                    .shape("Tapered")
                    .size("M")
                    .glazeColor("Cobalt Blue")
                    .imageUrl("https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800")
                    .stockQuantity(8)
                    .inStock(true)
                    .sellerId(sellerId)
                    .sellerName("Jaipur Royal Clayware")
                    .build(),

                Product.builder()
                    .name("Fluted Sage Green Planter")
                    .description("Minimalist fluted indoor planter with built-in drainage tray. Subtle matte sage finish.")
                    .price(new BigDecimal("38.50"))
                    .category("Planters")
                    .shape("Fluted")
                    .size("M")
                    .glazeColor("Sage Green")
                    .imageUrl("https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800")
                    .stockQuantity(20)
                    .inStock(true)
                    .sellerId(sellerId)
                    .sellerName("Jaipur Royal Clayware")
                    .build(),

                Product.builder()
                    .name("Golden Ochre Espresso Cup Set")
                    .description("Set of 2 hand-carved clay espresso cups featuring warm golden glaze accents.")
                    .price(new BigDecimal("32.00"))
                    .category("Cups")
                    .shape("Classic")
                    .size("S")
                    .glazeColor("Golden Ochre")
                    .imageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800")
                    .stockQuantity(12)
                    .inStock(true)
                    .sellerId(sellerId)
                    .sellerName("Jaipur Royal Clayware")
                    .build(),

                Product.builder()
                    .name("Charcoal Stoneware Serving Bowl")
                    .description("Rustic textured charcoal black serving bowl, organic rim edges.")
                    .price(new BigDecimal("78.00"))
                    .category("Bowls")
                    .shape("Classic")
                    .size("L")
                    .glazeColor("Charcoal Black")
                    .imageUrl("https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800")
                    .stockQuantity(5)
                    .inStock(true)
                    .sellerId(sellerId)
                    .sellerName("Jaipur Royal Clayware")
                    .build()
            );

            productRepository.saveAll(sampleProducts);
        }

        if (orderRepository.count() == 0) {
            Long buyerId = userRepository.findByEmail("buyer@localmart.com").map(u -> u.getId()).orElse(2L);
            Long sellerId = userRepository.findByEmail("artisan@localmart.com").map(u -> u.getId()).orElse(1L);

            Order demoOrder = Order.builder()
                    .userId(buyerId)
                    .customerName("Aria Sharma")
                    .email("buyer@localmart.com")
                    .phone("+91 9123456789")
                    .shippingAddress("42 Blossom Heights, Bangalore")
                    .shape("Fluted")
                    .size("M")
                    .glazeColor("Cobalt Blue")
                    .engraving("Aria 2026")
                    .totalPrice(new BigDecimal("74.99"))
                    .status("IN_PRODUCTION")
                    .sellerId(sellerId)
                    .build();

            OrderItem item = OrderItem.builder()
                    .productId(1L)
                    .productName("Custom Fluted Cobalt Blue Pot")
                    .quantity(1)
                    .unitPrice(new BigDecimal("74.99"))
                    .customShape("Fluted")
                    .customSize("M")
                    .customGlazeColor("Cobalt Blue")
                    .customEngraving("Aria 2026")
                    .build();

            demoOrder.addItem(item);
            orderRepository.save(demoOrder);
        }
    }
}
