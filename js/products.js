let catID = localStorage.getItem('catID');
let productos_url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
//Obtiene el CatID que guarda Category, y lo uso en url para que sea dinamico y cambie dependiendo del producto

let currentProductsArray = [];

// Funciones de filtro
// hay un error al cambiar el filtro si tenemos search boton filtrar no hace nada

function sortProductsDesc(dataArray){
    dataArray.products.sort((a,b) => a.cost - b.cost)
}
// Nico comentar aca
function sortProductsAsc(dataArray){
    dataArray.products.sort((a,b) => b.cost - a.cost)
}
function sortProductsSell(dataArray){
    dataArray.products.sort((a,b) => b.soldCount - a.soldCount)
}
//Nico comentar aca
function filterProductsByPrice(dataArray) {
    const min = parseInt(document.getElementById("minPrice").value) || 0;
    const max = parseInt(document.getElementById("maxPrice").value) || Infinity;

    const filteredArray = {
        ...dataArray,
        products: dataArray.products.filter(product => product.cost >= min && product.cost <= max)
    };

    return filteredArray;
}

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

// Creando la lista por DOM
//Nico comentar aca
function showTitle(title){
    let htmlContentToAppend = `
         <div class="titulo">
            <h1>${title}</h1>
        </div>
    `;
      document.getElementById("titulo").innerHTML = htmlContentToAppend;
}

function mostrarProductos(dataArray) {
    let htmlContentToAppend = "";
    let products = dataArray.products;
    for (let product of products) {
        htmlContentToAppend += `
            <div class="product-list-item" onclick="seleccionarProducto(${product.id})" style="cursor:pointer;">
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

function selectProduct(idProducto) {
    localStorage.setItem("productoSeleccionado", idProducto);
    window.location.href = "product-info.html";
}


// Listener utilizados

document.addEventListener("DOMContentLoaded", function(e){
 getJSONData(productos_url).then(function(resultObj){
     if (resultObj.status === "ok"){
        currentProductsArray = resultObj.data
        showTitle(resultObj.data.catName)
        sortProductsDesc(currentProductsArray); 
        let arrayToShow = filterProductsByPrice(currentProductsArray);
        mostrarProductos(arrayToShow)
        }
    });
  
})
//Nico comentar esto, las funciones explica solo la que te marque
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
        mostrarProductos(arrayToShow);
    })  
//Nico explica esto
document.getElementById("search").addEventListener("input",function(e){
    let valueObt = e.target.value;
    let arrayFiltered = filterProductsByTitleandDescription(valueObt);
    let arrayToShow = filterProductsByPrice(arrayFiltered);
    mostrarProductos(arrayToShow);
});

document.getElementById("btnFilter").addEventListener("click", e => { 
    let arrayFiltered = filterProductsByTitleandDescription(document.getElementById("search").value);
    let arrayToShow = filterProductsByPrice(arrayFiltered);
    mostrarProductos(arrayToShow);
});

document.getElementById("btnClear").addEventListener("click", e => {
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("search").value = "";
    mostrarProductos(currentProductsArray);
})