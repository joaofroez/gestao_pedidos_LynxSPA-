package com.joaofroes.gestao_pedidos.repository;

import com.joaofroes.gestao_pedidos.domain.entity.Payment;
import com.joaofroes.gestao_pedidos.domain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);
    List<Payment> findAllByOrder(Order order);
}