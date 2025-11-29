// Global variable for cart
let cartProducts = [];
let currentStep = 1; // Variable to control current step

document.addEventListener("DOMContentLoaded", function (e) {
  loadSavedTheme();
  // Get products from localStorage and parse JSON
  let products = localStorage.getItem("cart");
  console.log("Carrito raw:", products);

  if (products) {
    // Convert JSON string to array
    cartProducts = JSON.parse(products);
    console.log("Carrito parseado:", cartProducts);

    // Verify it's an array
    if (Array.isArray(cartProducts) && cartProducts.length > 0) {
      showCart();
    } else {
      showEmptyCart();
    }
  } else {
    showEmptyCart();
  }

  const paymentSelect = document.getElementById("paymentMethod");
  if (paymentSelect) {
    paymentSelect.addEventListener("change", showPaymentFields);
    showPaymentFields();
  }
});

// ==================== CART FUNCTIONS ====================
// Function to show empty cart
function showEmptyCart() {
  const cartInfo = document.querySelector(".cart");
  if (cartInfo) {
    cartInfo.innerHTML = `
      <div class="cartDiv">
        <h3>Tu carrito está vacío</h3>
        <p class="cartTitle">¡Comienza a agregar productos!</p>
        <button class="cartButton" onclick="continueShopping()">
          Ver productos
        </button>
      </div>
    `;
  }
}

// Function to save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartProducts));
}

// Function to continue shopping
function continueShopping() {
  window.location.href = "index.html";
}

// Function to remove a product from cart
function removeItem(index) {
  cartProducts.splice(index, 1);
  saveCart();

  if (cartProducts.length === 0) {
    showEmptyCart();
  } else {
    showCart();
  }
}

// Function to increase quantity
function increaseQuantity(index) {
  cartProducts[index].count++;
  saveCart();
  showCart();
}

// Function to decrease quantity
function decreaseQuantity(index) {
  if (cartProducts[index].count > 1) {
    cartProducts[index].count--;
    saveCart();
    showCart();
  }
}

// ==================== CALCULATE TOTALS ====================
function calculateTotals() {
  // Calculate subtotal (sum of all products)
  const subtotal = cartProducts.reduce((sum, product) => {
    return sum + product.cost * product.count;
  }, 0);

  // Get selected shipping type from SELECT
  const shippingMethodElement = document.getElementById("shippingMethod");
  let shippingPercentage = 0; // No shipping by default

  if (shippingMethodElement && shippingMethodElement.value) {
    const shippingType = shippingMethodElement.value;
    if (shippingType === "express") {
      shippingPercentage = 0.07; // 7%
    } else if (shippingType === "standard") {
      shippingPercentage = 0.05; // 5%
    } else if (shippingType === "premium") {
      shippingPercentage = 0.15; // 15%
    }
  }

  // Calculate shipping cost
  const shippingCost = subtotal * shippingPercentage;

  // Calculate total
  const total = subtotal + shippingCost;

  return {
    subtotal: subtotal,
    shippingCost: shippingCost,
    total: total,
  };
}

