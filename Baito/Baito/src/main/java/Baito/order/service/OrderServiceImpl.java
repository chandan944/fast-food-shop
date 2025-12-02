package Baito.order.service;


import Baito.order.model.Order;
import Baito.order.repository.OrderRepository;
import Baito.product.Repository.ProductRepository;
import Baito.product.product.Product;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    public OrderServiceImpl(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    @Override
    @Transactional
    public Order createOrder(
            List<Long> productIds,
            String username,
            String phone,
            String address,
            Long userId
    ) {

        // Fetch products from DB
        List<Product> products = productRepo.findAllById(productIds);

        // basic validation: ensure we found all requested products
        if (products.size() != productIds.size()) {
            throw new IllegalArgumentException("One or more productIds are invalid or missing");
        }

        Order order = Order.builder()
                .userId(userId)
                .username(username)
                .phone(phone)
                .address(address)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .products(products)
                .build();

        return orderRepo.save(order);
    }





    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepo.findByUserId(userId);
    }

    @Override
    public List<Order> getAdminOrders(String filter) {

        if (filter == null || filter.isEmpty()) {
            return orderRepo.findAll();
        }

        // Filter by status: PENDING / COMPLETED / CANCELED
        return orderRepo.findByStatus(filter.toUpperCase());
    }

    @Override
    public Order updateStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        order.setStatus(status.toUpperCase());
        return orderRepo.save(order);
    }
}
