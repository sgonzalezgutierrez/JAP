function saveImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        localStorage.setItem('savedImage', event.target.result);
        displayImage();
    };
    reader.readAsDataURL(file);
}

function displayImage() {
    const savedImage = localStorage.getItem('savedImage');
    const imgPreview = document.getElementById('imagePreview');
    
    if (savedImage) {
        imgPreview.src = savedImage;
        imgPreview.style.display = 'block';
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