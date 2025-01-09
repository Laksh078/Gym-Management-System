const imageInput = document.getElementById('UploadButton');
    const imagePreview = document.getElementById('imagePreview');
  
    imageInput.addEventListener('change', function(event) {
      const file = event.target.files[0]; // Get the uploaded file
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = function(e) {
          imagePreview.src = e.target.result; // Set the image src to the file result
          imagePreview.style.display = 'block'; // Show the image preview
        };
  
        reader.readAsDataURL(file); // Read the file as a data URL (base64 string)
      } else {
        imagePreview.src = ''; // Clear the image preview if no file is selected
        imagePreview.style.display = 'none'; // Hide the image preview
      }
    });