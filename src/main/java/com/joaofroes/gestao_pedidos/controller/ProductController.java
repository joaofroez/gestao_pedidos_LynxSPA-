package com.joaofroes.gestao_pedidos.controller;

import com.joaofroes.gestao_pedidos.dto.ProductDTO;
import com.joaofroes.gestao_pedidos.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }
    // GET - lista produtos com filtros opcionais
    @GetMapping
    public ResponseEntity<List<ProductDTO>> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean active
    ){
        List<ProductDTO> products = service.findAll(name, category, active);
        return ResponseEntity.ok(products);
    }
}