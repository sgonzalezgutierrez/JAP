// ========== FUNCIONES GLOBALES ==========

// Función para cambiar el tema
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

// Función para comprimir imagen
function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
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

function profileInfo(email) {
  const savedData = localStorage.getItem('perfilData');
  
  if (savedData) {
    const allProfiles = JSON.parse(savedData);
    const userProfile = allProfiles[email];
    
    if (userProfile) {
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

function saveProfileData(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  
  const perfil = {
    nombre: nombre,
    apellido: apellido,
    telefono: telefono,
    fechaGuardado: new Date().toLocaleString('es-ES')
  };
  
  let allProfiles = {};
  const savedData = localStorage.getItem('perfilData');
  
  if (savedData) {
    allProfiles = JSON.parse(savedData);
  }
  
  allProfiles[email] = perfil;
  localStorage.setItem('perfilData', JSON.stringify(allProfiles));
}

// ========== INICIALIZACIÓN ==========
document.addEventListener("DOMContentLoaded", function(){
  // 1. Cargar tema guardado
  loadSavedTheme();
  
  // 2. Conectar botón de tema (ESTO ES LO QUE FALTABA)
  const themeButton = document.getElementById('theme-toggle'); // O el ID que tenga tu botón
  if (themeButton) {
    themeButton.addEventListener('click', toggleTheme);
  }
  
  // 3. Cargar perfil
  const email = localStorage.getItem("username");
  if (email) {
    document.getElementById("email").value = email;
    profileInfo(email);
  }
  
  // 4. Eventos del formulario
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', saveProfileData);
  }
  
  // 5. Eventos de imagen
  const fileInput = document.getElementById("file");
  if (fileInput) {
    fileInput.addEventListener("change", function(event){
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        saveImage(selectedFile);
      }
    });
  }
  
  const cameraButton = document.querySelector('.camera-button');
  if (cameraButton) {
    cameraButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('file').click();
    });
  }
  
  // 6. Mostrar imagen guardada
  displayImage();
});