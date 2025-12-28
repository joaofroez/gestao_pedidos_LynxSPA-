package com.joaofroes.gestao_pedidos.config;

import com.joaofroes.gestao_pedidos.domain.entity.*;
import com.joaofroes.gestao_pedidos.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public DatabaseSeeder(ProductRepository productRepository, 
                          CustomerRepository customerRepository,
                          OrderRepository orderRepository,
                          PaymentRepository paymentRepository) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        customerRepository.deleteAll();

        Product p1 = new Product();
        p1.setName("Notebook Gamer");
        p1.setCategory("Eletronicos");
        p1.setPriceCents(500000);
        p1.setActive(true);

        Product p2 = new Product();
        p2.setName("Mouse Sem Fio");
        p2.setCategory("Acessorios");
        p2.setPriceCents(15000);
        p2.setActive(true);

        Product p3 = new Product();
        p3.setName("Teclado Antigo"); 
        p3.setCategory("Acessorios");
        p3.setPriceCents(5000);
        p3.setActive(false);

        productRepository.saveAll(Arrays.asList(p1, p2, p3));

        Customer c1 = new Customer();
        c1.setName("Joao Froes");
        c1.setEmail("joao@teste.com");
        
        Customer c2 = new Customer();
        c2.setName("Maria Silva");
        c2.setEmail("maria@teste.com");

        customerRepository.saveAll(Arrays.asList(c1, c2));

        Order order = new Order(c1);
        order.setStatus(OrderStatus.NEW);
        
        OrderItem item1 = new OrderItem();
        item1.setOrder(order);
        item1.setProduct(p1);
        item1.setQuantity(1);
        item1.setUnitPriceCents(p1.getPriceCents());

        order.getItems().add(item1);
        
        order.setTotalCents(p1.getPriceCents());

        orderRepository.save(order);

        System.out.println("-----------------------------------");
        System.out.println("BANCO DE DADOS INCIADO E POPULADO");
        System.out.println("Pedido criado com ID: " + order.getId());
        System.out.println("----------------------------------");
    }
}