package Baito.product.Controller;

import Baito.dto.Response;
import Baito.product.Service.ProductService;
import Baito.product.dto.ProductRequest;
import Baito.product.product.Product;
import Baito.user.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/product")
public class ProductController {

    final private ProductService productService;

    // allowed emails
    private static final List<String> ALLOWED_ADMIN_EMAILS = List.of(
            "max@gmail.com",
            "chandan@gmail.com",
            "rohit@gmail.com",
            "priyanshu@gmail.com",
            "admin@gmail.com"
    );

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // permission check
    private void checkAdminPermission(User user) {
        if (!ALLOWED_ADMIN_EMAILS.contains(user.getEmail())) {
            throw new RuntimeException("You are not allowed to manage products!");
        }
    }

    @GetMapping()
    public ResponseEntity<List<Product>> getAllProducts(){
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProduct(@PathVariable Long productId){
        Product product = productService.getProduct(productId);
        return ResponseEntity.ok(product);
    }

    @PostMapping()
    public ResponseEntity<Product> createProduct(
            @RequestParam("name") String name,
            @RequestParam("imgUrl") String imgUrl,
            @RequestParam("description") String description,
            @RequestParam("price") Integer price,
            @RequestParam("isAvailable") Boolean isAvailable,
            @RequestAttribute("authenticatedUser") User user){

        checkAdminPermission(user);  // 🔥 important

        Product product = productService.createProduct(name ,imgUrl ,description ,price ,isAvailable , user.getId());
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest request,
            @RequestAttribute("authenticatedUser") User user
    ) {
        checkAdminPermission(user); // 🔥 important

        Product updatedProduct = productService.UpdateProduct(
                productId,
                request.getName(),
                request.getImgUrl(),
                request.getDescription(),
                request.getPrice(),
                request.getIsAvailable(),
                user.getId()
        );

        return ResponseEntity.ok(updatedProduct);
    }


    @DeleteMapping("/{productId}")
    public ResponseEntity<Response> deleteProduct(@PathVariable Long productId,
                                                  @RequestAttribute("authenticatedUser") User user) throws Exception {

        checkAdminPermission(user);  // 🔥 important

        productService.deleteProduct(productId , user.getId());
        return ResponseEntity.ok(new Response("deleted successfully"));
    }
}
