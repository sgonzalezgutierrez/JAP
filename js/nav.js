document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("nav-container");
  console.log(navContainer);

  if (!navContainer) return; // seguridad por si no existe el contenedor

  const username = localStorage.getItem("username") || "Invitado";

  navContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark header-background p-1">
      <div class="container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav w-100 justify-content-between">
            <li class="nav-item">
              <a class="nav-link active" href="index.html">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="categories.html">Categorías</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="sell.html">Vender</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${username}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><button id="logoutBtn" class="dropdown-item">Cerrar sesión</button></li>
                <li><button id="myProfile" class="dropdown-item">Mi perfil</button></li>
              </ul>
            </li>
            <button type="button" class="btn-primary position-relative rounded-pill">
              <li class="nav-item">
                <a class="nav-link" href="cart.html">🛒 Mi Carrito</a>
              </li>
              <span id="cantidad" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                
              </span>
            </button>
          </ul>
        </div>
      </div>
    </nav>
  `;

  
document.getElementById('logoutBtn').addEventListener('click', function () {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  window.location.assign('login.html');
});
document.getElementById('myProfile').addEventListener('click', function () {
   window.location.href = "my-profile.html";
});
contarProdcuts();
});

function contarProdcuts() {
  let span = document.getElementById("cantidad");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let numero = 0;
  for (const product of cart) {
    numero += product.count;
  }
  if (numero > 0) {
    span.innerHTML = numero;
    span.style.display = "block";
  }else{
    span.style.display = "none";
  }
}