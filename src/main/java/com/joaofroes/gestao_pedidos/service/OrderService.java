package com.joaofroes.gestao_pedidos.service;

import com.joaofroes.gestao_pedidos.domain.entity.*;
import com.joaofroes.gestao_pedidos.dto.*;
import com.joaofroes.gestao_pedidos.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, CustomerRepository customerRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderResponseDTO::fromEntity)
                .toList();
    }

    @Transactional
    public OrderResponseDTO create(OrderRequestDTO dto) {
        Customer customer = customerRepository.findById(dto.customerId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + dto.customerId()));

        Order order = new Order(customer);
        int totalCents = 0;
        
        for (OrderItemRequestDTO itemDto : dto.items()) {
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com ID: " + itemDto.productId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDto.quantity());
            item.setUnitPriceCents(product.getPriceCents());

            order.getItems().add(item);
            
            totalCents += (item.getUnitPriceCents() * item.getQuantity());
        }

        order.setTotalCents(totalCents);

        orderRepository.save(order);

        return OrderResponseDTO.fromEntity(order);
    }
}