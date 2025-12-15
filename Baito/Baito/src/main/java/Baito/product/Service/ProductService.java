package Baito.product.Service;

import Baito.product.Repository.ProductRepository;
import Baito.product.product.Product;
import Baito.user.Repository.UserRepository;
import Baito.user.user.User;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // 🔒 only allow specific emails
    private void validateAdminAccess(User user) {
        List<String> allowedAdmins = List.of("max@gmail.com", "chandan@gmail.com", "rohit@gmail.com",
                "priyanshu@gmail.com",
                "admin@gmail.com");

        if (!allowedAdmins.contains(user.getEmail())) {
            throw new RuntimeException("Access Denied: You are not allowed to manage products.");
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product createProduct(String name, String imgUrl, String description,
                                 Integer price, Boolean isAvailable, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateAdminAccess(user);   // 🔒 check access

        Product product = new Product();
        product.setName(name);
        product.setImgUrl(imgUrl);
        product.setDescription(description);
        product.setPrice(price);
        product.setIsAvailable(isAvailable);
        product.setUser(user);

        return productRepository.save(product);
    }

    public Product UpdateProduct(Long productId, String name, String imgUrl, String description,
                                 Integer price, Boolean isAvailable, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateAdminAccess(user);   // 🔒 check access

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You cannot update this product");
        }

        product.setName(name);
        product.setImgUrl(imgUrl);
        product.setDescription(description);
        product.setPrice(price);
        product.setIsAvailable(isAvailable);

        return productRepository.save(product);
    }

    public void deleteProduct(Long productId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateAdminAccess(user);   // 🔒 check access

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You cannot delete this product");
        }

        productRepository.delete(product);
    }
}
