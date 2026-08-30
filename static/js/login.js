/* ==========================================
   AI SMART PHARMACY LOGIN
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       PASSWORD SHOW / HIDE
    ========================================== */

    const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

if (password && toggle) {

    const icon = toggle.querySelector("i");

    toggle.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            password.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

}

    /* ==========================================
       INPUT ANIMATION
    ========================================== */

    document.querySelectorAll(".input-box input").forEach(input=>{

        input.addEventListener("focus",()=>{

            input.parentElement.classList.add("active");

        });

        input.addEventListener("blur",()=>{

            if(input.value===""){

                input.parentElement.classList.remove("active");

            }

        });

    });

    /* ==========================================
       LOGIN BUTTON LOADING
    ========================================== */

    const form=document.querySelector("form");

    const loginBtn=document.querySelector(".login-btn");

    if(form){

        form.addEventListener("submit",()=>{

            loginBtn.disabled=true;

            loginBtn.innerHTML=`
            <i class="fa-solid fa-spinner fa-spin"></i>
            Signing In...
            `;

        });

    }

});