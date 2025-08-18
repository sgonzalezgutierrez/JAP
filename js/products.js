const productos_url = 'https://japceibal.github.io/emercado-api/cats_products/101.json'
let currentProductsArray = [];

function sortProductsDesc(dataArray){
    dataArray.products.sort((a,b) => a.cost - b.cost)
}
function sortProductsAsc(dataArray){
    dataArray.products.sort((a,b) => b.cost - a.cost)
}
function sortProductsSell(dataArray){
    dataArray.products.sort((a,b) => b.soldCount - a.soldCount)
}

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
            <div class="product-list-item">
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




document.addEventListener("DOMContentLoaded", function(e){
 getJSONData(productos_url).then(function(resultObj){
     if (resultObj.status === "ok"){
        currentProductsArray = resultObj.data
        showTitle(resultObj.data.catName)
        sortProductsDesc(currentProductsArray); 
        mostrarProductos(currentProductsArray)
        //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("miCombobox").addEventListener("change",function(event){
        let valorSeleccionado = event.target.value;    
        if(valorSeleccionado === "desc"){
           sortProductsDesc(currentProductsArray); 
        }else if(valorSeleccionado === "asc"){
            sortProductsAsc(currentProductsArray);
        }else{
           sortProductsSell(currentProductsArray); 
        }
        mostrarProductos(currentProductsArray);
    })    
})