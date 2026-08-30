/* ==========================================================
   AI SMART PHARMACY
   MEDICINES MODULE
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeMedicineModule();

    }

);

/* ==========================================================
   INITIALIZE
========================================================== */

function initializeMedicineModule(){

    initializeSearch();

    initializeFilters();

    initializeAddModal();

    initializeEditButtons();

    initializeDeleteButtons();

    initializeExport();

    initializeImagePreview();

}

/* ==========================================================
   LIVE SEARCH
========================================================== */

function initializeSearch(){

    const search=document.getElementById(

        "medicineSearch"

    );

    if(!search){

        return;

    }

    search.addEventListener(

        "keyup",

        function(){

            const value=this.value.toLowerCase();

            const rows=document.querySelectorAll(

                ".medicine-table tbody tr"

            );

            rows.forEach(function(row){

                const text=row.innerText.toLowerCase();

                row.style.display=

                    text.includes(value)

                    ? ""

                    : "none";

            });

        }

    );

}

/* ==========================================================
   FILTERS
========================================================== */

function initializeFilters(){

    const category=document.getElementById(

        "categoryFilter"

    );

    const status=document.getElementById(

        "statusFilter"

    );

    const manufacturer=document.getElementById(

        "manufacturerFilter"

    );

    if(category){

        category.addEventListener(

            "change",

            applyFilters

        );

    }

    if(status){

        status.addEventListener(

            "change",

            applyFilters

        );

    }

    if(manufacturer){

        manufacturer.addEventListener(

            "change",

            applyFilters

        );

    }

}

function applyFilters(){

    const category=

        document.getElementById(

            "categoryFilter"

        ).value.toLowerCase();

    const status=

        document.getElementById(

            "statusFilter"

        ).value.toLowerCase();

    const manufacturer=

        document.getElementById(

            "manufacturerFilter"

        ).value.toLowerCase();

    const rows=document.querySelectorAll(

        ".medicine-table tbody tr"

    );

    rows.forEach(function(row){

        const rowCategory=

            row.cells[2].innerText.toLowerCase();

        const rowManufacturer=

            row.cells[3].innerText.toLowerCase();

        const rowStatus=

            row.cells[6].innerText.toLowerCase();

        let visible=true;

        if(

            category!=="all categories"

            &&

            rowCategory!==category

        ){

            visible=false;

        }

        if(

            status!=="all status"

            &&

            rowStatus!==status

        ){

            visible=false;

        }

        if(

            manufacturer!=="all manufacturers"

            &&

            rowManufacturer!==manufacturer

        ){

            visible=false;

        }

        row.style.display=

            visible

            ? ""

            : "none";

    });

}

/* ==========================================================
   ADD MODAL
========================================================== */

function initializeAddModal(){

    const open=document.getElementById(

        "openAddMedicine"

    );

    const modal=document.getElementById(

        "addMedicineModal"

    );

    const close=document.getElementById(

        "closeAddMedicineModal"

    );

    const cancel=document.getElementById(

        "cancelAddMedicine"

    );

    if(open){

        open.onclick=function(){

            modal.classList.add(

                "show"

            );

        };

    }

    if(close){

        close.onclick=function(){

            modal.classList.remove(

                "show"

            );

        };

    }

    if(cancel){

        cancel.onclick=function(){

            modal.classList.remove(

                "show"

            );

        };

    }

}

/* ==========================================================
   EDIT MEDICINE MODAL
========================================================== */

