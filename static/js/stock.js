/* ==========================================================
   AI SMART PHARMACY
   STOCK MANAGEMENT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const addStockModal =
        document.getElementById("addStockModal");

    const editStockModal =
        document.getElementById("editStockModal");

    const viewStockModal =
        document.getElementById("viewStockModal");

    const addStockBtn =
        document.getElementById("addStockBtn");

    const closeAddStockModal =
        document.getElementById("closeAddStockModal");

    const cancelAddStock =
        document.getElementById("cancelAddStock");

    const closeEditStockModal =
        document.getElementById("closeEditStockModal");

    const cancelEditStock =
        document.getElementById("cancelEditStock");

    const closeViewStockModal =
        document.getElementById("closeViewStockModal");

    const closeViewStock =
        document.getElementById("closeViewStock");


    /* ======================================================
       OPEN ADD STOCK
    ====================================================== */

    if(addStockBtn){

        addStockBtn.addEventListener("click", () => {

            addStockModal.classList.add("show");

        });

    }


    /* ======================================================
       CLOSE ADD STOCK
    ====================================================== */

    function closeAddModal(){

        if(addStockModal){

            addStockModal.classList.remove("show");

        }

    }

    if(closeAddStockModal){

        closeAddStockModal.addEventListener(

            "click",

            closeAddModal

        );

    }

    if(cancelAddStock){

        cancelAddStock.addEventListener(

            "click",

            closeAddModal

        );

    }


    /* ======================================================
       CLOSE WHEN CLICK OUTSIDE
    ====================================================== */

    window.addEventListener("click",(e)=>{

        if(e.target===addStockModal){

            closeAddModal();

        }

    });


    /* ======================================================
       IMAGE PREVIEW
    ====================================================== */

    const stockImage =
        document.getElementById("stockImage");

    const stockPreview =
        document.getElementById("stockPreview");

    if(stockImage){

        stockImage.addEventListener(

            "change",

            function(){

                if(this.files.length===0){

                    return;

                }

                const reader =
                    new FileReader();

                reader.onload = function(e){

                    stockPreview.src =
                        e.target.result;

                }

                reader.readAsDataURL(

                    this.files[0]

                );

            }

        );

    }

});

/* ==========================================================
   EDIT STOCK MODAL
========================================================== */

const editButtons =
    document.querySelectorAll(".editStockBtn");

editButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");

        document.getElementById("editStockId").value =
            this.dataset.id;

        document.getElementById("editMedicineCode").value =
            row.dataset.code || "";

        document.getElementById("editBarcode").value =
            row.dataset.barcode || "";

        document.getElementById("editMedicineName").value =
            row.dataset.name || "";

        document.getElementById("editGenericName").value =
            row.dataset.generic || "";

        document.getElementById("editCategory").value =
            row.dataset.category || "";

        document.getElementById("editSupplier").value =
            row.dataset.supplier || "";

        document.getElementById("editManufacturer").value =
            row.dataset.manufacturer || "";

        document.getElementById("editBatchNumber").value =
            row.dataset.batch || "";

        document.getElementById("editPurchasePrice").value =
            row.dataset.purchase || "";

        document.getElementById("editSellingPrice").value =
            row.dataset.selling || "";

        document.getElementById("editQuantity").value =
            row.dataset.quantity || "";

        document.getElementById("editReorderLevel").value =
            row.dataset.reorder || "";

        document.getElementById("editUnit").value =
            row.dataset.unit || "";

        document.getElementById("editManufactureDate").value =
            row.dataset.manufacture || "";

        document.getElementById("editExpiryDate").value =
            row.dataset.expiry || "";

        document.getElementById("editDescription").value =
            row.dataset.description || "";

        if(row.dataset.image){

            document.getElementById("editStockPreview").src =
                row.dataset.image;

        }

        document.getElementById("editStockForm").action =
            "/stock/edit-stock/" + this.dataset.id;

        editStockModal.classList.add("show");

    });

});


/* ==========================================================
   CLOSE EDIT MODAL
========================================================== */

function closeEditModal(){

    editStockModal.classList.remove("show");

}

if(closeEditStockModal){

    closeEditStockModal.onclick = closeEditModal;

}

if(cancelEditStock){

    cancelEditStock.onclick = closeEditModal;

}


/* ==========================================================
   EDIT IMAGE PREVIEW
========================================================== */

const editImage =
    document.getElementById("editStockImage");

const editPreview =
    document.getElementById("editStockPreview");

if(editImage){

    editImage.addEventListener("change",function(){

        if(this.files.length===0){

            return;

        }

        const reader = new FileReader();

        reader.onload = function(e){

            editPreview.src = e.target.result;

        }

        reader.readAsDataURL(this.files[0]);

    });

}


/* ==========================================================
   CLOSE ON OUTSIDE CLICK
========================================================== */

window.addEventListener("click",function(e){

    if(e.target===editStockModal){

        closeEditModal();

    }

});

/* ==========================================================
   VIEW STOCK MODAL
========================================================== */

const viewButtons =
    document.querySelectorAll(".viewStockBtn");

