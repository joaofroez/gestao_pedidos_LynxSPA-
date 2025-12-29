import { updateCartCount, renderCartPage, checkout } from './cart.js';
import { loadProducts } from './products.js';
import { loadMyOrders, closeModal } from './orders.js';

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    // LÓGICA DA PÁGINA DE PRODUTOS (HOME)
    const searchInput = document.getElementById("searchName");
    if (searchInput) {
        loadProducts();

        searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") loadProducts();
        });

        const searchBtn = document.querySelector(".search-btn");
        if (searchBtn) {
            searchBtn.addEventListener("click", loadProducts);
        }
    }

    // LÓGICA DA PÁGINA DE CARRINHO
    const cartContainer = document.getElementById("cart-items");
    if (cartContainer) {
        renderCartPage();

        const checkoutBtn = document.getElementById("checkout-btn") || document.querySelector("button[onclick='checkout()']");
        
        if (checkoutBtn) {
            checkoutBtn.removeAttribute("onclick"); 
            checkoutBtn.addEventListener("click", checkout);
        }
    }

    // LÓGICA DA PÁGINA DE PEDIDOS
    const ordersList = document.getElementById("orders-list");
    if (ordersList) {
        loadMyOrders();
    }

    // LÓGICA GLOBAL (MODAL)
    const closeModalBtn = document.querySelector(".close-modal");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }
    
    const modal = document.getElementById("order-modal");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }
});