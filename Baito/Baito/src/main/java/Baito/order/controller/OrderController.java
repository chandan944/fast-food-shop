package Baito.order.controller;

import Baito.order.model.Order;
import Baito.order.service.OrderService;
import Baito.product.product.Product;
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
            "chandan@gmail.com"
    );

    private void checkAdminPermission(User user) {
        if (!ALLOWED_ADMIN_EMAILS.contains(user.getEmail())) {
            throw new RuntimeException("You are not allowed to access admin features!");
        }
    }

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(
            @RequestParam("productIds") List<Long> productIds,
            @RequestParam("username") String username,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestAttribute("authenticatedUser") User user
    ) {
        Order order = orderService.createOrder(
                productIds,
                username,
                phone,
                address,
                user.getId()
        );
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
