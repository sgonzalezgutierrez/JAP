const idSeleccionado = localStorage.getItem("productoSeleccionado"); //obtengo el id del producto seleccionado de localStorage
const url = `https://japceibal.github.io/emercado-api/products/${idSeleccionado}.json`;//Construye la URL de la API usando el ID del producto seleccionado
const urlCom = `https://japceibal.github.io/emercado-api/products_comments/${idSeleccionado}.json`; //constante para conseguir los comentarios de una ID de prodcuto especifico

fetch(url) //Realiza la petición a la API para obtener los datos del producto
    .then(response => response.json()) //Convierte la respuesta en un objeto JSON
    .then(data => {
        document.querySelector("h4").textContent = data.name;
        document.querySelector(".precio").textContent = `Precio: ${data.currency} ${data.cost}`;
        document.querySelector(".vendidos").textContent = `Cantidad vendida: ${data.soldCount}`;
        document.querySelector(".descripción-info").textContent = data.description;
        const galeria = document.querySelector(".galeria-imagenes");//selecciono el div donde van las imagenes
        data.images.forEach(image => { //recorro el array de imagenes
            galeria.innerHTML += `<img src="${image}" alt="Imagen del producto">`;
        }); //el + va agregando imagenenes y no las borra.

        const relatedProductsContainer = document.querySelector(".content-related-products");
        relatedProductsContainer.innerHTML = `
        <div class="title-related-products">Productos relacionados</div>
        <div class="products-wrapper"></div>
        `;
        const wrapper = relatedProductsContainer.querySelector(".products-wrapper");
        data.relatedProducts.forEach(product => {
        wrapper.innerHTML += `
            <div class="product-item d-flex flex-column align-items-center pt-3" onclick="selectRelatedProduct(${product.id})"">
                <img src="${product.image}" alt="Imagen del producto">
                <p class="name-related-product mt-2">${product.name}</p>
            </div>
        `;
        });
    }
    );

    fetch(urlCom) //Realiza la petición a la API para obtener los comentarios del producto
        .then(response => response.json())
        .then(data => {
            const coments = document.querySelector(".content-comments")
            data.forEach(com => {
                coments.innerHTML += `
                <div class="comments-wrapper">
                    <div class="d-flex gap-2 align-items-center w-100 justify-content-between">
                        <div class="d-flex gap-2 align-items-center">
                            <h4 class="text-white fw-bold fs-6">${com.user}</h4>
                            <div class="text-custom-grey">${com.dateTime}</div>
                        </div>
                        <div class="stars">${com.score}</div>
                    </div>
                    <div class="text-white fw-smoll">${com.description}</div>
                </div>
                `
            })
        })

    function selectRelatedProduct(id) {
        localStorage.setItem("productoSeleccionado", id); // guarda ID
        window.location.reload(); // recarga la página
    };
