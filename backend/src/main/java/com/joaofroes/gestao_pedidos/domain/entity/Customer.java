package com.joaofroes.gestao_pedidos.domain.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Representa um cliente (Customer) no sistema de gestão de pedidos.
 * Esta entidade é mapeada para a tabela "customers" no banco de dados.
 * * @author Joao Froes
 */
@Entity
@Table(name = "customers")
public class Customer {

    /**
    * Identificador único do cliente (Chave Primária).
     * Gerado automaticamente pela estratégia de identidade do banco.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome completo do cliente.
     * Campo obrigatório com limite de 120 caracteres.
     */
    @Column(nullable = false, length = 120)
    private String name;

    /**
     * Endereço de e-mail do cliente.
     * Campo obrigatório e único no sistema (não permite duplicatas).
     */

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    /**
     * Data e hora de criação do registro.
     * Este campo é imutável (updatable = false) e gerado automaticamente.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
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

    public Customer() {
    }

    /**
     * Construtor de conveniência para instanciar um novo cliente.
     * * @param name Nome do cliente.
     * @param email E-mail do cliente.
     */
    public Customer(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}