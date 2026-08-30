package com.localmart.repository;

import com.localmart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    List<Order> findBySellerIdOrderByOrderDateDesc(Long sellerId);
    List<Order> findByEmailOrderByOrderDateDesc(String email);
    List<Order> findAllByOrderByOrderDateDesc();
}
