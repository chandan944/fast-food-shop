package Baito.order.service;


import Baito.order.dto.CreateOrderRequest;
import Baito.order.dto.OrderItemRequest;
import Baito.order.model.Order;
import Baito.order.model.OrderItem;
import Baito.order.repository.OrderItemRepository;
import Baito.order.repository.OrderRepository;
import Baito.product.Repository.ProductRepository;
import Baito.product.product.Product;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final OrderItemRepository orderItemRepo;
    public OrderServiceImpl(OrderRepository orderRepo, ProductRepository productRepo, OrderItemRepository orderItemRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.orderItemRepo = orderItemRepo;
    }

    @Override
    @Transactional
    public Order createOrder(CreateOrderRequest request, Long userId) {

        // Step 1: Validate input
        if (request == null || request.getUsername() == null || request.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.getPhone() == null || request.getPhone().isEmpty()) {
            throw new IllegalArgumentException("Phone is required");
        }
        if (request.getAddress() == null || request.getAddress().isEmpty()) {
            throw new IllegalArgumentException("Address is required");
        }

        // Step 2: Create order
        Order order = Order.builder()
                .userId(userId)
                .username(request.getUsername())
                .phone(request.getPhone())
                .address(request.getAddress())
                .price(request.getPrice())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        order = orderRepo.save(order);

        // Step 3: Process items if provided
        List<OrderItem> orderItems = new ArrayList<>();

        if (request.getItems() != null && !request.getItems().isEmpty()) {

            // Group duplicate products and sum quantities
            Map<Long, Integer> productQuantityMap = new HashMap<>();
            for (OrderItemRequest itemRequest : request.getItems()) {
                if (itemRequest.getProductId() == null || itemRequest.getQuantity() == null) {
                    throw new IllegalArgumentException("ProductId and Quantity are required");
                }
                productQuantityMap.put(
                        itemRequest.getProductId(),
                        productQuantityMap.getOrDefault(itemRequest.getProductId(), 0) + itemRequest.getQuantity()
                );
            }

            // Create OrderItem for each unique product
            for (Map.Entry<Long, Integer> entry : productQuantityMap.entrySet()) {
                Long productId = entry.getKey();
                Integer totalQuantity = entry.getValue();

                String productName = "Unknown Product";
                Double productPrice = 0.0;

                try {
                    Product product = productRepo.findById(productId).orElse(null);
                    if (product != null) {
                        productName = product.getName();
                        productPrice = Double.valueOf(product.getPrice());
                    }
                } catch (Exception e) {
                    System.err.println("Warning: Could not fetch product details for ID: " + productId);
                }

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .productId(productId)
                        .productName(productName)
                        .productPrice(productPrice)
                        .quantity(totalQuantity)
                        .build();

                orderItems.add(orderItem);
            }

            orderItemRepo.saveAll(orderItems);
        }

        order.setItems(orderItems);
        return order;
    }

    // INCREASE QUANTITY
    @Override
    @Transactional
    public Order increaseQuantity(Long orderId, Long productId, Integer quantityToAdd) {

        if (orderId == null || productId == null || quantityToAdd == null) {
            throw new IllegalArgumentException("OrderId, ProductId, and Quantity are required");
        }

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        OrderItem item = orderItemRepo.findByOrderIdAndProductId(orderId, productId);

        if (item == null) {
            throw new RuntimeException("Product with ID " + productId + " not found in this order");
        }

        item.setQuantity(item.getQuantity() + quantityToAdd);
        orderItemRepo.save(item);

        return orderRepo.findById(orderId).get();
    }

    // DECREASE QUANTITY
    @Override
    @Transactional
    public Order decreaseQuantity(Long orderId, Long productId, Integer quantityToReduce) {

        if (orderId == null || productId == null || quantityToReduce == null) {
            throw new IllegalArgumentException("OrderId, ProductId, and Quantity are required");
        }

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        OrderItem item = orderItemRepo.findByOrderIdAndProductId(orderId, productId);

        if (item == null) {
            throw new RuntimeException("Product with ID " + productId + " not found in this order");
        }

        int newQuantity = item.getQuantity() - quantityToReduce;

        if (newQuantity <= 0) {
            orderItemRepo.delete(item);
        } else {
            item.setQuantity(newQuantity);
            orderItemRepo.save(item);
        }

        return orderRepo.findById(orderId).get();
    }




    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepo.findByUserId(userId);
    }

    @Override
    public List<Order> getAdminOrders(String filter) {

        if (filter == null || filter.isEmpty()) {
            return orderRepo.findAllByOrderByCreatedAtDesc(); // ⬇️ Latest first
        }

        return orderRepo.findByStatusOrderByCreatedAtDesc(filter.toUpperCase());
    }


    @Override
    public Order updateStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        order.setStatus(status.toUpperCase());
        return orderRepo.save(order);
    }
}
