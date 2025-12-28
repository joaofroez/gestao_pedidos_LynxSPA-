const API_URL = "http://localhost:8080";

let state = {
    cart: JSON.parse(localStorage.getItem('myCart')) || []
};

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    const searchInput = document.getElementById("searchName");
    if (searchInput) {
        loadProducts();

        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") loadProducts();
        });
    }

    const cartContainer = document.getElementById("cart-items");
    if (cartContainer) {
        renderCartPage(); 
    }
});

async function loadProducts() {
    const name = document.getElementById("searchName").value;
    const category = document.getElementById("searchCategory") ? document.getElementById("searchCategory").value : "";
    const activeEl = document.getElementById("searchActive");
    const active = activeEl ? activeEl.checked : true;

    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (category) params.append("category", category);
    params.append("active", active);

    try {
        const response = await fetch(`${API_URL}/products?${params}`);
        if (!response.ok) throw new Error("Erro na resposta da API");
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("❌ Erro:", error);
        const list = document.getElementById("products-list");
        if(list) {
            list.innerHTML = `<p style="color:red; text-align:center;">Erro ao conectar na API: ${error.message}</p>`;
        }
    }
}

function renderProducts(products) {
    const list = document.getElementById("products-list");
    if(!list) return;

    list.innerHTML = ""; 

    if (products.length === 0) {
        list.innerHTML = `<p>Nenhum produto encontrado.</p>`;
        return;
    }

    products.forEach(p => {
        const priceFormatted = (p.priceCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        // Imagens de placeholder
        let imageUrl = "https://placehold.co/200x150?text=Produto";
        if(p.category && p.category.toLowerCase().includes("eletronico")) imageUrl = "https://placehold.co/200x150/2563eb/FFF?text=Tech";
        if(p.category && p.category.toLowerCase().includes("acessorio")) imageUrl = "https://placehold.co/200x150/orange/FFF?text=Acessorio";
        
        const btnDisabled = p.active ? "" : "disabled";
        const btnText = p.active ? "🛒 Adicionar" : "Indisponível";

        list.innerHTML += `
            <div class="product-card ${!p.active ? 'inactive' : ''}">
                <div class="card-image-wrapper">
                    <span class="category-badge">${p.category || 'Geral'}</span>
                    <img src="${imageUrl}" alt="${p.name}">
                </div>
                <div class="card-content">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-price">${priceFormatted}</div>
                    <button class="btn-add-cart" 
                        onclick="addToCart(${p.id}, '${p.name}', ${p.priceCents})" 
                        ${btnDisabled}>
                        ${btnText}
                    </button>
                </div>
            </div>
        `;
    });
}

function addToCart(id, name, priceCents) {
    const existingItem = state.cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({
            id: id,
            name: name,
            price: priceCents,
            quantity: 1
        });
    }

    saveCart();
    showToast(`"${name}" adicionado!`);
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    renderCartPage(); 
}

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(state.cart));
    updateCartCount();
}

function updateCartCount() {
    const badge = document.getElementById("cart-count-badge");
    if(badge) {
        const totalQty = state.cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.innerText = totalQty;
    }
}

function renderCartPage() {
    const cartElement = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total-value");
    
    if(!cartElement) return;

    cartElement.innerHTML = "";

    if (state.cart.length === 0) {
        cartElement.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
        totalElement.innerText = "R$ 0,00";
        return;
    }

    let totalCents = 0;

    state.cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalCents += subtotal;

        const priceFormatted = (item.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        cartElement.innerHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <strong>${item.name}</strong> <br>
                    <small>Qtd: ${item.quantity} | Unit: ${priceFormatted}</small>
                </div>
                <div class="cart-controls">
                    <button onclick="removeFromCart(${item.id})" class="btn-remove">🗑️ Remover</button>
                </div>
            </div>
        `;
    });

    totalElement.innerText = (totalCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function checkout() {
    if (state.cart.length === 0) {
        alert("Carrinho vazio!");
        return;
    }

    const orderData = {
        customerId: parseInt(document.getElementById("customerId").value) || 1,
        items: state.cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }))
    };

    console.log("Enviando pedido:", orderData);

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert("Pedido realizado com sucesso!");
            state.cart = [];
            saveCart();
            window.location.href = "home.html";
        } else {
            alert("Erro ao finalizar pedido.");
        }
    } catch (error) {
        console.error("Erro checkout:", error);
        alert("Erro de conexão ao finalizar.");
    }
}

function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `<span>✅</span> <span>${msg}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}