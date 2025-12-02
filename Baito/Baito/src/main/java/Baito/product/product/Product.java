package Baito.product.product;


import Baito.user.user.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String imgUrl;
    private String description;
    private Integer price;
    private Boolean isAvailable;
    @ManyToOne
    private User user;



}