// ==================== UPDATE DOM WITH TOTALS ====================
function updateTotalsDisplay() {
  const totals = calculateTotals();

  // Update DOM elements in step 3
  const subtotalElement = document.getElementById("summarySubtotal");
  const costElement = document.getElementById("summaryCost");
  const totalElement = document.getElementById("summaryTotal");

  if (subtotalElement)
    subtotalElement.textContent = `USD ${totals.subtotal.toFixed(2)}`;
  if (costElement)
    costElement.textContent = `USD ${totals.shippingCost.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `USD ${totals.total.toFixed(2)}`;
}

// Function to change step
function goToStep(step) {
  currentStep = step;

  // Hide all steps
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  if (step1) step1.style.display = "none";
  if (step2) step2.style.display = "none";
  if (step3) step3.style.display = "none";

  // Change title according to step
  const pageTitle = document.querySelector(".profile-header h1");
  if (pageTitle) {
    if (step === 1) {
      pageTitle.textContent = "Carrito de compras";
    } else if (step === 2) {
      pageTitle.textContent = "Dirección de Envío";
    } else if (step === 3) {
      pageTitle.textContent = "Tipo de Envío";
    }
  }

  // Show current step
  if (step === 1 && step1) {
    step1.style.display = "flex";
  } else if (step === 2 && step2) {
    step2.style.display = "flex";
    setupShippingValidation();
  } else if (step === 3 && step3) {
    step3.style.display = "flex";
    updateTotalsDisplay();
    setupPaymentValidation();
  }
}

// ==================== NEW FUNCTIONS FOR CHANGE HANDLING ====================
function handlePaymentTypeChange(type, isChecked) {
  const cardFields = document.getElementById("cardFields");
  const transferFields = document.getElementById("transferFields");

  if (!cardFields || !transferFields) return;

  // Obtener todos los checkboxes marcados
  const creditoChecked = document.querySelector(
    'input[value="credito"]'
  )?.checked;
  const debitoChecked = document.querySelector(
    'input[value="debito"]'
  )?.checked;
  const transferenciaChecked = document.querySelector(
    'input[value="transferencia"]'
  )?.checked;

  // Mostrar campos de tarjeta si al menos uno está marcado
  if (creditoChecked || debitoChecked) {
    cardFields.style.display = "block";
  } else {
    cardFields.style.display = "none";
  }

  // Mostrar campos de transferencia si está marcado
  if (transferenciaChecked) {
    transferFields.style.display = "block";
  } else {
    transferFields.style.display = "none";
  }

  updatePaymentButton();
}

function handleShippingChange() {
  updateTotalsDisplay();
  updatePaymentButton();
}

// ==================== REAL-TIME VALIDATION - STEP 2 ====================
function setupShippingValidation() {
  const fields = ["departamento", "localidad", "calle", "numero", "esquina"];

  fields.forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (input) {
      // Add real-time validation
      input.addEventListener("input", () => {
        validateShippingField(fieldId);
        updateShippingButton();
      });

      // Validate on blur
      input.addEventListener("blur", () => {
        validateShippingField(fieldId);
      });

      // Restriction for "numero" field - only numbers
      if (fieldId === "numero") {
        input.addEventListener("input", (e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, "");
        });
      }
    }
  });

  // Initial validation
  updateShippingButton();
}

function validateShippingField(fieldId) {
  const input = document.getElementById(fieldId);
  const errorDiv = document.getElementById(`${fieldId}-error`);

  if (!input) return true;

  const value = input.value.trim();
  const isEmpty = value === "";

  // Update input style
  if (isEmpty) {
    input.style.borderColor = "#ef4444";
    input.style.borderWidth = "2px";
  } else {
    input.style.borderColor = "var(--input-border)";
    input.style.borderWidth = "1px";
  }

  // Show/hide error message
  if (errorDiv) {
    if (isEmpty) {
      errorDiv.style.display = "flex";
    } else {
      errorDiv.style.display = "none";
    }
  }

  return !isEmpty;
}

function updateShippingButton() {
  const btn = document.getElementById("shippingNextBtn");
  if (!btn) return;

  const fields = ["departamento", "localidad", "calle", "numero", "esquina"];
  const allValid = fields.every((fieldId) => {
    const input = document.getElementById(fieldId);
    return input && input.value.trim() !== "";
  });

  if (allValid) {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  } else {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  }
}

// ==================== REAL-TIME VALIDATION - STEP 3 ====================
function setupPaymentValidation() {
  // Validation for payment type radio buttons
  const paymentRadios = document.querySelectorAll('input[name="paymentType"]');
  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      handlePaymentTypeChange(radio.value);
    });
  });

  // Shipping type select
  const shippingSelect = document.getElementById("shippingMethod");
  if (shippingSelect) {
    shippingSelect.addEventListener("change", handleShippingChange);
  }

  // Validation for card fields
  const cardNumber = document.getElementById("cardNumber");
  const cardExpiry = document.getElementById("cardExpiry");
  const cardCVV = document.getElementById("cardCVV");

  if (cardNumber) {
    cardNumber.addEventListener("input", (e) => {
      // Only numbers and spaces
      e.target.value = e.target.value.replace(/[^0-9\s]/g, "");
      // Format: XXXX XXXX XXXX XXXX
      let value = e.target.value.replace(/\s/g, "");
      let formatted = value.match(/.{1,4}/g)?.join(" ") || value;
      e.target.value = formatted;
      validatePaymentField("cardNumber");
      updatePaymentButton();
    });
    cardNumber.addEventListener("blur", () =>
      validatePaymentField("cardNumber")
    );
  }

  if (cardExpiry) {
    cardExpiry.addEventListener("input", (e) => {
      // Only numbers and slash
      e.target.value = e.target.value.replace(/[^0-9\/]/g, "");
      // Auto-add slash after MM
      let value = e.target.value.replace(/\//g, "");
      if (value.length >= 2) {
        e.target.value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      validatePaymentField("cardExpiry");
      updatePaymentButton();
    });
    cardExpiry.addEventListener("blur", () =>
      validatePaymentField("cardExpiry")
    );
  }

  if (cardCVV) {
    cardCVV.addEventListener("input", (e) => {
      // Only numbers
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
      validatePaymentField("cardCVV");
      updatePaymentButton();
    });
    cardCVV.addEventListener("blur", () => validatePaymentField("cardCVV"));
  }

  // Validation for transfer
  const accountNumber = document.getElementById("accountNumber");
  if (accountNumber) {
    accountNumber.addEventListener("input", (e) => {
      // Only numbers
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
      validatePaymentField("accountNumber");
      updatePaymentButton();
    });
    accountNumber.addEventListener("blur", () =>
      validatePaymentField("accountNumber")
    );
  }

  updatePaymentButton();
}

function validatePaymentField(fieldId) {
  const input = document.getElementById(fieldId);
  const errorDiv = document.getElementById(`${fieldId}-error`);

  if (!input) return true;

  const value = input.value.trim();
  let isValid = true;
  let errorMessage = "";

  // Specific validations
  if (fieldId === "cardNumber") {
    const cleanNumber = value.replace(/\s/g, "");
    if (cleanNumber === "") {
      isValid = false;
      errorMessage = "El número de tarjeta es requerido";
    } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      isValid = false;
      errorMessage = "Número de tarjeta inválido";
    }
  } else if (fieldId === "cardExpiry") {
    if (value === "") {
      isValid = false;
      errorMessage = "La fecha de vencimiento es requerida";
    } else if (!/^\d{2}\/\d{2}$/.test(value)) {
      isValid = false;
      errorMessage = "Formato inválido (MM/YY)";
    }
  } else if (fieldId === "cardCVV") {
    if (value === "") {
      isValid = false;
      errorMessage = "El CVV es requerido";
    } else if (!/^\d{3,4}$/.test(value)) {
      isValid = false;
      errorMessage = "CVV inválido (3-4 dígitos)";
    }
  } else if (fieldId === "accountNumber") {
    if (value === "") {
      isValid = false;
      errorMessage = "El número de cuenta es requerido";
    } else if (value.length < 8) {
      isValid = false;
      errorMessage = "Número de cuenta inválido";
    }
  }

  // Update input style
  if (!isValid) {
    input.style.borderColor = "#ef4444";
    input.style.borderWidth = "2px";
  } else {
    input.style.borderColor = "var(--input-border)";
    input.style.borderWidth = "1px";
  }

  // Show/hide error message
  if (errorDiv) {
    if (!isValid) {
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = "flex";
    } else {
      errorDiv.style.display = "none";
    }
  }

  return isValid;
}

function updatePaymentButton() {
  const btn = document.getElementById("finalizeBtn");
  if (!btn) return;

  // Verify selected shipping type (now a select)
  const shippingSelect = document.getElementById("shippingMethod");
  if (!shippingSelect || !shippingSelect.value) {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
    return;
  }

  // Verify selected payment type (radio buttons)
  const paymentRadio = document.querySelector(
    'input[name="paymentType"]:checked'
  );
  if (!paymentRadio) {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
    return;
  }

  const paymentType = paymentRadio.value;

  // Verify fields according to payment type
  let allValid = true;

  if (paymentType === "credito" || paymentType === "debito") {
    const cardNumber = document.getElementById("cardNumber");
    const cardExpiry = document.getElementById("cardExpiry");
    const cardCVV = document.getElementById("cardCVV");

    allValid =
      cardNumber?.value.replace(/\s/g, "").length >= 13 &&
      /^\d{2}\/\d{2}$/.test(cardExpiry?.value || "") &&
      /^\d{3,4}$/.test(cardCVV?.value || "");
  } else if (paymentType === "transferencia") {
    const accountNumber = document.getElementById("accountNumber");
    allValid = accountNumber?.value.trim().length >= 8;
  }

  if (allValid) {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  } else {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  }
}

// ==================== SUCCESS MODAL ====================
function showSuccessModal(totals, shippingName, paymentName) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  // Create modal
  const modal = document.createElement("div");
  modal.style.cssText = `
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 32px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    color: var(--text-primary);
  `;

  modal.innerHTML = `
    <div class="success-modal-content">
  <!-- Animated success icon -->
  <div class="success-icon">
    <div class="success-checkmark"></div>
  </div>
  
  <h2 class="success-title">¡Compra Exitosa!</h2>
  <p class="success-description">Tu pedido ha sido procesado correctamente</p>
  
  <!-- Purchase details -->
  <div class="purchase-details">
    <div class="detail-row">
      <span class="detail-label">Subtotal:</span>
      <span class="detail-value">USD ${totals.subtotal.toFixed(2)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Envío (${shippingName}):</span>
      <span class="detail-value">USD ${totals.shippingCost.toFixed(2)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Método de pago:</span>
      <span class="detail-value">${paymentName}</span>
    </div>
    <div class="detail-row total-row">
      <span class="detail-label">Total:</span>
      <span class="detail-value">USD ${totals.total.toFixed(2)}</span>
    </div>
  </div>
  
  <button id="closeSuccessModal" class="continue-shopping-btn">
    Continuar comprando
  </button>
</div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Hover effect on button
  const closeBtn = modal.querySelector("#closeSuccessModal");
  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.transform = "scale(1.05)";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.transform = "scale(1)";
  });

  // Close modal and redirect
  closeBtn.addEventListener("click", () => {
    // Clear cart before redirecting
    cartProducts = [];
    localStorage.removeItem("cart");
    localStorage.removeItem("shippingData");

    overlay.style.animation = "fadeIn 0.3s ease reverse";
    setTimeout(() => {
      document.body.removeChild(overlay);
      window.location.href = "index.html";
    }, 300);
  });
}

