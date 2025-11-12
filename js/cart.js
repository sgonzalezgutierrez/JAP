// Global variable for cart
let cartProducts = [];
let currentStep = 1; // Variable to control current step

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

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

  const paymentSelect = document.getElementById('paymentMethod');
  if (paymentSelect) {
    paymentSelect.addEventListener('change', showPaymentFields);
    showPaymentFields();
  }
});

// ==================== CART FUNCTIONS ====================
// Function to show empty cart
function showEmptyCart() {
  const cartInfo = document.querySelector(".cart");
  if (cartInfo) {
    cartInfo.innerHTML = `
      <div style="text-align:center; padding:40px; color:var(--text-primary);">
        <h3>Tu carrito está vacío</h3>
        <p style="margin:20px 0; color:var(--text-secondary);">¡Comienza a agregar productos!</p>
        <button style="background-color:#0098A6; border:none; border-radius:8px; padding:12px 24px; color:white; font-weight:bold; cursor:pointer;" onclick="continueShopping()">
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
  window.location.href = 'index.html';
}

// Function to remove a product from cart
function removeItem(index) {
  const product = cartProducts[index];
  showDeleteModal(product, index);
}

// Function to show delete confirmation modal
function showDeleteModal(product, index) {
  // Create overlay
  const overlay = document.createElement('div');
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
  const modal = document.createElement('div');
  modal.style.cssText = `
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 32px;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    color: var(--text-primary);
  `;
  
  modal.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
    
    <div style="text-align: center;">
      <!-- Warning icon -->
      <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #ef4444; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 48px; color: white;">
        ⚠️
      </div>
      
      <h2 style="margin: 0 0 16px 0; color: var(--text-primary); font-size: 24px;">¿Eliminar producto?</h2>
      <p style="margin: 0 0 8px 0; color: var(--text-secondary); font-size: 16px;">¿Estás seguro de que quieres eliminar este producto del carrito?</p>
      <p style="margin: 0 0 24px 0; color: var(--text-primary); font-weight: bold; font-size: 18px;">${product.name}</p>
      
      <!-- Buttons -->
      <div style="display: flex; gap: 12px;">
        <button id="cancelDeleteBtn" style="flex: 1; background-color: #6B7280; border: none; border-radius: 12px; padding: 14px; color: white; font-weight: bold; font-size: 16px; cursor: pointer; transition: all 0.2s;">
          Cancelar
        </button>
        <button id="confirmDeleteBtn" style="flex: 1; background-color: #ef4444; border: none; border-radius: 12px; padding: 14px; color: white; font-weight: bold; font-size: 16px; cursor: pointer; transition: all 0.2s;">
          Eliminar
        </button>
      </div>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Hover effects
  const cancelBtn = modal.querySelector('#cancelDeleteBtn');
  const confirmBtn = modal.querySelector('#confirmDeleteBtn');
  
  cancelBtn.addEventListener('mouseenter', () => {
    cancelBtn.style.transform = 'scale(1.05)';
    cancelBtn.style.backgroundColor = '#4B5563';
  });
  cancelBtn.addEventListener('mouseleave', () => {
    cancelBtn.style.transform = 'scale(1)';
    cancelBtn.style.backgroundColor = '#6B7280';
  });
  
  confirmBtn.addEventListener('mouseenter', () => {
    confirmBtn.style.transform = 'scale(1.05)';
    confirmBtn.style.backgroundColor = '#dc2626';
  });
  confirmBtn.addEventListener('mouseleave', () => {
    confirmBtn.style.transform = 'scale(1)';
    confirmBtn.style.backgroundColor = '#ef4444';
  });
  
  // Cancel button
  cancelBtn.addEventListener('click', () => {
    overlay.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  });
  
  // Confirm delete button
  confirmBtn.addEventListener('click', () => {
    cartProducts.splice(index, 1);
    saveCart();
    
    overlay.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(overlay);
      
      if (cartProducts.length === 0) {
        showEmptyCart();
      } else {
        showCart();
      }
    }, 300);
  });
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
    return sum + (product.cost * product.count);
  }, 0);
  
  // Get selected shipping type from SELECT
  const shippingMethodElement = document.getElementById('shippingMethod');
  let shippingPercentage = 0; // No shipping by default
  
  if (shippingMethodElement && shippingMethodElement.value) {
    const shippingType = shippingMethodElement.value;
    if (shippingType === 'express') {
      shippingPercentage = 0.07; // 7%
    } else if (shippingType === 'standard') {
      shippingPercentage = 0.05; // 5%
    } else if (shippingType === 'premium') {
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
    total: total
  };
}

// ==================== UPDATE DOM WITH TOTALS ====================
function updateTotalsDisplay() {
  const totals = calculateTotals();
  
  // Update DOM elements in step 3
  const subtotalElement = document.getElementById('summarySubtotal');
  const costElement = document.getElementById('summaryCost');
  const totalElement = document.getElementById('summaryTotal');
  
  if (subtotalElement) subtotalElement.textContent = `USD ${totals.subtotal.toFixed(2)}`;
  if (costElement) costElement.textContent = `USD ${totals.shippingCost.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `USD ${totals.total.toFixed(2)}`;
}

// Function to change step
function goToStep(step) {
  currentStep = step;
  
  // Hide all steps
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'none';
  
  // Change title according to step
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
  
  // Show current step
  if (step === 1 && step1) {
    step1.style.display = 'flex';
  } else if (step === 2 && step2) {
    step2.style.display = 'flex';
    setupShippingValidation();
  } else if (step === 3 && step3) {
    step3.style.display = 'flex';
    updateTotalsDisplay();
    setupPaymentValidation();
  }
}

// ==================== NEW FUNCTIONS FOR CHANGE HANDLING ====================
function handlePaymentTypeChange() {
  // Update fields according to selected payment types (checkboxes)
  const cardFields = document.getElementById('cardFields');
  const transferFields = document.getElementById('transferFields');
  
  if (!cardFields || !transferFields) return;
  
  // Get all checked payment types
  const creditoChecked = document.getElementById('payment-credito')?.checked;
  const debitoChecked = document.getElementById('payment-debito')?.checked;
  const transferenciaChecked = document.getElementById('payment-transferencia')?.checked;
  
  // Show/hide card fields if any card type is selected
  if (creditoChecked || debitoChecked) {
    cardFields.style.display = 'block';
  } else {
    cardFields.style.display = 'none';
  }
  
  // Show/hide transfer fields
  if (transferenciaChecked) {
    transferFields.style.display = 'block';
  } else {
    transferFields.style.display = 'none';
  }
  
  updatePaymentButton();
}

function handleShippingChange() {
  updateTotalsDisplay();
  updatePaymentButton();
}

// ==================== REAL-TIME VALIDATION - STEP 2 ====================
function setupShippingValidation() {
  const fields = ['departamento', 'localidad', 'calle', 'numero', 'esquina'];
  
  fields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      // Add real-time validation
      input.addEventListener('input', () => {
        validateShippingField(fieldId);
        updateShippingButton();
      });
      
      // Validate on blur
      input.addEventListener('blur', () => {
        validateShippingField(fieldId);
      });
      
      // Restriction for "numero" field - only numbers
      if (fieldId === 'numero') {
        input.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, '');
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
  const isEmpty = value === '';
  
  // Update input style
  if (isEmpty) {
    input.style.borderColor = '#ef4444';
    input.style.borderWidth = '2px';
  } else {
    input.style.borderColor = 'var(--input-border)';
    input.style.borderWidth = '1px';
  }
  
  // Show/hide error message
  if (errorDiv) {
    if (isEmpty) {
      errorDiv.style.display = 'flex';
    } else {
      errorDiv.style.display = 'none';
    }
  }
  
  return !isEmpty;
}

function updateShippingButton() {
  const btn = document.getElementById('shippingNextBtn');
  if (!btn) return;
  
  const fields = ['departamento', 'localidad', 'calle', 'numero', 'esquina'];
  const allValid = fields.every(fieldId => {
    const input = document.getElementById(fieldId);
    return input && input.value.trim() !== '';
  });
  
  if (allValid) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  } else {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
  }
}

// ==================== REAL-TIME VALIDATION - STEP 3 ====================
function setupPaymentValidation() {
  // Validation for payment type checkboxes
  const paymentCheckboxes = document.querySelectorAll('input[name="paymentType"]');
  paymentCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      handlePaymentTypeChange();
    });
  });
  
  // Shipping type select
  const shippingSelect = document.getElementById('shippingMethod');
  if (shippingSelect) {
    shippingSelect.addEventListener('change', handleShippingChange);
  }
  
  // Validation for card fields
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCVV = document.getElementById('cardCVV');
  
  if (cardNumber) {
    cardNumber.addEventListener('input', (e) => {
      // Only numbers and spaces
      e.target.value = e.target.value.replace(/[^0-9\s]/g, '');
      // Format: XXXX XXXX XXXX XXXX
      let value = e.target.value.replace(/\s/g, '');
      let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formatted;
      validatePaymentField('cardNumber');
      updatePaymentButton();
    });
    cardNumber.addEventListener('blur', () => validatePaymentField('cardNumber'));
  }
  
  if (cardExpiry) {
    cardExpiry.addEventListener('input', (e) => {
      // Only numbers and slash
      e.target.value = e.target.value.replace(/[^0-9\/]/g, '');
      // Auto-add slash after MM
      let value = e.target.value.replace(/\//g, '');
      if (value.length >= 2) {
        e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      validatePaymentField('cardExpiry');
      updatePaymentButton();
    });
    cardExpiry.addEventListener('blur', () => validatePaymentField('cardExpiry'));
  }
  
  if (cardCVV) {
    cardCVV.addEventListener('input', (e) => {
      // Only numbers
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      validatePaymentField('cardCVV');
      updatePaymentButton();
    });
    cardCVV.addEventListener('blur', () => validatePaymentField('cardCVV'));
  }
  
  // Validation for transfer
  const accountNumber = document.getElementById('accountNumber');
  if (accountNumber) {
    accountNumber.addEventListener('input', (e) => {
      // Only numbers
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      validatePaymentField('accountNumber');
      updatePaymentButton();
    });
    accountNumber.addEventListener('blur', () => validatePaymentField('accountNumber'));
  }
  
  updatePaymentButton();
}

function validatePaymentField(fieldId) {
  const input = document.getElementById(fieldId);
  const errorDiv = document.getElementById(`${fieldId}-error`);
  
  if (!input) return true;
  
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  // Specific validations
  if (fieldId === 'cardNumber') {
    const cleanNumber = value.replace(/\s/g, '');
    if (cleanNumber === '') {
      isValid = false;
      errorMessage = 'El número de tarjeta es requerido';
    } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      isValid = false;
      errorMessage = 'Número de tarjeta inválido';
    }
  } else if (fieldId === 'cardExpiry') {
    if (value === '') {
      isValid = false;
      errorMessage = 'La fecha de vencimiento es requerida';
    } else if (!/^\d{2}\/\d{2}$/.test(value)) {
      isValid = false;
      errorMessage = 'Formato inválido (MM/YY)';
    }
  } else if (fieldId === 'cardCVV') {
    if (value === '') {
      isValid = false;
      errorMessage = 'El CVV es requerido';
    } else if (!/^\d{3,4}$/.test(value)) {
      isValid = false;
      errorMessage = 'CVV inválido (3-4 dígitos)';
    }
  } else if (fieldId === 'accountNumber') {
    if (value === '') {
      isValid = false;
      errorMessage = 'El número de cuenta es requerido';
    } else if (value.length < 8) {
      isValid = false;
      errorMessage = 'Número de cuenta inválido';
    }
  }
  
  // Update input style
  if (!isValid) {
    input.style.borderColor = '#ef4444';
    input.style.borderWidth = '2px';
  } else {
    input.style.borderColor = 'var(--input-border)';
    input.style.borderWidth = '1px';
  }
  
  // Show/hide error message
  if (errorDiv) {
    if (!isValid) {
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = 'flex';
    } else {
      errorDiv.style.display = 'none';
    }
  }
  
  return isValid;
}

