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

        Product p1 = new Product("Notebook Gamer", "Eletronicos", 500000);
        p1.setActive(true);

        Product p2 = new Product("Smartphone Pro", "Eletronicos", 350000);
        p2.setActive(true);

        Product p3 = new Product("Tablet Básico", "Eletronicos", 80000);
        p3.setActive(true);

        Product p4 = new Product("Mouse Sem Fio", "Acessorios", 15000);
        p4.setActive(true);

        Product p5 = new Product("Teclado Mecânico", "Acessorios", 45000);
        p5.setActive(true);

        Product p6 = new Product("Cabo HDMI 2m", "Acessorios", 3000);
        p6.setActive(true);

        Product p7 = new Product("Teclado Antigo", "Acessorios", 1000);
        p7.setActive(false);

        Product p8 = new Product("Monitor 27pol 144hz", "Perifericos", 180000);
        p8.setActive(true);

        Product p9 = new Product("Headset Surround", "Perifericos", 35000); 
        p9.setActive(true);

        Product p10 = new Product("Webcam 720p", "Perifericos", 12000);
        p10.setActive(true);

        Product p11 = new Product("Cadeira Gamer RGB", "Escritorio", 120000);
        p11.setActive(true);

        Product p12 = new Product("Mesa Ajustável", "Escritorio", 95000);
        p12.setActive(true);

        Product p13 = new Product("Mouse Antigo", "Acessorios", 1050);
        p13.setActive(false);

        productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13));

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