function initializeEditButtons(){

    const buttons=document.querySelectorAll(

        ".action-btn.edit"

    );

    buttons.forEach(function(button){

        button.addEventListener(

            "click",

            function(){

                const row=this.closest("tr");

                const modal=document.getElementById(

                    "editMedicineModal"

                );

                if(!modal){

                    return;

                }

                document.getElementById(

                    "editMedicineId"

                ).value=this.dataset.id;

                document.getElementById(

                    "editMedicineName"

                ).value=row.querySelector(

                    ".medicine-details h4"

                ).innerText;

                document.getElementById(

                    "editGenericName"

                ).value=row.cells[1].innerText;

                document.getElementById(

                    "editCategory"

                ).value=row.cells[2].innerText;

                document.getElementById(

                    "editManufacturer"

                ).value=row.cells[3].innerText;

                document.getElementById(

                    "editSellingPrice"

                ).value=row.cells[4]

                .innerText

                .replace("₹","");

                modal.classList.add(

                    "show"

                );

            }

        );

    });

    const close=document.getElementById(

        "closeEditMedicineModal"

    );

    const cancel=document.getElementById(

        "cancelEditMedicine"

    );

    if(close){

        close.onclick=function(){

            document.getElementById(

                "editMedicineModal"

            ).classList.remove(

                "show"

            );

        };

    }

    if(cancel){

        cancel.onclick=function(){

            document.getElementById(

                "editMedicineModal"

            ).classList.remove(

                "show"

            );

        };

    }

}

/* ==========================================================
   IMAGE PREVIEW
========================================================== */

function initializeImagePreview(){

    const upload=document.getElementById(

        "medicineImage"

    );

    if(!upload){

        return;

    }

    upload.addEventListener(

        "change",

        function(){

            if(this.files.length===0){

                return;

            }

            const reader=new FileReader();

            reader.onload=function(e){

                const preview=document.getElementById(

                    "imagePreview"

                );

                if(preview){

                    preview.src=e.target.result;

                }

            };

            reader.readAsDataURL(

                this.files[0]

            );

        }

    );

}

/* ==========================================================
   EXPORT CSV
========================================================== */

function initializeExport(){

    const button=document.getElementById(

        "exportMedicines"

    );

    if(!button){

        return;

    }

    button.addEventListener(

        "click",

        function(){

            let csv=[];

            document.querySelectorAll(

                ".medicine-table tr"

            ).forEach(function(row){

                let cols=[];

                row.querySelectorAll(

                    "th,td"

                ).forEach(function(col){

                    cols.push(

                        '"' +

                        col.innerText.replace(/\n/g," ")

                        + '"'

                    );

                });

                csv.push(

                    cols.join(",")

                );

            });

            const blob=new Blob(

                [csv.join("\n")],

                {

                    type:"text/csv"

                }

            );

            const url=

                URL.createObjectURL(

                    blob

                );

            const link=document.createElement(

                "a"

            );

            link.href=url;

            link.download="medicines.csv";

            document.body.appendChild(

                link

            );

            link.click();

            link.remove();

            URL.revokeObjectURL(

                url

            );

        }

    );

}

/* ==========================================================
   DELETE CONFIRMATION
========================================================== */

function initializeDeleteButtons(){

    document.querySelectorAll(

        ".action-btn.delete"

    ).forEach(function(button){

        button.addEventListener(

            "click",

            function(e){

                if(

                    !confirm(

                        "Are you sure you want to delete this medicine?"

                    )

                ){

                    e.preventDefault();

                }

            }

        );

    });

}

/* ==========================================================
   SIMPLE FORM VALIDATION
========================================================== */

document.querySelectorAll(

    "form"

).forEach(function(form){

    form.addEventListener(

        "submit",

        function(e){

            const required=form.querySelectorAll(

                "[required]"

            );

            let valid=true;

            required.forEach(function(input){

                if(

                    input.value.trim()===""

                ){

                    input.style.borderColor="#ef4444";

                    valid=false;

                }else{

                    input.style.borderColor="#dbe4ee";

                }

            });

            if(!valid){

                e.preventDefault();

                alert(

                    "Please complete all required fields."

                );

            }

        }

    );

});

/* ==========================================================
   ROW ANIMATION
========================================================== */

document.querySelectorAll(

    ".medicine-table tbody tr"

).forEach(function(row,index){

    row.style.opacity="0";

    row.style.transform="translateY(15px)";

    setTimeout(function(){

        row.style.transition=".35s";

        row.style.opacity="1";

        row.style.transform="translateY(0)";

    },index*60);

});

/* ==========================================================
   END
========================================================== */