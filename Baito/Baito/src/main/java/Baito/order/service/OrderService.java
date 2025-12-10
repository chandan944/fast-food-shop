package Baito.order.service;

import Baito.order.dto.CreateOrderRequest;
import Baito.order.model.Order;
import Baito.product.product.Product;

import java.util.List;

public interface OrderService {

    
    List<Order> getUserOrders(Long userId);

    List<Order> getAdminOrders(String filter);

    Order updateStatus(Long orderId, String status);

    Order createOrder(CreateOrderRequest request, Long userId);
    // Add product to existing order
    // Increase product quantity in order
    Order increaseQuantity(Long orderId, Long productId, Integer quantityToAdd);

    // Decrease product quantity in order
    Order decreaseQuantity(Long orderId, Long productId, Integer quantityToReduce);

}