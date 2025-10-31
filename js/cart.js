// Variable global para el carrito
let cartProducts = [];


function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
  loadSavedTheme();
  // Obtener productos del localStorage y parsear el JSON
  let products = localStorage.getItem("cart");
  console.log("Carrito raw:", products);

  if (products) {
    // Convertir el string JSON a array
    cartProducts = JSON.parse(products);
    console.log("Carrito parseado:", cartProducts);

    // Verificar que sea un array
    if (Array.isArray(cartProducts) && cartProducts.length > 0) {
      showCart();
    } else {
      showEmptyCart();
    }
  } else {
    showEmptyCart();
  }
});

// Función para mostrar el carrito
function showCart() {
  const cartInfo = document.querySelector(".cart");

  if (!cartInfo) {
    console.error("No se encontró el elemento .cart-items");
    return;
  }

  let html = "";
  let total = 0;
  let totalGenereal = 0;
  // Construir HTML de todos los productos
  cartProducts.forEach((product, index) => {
    const subtotal = product.cost * product.count;
    total += subtotal;
    totalGenereal += total;
    html += `
            <div class="cart-item">
                <button class="delete-btn" onclick="removeItem(${index})">Eliminar</button>
                <img src="${product.image}" alt="${
      product.name
    }" class="item-image" onerror="this.src='img/prod1.jpg'">
                <div class="item-details">
                    <div class="item-name">${product.name}</div>
                    <div class="item-price">${
                      product.currency
                    } ${product.cost.toFixed(2)}</div>
                    
                    <div class="quantity-controls">
                        <span class="quantity-label">Cantidad:</span>
                        <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                        <div class="quantity-display">${product.count}</div>
                        <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    
                    <div class="item-subtotal">
                        <span class="subtotal-label">Subtotal:</span>
                        <span class="subtotal-price">${
                          product.currency
                        } ${subtotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
  });
  html += `
      <div style="display:flex; flex-direction:column; background-color:var(--bg-card); border:1px solid #00747C; border-radius:8px; padding:16px; width:100%; display:flex; justify-content:space-between; align-items:center; font-family:Arial, sans-serif; color:var(--text-primary);">
  <div style="display:flex; justify-content:space-between; width:100%">
    <h3>Total:</h3>
    <h4 style="font-weight:bold; align-items:flex-end">USD ${totalGenereal.toFixed(2)}</h4>
  </div>
  <div style="display:flex; flex-direction:column;  width:100%">
    <div style=" margin-top:8px; display:flex; gap:8px; justify-content: center; padding:4px width:100%">
      <button style=" width:100%; background-color:#5C7A7D; border:none; border-radius:8px; padding:6px 8px; color:white; font-weight:bold; cursor:pointer;"
       onclick="continueShopping()">
        Continuar comprando
      </button>
      <button style="width:100%; background-color:#0098A6; border:none; border-radius:8px; padding:6px 8px; color:white; font-weight:bold; cursor:pointer;">
        Finalizar compra
      </button>
    </div>
  </div>
</div>

    `;

  // Insertar todo el HTML de una vez
  cartInfo.innerHTML = html;

  // Mostrar el total
  const totalElement = document.getElementById("totalPrice");
  if (totalElement) {
    const currency = cartProducts[0]?.currency || "USD";
    totalElement.textContent = `${currency} ${total.toFixed(2)}`;
  }

  // Mostrar secciones del total y botones
  document.getElementById("cartTotal").style.display = "block";
  document.getElementById("actionButtons").style.display = "flex";
}

// Función para mostrar carrito vacío
function showEmptyCart() {
  const cartInfo = document.querySelector(".cart");
  if (cartInfo) {
    cartInfo.innerHTML = 
    `<div class="empty-cart" style="display:flex; flex-direction:column;  width:100%; align-items:center">
      <h2>Tu carrito está vacío</h2>
      <div style=" margin-top:8px; display:flex; gap:8px; justify-content: center; padding:4px width:100%">
      <button style=" width:100%; background-color:#5C7A7D; border:none; border-radius:8px; padding:6px 8px; color:white; font-weight:bold; cursor:pointer;"
       onclick="continueShopping()">
        Continuar comprando
      </button>
      </div>`;
  }

  document.getElementById("cartTotal").style.display = "none";
  document.getElementById("actionButtons").style.display = "none";
}

// Función para aumentar cantidad
function increaseQuantity(index) {
  cartProducts[index].count++;
  saveCart();
  showCart();
}

// Función para disminuir cantidad
function decreaseQuantity(index) {
  if (cartProducts[index].count > 1) {
    cartProducts[index].count--;
    saveCart();
    showCart();
  }
}

// Función para eliminar producto
function removeItem(index) {
  if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
    cartProducts.splice(index, 1);
    saveCart();

    if (cartProducts.length === 0) {
      showEmptyCart();
    } else {
      showCart();
    }
  }
}

// Función para guardar el carrito en localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartProducts));
  contarProdcuts();
}

// Función para continuar comprando
function continueShopping() {
  window.location.href = "categories.html";
}

// Función para finalizar compra
function finalizePurchase() {
  if (cartProducts.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const total = cartProducts.reduce((sum, p) => sum + p.cost * p.count, 0);
  const currency = cartProducts[0]?.currency || "USD";

  alert(`Finalizando compra\nTotal: ${currency} ${total.toFixed(2)}`);
  // window.location.href = 'checkout.html';
}