function updatePaymentButton() {
  const btn = document.getElementById('finalizeBtn');
  if (!btn) return;
  
  // Verify selected shipping type (now a select)
  const shippingSelect = document.getElementById('shippingMethod');
  if (!shippingSelect || !shippingSelect.value) {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
    return;
  }
  
  // Verify at least 1 payment type selected (checkboxes) - MODIFICADO
  const creditoChecked = document.getElementById('payment-credito')?.checked;
  const debitoChecked = document.getElementById('payment-debito')?.checked;
  const transferenciaChecked = document.getElementById('payment-transferencia')?.checked;
  
  const checkedCount = [creditoChecked, debitoChecked, transferenciaChecked].filter(Boolean).length;
  
  if (checkedCount < 1) {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
    return;
  }
  
  // Verify fields according to payment types selected
  let allValid = true;
  
  // If any card type is selected, validate card fields
  if (creditoChecked || debitoChecked) {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCVV = document.getElementById('cardCVV');
    
    const cardValid = cardNumber?.value.replace(/\s/g, '').length >= 13 &&
                      /^\d{2}\/\d{2}$/.test(cardExpiry?.value || '') &&
                      /^\d{3,4}$/.test(cardCVV?.value || '');
    
    if (!cardValid) allValid = false;
  }
  
  // If transfer is selected, validate account number
  if (transferenciaChecked) {
    const accountNumber = document.getElementById('accountNumber');
    const transferValid = accountNumber?.value.trim().length >= 8;
    
    if (!transferValid) allValid = false;
  }
  
  if (allValid) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  } else {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
  }
}

