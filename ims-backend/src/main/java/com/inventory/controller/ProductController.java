package com.inventory.controller;

import com.inventory.entity.Product;
import com.inventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAll() {
        return service.getAllProducts();
    }

    @PostMapping
    public Product add(@Valid @RequestBody Product product) {
        return service.addProduct(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id,@Valid @RequestBody Product product) {
        return service.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }

    @GetMapping("/low-stock")
    public List<Product> lowStock() {
        return service.getLowStockProducts();
    }
}

