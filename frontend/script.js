const API_URL = "http://localhost:8080";

let state = {
    cart: [] 
};

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    document.getElementById("searchName").addEventListener("keypress", function(event) {
        if (event.key === "Enter") loadProducts();
    });
});

async function loadProducts() {
    const name = document.getElementById("searchName").value;
    const category = document.getElementById("searchCategory").value;
    const active = document.getElementById("searchActive").checked;

    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (category) params.append("category", category);
    params.append("active", active);

    console.log("🔍 Buscando em:", `${API_URL}/products?${params}`);

    try {
        const response = await fetch(`${API_URL}/products?${params}`);
        if (!response.ok) throw new Error("Erro na resposta da API");
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("❌ Erro:", error);
        document.getElementById("products-list").innerHTML = 
            `<p style="color:red; text-align:center; grid-column: 1/-1;">
                Erro ao conectar com o Backend.<br>
                1. Verifique se o Java está rodando.<br>
                2. Verifique se adicionou @CrossOrigin nos Controllers.<br>
                Erro técnico: ${error.message}
            </p>`;
    }
}

function renderProducts(products) {
    const list = document.getElementById("products-list");
    list.innerHTML = ""; 

    if (products.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p style="font-size: 1.2rem; color: #666;">Nenhum produto encontrado.</p>
            </div>
        `;
        return;
    }

    products.forEach(p => {
        const priceFormatted = (p.priceCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        // Imagens de placeholder
        let imageUrl = "https://placehold.co/200x150?text=Produto";
        if(p.category && p.category.toLowerCase().includes("eletronico")) imageUrl = "https://placehold.co/200x150/2563eb/FFF?text=Tech";
        if(p.category && p.category.toLowerCase().includes("acessorio")) imageUrl = "https://placehold.co/200x150/orange/FFF?text=Acessorio";
        
        const inactiveClass = p.active ? "" : "inactive";
        const btnDisabled = p.active ? "" : "disabled";

        list.innerHTML += `
            <div class="product-card ${inactiveClass}">
                <div class="card-image-wrapper">
                    <span class="category-badge">${p.category || 'Geral'}</span>
                    <img src="${imageUrl}" alt="${p.name}">
                </div>
                <div class="card-content">
                    <h3 class="product-title" title="${p.name}">${p.name}</h3>
                    <div class="product-price">${priceFormatted}</div>
                    <button class="btn-add-cart" 
                        onclick="addToCart(${p.id}, '${p.name}', ${p.priceCents})" 
                        ${btnDisabled}>
                        ${p.active ? "🛒 Adicionar" : "Indisponível"}
                    </button>
                </div>
            </div>
        `;
    });
}