// ==================== SUCCESS MODAL ====================
function showSuccessModal(totals, shippingName, paymentName) {
  // Create overlay
  const overlay = document.createElement('div');
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
  const modal = document.createElement('div');
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
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes checkmark {
        0% { transform: scale(0) rotate(45deg); }
        50% { transform: scale(1.2) rotate(45deg); }
        100% { transform: scale(1) rotate(45deg); }
      }
    </style>
    
    <div style="text-align: center;">
      <!-- Animated success icon -->
      <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #10b981; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 30px; height: 50px; border-right: 4px solid white; border-bottom: 4px solid white; transform: rotate(45deg); animation: checkmark 0.5s ease 0.3s both;"></div>
      </div>
      
      <h2 style="margin: 0 0 16px 0; color: var(--text-primary); font-size: 28px;">¡Compra Exitosa!</h2>
      <p style="margin: 0 0 24px 0; color: var(--text-secondary); font-size: 16px;">Tu pedido ha sido procesado correctamente</p>
      
      <!-- Purchase details -->
      <div style="background-color: var(--bg-primary); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: left;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
          <span style="color: var(--text-secondary);">Subtotal:</span>
          <span style="font-weight: bold;">USD ${totals.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
          <span style="color: var(--text-secondary);">Envío (${shippingName}):</span>
          <span style="font-weight: bold;">USD ${totals.shippingCost.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
          <span style="color: var(--text-secondary);">Método de pago:</span>
          <span style="font-weight: bold;">${paymentName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 20px; color: #10b981;">
          <span style="font-weight: bold;">Total:</span>
          <span style="font-weight: bold;">USD ${totals.total.toFixed(2)}</span>
        </div>
      </div>
      
      <button id="closeSuccessModal" style="width: 100%; background: linear-gradient(135deg, #0098A6 0%, #00BCD4 100%); border: none; border-radius: 12px; padding: 16px; color: white; font-weight: bold; font-size: 16px; cursor: pointer; transition: transform 0.2s;">
        Continuar comprando
      </button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Hover effect on button
  const closeBtn = modal.querySelector('#closeSuccessModal');
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.transform = 'scale(1.05)';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.transform = 'scale(1)';
  });
  
  // Close modal and redirect
  closeBtn.addEventListener('click', () => {
    // Clear cart before redirecting
    cartProducts = [];
    localStorage.removeItem('cart');
    localStorage.removeItem('shippingData');
    
    overlay.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(overlay);
      window.location.href = 'index.html';
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
  const departamento = document.getElementById('departamento')?.value;
  const localidad = document.getElementById('localidad')?.value;
  const calle = document.getElementById('calle')?.value;
  const numero = document.getElementById('numero')?.value;
  const esquina = document.getElementById('esquina')?.value;
  
  if (!departamento || !localidad || !calle || !numero || !esquina) {
    alert('Por favor completa todos los campos de dirección');
    return;
  }
  
  // Save shipping data
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
  
  // Total and buttons for step 1
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
    
    <!-- STEP 2: SHIPPING ADDRESS -->
    <div id="step2" style="display: none; flex-direction: column; width: 100%; margin: 0 auto;">
      <div style="background-color:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:24px; color:var(--text-primary);">
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Departamento *</label>
            <input id="departamento" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese departamento">
            <div id="departamento-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px; align-items:center; gap:4px;">
              <span>⚠️</span>
              <span>Este campo es requerido</span>
            </div>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Localidad *</label>
            <input id="localidad" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese localidad">
            <div id="localidad-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px; align-items:center; gap:4px;">
              <span>⚠️</span>
              <span>Este campo es requerido</span>
            </div>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Calle *</label>
            <input id="calle" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese calle">
            <div id="calle-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px; align-items:center; gap:4px;">
              <span>⚠️</span>
              <span>Este campo es requerido</span>
            </div>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Número *</label>
            <input id="numero" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese número">
            <div id="numero-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px; align-items:center; gap:4px;">
              <span>⚠️</span>
              <span>Este campo es requerido</span>
            </div>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-weight:bold; color:var(--text-primary);">Esquina *</label>
            <input id="esquina" type="text" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px; color:var(--input-text); font-size:14px;" placeholder="Ingrese esquina">
            <div id="esquina-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px; align-items:center; gap:4px;">
              <span>⚠️</span>
              <span>Este campo es requerido</span>
            </div>
          </div>
          
          <div style="display:flex; gap:8px; margin-top:16px;">
            <button style="width:100%; background-color:#3C747E; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="backToCart()">
              Volver al Carrito
            </button>
            <button id="shippingNextBtn" disabled style="width:100%; background-color:#0098A6; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:not-allowed; opacity:0.5;" onclick="goToPayment()">
              Formas de Pago
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- STEP 3: SHIPPING TYPE AND PAYMENT METHOD -->
    <div id="step3" style="display: none; flex-direction: column; width: 100%; margin: 0 auto;">
      <div style="color:var(--text-primary);">
        
        <div style="display:flex; flex-direction:column; gap:16px;">
          
          <!-- Payment method options (Checkboxes - minimum 1 required, maximum 2) -->
          <div style="background-color:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:20px;">
              <p style="margin:0 0 12px 0; font-weight:600; color:var(--text-primary);">Selecciona entre 1 y 2 formas de pago:</p>
              
              <label style="display:flex; align-items:center; gap:12px; margin-bottom:16px; cursor:pointer;">
                <input type="checkbox" id="payment-credito" name="paymentType" value="credito" onchange="handlePaymentTypeChange()" style="width:18px; height:18px; cursor:pointer;">
                <span style="font-size:16px;">Tarjeta de Crédito</span>
              </label>
              
              <label style="display:flex; align-items:center; gap:12px; margin-bottom:16px; cursor:pointer;">
                <input type="checkbox" id="payment-debito" name="paymentType" value="debito" onchange="handlePaymentTypeChange()" style="width:18px; height:18px; cursor:pointer;">
                <span style="font-size:16px;">Tarjeta de Débito</span>
              </label>
              
              <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                <input type="checkbox" id="payment-transferencia" name="paymentType" value="transferencia" onchange="handlePaymentTypeChange()" style="width:18px; height:18px; cursor:pointer;">
                <span style="font-size:16px;">Transferencia Bancaria</span>
              </label>
      
            
            <!-- Shipping Type (Select) -->
         <div style="display:flex; flex-direction:column; gap:8px; position:relative; margin-top:16px;">

            
            <!-- Dynamic payment fields (hidden by default) -->
            <div id="cardFields" class="payment-fields" style="display:none; margin-top:12px;">
              <div class="form-field" style="margin-bottom:12px;">
                <label class="field-label" style="font-weight:bold; color:var(--text-primary); font-size:14px; display:block; margin-bottom:4px;">Número de Tarjeta *</label>
                <input id="cardNumber" type="text" maxlength="19" class="field-input" placeholder="1234 5678 9012 3456" style="width:100%; background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:10px; color:var(--input-text);">
                <div id="cardNumber-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px;">
                  <span>⚠️</span>
                  <span>El número de tarjeta es requerido</span>
                </div>
              </div>
              <div class="field-row" style="display:flex; gap:12px;">
                <div class="form-field" style="flex:1;">
                  <label class="field-label" style="font-weight:bold; color:var(--text-primary); font-size:14px; display:block; margin-bottom:4px;">Fecha de Vencimiento *</label>
                  <input id="cardExpiry" type="text" maxlength="5" class="field-input" placeholder="MM/YY" style="width:100%; background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:10px; color:var(--input-text);">
                  <div id="cardExpiry-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px;">
                    <span>⚠️</span>
                    <span>Fecha requerida</span>
                  </div>
                </div>
                <div class="form-field" style="width:120px;">
                  <label class="field-label" style="font-weight:bold; color:var(--text-primary); font-size:14px; display:block; margin-bottom:4px;">CVV *</label>
                  <input id="cardCVV" type="text" maxlength="4" class="field-input" placeholder="123" style="width:100%; background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:10px; color:var(--input-text);">
                  <div id="cardCVV-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px;">
                    <span>⚠️</span>
                    <span>CVV requerido</span>
                  </div>
                </div>
              </div>
            </div>
            <div id="transferFields" class="payment-fields" style="display:none; margin-top:12px;">
              <div class="form-field">
                <label class="field-label" style="font-weight:bold; color:var(--text-primary); font-size:14px; display:block; margin-bottom:4px;">Número de Cuenta *</label>
                <input id="accountNumber" type="text" class="field-input" placeholder="Ingrese número de cuenta" style="width:100%; background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:10px; color:var(--input-text);">
                <div id="accountNumber-error" style="display:none; color:#ef4444; font-size:12px; font-weight:600; margin-top:4px;">
                  <span>⚠️</span>
                  <span>El número de cuenta es requerido</span>
                </div>
              </div>
            </div>

            <label style="font-weight:bold; color:var(--text-primary); font-size:14px;">Tipo de Envío: *</label>
            <select id="shippingMethod" onchange="handleShippingChange()" style="background-color:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; padding:12px 40px 12px 12px; color:var(--input-text); font-size:14px; cursor:pointer; appearance:none; -webkit-appearance:none; -moz-appearance:none; background-image:url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E'); background-repeat:no-repeat; background-position:right 12px center; background-size:20px;">
              <option value="">Seleccione tipo de envío</option>
              <option value="standard">Standard 12 a 15 días (5%)</option>
              <option value="express">Express 5 a 8 días (7%)</option>
              <option value="premium">Premium 2 a 5 días (15%)</option>
            </select>
          </div>

          </div>
          <!-- Cost summary -->
          <div style="background-color:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:16px; margin-top:8px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:16px;">
              <span>Subtotal:</span>
              <span id="summarySubtotal">USD 0.00</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:16px;">
              <span>Costo de Envío:</span>
              <span id="summaryCost">USD 0.00</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:20px; border-top:1px solid var(--border-color); padding-top:12px; color:var(--text-primary);">
              <span>Total:</span>
              <span id="summaryTotal">USD 0.00</span>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div style="display:flex; gap:8px; margin-top:16px;">
            <button style="width:100%; background-color:#3C747E; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:pointer;" onclick="goToStep(2)">
              Volver
            </button>
            <button id="finalizeBtn" disabled style="width:100%; background-color:#0098A6; border:none; border-radius:8px; padding:12px 8px; color:white; font-weight:bold; cursor:not-allowed; opacity:0.5;" onclick="finalizePurchase()">
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  cartInfo.innerHTML = html;
  
  // If generated HTML includes payment select, ensure listener to toggle fields
  const dynamicPaymentSelect = document.getElementById('paymentMethod');
  if (dynamicPaymentSelect) {
    dynamicPaymentSelect.addEventListener('change', showPaymentFields);
    // Initialize field state according to current value
    showPaymentFields();
  }

  // Show current step
  goToStep(currentStep);
}

// Function to show payment fields
function showPaymentFields() {
  const paymentSelect = document.getElementById('paymentMethod');
  if (!paymentSelect) return;

  const cardFields = document.getElementById('cardFields');
  const transferFields = document.getElementById('transferFields');
  
  if (!cardFields || !transferFields) return;

  // Hide all fields
  cardFields.style.display = 'none';
  transferFields.style.display = 'none';

  // Show fields according to selection
  const selectedValue = paymentSelect.value;
  if (selectedValue === 'credito' || selectedValue === 'debito') {
    cardFields.style.display = 'block';
  } else if (selectedValue === 'transferencia') {
    transferFields.style.display = 'block';
  }
}

// Function to finalize purchase (modified with modal)
function finalizePurchase() {
  // --- Previous validations ---
  const totals = calculateTotals();
  
  // 1) Address: validate fields (if in DOM) or in localStorage
  const deptEl = document.getElementById('departamento');
  const locEl = document.getElementById('localidad');
  const calleEl = document.getElementById('calle');
  const numEl = document.getElementById('numero');
  const esquinaEl = document.getElementById('esquina');

  let departamento = deptEl?.value?.trim();
  let localidad = locEl?.value?.trim();
  let calle = calleEl?.value?.trim();
  let numero = numEl?.value?.trim();
  let esquina = esquinaEl?.value?.trim();

  if (!departamento || !localidad || !calle || !numero || !esquina) {
    // try to read shippingData from localStorage
    const saved = localStorage.getItem('shippingData');
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
    alert('Por favor completa todos los campos de dirección antes de finalizar la compra.');
    return;
  }

  // 2) Shipping method: must be selected (select)
  const shippingSelect = document.getElementById('shippingMethod');
  if (!shippingSelect || !shippingSelect.value) {
    alert('Por favor selecciona un tipo de envío');
    return;
  }
  const shippingType = shippingSelect.value;

  // 3) Quantities: each product must have count > 0
  if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
    alert('No hay productos en el carrito');
    return;
  }
  for (const p of cartProducts) {
    const cnt = Number(p.count);
    if (!Number.isFinite(cnt) || cnt <= 0) {
      alert('Asegúrate de que la cantidad de cada producto sea mayor a 0');
      return;
    }
  }

  // 4) Payment types selected (checkboxes - minimum 1, maximum 2) - MODIFICADO
  const creditoChecked = document.getElementById('payment-credito')?.checked;
  const debitoChecked = document.getElementById('payment-debito')?.checked;
  const transferenciaChecked = document.getElementById('payment-transferencia')?.checked;
  
  const checkedCount = [creditoChecked, debitoChecked, transferenciaChecked].filter(Boolean).length;
  
  if (checkedCount < 1) {
    alert('Por favor selecciona al menos 1 método de pago');
    return;
  }

  // 5) Payment method fields cannot be empty for selected payment types
  if (creditoChecked || debitoChecked) {
    const cardNumber = document.getElementById('cardNumber')?.value?.trim();
    const cardExpiry = document.getElementById('cardExpiry')?.value?.trim();
    const cardCVV = document.getElementById('cardCVV')?.value?.trim();

    if (!cardNumber || !cardExpiry || !cardCVV) {
      alert('Por favor completa todos los campos de la tarjeta');
      return;
    }
    // Simple validations: expiry MM/YY and numeric CVV
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      alert('Formato de fecha de vencimiento inválido. Use MM/YY');
      return;
    }
    if (!/^\d{3,4}$/.test(cardCVV)) {
      alert('CVV inválido');
      return;
    }
  }
  
  if (transferenciaChecked) {
    const account = document.getElementById('accountNumber')?.value?.trim();
    if (!account) {
      alert('Por favor ingresa el número de cuenta para la transferencia');
      return;
    }
  }

  // Readable names for selected payment methods
  let paymentNames = [];
  if (creditoChecked) paymentNames.push('Tarjeta de Crédito');
  if (debitoChecked) paymentNames.push('Tarjeta de Débito');
  if (transferenciaChecked) paymentNames.push('Transferencia Bancaria');
  
  const paymentName = paymentNames.join(', ');
  
  // Readable name for shipping
  let shippingName = '';
  switch (shippingType) {
    case 'premium': shippingName = 'Premium 2 a 5 días'; break;
    case 'express': shippingName = 'Express 5 a 8 días'; break;
    case 'standard': shippingName = 'Standard 12 a 15 días'; break;
  }
  
  // Show success modal
  showSuccessModal(totals, shippingName, paymentName);
}