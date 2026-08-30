package com.localmart.service;

import com.localmart.model.Order;
import com.localmart.model.OrderItem;
import com.localmart.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        if (order.getStatus() == null) {
            order.setStatus("PENDING");
        }
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<Order> getOrdersBySeller(Long sellerId) {
        return orderRepository.findBySellerIdOrderByOrderDateDesc(sellerId);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByEmailOrderByOrderDateDesc(email);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
}
