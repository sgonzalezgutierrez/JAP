const idSeleccionado = localStorage.getItem("productoSeleccionado");

fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
    .then(response => response.json())
    .then(data => {
        const producto = data.products.find(p => p.id == idSeleccionado);
        if (producto) {
            document.querySelector("h4").textContent = producto.name;
            document.querySelector(".precio").textContent = `Precio: ${producto.currency} ${producto.cost}`;
            document.querySelector(".vendidos").textContent = `Cantidad vendida: ${producto.soldCount}`;
            document.querySelector(".descripción-info").textContent = producto.description;
            const galeria = document.querySelector(".galeria-imagenes");
            galeria.innerHTML = '<p class="galeria">Galería</p>';
          
                galeria.innerHTML += `<img class="img-thumbnail mx-2" src="${producto.image}" alt="Imagen del producto">`;
        }
    });
