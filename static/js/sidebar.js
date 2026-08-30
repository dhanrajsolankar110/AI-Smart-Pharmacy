/* =====================================================
   AI SMART PHARMACY SIDEBAR
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");

    // Restore previous state
    const savedState = localStorage.getItem("sidebar-state");

    if(savedState === "collapsed"){

        sidebar.classList.add("collapsed");

    }

    // Toggle sidebar
    if(toggle){

        toggle.addEventListener("click", function(){

            sidebar.classList.toggle("collapsed");

            if(sidebar.classList.contains("collapsed")){

                localStorage.setItem(
                    "sidebar-state",
                    "collapsed"
                );

            }

            else{

                localStorage.setItem(
                    "sidebar-state",
                    "expanded"
                );

            }

        });

    }

});