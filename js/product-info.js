const idSeleccionado = localStorage.getItem("productoSeleccionado");
const url = `https://japceibal.github.io/emercado-api/products/${idSeleccionado}.json`;
fetch(url)
    .then(response => response.json())
    .then(data => {
        document.querySelector("h4").textContent = data.name;
        document.querySelector(".precio").textContent = `Precio: ${data.currency} ${data.cost}`;
        document.querySelector(".vendidos").textContent = `Cantidad vendida: ${data.soldCount}`;
        document.querySelector(".descripción-info").textContent = data.description;
        const galeria = document.querySelector(".galeria-imagenes");
        galeria.innerHTML = '<p class="galeria">Galería</p>';
        data.images.forEach(image => {
            galeria.innerHTML += `<img class="img-thumbnail mx-2" src="${image}" alt="Imagen del producto">`;
        }); //el + va agregando imagenenes y no las borra.
    }
    );