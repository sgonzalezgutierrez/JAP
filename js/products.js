const productos_url = 'https://japceibal.github.io/emercado-api/cats_products/101.json'
let currentProductsArray = [];


function mostrarProductos(dataArray) {
    let htmlContentToAppend = "";
    let products = dataArray.products;
    htmlContentToAppend += `
        <div class="titulo">
            <h1>${dataArray.catName}</h1>
        </div>
    `;
    for (let product of products) {
        htmlContentToAppend += `
            <div class="list-group-item">
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

    document.getElementById("productos-lista").innerHTML = htmlContentToAppend;
}


document.addEventListener("DOMContentLoaded", function(e){
 getJSONData(productos_url).then(function(resultObj){
     if (resultObj.status === "ok"){
        currentProductsArray = resultObj.data
        mostrarProductos(currentProductsArray)
        //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });
})