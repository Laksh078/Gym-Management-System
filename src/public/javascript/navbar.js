document.getElementById('profile-image-checkbox').addEventListener('change', function(){
    let dropdownProfile = document.getElementById('dropdown-profile');
    console.log("asdfasdlfkj")
    if (this.checked) {
        dropdownProfile.style.visibility = 'visible';
    } else {
        dropdownProfile.style.visibility = 'hidden';
    };
    
});

document.getElementById('profile-image-checkbox-phone').addEventListener('change', function(){
    let dropdownProfilePhone = document.getElementById('dropdown-profile-phone');
    console.log("asdfasdlfkj")
    if (this.checked) {
        dropdownProfilePhone.style.visibility = 'visible';
    } else {
        dropdownProfilePhone.style.visibility = 'hidden';
    };
    
});