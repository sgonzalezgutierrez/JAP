// Esta función valida el login: si el usuario y la contraseña no están vacíos, guarda el estado en localStorage y redirige a index.html
document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username !== '' && password !== '') {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', username);

      window.location.assign('index.html');
    } else {
      alert('Todos los campos deben estar llenos');
    }
  });
