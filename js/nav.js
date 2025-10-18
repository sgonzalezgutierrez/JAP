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
});
