let catID = localStorage.getItem('catID');
let productos_url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
//Obtiene el CatID que guarda Category, y lo uso en url para que sea dinamico y cambie dependiendo del producto

let currentProductsArray = [];

// Funciones de filtro

// Filtra de forma descendiente
function sortProductsDesc(dataArray){
    dataArray.products.sort((a,b) => a.cost - b.cost)
}

// Este codigp se usa para acortar la lista de prodcutos.
function sortProductsAsc(dataArray){
    dataArray.products.sort((a,b) => b.cost - a.cost)
}
//Filtra por la cantidad vendida
function sortProductsSell(dataArray){
    dataArray.products.sort((a,b) => b.soldCount - a.soldCount)
}

//Filtra segun el precio que se coloco en los filtros, revisando si tiene valores
function filterProductsByPrice(dataArray) {
    const min = parseInt(document.getElementById("minPrice").value) || 0;
    const max = parseInt(document.getElementById("maxPrice").value) || Infinity;

    const filteredArray = {
        ...dataArray,
        products: dataArray.products.filter(product => product.cost >= min && product.cost <= max)
    };

    return filteredArray;
}

// Filtra segun el titulo y descripcion
function filterProductsByTitleandDescription(str){
      const search = str.trim().toLowerCase();

  const filteredProducts = currentProductsArray.products.filter(item => {
    const name = item.name.toLowerCase();
    const description = item.description.toLowerCase();
    return name.includes(search) || description.includes(search);
  });

  return {
    ...currentProductsArray,
    products: filteredProducts
  };
}

// Creando la lista por DOM.
// Muestra el titulo de los objetos en la lista.
function showTitle(title){
    let htmlContentToAppend = `
         <div class="titulo">
            <h1>${title}</h1>
        </div>
    `;
      document.getElementById("titulo").innerHTML = htmlContentToAppend;
}

//Genera lo que se va a agregar en el html con uso del dom
function showProducts(dataArray) {
    let htmlContentToAppend = "";
    let products = dataArray.products;
    for (let product of products) {
        htmlContentToAppend += `
            <div class="product-list-item" data-id="${product.id}" style="cursor:pointer;">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class='right'>
                            <h4>${product.name}</h4>
                            <small class="text-muted">${product.soldCount} artículos</small>
                        </div>
                        <p>${product.description}</p>
                        <p class="cost">${product.currency}  ${product.cost}</p>
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById("list").innerHTML = htmlContentToAppend;
}

//Guarda en el local storage el id de producto y re dirige a product info
function selectProduct(idProducto) {
    localStorage.setItem("productoSeleccionado", idProducto);
    window.location.href = "product-info.html";
}


// Listener utilizados

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}


document.addEventListener("DOMContentLoaded", function(e){
    loadSavedTheme();
 getJSONData(productos_url).then(function(resultObj){
     if (resultObj.status === "ok"){
        currentProductsArray = resultObj.data
        showTitle(resultObj.data.catName)
        sortProductsDesc(currentProductsArray); 
        let arrayToShow = filterProductsByPrice(currentProductsArray);
        showProducts(arrayToShow)
        }
    });
  
})

// Filtra los productos correctamente segun la opcion seleccionada en el combobox
document.getElementById("miCombobox").addEventListener("change",function(event){
        let valorSeleccionado = event.target.value;    
        if(valorSeleccionado === "desc"){
           sortProductsDesc(currentProductsArray); 
        }else if(valorSeleccionado === "asc"){
            sortProductsAsc(currentProductsArray);
        }else{
           sortProductsSell(currentProductsArray); 
        }
  let arrayToShow = filterProductsByPrice(currentProductsArray);
        showProducts(arrayToShow);
    }) 

// Listener por si se hace click en un elemento en una lista.  
document.getElementById("list").addEventListener("click", function(e){
    const value = e.target.closest(".product-list-item")
        if(value){
            let productId = value.dataset.id;
            selectProduct(productId);
        }  
    });

// Esta pieza de codigo cumple la funcion de permitir editar y agregar elementos a la lsita de productos.
document.getElementById("search").addEventListener("input",function(e){
    let valueObt = e.target.value;
    let arrayFiltered = filterProductsByTitleandDescription(valueObt);
    let arrayToShow = filterProductsByPrice(arrayFiltered);
    showProducts(arrayToShow);
});

// Listener 
document.getElementById("btnFilter").addEventListener("click", e => { 
    let arrayFiltered = filterProductsByTitleandDescription(document.getElementById("search").value);
    let arrayToShow = filterProductsByPrice(arrayFiltered);
    showProducts(arrayToShow);
});

// Listener para cuando se hace click en clear queda la lista como al principo
document.getElementById("btnClear").addEventListener("click", e => {
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("search").value = "";
    showProducts(currentProductsArray);
})
