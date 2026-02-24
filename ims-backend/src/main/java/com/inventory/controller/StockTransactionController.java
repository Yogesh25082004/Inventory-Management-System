package com.inventory.controller;

import com.inventory.entity.Product;
import com.inventory.entity.StockTransaction;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockTransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/transactions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StockTransactionController {

    private final ProductRepository productRepository;
    private final StockTransactionRepository stockTransactionRepository;

    public StockTransactionController(
            ProductRepository productRepository,
            StockTransactionRepository stockTransactionRepository
    ) {
        this.productRepository = productRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getTransactions(@PathVariable Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }

        return stockTransactionRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTransaction(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> request
    ) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        String rawType = request.get("transactionType") == null ? "" : request.get("transactionType").toString();
        String type = rawType.trim().toUpperCase();
        Integer quantity = parseInt(request.get("quantity"));
        String note = request.get("note") == null ? null : request.get("note").toString();
        String createdBy = request.get("createdBy") == null ? "system" : request.get("createdBy").toString();

        if (!type.equals("IN") && !type.equals("OUT") && !type.equals("ADJUSTMENT")) {
            return ResponseEntity.badRequest().body(error("transactionType must be IN, OUT, or ADJUSTMENT"));
        }
        if (quantity == null || quantity < 0) {
            return ResponseEntity.badRequest().body(error("quantity must be a non-negative number"));
        }
        if (!type.equals("ADJUSTMENT") && quantity == 0) {
            return ResponseEntity.badRequest().body(error("quantity must be greater than 0 for IN/OUT"));
        }

        int before = product.getQuantity();
        int after;

        switch (type) {
            case "IN" -> after = before + quantity;
            case "OUT" -> {
                if (quantity > before) {
                    return ResponseEntity.badRequest().body(error("Insufficient stock for OUT transaction"));
                }
                after = before - quantity;
            }
            default -> after = quantity;
        }

        product.setQuantity(after);
        productRepository.save(product);

        StockTransaction transaction = new StockTransaction();
        transaction.setProduct(product);
        transaction.setTransactionType(type);
        transaction.setQuantity(quantity);
        transaction.setQuantityBefore(before);
        transaction.setQuantityAfter(after);
        transaction.setNote(note);
        transaction.setCreatedBy(createdBy);

        StockTransaction saved = stockTransactionRepository.save(transaction);

        Map<String, Object> response = toResponse(saved);
        response.put("currentQuantity", after);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private Map<String, Object> toResponse(StockTransaction tx) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", tx.getId());
        data.put("productId", tx.getProduct().getId());
        data.put("transactionType", tx.getTransactionType());
        data.put("quantity", tx.getQuantity());
        data.put("quantityBefore", tx.getQuantityBefore());
        data.put("quantityAfter", tx.getQuantityAfter());
        data.put("note", tx.getNote());
        data.put("createdBy", tx.getCreatedBy());
        data.put("createdAt", tx.getCreatedAt());
        return data;
    }

    private Map<String, Object> error(String message) {
        Map<String, Object> data = new HashMap<>();
        data.put("message", message);
        return data;
    }

    private Integer parseInt(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
