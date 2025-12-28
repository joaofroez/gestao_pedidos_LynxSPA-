package com.joaofroes.gestao_pedidos.service;

import com.joaofroes.gestao_pedidos.domain.entity.*;
import com.joaofroes.gestao_pedidos.dto.PaymentRequestDTO;
import com.joaofroes.gestao_pedidos.repository.OrderRepository;
import com.joaofroes.gestao_pedidos.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public PaymentRequestDTO create(PaymentRequestDTO dto) {
        Order order = orderRepository.findById(dto.orderId())
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado"));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("Este pedido já foi totalmente pago.");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmountCents(dto.amountCents());
        payment.setMethod(dto.method());
        paymentRepository.save(payment);

        checkAndCompleteOrder(order);

        return dto;
    }

    private void checkAndCompleteOrder(Order order) {
        List<Payment> payments = paymentRepository.findAllByOrder(order);

        int totalPaid = payments.stream()
                .mapToInt(Payment::getAmountCents)
                .sum();

        if (totalPaid >= order.getTotalCents()) {
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
        }
    }
}