// Function to go to shipping address
function goToShipping() {
  if (cartProducts.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  goToStep(2);
}

// Function to go back to cart
function backToCart() {
  goToStep(1);
}

// Function to go to payment form
function goToPayment() {
  // Validate that fields are complete
  const departamento = document.getElementById("departamento")?.value;
  const localidad = document.getElementById("localidad")?.value;
  const calle = document.getElementById("calle")?.value;
  const numero = document.getElementById("numero")?.value;
  const esquina = document.getElementById("esquina")?.value;

  if (!departamento || !localidad || !calle || !numero || !esquina) {
    alert("Por favor completa todos los campos de dirección");
    return;
  }

  // Save shipping data
  const shippingData = {
    departamento,
    localidad,
    calle,
    numero,
    esquina,
  };
  localStorage.setItem("shippingData", JSON.stringify(shippingData));

  goToStep(3);
}

// Function to show cart
function showCart() {
  const cartInfo = document.querySelector(".cart");

  if (!cartInfo) {
    console.error("No se encontró el elemento .cart");
    return;
  }

  let total = 0;

  // Create container for steps
  let html = `
    <!-- STEP 1: CART -->
    <div id="step1" style="display: flex; flex-direction: column; width: 100%; gap: 16px;">
  `;

  // Build HTML for all products
  cartProducts.forEach((product, index) => {
    const subtotal = product.cost * product.count;
    total += subtotal;
    html += `
      <div class="cart-item">
        <button class="delete-btn" onclick="removeItem(${index})">Eliminar</button>
        <img src="${product.image}" alt="${
      product.name
    }" class="item-image" onerror="this.src='img/prod1.jpg'">
        <div class="item-details">
          <div class="item-name">${product.name}</div>
          <div class="item-price">${product.currency} ${product.cost.toFixed(
      2
    )}</div>
          
          <div class="quantity-controls">
            <span class="quantity-label">Cantidad:</span>
            <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
            <div class="quantity-display">${product.count}</div>
            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
          </div>
          
          <div class="item-subtotal">
            <span class="subtotal-label">Subtotal:</span>
            <span class="subtotal-price">${product.currency} ${subtotal.toFixed(
      2
    )}</span>
          </div>
        </div>
      </div>
    `;
  });

  // Total and buttons for step 1
  html += `
      <div class="cartTotal">
        <div class="subtotal">
          <h3>Total:</h3>
          <h4 class="valueText">USD ${total.toFixed(2)}</h4>
        </div>
        <div class="continueShopping">
          <button class="btnContinueShopping" onclick="continueShopping()">
            Continuar comprando
          </button>
          <button class="btnDirection" onclick="goToShipping()">
            Dirección de envío
          </button>
        </div>
      </div>
    </div>
    
 <!-- STEP 2: SHIPPING ADDRESS -->
<div id="step2" class="step2">
  <div class="shipping-card">
    <div class="shipping-form">
      
      <!-- Departamento -->
      <div class="form-group">
        <label class="form-label">Departamento *</label>
        <input id="departamento" type="text" class="form-input" placeholder="Ingrese departamento">
        <div id="departamento-error" class="error-message">
          <span>⚠️</span>
          <span>Este campo es requerido</span>
        </div>
      </div>
      
      <!-- Localidad -->
      <div class="form-group">
        <label class="form-label">Localidad *</label>
        <input id="localidad" type="text" class="form-input" placeholder="Ingrese localidad">
        <div id="localidad-error" class="error-message">
          <span>⚠️</span>
          <span>Este campo es requerido</span>
        </div>
      </div>
      
      <!-- Calle -->
      <div class="form-group">
        <label class="form-label">Calle *</label>
        <input id="calle" type="text" class="form-input" placeholder="Ingrese calle">
        <div id="calle-error" class="error-message">
          <span>⚠️</span>
          <span>Este campo es requerido</span>
        </div>
      </div>
      
      <!-- Número -->
      <div class="form-group">
        <label class="form-label">Número *</label>
        <input id="numero" type="text" class="form-input" placeholder="Ingrese número">
        <div id="numero-error" class="error-message">
          <span>⚠️</span>
          <span>Este campo es requerido</span>
        </div>
      </div>
      
      <!-- Esquina -->
      <div class="form-group">
        <label class="form-label">Esquina *</label>
        <input id="esquina" type="text" class="form-input" placeholder="Ingrese esquina">
        <div id="esquina-error" class="error-message">
          <span>⚠️</span>
          <span>Este campo es requerido</span>
        </div>
      </div>
      
      <!-- Botones -->
      <div class="button-group">
        <button class="btn-back" onclick="backToCart()">
          Volver al Carrito
        </button>
        <button id="shippingNextBtn" class="btn-next" disabled onclick="goToPayment()">
          Formas de Pago
        </button>
      </div>
    </div>
  </div>
</div>

<!-- STEP 3: SHIPPING TYPE AND PAYMENT METHOD -->
<div id="step3">
  <div class="payment-container">
    <div class="payment-form">
      
      <!-- Payment Methods (CHECKBOXES para múltiples selecciones) -->
      <div class="payment-methods-card">
        <label class="radio-label">
          <input type="checkbox" name="paymentType" value="credito" class="radio-input" onchange="handlePaymentTypeChange('credito', this.checked)">
          <span class="radio-text">Tarjeta de Crédito</span>
        </label>
        
        <label class="radio-label">
          <input type="checkbox" name="paymentType" value="debito" class="radio-input" onchange="handlePaymentTypeChange('debito', this.checked)">
          <span class="radio-text">Tarjeta de Débito</span>
        </label>
        
        <label class="radio-label">
          <input type="checkbox" name="paymentType" value="transferencia" class="radio-input" onchange="handlePaymentTypeChange('transferencia', this.checked)">
          <span class="radio-text">Transferencia Bancaria</span>
        </label>
        
        <!-- Card Fields (hidden by default) -->
        <div id="cardFields" class="payment-fields">
          <div class="field-group">
            <label class="field-label">Número de Tarjeta *</label>
            <input id="cardNumber" type="text" maxlength="19" class="field-input" placeholder="1234 5678 9012 3456">
            <div id="cardNumber-error" class="field-error">
              <span>⚠️</span>
              <span>El número de tarjeta es requerido</span>
            </div>
          </div>
          
          <div class="fields-row">
            <div class="field-group">
              <label class="field-label">Fecha de Vencimiento *</label>
              <input id="cardExpiry" type="text" maxlength="5" class="field-input" placeholder="MM/YY">
              <div id="cardExpiry-error" class="field-error">
                <span>⚠️</span>
                <span>Fecha requerida</span>
              </div>
            </div>
            
            <div class="field-group">
              <label class="field-label">CVV *</label>
              <input id="cardCVV" type="text" maxlength="4" class="field-input" placeholder="123">
              <div id="cardCVV-error" class="field-error">
                <span>⚠️</span>
                <span>CVV requerido</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Transfer Fields (hidden by default) -->
        <div id="transferFields" class="payment-fields">
          <div class="field-group">
            <label class="field-label">Número de Cuenta *</label>
            <input id="accountNumber" type="text" class="field-input" placeholder="Ingrese número de cuenta">
            <div id="accountNumber-error" class="field-error">
              <span>⚠️</span>
              <span>El número de cuenta es requerido</span>
            </div>
          </div>
        </div>
        
        <!-- Shipping Select -->
        <div class="shipping-select-wrapper">
          <label class="form-label">Tipo de Envío: *</label>
          <select id="shippingMethod" class="shipping-select" onchange="handleShippingChange()">
            <option value="">Seleccione tipo de envío</option>
            <option value="standard">Standard 12 a 15 días (5%)</option>
            <option value="express">Express 5 a 8 días (7%)</option>
            <option value="premium">Premium 2 a 5 días (15%)</option>
          </select>
        </div>
      </div>
      
      <!-- Cost Summary -->
      <div class="summary-card">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span id="summarySubtotal">USD 0.00</span>
        </div>
        <div class="summary-row">
          <span>Costo de Envío:</span>
          <span id="summaryCost">USD 0.00</span>
        </div>
        <div class="summary-total">
          <span>Total:</span>
          <span id="summaryTotal">USD 0.00</span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="button-group">
        <button class="btn-back" onclick="goToStep(2)">
          Volver
        </button>
        <button id="finalizeBtn" class="btn-next" disabled onclick="finalizePurchase()">
          Finalizar compra
        </button>
      </div>
    </div>
  </div>
</div>
  `;

  cartInfo.innerHTML = html;

  // If generated HTML includes payment select, ensure listener to toggle fields
  const dynamicPaymentSelect = document.getElementById("paymentMethod");
  if (dynamicPaymentSelect) {
    dynamicPaymentSelect.addEventListener("change", showPaymentFields);
    // Initialize field state according to current value
    showPaymentFields();
  }

  // Show current step
  goToStep(currentStep);
}

// Function to show payment fields
function showPaymentFields() {
  const paymentSelect = document.getElementById("paymentMethod");
  if (!paymentSelect) return;

  const cardFields = document.getElementById("cardFields");
  const transferFields = document.getElementById("transferFields");

  if (!cardFields || !transferFields) return;

  // Hide all fields
  cardFields.style.display = "none";
  transferFields.style.display = "none";

  // Show fields according to selection
  const selectedValue = paymentSelect.value;
  if (selectedValue === "credito" || selectedValue === "debito") {
    cardFields.style.display = "block";
  } else if (selectedValue === "transferencia") {
    transferFields.style.display = "block";
  }
}

// Function to finalize purchase (modified with modal)
function finalizePurchase() {
  // --- Previous validations ---
  const totals = calculateTotals();

  // 1) Address: validate fields (if in DOM) or in localStorage
  const deptEl = document.getElementById("departamento");
  const locEl = document.getElementById("localidad");
  const calleEl = document.getElementById("calle");
  const numEl = document.getElementById("numero");
  const esquinaEl = document.getElementById("esquina");

  let departamento = deptEl?.value?.trim();
  let localidad = locEl?.value?.trim();
  let calle = calleEl?.value?.trim();
  let numero = numEl?.value?.trim();
  let esquina = esquinaEl?.value?.trim();

  if (!departamento || !localidad || !calle || !numero || !esquina) {
    // try to read shippingData from localStorage
    const saved = localStorage.getItem("shippingData");
    if (saved) {
      try {
        const sd = JSON.parse(saved);
        departamento = departamento || sd.departamento;
        localidad = localidad || sd.localidad;
        calle = calle || sd.calle;
        numero = numero || sd.numero;
        esquina = esquina || sd.esquina;
      } catch (e) {
        // ignore
      }
    }
  }

  if (!departamento || !localidad || !calle || !numero || !esquina) {
    alert(
      "Por favor completa todos los campos de dirección antes de finalizar la compra."
    );
    return;
  }

  // 2) Shipping method: must be selected (select)
  const shippingSelect = document.getElementById("shippingMethod");
  if (!shippingSelect || !shippingSelect.value) {
    alert("Por favor selecciona un tipo de envío");
    return;
  }
  const shippingType = shippingSelect.value;

  // 3) Quantities: each product must have count > 0
  if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
    alert("No hay productos en el carrito");
    return;
  }
  for (const p of cartProducts) {
    const cnt = Number(p.count);
    if (!Number.isFinite(cnt) || cnt <= 0) {
      alert("Asegúrate de que la cantidad de cada producto sea mayor a 0");
      return;
    }
  }

  // 4) Payment type selected (radio)
  const paymentRadio = document.querySelector(
    'input[name="paymentType"]:checked'
  );
  if (!paymentRadio) {
    alert("Por favor selecciona un método de pago");
    return;
  }
  const paymentType = paymentRadio.value;

  // 5) Payment method fields cannot be empty
  if (paymentType === "credito" || paymentType === "debito") {
    const cardNumber = document.getElementById("cardNumber")?.value?.trim();
    const cardExpiry = document.getElementById("cardExpiry")?.value?.trim();
    const cardCVV = document.getElementById("cardCVV")?.value?.trim();

    if (!cardNumber || !cardExpiry || !cardCVV) {
      alert("Por favor completa todos los campos de la tarjeta");
      return;
    }
    // Simple validations: expiry MM/YY and numeric CVV
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      alert("Formato de fecha de vencimiento inválido. Use MM/YY");
      return;
    }
    if (!/^\d{3,4}$/.test(cardCVV)) {
      alert("CVV inválido");
      return;
    }
  } else if (paymentType === "transferencia") {
    const account = document.getElementById("accountNumber")?.value?.trim();
    if (!account) {
      alert("Por favor ingresa el número de cuenta para la transferencia");
      return;
    }
  }

  // Readable names
  let shippingName = "";
  switch (shippingType) {
    case "premium":
      shippingName = "Premium 2 a 5 días";
      break;
    case "express":
      shippingName = "Express 5 a 8 días";
      break;
    case "standard":
      shippingName = "Standard 12 a 15 días";
      break;
  }

  let paymentName = "";
  switch (paymentType) {
    case "credito":
      paymentName = "Tarjeta de Crédito";
      break;
    case "debito":
      paymentName = "Tarjeta de Débito";
      break;
    case "transferencia":
      paymentName = "Transferencia Bancaria";
      break;
  }

async function sendCartToBackend() {
  try {
    const usuarioId = 1;

    const items = cartProducts.map(item => ({
      productoId: item.id || item.productId || item.productoId,
      cantidad: item.count
    }));

    const response = await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, items })
    });

    const data = await response.json();
    console.log("Respuesta del backend:", data);

    return data;
  } catch (err) {
    console.error("Error enviando carrito al backend:", err);
    return null;
  }
}
sendCartToBackend();
showSuccessModal(totals, shippingName, paymentName);
}
