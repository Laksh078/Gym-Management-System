// First password box
let Show = document.getElementById("show");
let password = document.getElementById("password");

        show.onclick = function(){
            if(password.type == "password"){
                password.type = "text";
                show.src = "/public/assets/images/eye_open.svg"
            }else{
                password.type = "password";
                show.src = "/public/assets/images/eye.svg"
            }
        }
        
// Second password box
let Show1 = document.getElementById("show1");
let password1 = document.getElementById("password1");

        show1.onclick = function(){
            if(password1.type == "password"){
                password1.type = "text";
                show1.src = "/public/assets/images/eye_open.svg"
            }else{
                password1.type = "password";
                show1.src = "/public/assets/images/eye.svg"
            }
        }