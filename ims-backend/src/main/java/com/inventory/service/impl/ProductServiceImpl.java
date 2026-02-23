package com.inventory.service.impl;

import com.inventory.entity.Product;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import com.inventory.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;

    public ProductServiceImpl(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product addProduct(Product product) {
        return repository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        Product existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        existing.setProductName(product.getProductName());
        existing.setCategory(product.getCategory());
        existing.setQuantity(product.getQuantity());
        existing.setPrice(product.getPrice());

        return repository.save(existing);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        repository.deleteById(id);
    }

    @Override
    public List<Product> getLowStockProducts() {
        return repository.findByQuantityLessThan(5);
    }
}

