// Variable global para el carrito
let cartProducts = [];
let currentStep = 1; // Variable para controlar el paso actual

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

// Función para cambiar de paso
function goToStep(step) {
  currentStep = step;
  
  // Ocultar todos los pasos
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'none';
  
  // Cambiar el título según el paso
  const pageTitle = document.querySelector('.profile-header h1');
  if (pageTitle) {
    if (step === 1) {
      pageTitle.textContent = 'Carrito de compras';
    } else if (step === 2) {
      pageTitle.textContent = 'Dirección de Envío';
    } else if (step === 3) {
      pageTitle.textContent = 'Tipo de Envío';
    }
  }
  
  // Mostrar el paso actual
  if (step === 1 && step1) {
    step1.style.display = 'flex';
  } else if (step === 2 && step2) {
    step2.style.display = 'flex';
  } else if (step === 3 && step3) {
    step3.style.display = 'flex';
  }
}

// Función para ir a dirección de envío
function goToShipping() {
  if (cartProducts.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  goToStep(2);
}

// Función para volver al carrito
function backToCart() {
  goToStep(1);
}

// Función para ir a forma de pago
function goToPayment() {
  // Validar que los campos estén completos
  const departamento = document.getElementById('departamento')?.value;
  const localidad = document.getElementById('localidad')?.value;
  const calle = document.getElementById('calle')?.value;
  const numero = document.getElementById('numero')?.value;
  const esquina = document.getElementById('esquina')?.value;
  
  if (!departamento || !localidad || !calle || !numero || !esquina) {
    alert('Por favor completa todos los campos de dirección');
    return;
  }
  
  // Guardar datos de envío
  const shippingData = {
    departamento,
    localidad,
    calle,
    numero,
    esquina
  };
  localStorage.setItem('shippingData', JSON.stringify(shippingData));
  
  goToStep(3);
}

// Función para mostrar el carrito
function showCart() {
  const cartInfo = document.querySelector(".cart");

  if (!cartInfo) {
    console.error("No se encontró el elemento .cart");
    return;
  }

  let total = 0;
  
  // Crear contenedor para los pasos
  let html = `
    <!-- PASO 1: CARRITO -->
    <div id="step1" style="display: flex; flex-direction: column; width: 100%; gap: 16px;">
  `;
  
  // Construir HTML de todos los productos
  cartProducts.forEach((product, index) => {
    const subtotal = product.cost * product.count;
    total += subtotal;
    html += `
      <div class="cart-item">
        <button class="delete-btn" onclick="removeItem(${index})">Eliminar</button>
        <img src="${product.image}" alt="${product.name}" class="item-image" onerror="this.src='img/prod1.jpg'">
        <div class="item-details">
          <div class="item-name">${product.name}</div>
          <div class="item-price">${product.currency} ${product.cost.toFixed(2)}</div>
          
          <div class="quantity-controls">
            <span class="quantity-label">Cantidad:</span>
            <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
            <div class="quantity-display">${product.count}</div>
            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
          </div>
          
          <div class="item-subtotal">
            <span class="subtotal-label">Subtotal:</span>
            <span class="subtotal-price">${product.currency} ${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  // Total y botones del paso 1
  html += `
      <div style="display:flex; flex-direction:column; background-color:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:16px; width:100%; gap:12px; font-family:Arial, sans-serif; color:var(--text-primary);">
        <div style="display:flex; justify-content:space-between; width:100%">
          <h3>Total:</h3>
          <h4 style="font-weight:bold;">USD ${total.toFixed(2)}</h4>
        </div>
        <div style="display:flex; gap:8px; width:100%">
          <button style="width:100%; background-color:#3C747E; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="continueShopping()">
            Continuar comprando
          </button>
          <button style="width:100%; background-color:#0098A6; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="goToShipping()">
            Dirección de envío
          </button>
        </div>
      </div>
    </div>
    
    <!-- PASO 2: DIRECCIÓN DE ENVÍO -->
    <div id="step2" style="display: none; flex-direction: column; width: 100%;  margin: 0 auto;">
      <div style="background-color:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:24px; color:var(--text-primary);">
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Departamento</label>
            <input id="departamento" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese departamento">
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Localidad</label>
            <input id="localidad" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese localidad">
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Calle</label>
            <input id="calle" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese calle">
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Número</label>
            <input id="numero" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese número">
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Esquina</label>
            <input id="esquina" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese esquina">
          </div>
          
          <div style="display:flex; gap:8px; margin-top:16px;">
            <button style="width:100%; background-color:#3C747E; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="backToCart()">
              Volver al Carrito
            </button>
            <button style="width:100%; background-color:#0098A6; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="goToPayment()">
              Formas de Pago
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- PASO 3: TIPO DE ENVÍO Y FORMA DE PAGO -->
    <div id="step3" style="display: none; flex-direction: column; width: 100%; margin: 0 auto;">
      <div style="color:var(--text-primary);">
        
        <div style="display:flex; flex-direction:column; gap:16px;">
          
          <!-- Opciones de tipo de envío -->
          <div style="background-color:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:20px;">
              <label style="display:flex; align-items:center; gap:12px; margin-bottom:16px; cursor:pointer;">
                <input type="radio" name="shippingType" value="premium" checked onchange="updateShippingCost(128.85)" style="width:18px; height:18px; cursor:pointer;">
                <span style="font-size:16px;">Premium 2 a 5 días (15%)</span>
              </label>
              
              <label style="display:flex; align-items:center; gap:12px; margin-bottom:16px; cursor:pointer;">
                <input type="radio" name="shippingType" value="express" onchange="updateShippingCost(60.13)" style="width:18px; height:18px; cursor:pointer;">
                <span style="font-size:16px;">Express 5 a 8 días (7%)</span>
              </label>
              
              <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                <input type="radio" name="shippingType" value="standard" onchange="updateShippingCost(42.95)" style="width:18px; height:18px; cursor:pointer;">
                <span style="font-size:16px;">Standard 12 a 15 días (5%)</span>
              </label>
      
            
            <!-- Forma de Pago -->
         <div style="display:flex; flex-direction:column; gap:8px; position:relative; margin-top:16px;">
            <label style="font-weight:bold; color:var(--text-primary); font-size:14px;">Forma de Pago:</label>
            <select id="paymentMethod" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px 40px 12px 12px; color:var(--input-text); font-size:14px; cursor:pointer; appearance:none; -webkit-appearance:none; -moz-appearance:none; background-image:url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E'); background-repeat:no-repeat; background-position:right 12px center; background-size:20px;">
              <option value="">Seleccione método de pago</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="efectivo">Efectivo contra entrega</option>
            </select>
          </div>

          </div>
          <!-- Resumen de costos -->
          <div style="background-color:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:16px; margin-top:8px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:16px;">
              <span>Subtotal:</span>
              <span id="summarySubtotal">${total.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:16px;">
              <span>Costo de Envío:</span>
              <span id="summaryCost">$128.85</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:20px; border-top:1px solid var(--border-color); padding-top:12px; color:var(--text-primary);">
              <span>Total:</span>
              <span id="summaryTotal">${(total + 128.85).toFixed(2)}</span>
            </div>
          </div>
          
          <!-- Botones de acción -->
          <div style="display:flex; gap:8px; margin-top:16px;">
            <button style="width:100%; background-color:#3C747E; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="goToStep(2)">
              Volver al Carrito
            </button>
            <button style="width:100%; background-color:#0098A6; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="finalizePurchase()">
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  cartInfo.innerHTML = html;
  
  // Mostrar el paso actual
  goToStep(currentStep);
}

// Variable para almacenar el costo de envío actual
let currentShippingCost = 128.85;

// Función para actualizar el costo de envío
function updateShippingCost(cost) {
  currentShippingCost = cost;
  
  const total = cartProducts.reduce((sum, p) => sum + p.cost * p.count, 0);
  const finalTotal = total + cost;
  
  // Actualizar elementos del DOM
  const costElement = document.getElementById('summaryCost');
  const totalElement = document.getElementById('summaryTotal');
  const subtotalElement = document.getElementById('summarySubtotal');
  
  if (costElement) costElement.textContent = `${cost.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `${finalTotal.toFixed(2)}`;
  if (subtotalElement) subtotalElement.textContent = `${total.toFixed(2)}`;
}

// Función para finalizar compra (modificada)
function finalizePurchase() {
  const paymentMethod = document.getElementById('paymentMethod')?.value;
  
  if (!paymentMethod) {
    alert('Por favor selecciona un método de pago');
    return;
  }
  
  const total = cartProducts.reduce((sum, p) => sum + p.cost * p.count, 0);
  const finalTotal = total + currentShippingCost;
  
  // Obtener tipo de envío seleccionado
  const shippingType = document.querySelector('input[name="shippingType"]:checked')?.value || 'premium';
  let shippingName = '';
  
  switch(shippingType) {
    case 'premium':
      shippingName = 'Premium 2 a 5 días';
      break;
    case 'express':
      shippingName = 'Express 5 a 8 días';
      break;
    case 'standard':
      shippingName = 'Standard 12 a 15 días';
      break;
  }
  
  let paymentName = '';
  switch(paymentMethod) {
    case 'tarjeta':
      paymentName = 'Tarjeta de Crédito/Débito';
      break;
    case 'transferencia':
      paymentName = 'Transferencia Bancaria';
      break;
    case 'efectivo':
      paymentName = 'Efectivo contra entrega';
      break;
  }
  
  alert(`¡Compra finalizada con éxito!\n\nEnvío: ${shippingName}\nMétodo de pago: ${paymentName}\nTotal: ${finalTotal.toFixed(2)}\n\n¡Gracias por tu compra!`);
  
  cartProducts = [];
  saveCart();
  window.location.href = 'index.html';
}

// Función para mostrar carrito vacío
function showEmptyCart() {
  const cartInfo = document.querySelector(".cart");
  if (cartInfo) {
    cartInfo.innerHTML = 
    `<div class="empty-cart" style="display:flex; flex-direction:column; width:100%; align-items:center">
      <h2>Tu carrito está vacío</h2>
      <div style="margin-top:8px; display:flex; gap:8px; justify-content:center; padding:4px; width:100%">
        <button style="width:100%; background-color:#3C747E; border:none; border-radius:8px; padding:6px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="continueShopping()">
          Continuar comprando
        </button>
      </div>
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
  if (typeof contarProdcuts === 'function') {
    contarProdcuts();
  }
}

// Función para continuar comprando
function continueShopping() {
  window.location.href = "categories.html";
}