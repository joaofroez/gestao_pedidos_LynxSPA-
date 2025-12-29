import { API_URL } from './api.js';
import { formatCurrency } from './utils.js';
import { addToCart } from './cart.js';

export async function loadProducts() {
    const nameInput = document.getElementById("searchName");
    const categoryInput = document.getElementById("searchCategory");
    const activeEl = document.getElementById("searchActive");

    const name = nameInput ? nameInput.value : "";
    const category = categoryInput ? categoryInput.value : "";
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
        let imageUrl = "https://placehold.co/200x150?text=Produto";
        if(p.category && p.category.toLowerCase().includes("eletronico")) imageUrl = "https://placehold.co/200x150/2563eb/FFF?text=Tech";
        if(p.category && p.category.toLowerCase().includes("acessorio")) imageUrl = "https://placehold.co/200x150/orange/FFF?text=Acessorio";
        if(p.category && p.category.toLowerCase().includes("perifericos")) imageUrl = "https://placehold.co/200x150/green/FFF?text=Periférico";
        if(p.category && p.category.toLowerCase().includes("escritorio")) imageUrl = "https://placehold.co/200x150/brown/FFF?text=Escritório";
        
        const btnDisabled = p.active ? "" : "disabled";
        const btnText = p.active ? "🛒 Adicionar" : "Indisponível";

        const card = document.createElement('div');
        card.className = `product-card ${!p.active ? 'inactive' : ''}`;

        card.innerHTML = `
            <div class="card-image-wrapper">
                <span class="category-badge">${p.category || 'Geral'}</span>
                <img src="${imageUrl}" alt="${p.name}">
            </div>
            <div class="card-content">
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">${formatCurrency(p.priceCents)}</div>
                <button class="btn-add-cart" ${btnDisabled}>
                    ${btnText}
                </button>
            </div>
        `;
        
        if (p.active) {
            const btn = card.querySelector('.btn-add-cart');
            btn.addEventListener('click', () => {
                addToCart(p.id, p.name, p.priceCents);
            });
        }

        list.appendChild(card);
    });
}