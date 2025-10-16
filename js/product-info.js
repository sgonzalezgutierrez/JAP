// ==================== PRODUCT DATA ====================
const selectedProductId = localStorage.getItem("productoSeleccionado");
const productUrl = `https://japceibal.github.io/emercado-api/products/${selectedProductId}.json`;
const commentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${selectedProductId}.json`;

// ==================== FETCH PRODUCT ====================
fetch(productUrl)
  .then(res => res.json())
  .then(product => {
    document.querySelector("h4").textContent = product.name;
    document.querySelector(".precio").textContent = `Precio: ${product.currency} ${product.cost}`;
    document.querySelector(".vendidos").textContent = `Cantidad vendida: ${product.soldCount}`;
    document.querySelector(".descripción-info").textContent = product.description;

    const gallery = document.querySelector(".galeria-imagenes");
    product.images.forEach(img => gallery.innerHTML += `<img src="${img}" alt="Imagen del producto">`);

    const relatedContainer = document.querySelector(".content-related-products");
    relatedContainer.innerHTML = `
      <div class="title-related-products">Productos relacionados</div>
      <div class="products-wrapper"></div>
    `;
    const wrapper = relatedContainer.querySelector(".products-wrapper");
    product.relatedProducts.forEach(p => {
      wrapper.innerHTML += `
        <div class="product-item d-flex flex-column align-items-center pt-3" onclick="selectRelatedProduct(${p.id})">
          <img src="${p.image}" alt="Imagen del producto">
          <p class="name-related-product mt-2">${p.name}</p>
        </div>
      `;
    });
  });

// ==================== FETCH COMMENTS ====================
let allRatings = []; // guardará todas las calificaciones reales
const commentsContainer = document.querySelector(".featured-reviews .comments-wrapper");
const averageContainer = document.getElementById("average-note");

fetch(commentsUrl)
  .then(res => res.json())
  .then(data => {
    if(data.length) {
      allRatings = data.map(c => c.score);
      updateAverageRating();
    } else {
      averageContainer.innerHTML = `<p class="text-white fw-bold fs-5">Sin comentarios</p>`;
    }

    data.forEach(c => {
      const date = new Date(c.dateTime).toLocaleDateString("es-ES");
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comments-wrapper");
      commentDiv.innerHTML = `
        <div class="d-flex gap-2 align-items-center w-100 justify-content-between flex-wrap flex-md-nowrap">
          <div class="d-flex gap-2 align-items-center">
            <img class="icon-comment" src="./assets/icon-comment.png" alt="person"/>
            <p class="user-comment">${c.user}</p>
            <div class="text-custom-grey">${date}</div>
          </div>
          <div class="stars">${createStars(c.score)}</div>
        </div>
        <div class="text-white fw-smoll">${c.description}</div>
      `;
      commentsContainer.appendChild(commentDiv);
    });
  });

// ==================== HELPER FUNCTIONS ====================
function selectRelatedProduct(id) {
  localStorage.setItem("productoSeleccionado", id);
  window.location.reload();
}

function createStars(score) {
  let stars = "";
  for(let i = 1; i <= 5; i++) {
    stars += i <= score ? "★ " : '<span class="star inactive">★</span> ';
  }
  return stars.trim();
}

function updateStarsVisual(score) {
  stars.forEach(star => {
    const value = parseInt(star.dataset.value);
    if(value <= score) {
      star.classList.remove("inactive");
      star.classList.add("active");
    } else {
      star.classList.remove("active");
      star.classList.add("inactive");
    }
  });
}

function calculateAverage(scores) {
  if(!scores.length) return 0;
  const sum = scores.reduce((a,b) => a+b,0);
  return Math.trunc(sum / scores.length);
}

function updateAverageRating() {
  const avg = calculateAverage(allRatings); // promedio entero
  const total = allRatings.length; // cantidad de calificaciones

  averageContainer.innerHTML = `
    <div class="d-flex align-items-start gap-3">
  
        <span class="fw-bold fs-4">${avg}</span>
            <div class="d-flex align-items-start flex-column">
        <div class="stars" id="stars-average"></div>
      
      <span class="fw-medium fs-6 text-white">${total} calificaciones</span>
      </div>
    </div>
  `;
  renderStars(document.getElementById("stars-average"), avg);
}

function renderStars(container, rating) {
  if(!container) return;
  container.innerHTML = "";
  for(let i = 1; i <= 5; i++) {
    container.innerHTML += i <= rating ? "★ " : '<span class="star inactive">★</span> ';
  }
}

const btnSend = document.getElementById("rangeFilterCount");
const textarea = document.getElementById("productDescription");
const stars = document.querySelectorAll("#starRating .star");
let selectedScore = 0;

// Selección de calificación
stars.forEach(star => {
  star.addEventListener("click", () => {
    selectedScore = parseInt(star.dataset.value);
    updateStarsVisual(selectedScore);
  });
});

btnSend.addEventListener("click", () => {
  const commentText = textarea.value.trim();
  if(!commentText) return alert("Debes escribir un comentario");
  if(selectedScore === 0) return alert("Debes seleccionar una calificación");

  // Usuario logeado desde localStorage
  let loggedUser = localStorage.getItem("username") || "Usuario";
  loggedUser = loggedUser.split("@")[0];

  const dateFormatted = new Date().toLocaleDateString("es-ES");

  // Guardar calificación
  allRatings.push(selectedScore);

  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comments-wrapper");
  commentDiv.innerHTML = `
    <div class="d-flex gap-2 align-items-center w-100 justify-content-between">
      <div class="d-flex gap-2 align-items-center">
        <img class="icon-comment" src="./assets/icon-comment.png" alt="person"/>
        <p class="user-comment">${loggedUser}</p>
        <div class="text-custom-grey">${dateFormatted}</div>
      </div>
      <div class="stars">${createStars(selectedScore)}</div>
    </div>
    <div class="text-white fw-smoll">${commentText}</div>
  `;
  commentsContainer.appendChild(commentDiv);

  // Actualizar promedio
  updateAverageRating();

  // Reset
  textarea.value = "";
  selectedScore = 0;
  updateStarsVisual(0);
});
