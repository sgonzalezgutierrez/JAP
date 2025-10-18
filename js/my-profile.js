// Función para alternar entre tema claro y oscuro
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLightMode = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

// Función para cargar el tema guardado
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
}

// Función para cargar la información del perfil según el email
function profileInfo(email) {
  if (!email) {
    return;
  }

  // Obtener todos los perfiles guardados
  const savedData = localStorage.getItem('perfilData');
  
  if (savedData) {
    const allProfiles = JSON.parse(savedData);
    
    // Buscar el perfil de este email específico
    const userProfile = allProfiles[email];
    
    if (userProfile) {
      // Cargar los datos en los inputs
      if (userProfile.nombre) {
        document.getElementById('nombre').value = userProfile.nombre;
      }
      
      if (userProfile.apellido) {
        document.getElementById('apellido').value = userProfile.apellido;
      }
      
      if (userProfile.telefono) {
        document.getElementById('telefono').value = userProfile.telefono;
      }
      
      console.log('✅ Datos cargados desde localStorage para:', email);
    }
  }
}

// Función para guardar el perfil
function saveProfileData(event) {
  event.preventDefault();
  
  // Obtener los valores de todos los inputs
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  
  // Validar que los campos obligatorios no estén vacíos
  if (!nombre || !apellido || !telefono) {
    alert('❌ Por favor completa todos los campos obligatorios');
    return;
  }
  
  // Validar que haya un email
  if (!email) {
    alert('❌ No hay email de usuario');
    return;
  }
  
  // Crear objeto con los datos del perfil
  const perfil = {
    nombre: nombre,
    apellido: apellido,
    telefono: telefono,
    fechaGuardado: new Date().toLocaleString('es-ES')
  };
  
  // Obtener todos los perfiles existentes
  let allProfiles = {};
  const savedData = localStorage.getItem('perfilData');
  
  if (savedData) {
    allProfiles = JSON.parse(savedData);
  }
  
  // Guardar/actualizar el perfil de este email específico
  allProfiles[email] = perfil;
  
  // Guardar todo de vuelta en localStorage
  localStorage.setItem('perfilData', JSON.stringify(allProfiles));
  
  alert('✅ Perfil guardado exitosamente!');
  
  console.log('=== PERFIL GUARDADO ===');
  console.log('Email:', email);
  console.log('Datos:', perfil);
  console.log('=====================');
}

document.addEventListener("DOMContentLoaded", function(){
  // Cargar tema guardado
  loadSavedTheme();
  
  // Recuperar el email del localStorage
  const email = localStorage.getItem("username");
  document.getElementById("email").value = email;

  // Cargar perfil pasando el email como parámetro
  profileInfo(email);
  
  // Agregar evento al formulario (usa querySelector porque no tiene ID)
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', saveProfileData);
  }
});