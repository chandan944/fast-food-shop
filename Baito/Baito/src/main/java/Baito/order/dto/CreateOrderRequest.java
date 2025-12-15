package Baito.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private String username;
    private String phone;
    private String address;
    private Long price;
    private List<OrderItemRequest> items;  // List of products with quantities
}