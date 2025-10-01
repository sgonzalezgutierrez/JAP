const idSeleccionado = localStorage.getItem("productoSeleccionado"); //obtengo el id del producto seleccionado de localStorage
const url = `https://japceibal.github.io/emercado-api/products/${idSeleccionado}.json`; //Construye la URL de la API usando el ID del producto seleccionado
const urlCom = `https://japceibal.github.io/emercado-api/products_comments/${idSeleccionado}.json`; //constante para conseguir los comentarios de una ID de prodcuto especifico

fetch(url) //Realiza la petición a la API para obtener los datos del producto
  .then((response) => response.json()) //Convierte la respuesta en un objeto JSON
  .then((data) => {
    document.querySelector("h4").textContent = data.name;
    document.querySelector(
      ".precio"
    ).textContent = `Precio: ${data.currency} ${data.cost}`;
    document.querySelector(
      ".vendidos"
    ).textContent = `Cantidad vendida: ${data.soldCount}`;
    document.querySelector(".descripción-info").textContent = data.description;
    const galeria = document.querySelector(".galeria-imagenes"); //selecciono el div donde van las imagenes
    data.images.forEach((image) => {
      //recorro el array de imagenes
      galeria.innerHTML += `<img src="${image}" alt="Imagen del producto">`;
    }); //el + va agregando imagenenes y no las borra.

    const relatedProductsContainer = document.querySelector(
      ".content-related-products"
    );
    relatedProductsContainer.innerHTML = `
        <div class="title-related-products">Productos relacionados</div>
        <div class="products-wrapper"></div>
        `;
    const wrapper = relatedProductsContainer.querySelector(".products-wrapper");
    data.relatedProducts.forEach((product) => {
      wrapper.innerHTML += `
            <div class="product-item d-flex flex-column align-items-center pt-3" onclick="selectRelatedProduct(${product.id})"">
                <img src="${product.image}" alt="Imagen del producto">
                <p class="name-related-product mt-2">${product.name}</p>
            </div>
        `;
    });
  });

fetch(urlCom) //Realiza la petición a la API para obtener los comentarios del producto
  .then((response) => response.json())
  .then((data) => {
    const coments = document.querySelector(".content-comments");
    const commentsContainer = document.getElementById("comments-container");
    if(data.length > 0){
        const average = document.getElementById("average-note");
        const calif = data.map(item => item.score);
        const aver = averageNotes(calif);
        average.innerHTML +=`
            <div >
                ${Math.trunc(aver)}
                <div class="stars" id="stars-a"></div>
            </div>
            `
        renderStars(`stars-a`, Math.trunc(aver));
    }else{
        coments.innerHTML = `
            <p class="text-white fw-bold fs-4">Sin comentarios</p>
        `
    }
    data.forEach((com, index) => {
      const div = document.createElement("div");
      div.classList.add("comments-wrapper", "mb-3"); // margen entre comentarios
      div.innerHTML = `
        <div class="d-flex gap-2 align-items-center w-100 justify-content-between">
            <div class="d-flex gap-2 align-items-center">
                <h4 class="text-white fw-bold fs-6">${com.user}</h4>
                <div class="text-custom-grey">${com.dateTime}</div>
            </div>
            <div class="stars" id="stars-${index}"></div>
        </div>
        <div class="text-white">${com.description}</div>
        `;
      commentsContainer.appendChild(div);
      renderStars(`stars-${index}`, com.score);
    });
  });

function selectRelatedProduct(id) {
  localStorage.setItem("productoSeleccionado", id); // guarda ID
  window.location.reload(); // recarga la página
}

function renderStars(containerOrId, rating, maxStars = 5) {
  const container =
    typeof containerOrId === "string"
      ? document.getElementById(containerOrId)
      : containerOrId;

  if (!container) return; // no existe -> salir
  container.innerHTML = "";
  for (let i = 1; i <= maxStars; i++) {
    const span = document.createElement("span");
    span.textContent = i <= rating ? "★" : "☆";
    span.className = i <= rating ? "star filled" : "star";
    container.appendChild(span);
  }
}

function averageNotes(scores){
    return promedio = scores.reduce((a, b) => a + b, 0) / scores.length;
}