viewButtons.forEach(button => {

    button.addEventListener("click", function(){

        const row = this.closest("tr");

        document.getElementById("viewMedicineImage").src =
            row.dataset.image ||
            "/static/images/default-medicine.png";

        document.getElementById("viewMedicineName").textContent =
            row.dataset.name || "-";

        document.getElementById("viewGenericName").textContent =
            row.dataset.generic || "-";

        document.getElementById("viewStatus").textContent =
            row.dataset.status || "-";

        document.getElementById("viewMedicineCode").value =
            row.dataset.code || "";

        document.getElementById("viewBarcode").value =
            row.dataset.barcode || "";

        document.getElementById("viewCategory").value =
            row.dataset.category || "";

        document.getElementById("viewSupplier").value =
            row.dataset.supplier || "";

        document.getElementById("viewManufacturer").value =
            row.dataset.manufacturer || "";

        document.getElementById("viewBatchNumber").value =
            row.dataset.batch || "";

        document.getElementById("viewPurchasePrice").value =
            row.dataset.purchase || "";

        document.getElementById("viewSellingPrice").value =
            row.dataset.selling || "";

        document.getElementById("viewQuantity").value =
            row.dataset.quantity || "";

        document.getElementById("viewReorderLevel").value =
            row.dataset.reorder || "";

        document.getElementById("viewUnit").value =
            row.dataset.unit || "";

        document.getElementById("viewInventoryValue").value =
            row.dataset.inventory || "";

        document.getElementById("viewManufactureDate").value =
            row.dataset.manufacture || "";

        document.getElementById("viewExpiryDate").value =
            row.dataset.expiry || "";

        document.getElementById("viewDescription").value =
            row.dataset.description || "";

        viewStockModal.classList.add("show");

    });

});


/* ==========================================================
   CLOSE VIEW MODAL
========================================================== */

function closeViewModal(){

    viewStockModal.classList.remove("show");

}

if(closeViewStockModal){

    closeViewStockModal.onclick = closeViewModal;

}

if(closeViewStock){

    closeViewStock.onclick = closeViewModal;

}

window.addEventListener("click",function(e){

    if(e.target===viewStockModal){

        closeViewModal();

    }

});


/* ==========================================================
   SEARCH
========================================================== */

const searchInput =
    document.getElementById("searchStock");

if(searchInput){

    searchInput.addEventListener("keyup",function(){

        const keyword =
            this.value.toLowerCase();

        document
            .querySelectorAll(".stock-table tbody tr")
            .forEach(row=>{

                row.style.display =
                    row.innerText
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";

            });

    });

}


/* ==========================================================
   CATEGORY FILTER
========================================================== */

const categoryFilter =
    document.getElementById("categoryFilter");

if(categoryFilter){

    categoryFilter.addEventListener("change",filterTable);

}


/* ==========================================================
   STATUS FILTER
========================================================== */

const statusFilter =
    document.getElementById("statusFilter");

if(statusFilter){

    statusFilter.addEventListener("change",filterTable);

}


/* ==========================================================
   FILTER FUNCTION
========================================================== */

function filterTable(){

    const category =
        categoryFilter.value.toLowerCase();

    const status =
        statusFilter.value.toLowerCase();

    document
        .querySelectorAll(".stock-table tbody tr")
        .forEach(row=>{

            const rowCategory =
                (row.dataset.category || "").toLowerCase();

            const rowStatus =
                (row.dataset.status || "").toLowerCase();

            const categoryMatch =
                category === "" ||
                rowCategory === category;

            const statusMatch =
                status === "" ||
                rowStatus === status;

            row.style.display =
                categoryMatch && statusMatch
                ? ""
                : "none";

        });

}

/* ==========================================================
   STOCK TABS
========================================================== */

const tabButtons =
    document.querySelectorAll(".tab-btn");

tabButtons.forEach(button=>{

    button.addEventListener("click",function(){

        tabButtons.forEach(tab=>{

            tab.classList.remove("active");

        });

        this.classList.add("active");

    });

});


/* ==========================================================
   FORM VALIDATION
========================================================== */

const addStockForm =
    document.querySelector("#addStockModal form");

if(addStockForm){

    addStockForm.addEventListener("submit",function(e){

        const medicineName =
            this.querySelector("[name='medicine_name']");

        const quantity =
            this.querySelector("[name='quantity']");

        const purchasePrice =
            this.querySelector("[name='purchase_price']");

        const sellingPrice =
            this.querySelector("[name='selling_price']");

        if(medicineName.value.trim()===""){

            alert("Medicine Name is required.");

            medicineName.focus();

            e.preventDefault();

            return;

        }

        if(Number(quantity.value)<0){

            alert("Quantity cannot be negative.");

            quantity.focus();

            e.preventDefault();

            return;

        }

        if(Number(purchasePrice.value)<0){

            alert("Purchase Price is invalid.");

            purchasePrice.focus();

            e.preventDefault();

            return;

        }

        if(Number(sellingPrice.value)<0){

            alert("Selling Price is invalid.");

            sellingPrice.focus();

            e.preventDefault();

            return;

        }

    });

}


/* ==========================================================
   LOADING BUTTON
========================================================== */

document.querySelectorAll("form").forEach(form=>{

    form.addEventListener("submit",function(){

        const submitButton =
            this.querySelector("button[type='submit']");

        if(submitButton){

            submitButton.disabled = true;

            submitButton.innerHTML =

                '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

        }

    });

});


/* ==========================================================
   AUTO CLOSE FLASH MESSAGE
========================================================== */

const flashMessages =
    document.querySelectorAll(".alert");

flashMessages.forEach(message=>{

    setTimeout(()=>{

        message.style.transition=".4s";

        message.style.opacity="0";

        setTimeout(()=>{

            message.remove();

        },400);

    },4000);

});


/* ==========================================================
   REFRESH TABLE
========================================================== */

function refreshTable(){

    location.reload();

}


/* ==========================================================
   ESC KEY CLOSE MODALS
========================================================== */

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        if(addStockModal){

            addStockModal.classList.remove("show");

        }

        if(editStockModal){

            editStockModal.classList.remove("show");

        }

        if(viewStockModal){

            viewStockModal.classList.remove("show");

        }

    }

});


/* ==========================================================
   END OF STOCK.JS
========================================================== */