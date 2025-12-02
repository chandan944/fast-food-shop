package Baito.order.service;

import Baito.order.model.Order;
import Baito.product.product.Product;

import java.util.List;

public interface OrderService {

    
    List<Order> getUserOrders(Long userId);

    List<Order> getAdminOrders(String filter);

    Order updateStatus(Long orderId, String status);

    Order createOrder(List<Long> product, String username, String phone, String address, Long id);
}