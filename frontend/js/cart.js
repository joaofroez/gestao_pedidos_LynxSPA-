import { API_URL } from './api.js';
import { formatCurrency, showToast } from './utils.js';

let cart = JSON.parse(localStorage.getItem('myCart')) || [];

export function updateCartCount() {
    const badge = document.getElementById("cart-count-badge");
    if(badge) {
        const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.innerText = totalQty;
    }
}

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartCount();
}

export function addToCart(id, name, priceCents) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: priceCents,
            quantity: 1
        });
    }

    saveCart();
    showToast(`"${name}" adicionado!`);
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartPage(); 
}

export function changeCartItemQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity < 1) item.quantity = 1;

    saveCart();
    renderCartPage();
}

export function renderCartPage() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total-value");
    if(!container) return;

    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
        totalEl.innerText = "R$ 0,00";
        return;
    }

    let totalCents = 0;

    cart.forEach(item => {
        totalCents += item.price * item.quantity;
        const subtotal = item.price * item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <small>Preço: ${formatCurrency(item.price)}</small>
            </div>
            
            <div class="cart-qty-controls">
                <small>Quantidade: </small>
                <button class="qty-btn-mini btn-decrease">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn-mini btn-increase">+</button>
            </div>

            <div class="cart-item-price">
                <strong>${formatCurrency(subtotal)}</strong>
            </div>

            <button class="btn-remove-icon" title="Remover">🗑️</button>
        `;

        itemDiv.querySelector('.btn-decrease').addEventListener('click', () => changeCartItemQty(item.id, -1));
        itemDiv.querySelector('.btn-increase').addEventListener('click', () => changeCartItemQty(item.id, 1));
        itemDiv.querySelector('.btn-remove-icon').addEventListener('click', () => removeFromCart(item.id));

        container.appendChild(itemDiv);
    });

    totalEl.innerText = formatCurrency(totalCents);
}

export async function checkout() {
    if (cart.length === 0) return alert("Carrinho vazio!");
    
    const orderData = {
        // hardcoded
        customerId: 1, 
        items: cart.map(i => ({ productId: i.id, quantity: i.quantity }))
    };

    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            alert("Pedido realizado com sucesso!");
            cart = [];
            saveCart();
            window.location.href = "home.html";
        } else {
            alert("Erro ao finalizar pedido.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
    }
}