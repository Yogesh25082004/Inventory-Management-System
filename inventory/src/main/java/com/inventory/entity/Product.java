package com.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Column(name = "product_name", nullable = false)
    private String productName;

    @Setter
    @Getter
    private String category;

    @Setter
    @Getter
    @Min(0)
    private int quantity;

    @Setter
    @Getter
    @Min(0)
    private double price;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // getters & setters
}

