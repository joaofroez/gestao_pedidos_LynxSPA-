package com.joaofroes.gestao_pedidos.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;


/**
 * Representa uma transação financeira (Pagamento) realizada para abater o valor de um {@link Order}.
 * <p>
 * O sistema permite múltiplos pagamentos para um único pedido (ex: pagar metade no PIX e metade no Cartão).
 * Quando um pagamento é persistido, ele deve gatilhar a verificação de saldo do pedido.
 * </p>
 * @see Order
 * @see PaymentMethod
 * @author Joao Froes
 */
@Entity
@Table(name = "payments")
public class Payment {

    /**
     * Identificador único da transação.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * O pedido ao qual este pagamento se refere.
     * Relacionamento obrigatório.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /**
     * O método utilizado (PIX, CARD, BOLETO).
     * 
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMethod method; 

    /**
     * Valor do pagamento em centavos.
     * <p>
     * Utiliza-se inteiros para evitar problemas de arredondamento de ponto flutuante.
     * Exemplo: R$ 10,50 é armazenado como 1050.
     * </p>
     */
    @Column(name = "amount_cents", nullable = false)
    private Integer amountCents;

    /**
     * Data e hora exata em que o pagamento foi processado/registrado.
     * Gerado automaticamente pelo sistema.
     */
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    /**
     * Método de callback do ciclo de vida do JPA.
     * Executado automaticamente antes que a entidade seja salva pela primeira vez.
     * Define o atributo {@code paidAt} com o momento atual.
     */
    @PrePersist
    protected void onCreate() {
        this.paidAt = LocalDateTime.now();
    }

    public Payment() {
        
    }
    
    /**
     * Construtor de conveniência para registrar um novo pagamento.
     * @param order O pedido associado.
     * @param method O meio de pagamento escolhido.
     * @param amountCents O valor pago (em centavos).
     */
    public Payment(Order order, PaymentMethod method, Integer amountCents) {
        this.order = order;
        this.method = method;
        this.amountCents = amountCents;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public Integer getAmountCents() {
        return amountCents;
    }

    public void setAmountCents(Integer amountCents) {
        this.amountCents = amountCents;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
}