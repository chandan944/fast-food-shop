package Baito.order.controller;

import Baito.order.dto.CreateOrderRequest;
import Baito.order.model.Order;
import Baito.order.service.OrderService;

import Baito.user.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/orders")
public class OrderController {
    private final OrderService orderService;

    private static final List<String> ALLOWED_ADMIN_EMAILS = List.of(
            "max@gmail.com",
            "chandan@gmail.com",
            "rohit@gmail.com",
            "priyanshu@gmail.com",
            "admin@gmail.com"
    );

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private void checkAdminPermission(User user) {
        if (!ALLOWED_ADMIN_EMAILS.contains(user.getEmail())) {
            throw new RuntimeException("You are not allowed to access admin features!");
        }
    }

    // CREATE ORDER WITH PRODUCTS IN ONE CALL
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(
            @RequestBody CreateOrderRequest request,
            @RequestAttribute("authenticatedUser") User user
    ) {
        Order order = orderService.createOrder(request, user.getId());
        return ResponseEntity.ok(order);
    }

    // INCREASE PRODUCT QUANTITY IN ORDER
    @PutMapping("/{orderId}/product/{productId}/increase")
    public ResponseEntity<Order> increaseQuantity(
            @PathVariable Long orderId,
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            @RequestAttribute("authenticatedUser") User user
    ) {
        Order order = orderService.increaseQuantity(orderId, productId, quantity);
        return ResponseEntity.ok(order);
    }

    // DECREASE PRODUCT QUANTITY IN ORDER
    @PutMapping("/{orderId}/product/{productId}/decrease")
    public ResponseEntity<Order> decreaseQuantity(
            @PathVariable Long orderId,
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            @RequestAttribute("authenticatedUser") User user
    ) {
        Order order = orderService.decreaseQuantity(orderId, productId, quantity);
        return ResponseEntity.ok(order);
    }

    // USER → See only their own orders
    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(
            @RequestAttribute("authenticatedUser") User user) {

        List<Order> orders = orderService.getUserOrders(user.getId());
        return ResponseEntity.ok(orders);
    }

    // ADMIN → See all orders
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestAttribute("authenticatedUser") User user,
            @RequestParam(required = false) String filter
    ) {
        checkAdminPermission(user);

        List<Order> orders = orderService.getAdminOrders(filter);
        return ResponseEntity.ok(orders);
    }


    // ADMIN → Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status,
            @RequestAttribute("authenticatedUser") User user) {

        checkAdminPermission(user);
        Order updated = orderService.updateStatus(orderId, status);
        return ResponseEntity.ok(updated);
    }
}
