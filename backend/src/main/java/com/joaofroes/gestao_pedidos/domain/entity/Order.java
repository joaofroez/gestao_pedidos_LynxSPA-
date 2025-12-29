package com.joaofroes.gestao_pedidos.domain.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Representa um pedido (Order) no sistema.
 * Esta é a entidade central que agrupa o cliente, os itens pedidos e os pagamentos realizados.
 * Mapeada para a tabela "orders" conforme requisitos do esquema de banco de dados.
 * @see Customer
 * @see OrderItem
 * @see Payment
 */
@Entity
@Table(name = "orders")
public class Order {

    /**
     * Identificador único do pedido (Chave Primária).
     * Gerado automaticamente pelo banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * O cliente que realizou o pedido.
     * Relacionamento obrigatório (Muitos pedidos para um cliente).
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    /**
     * Status atual do pedido (ex: NEW, PAID, CANCELLED).
     * O status inicial padrão é {@link OrderStatus#NEW}.
     * A alteração para PAID ocorre automaticamente se a soma dos pagamentos cobrir o total.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.NEW;

    /**
     * Valor total do pedido armazenado em centavos (R$ 10,00 = 1000).
     * Calculado pela soma de (quantidade * preço unitário) de todos os itens.
     */
    @Column(name = "total_cents", nullable = false)
    private Integer totalCents = 0;

    /**
     * Lista de itens que compõem este pedido.
     * O {@code CascadeType.ALL} garante que ao salvar o pedido, os itens também sejam salvos.
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    /**
     * Lista de pagamentos registrados para este pedido.
     * Usada para calcular o total pago e determinar se o pedido pode ser marcado como PAID.
     * Busca todos pagamentos ao receber um getPayments().
     */
    @OneToMany(mappedBy = "order") 
    private List<Payment> payments = new ArrayList<>();

    /**
     * Data e hora exata em que o pedido foi criado.
     * Gerado automaticamente antes da persistência.
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    /**
     * Método de callback do ciclo de vida do JPA.
     * Executado automaticamente antes que a entidade seja salva pela primeira vez.
     * Define o atributo {@code createdAt} com o momento atual.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Order() {
        
    }

    public Order(Customer customer) {
        this.customer = customer;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Integer getTotalCents() {
        return totalCents;
    }

    public void setTotalCents(Integer totalCents) {
        this.totalCents = totalCents;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
}