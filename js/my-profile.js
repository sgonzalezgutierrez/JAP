function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Redimensionar la imagen (máximo 400x400 para avatares)
            let width = img.width;
            let height = img.height;
            const maxSize = 400;
            
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Comprimir a 0.7 de calidad
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(compressedDataUrl);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function saveImage(file) {
    compressImage(file, function(compressedImage) {
        const currentUsername = localStorage.getItem('username');
        
        if (currentUsername) {
            try {
                localStorage.setItem(`savedImage_${currentUsername}`, compressedImage);
                displayImage();
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('La imagen es demasiado grande. Por favor selecciona una imagen más pequeña.');
                }
            }
        }
    });
}

function displayImage() {
    const currentUsername = localStorage.getItem('username');
    const imgPreview = document.getElementById('imagePreview');
    
    if (currentUsername) {
        const savedImage = localStorage.getItem(`savedImage_${currentUsername}`);
        
        if (savedImage) {
            imgPreview.src = savedImage;
            imgPreview.style.display = 'block';
        }
    }
}

document.getElementById("file").addEventListener("change", function(event){
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
        saveImage(selectedFile);
    }
});

document.querySelector('.camera-button').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('file').click();
});

document.addEventListener("DOMContentLoaded", function(){
    displayImage();
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
  
}

document.addEventListener("DOMContentLoaded", function(){
  // Cargar tema guardado
  loadSavedTheme();
  
  // Recuperar el email del localStorage
  const email = localStorage.getItem("username");
  document.getElementById("email").value = email;

  // Cargar perfil pasando el email como parámetro
  profileInfo(email);
  
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', saveProfileData);
  }
});