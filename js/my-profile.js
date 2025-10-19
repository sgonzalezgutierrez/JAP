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
});