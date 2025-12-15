package Baito.product.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String imgUrl;
    private String description;
    private Integer price;
    private Boolean isAvailable;
}

