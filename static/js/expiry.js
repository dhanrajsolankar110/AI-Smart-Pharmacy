/* ==========================================================
   AI SMART PHARMACY
   EXPIRY INTELLIGENCE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const addAlertModal =
        document.getElementById("addAlertModal");

    const viewExpiryModal =
        document.getElementById("viewExpiryModal");

    const alertSettingsModal =
        document.getElementById("alertSettingsModal");

    const addAlertBtn =
        document.getElementById("addAlertBtn");

    const saveAlertSettings =
        document.getElementById("saveAlertSettings");

    const closeAddAlertModal =
        document.getElementById("closeAddAlertModal");

    const cancelAddAlert =
        document.getElementById("cancelAddAlert");

    const closeViewExpiryModal =
        document.getElementById("closeViewExpiryModal");

    const closeViewExpiry =
        document.getElementById("closeViewExpiry");

    const closeAlertSettingsModal =
        document.getElementById("closeAlertSettingsModal");

    const cancelAlertSettings =
        document.getElementById("cancelAlertSettings");


    /* ======================================================
       ADD ALERT MODAL
    ====================================================== */

    function openAddAlert(){

        if(addAlertModal){

            addAlertModal.classList.add("show");

        }

    }

    function closeAddAlert(){

        if(addAlertModal){

            addAlertModal.classList.remove("show");

        }

    }

    if(addAlertBtn){

        addAlertBtn.onclick = openAddAlert;

    }

    if(closeAddAlertModal){

        closeAddAlertModal.onclick = closeAddAlert;

    }

    if(cancelAddAlert){

        cancelAddAlert.onclick = closeAddAlert;

    }


    /* ======================================================
       ALERT SETTINGS
    ====================================================== */

    function openSettings(){

        if(alertSettingsModal){

            alertSettingsModal.classList.add("show");

        }

    }

    function closeSettings(){

        if(alertSettingsModal){

            alertSettingsModal.classList.remove("show");

        }

    }

    if(saveAlertSettings){

        saveAlertSettings.onclick = openSettings;

    }

    if(closeAlertSettingsModal){

        closeAlertSettingsModal.onclick = closeSettings;

    }

    if(cancelAlertSettings){

        cancelAlertSettings.onclick = closeSettings;

    }


    /* ======================================================
       CLOSE MODALS WHEN CLICK OUTSIDE
    ====================================================== */

    window.addEventListener("click",function(e){

        if(e.target===addAlertModal){

            closeAddAlert();

        }

        if(e.target===viewExpiryModal){

            viewExpiryModal.classList.remove("show");

        }

        if(e.target===alertSettingsModal){

            closeSettings();

        }

    });

});

/* ==========================================================
   VIEW EXPIRY MODAL
========================================================== */

const viewButtons =
    document.querySelectorAll(".viewExpiryBtn");

viewButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");

        if (!row || !viewExpiryModal) {
            return;
        }

        /* ==================================================
           MEDICINE IMAGE
        ================================================== */

        const image =
            row.dataset.image ||
            "/static/images/default-medicine.png";

        const imageElement =
            document.getElementById("viewExpiryImage");

        if (imageElement) {

            imageElement.src = image;

        }


        /* ==================================================
           BASIC INFORMATION
        ================================================== */

        const medicineName =
            document.getElementById("viewExpiryMedicine");

        const genericName =
            document.getElementById("viewExpiryGeneric");

        const status =
            document.getElementById("viewExpiryStatus");

        if (medicineName) {

            medicineName.textContent =
                row.dataset.name || "-";

        }

        if (genericName) {

            genericName.textContent =
                row.dataset.generic || "-";

        }

        if (status) {

            status.textContent =
                row.dataset.status || "-";

            status.className =
                "status " +
                getStatusClass(
                    row.dataset.status
                );

        }


        /* ==================================================
           FORM INFORMATION
        ================================================== */

        setValue(
            "viewMedicineCode",
            row.dataset.code
        );

        setValue(
            "viewBatchNumber",
            row.dataset.batch
        );

        setValue(
            "viewCategory",
            row.dataset.category
        );

        setValue(
            "viewManufacturer",
            row.dataset.manufacturer
        );

        setValue(
            "viewExpiryDate",
            row.dataset.expiry
        );

        setValue(
            "viewDaysRemaining",
            row.dataset.days
        );

        setValue(
            "viewCurrentStock",
            row.dataset.quantity
        );

        setValue(
            "viewReorderLevel",
            row.dataset.reorder
        );

        setValue(
            "viewPurchasePrice",
            row.dataset.purchase
        );

        setValue(
            "viewSellingPrice",
            row.dataset.selling
        );

        setValue(
            "viewDescription",
            row.dataset.description
        );


        /* ==================================================
           OPEN MODAL
        ================================================== */

        viewExpiryModal.classList.add("show");

    });

});


/* ==========================================================
   HELPER - SET VALUE
========================================================== */

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.value =
        value || "";

}


/* ==========================================================
   STATUS CLASS
========================================================== */

function getStatusClass(status) {

    switch ((status || "").toLowerCase()) {

        case "critical":

            return "danger";

        case "warning":

            return "warning";

        case "moderate":

            return "moderate";

        case "safe":

            return "success";

        case "expired":

            return "danger";

        default:

            return "warning";

    }

}


/* ==========================================================
   CLOSE VIEW EXPIRY
========================================================== */

function closeViewExpiryModal() {

    if (viewExpiryModal) {

        viewExpiryModal.classList.remove("show");

    }

}

if (closeViewExpiryModal) {

    closeViewExpiryModal.onclick =
        closeViewExpiryModal;

}

if (closeViewExpiry) {

    closeViewExpiry.onclick =
        closeViewExpiryModal;

}


/* ==========================================================
   SEARCH
========================================================== */

const searchExpiry =
    document.getElementById("searchExpiry");

if (searchExpiry) {

    searchExpiry.addEventListener(
        "input",
        filterExpiryTable
    );

}


/* ==========================================================
   CATEGORY FILTER
========================================================== */

const categoryFilter =
    document.getElementById("categoryFilter");

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterExpiryTable
    );

}


/* ==========================================================
   STATUS FILTER
========================================================== */

const statusFilter =
    document.getElementById("statusFilter");

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterExpiryTable
    );

}


/* ==========================================================
   DATE FILTER
========================================================== */

const expiryDate =
    document.getElementById("expiryDate");

if (expiryDate) {

    expiryDate.addEventListener(
        "change",
        filterExpiryTable
    );

}


/* ==========================================================
   FILTER TABLE
========================================================== */

function filterExpiryTable() {

    const keyword =
        searchExpiry
            ? searchExpiry.value
                .toLowerCase()
                .trim()
            : "";

    const category =
        categoryFilter
            ? categoryFilter.value
                .toLowerCase()
                .trim()
            : "";

    const status =
        statusFilter
            ? statusFilter.value
                .toLowerCase()
                .trim()
            : "";

    const selectedDate =
        expiryDate
            ? expiryDate.value
            : "";


    const rows =
        document.querySelectorAll(
            ".expiry-table tbody tr[data-name]"
        );


    rows.forEach(row => {

        const name =
            (row.dataset.name || "")
                .toLowerCase();

        const batch =
            (row.dataset.batch || "")
                .toLowerCase();

        const rowCategory =
            (row.dataset.category || "")
                .toLowerCase();

        const rowStatus =
            (row.dataset.status || "")
                .toLowerCase();

        const rowExpiry =
            row.dataset.expiryRaw || "";


        const searchMatch =
            keyword === "" ||
            name.includes(keyword) ||
            batch.includes(keyword);

        const categoryMatch =
            category === "" ||
            rowCategory === category;

        const statusMatch =
            status === "" ||
            rowStatus === status;

        const dateMatch =
            selectedDate === "" ||
            rowExpiry === selectedDate;


        row.style.display =
            searchMatch &&
            categoryMatch &&
            statusMatch &&
            dateMatch
                ? ""
                : "none";

    });

}

/* ==========================================================
   EXPIRY TABS
========================================================== */

const expiryTabs =
    document.querySelectorAll(".expiry-tabs .tab-btn");

expiryTabs.forEach(tab => {

    tab.addEventListener("click", function () {

        expiryTabs.forEach(item => {

            item.classList.remove("active");

        });

        this.classList.add("active");

        const tabName =
            this.textContent
                .trim()
                .toLowerCase();

        const rows =
            document.querySelectorAll(
                ".expiry-table tbody tr[data-name]"
            );

        rows.forEach(row => {

            const days =
                parseInt(
                    row.dataset.days || "0",
                    10
                );

            const status =
                (
                    row.dataset.status || ""
                ).toLowerCase();

            let show = true;


            /* ==============================================
               EXPIRING SOON
            =============================================== */

            if (
                tabName === "expiring soon"
            ) {

                show =
                    days >= 0 &&
                    days <= 60;

            }


            /* ==============================================
               EXPIRED ITEMS
            =============================================== */

            else if (
                tabName === "expired items"
            ) {

                show =
                    days < 0 ||
                    status === "expired";

            }


            /* ==============================================
               ALL ITEMS
            =============================================== */

            else if (
                tabName === "all items"
            ) {

                show = true;

            }


            /* ==============================================
               EXPIRY HISTORY
            =============================================== */

            else if (
                tabName === "expiry history"
            ) {

                show =
                    days < 0 ||
                    status === "expired";

            }

            row.style.display =
                show ? "" : "none";

        });

    });

});


/* ==========================================================
   EXPIRY OVERVIEW CHART
========================================================== */

const expiryChartElement =
    document.getElementById("expiryChart");

if (
    expiryChartElement &&
    typeof Chart !== "undefined"
) {

    const expiredCount =
        Number(
            expiryChartElement.dataset.expired ||
            expiryChartElement.getAttribute(
                "data-expired"
            ) ||
            0
        );

    const criticalCount =
        Number(
            expiryChartElement.dataset.critical ||
            expiryChartElement.getAttribute(
                "data-critical"
            ) ||
            0
        );

    const warningCount =
        Number(
            expiryChartElement.dataset.warning ||
            expiryChartElement.getAttribute(
                "data-warning"
            ) ||
            0
        );

    const safeCount =
        Number(
            expiryChartElement.dataset.safe ||
            expiryChartElement.getAttribute(
                "data-safe"
            ) ||
            0
        );


    new Chart(
        expiryChartElement,
        {
            type: "doughnut",

            data: {

                labels: [
                    "Expired",
                    "0 - 30 Days",
                    "31 - 60 Days",
                    "60+ Days"
                ],

                datasets: [

                    {
                        data: [
                            expiredCount,
                            criticalCount,
                            warningCount,
                            safeCount
                        ],

                        backgroundColor: [
                            "#ef4444",
                            "#f97316",
                            "#f59e0b",
                            "#22c55e"
                        ],

                        borderWidth: 0,

                        hoverOffset: 6
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "68%",

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );

}


/* ==========================================================
   SAVE ALERT SETTINGS
========================================================== */

const saveSettingsButton =
    document.getElementById(
        "saveAlertSettings"
    );

if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        function () {

            if (!alertSettingsModal) {
                return;
            }

            alertSettingsModal.classList.add(
                "show"
            );

        }
    );

}


/* ==========================================================
   ESC KEY
========================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }

        if (addAlertModal) {

            addAlertModal.classList.remove(
                "show"
            );

        }

        if (viewExpiryModal) {

            viewExpiryModal.classList.remove(
                "show"
            );

        }

        if (alertSettingsModal) {

            alertSettingsModal.classList.remove(
                "show"
            );

        }

    }
);

/* ==========================================================
   ADD ALERT FORM VALIDATION
========================================================== */

const addAlertForm =
    document.querySelector(
        "#addAlertModal form"
    );

if (addAlertForm) {

    addAlertForm.addEventListener(
        "submit",
        function (event) {

            const alertName =
                this.querySelector(
                    "[name='alert_name']"
                );

            const medicine =
                this.querySelector(
                    "[name='medicine_id']"
                );

            const daysBefore =
                this.querySelector(
                    "[name='days_before']"
                );

            if (
                !alertName ||
                alertName.value.trim() === ""
            ) {

                alert(
                    "Please enter an alert name."
                );

                if (alertName) {
                    alertName.focus();
                }

                event.preventDefault();

                return;

            }

            if (
                !medicine ||
                medicine.value === ""
            ) {

                alert(
                    "Please select a medicine."
                );

                if (medicine) {
                    medicine.focus();
                }

                event.preventDefault();

                return;

            }

            if (
                !daysBefore ||
                Number(daysBefore.value) <= 0
            ) {

                alert(
                    "Please select a valid alert period."
                );

                if (daysBefore) {
                    daysBefore.focus();
                }

                event.preventDefault();

                return;

            }

        }
    );

}


/* ==========================================================
   ALERT SETTINGS FORM
========================================================== */

const alertSettingsForm =
    document.querySelector(
        "#alertSettingsModal form"
    );

if (alertSettingsForm) {

    alertSettingsForm.addEventListener(
        "submit",
        function () {

            const submitButton =
                this.querySelector(
                    "button[type='submit']"
                );

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

            }

        }
    );

}


/* ==========================================================
   FORM LOADING STATES
========================================================== */

document
    .querySelectorAll(
        "#addAlertModal form"
    )
    .forEach(form => {

        form.addEventListener(
            "submit",
            function () {

                const button =
                    this.querySelector(
                        "button[type='submit']"
                    );

                if (!button) {
                    return;
                }

                button.disabled = true;

                button.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

            }
        );

    });


/* ==========================================================
   SAVE ALERT SETTINGS
========================================================== */

const settingsSaveButton =
    document.getElementById(
        "saveAlertSettings"
    );

if (settingsSaveButton) {

    settingsSaveButton.addEventListener(
        "click",
        function () {

            if (!alertSettingsModal) {
                return;
            }

            alertSettingsModal.classList.add(
                "show"
            );

        }
    );

}


/* ==========================================================
   REFRESH EXPIRY PAGE
========================================================== */

function refreshExpiryPage() {

    window.location.reload();

}


/* ==========================================================
   RESET FILTERS
========================================================== */

function resetExpiryFilters() {

    if (searchExpiry) {

        searchExpiry.value = "";

    }

    if (categoryFilter) {

        categoryFilter.value = "";

    }

    if (statusFilter) {

        statusFilter.value = "";

    }

    if (expiryDate) {

        expiryDate.value = "";

    }

    filterExpiryTable();

}


/* ==========================================================
   CLOSE ALL MODALS
========================================================== */

function closeAllExpiryModals() {

    if (addAlertModal) {

        addAlertModal.classList.remove(
            "show"
        );

    }

    if (viewExpiryModal) {

        viewExpiryModal.classList.remove(
            "show"
        );

    }

    if (alertSettingsModal) {

        alertSettingsModal.classList.remove(
            "show"
        );

    }

}


/* ==========================================================
   PREVENT BODY SCROLL WHEN MODAL IS OPEN
========================================================== */

function updateBodyScroll() {

    const modalOpen =
        document.querySelector(
            ".modal.show"
        );

    document.body.style.overflow =
        modalOpen ? "hidden" : "";

}


/* ==========================================================
   MODAL OBSERVER
========================================================== */

const modalObserver =
    new MutationObserver(
        function () {

            updateBodyScroll();

        }
    );

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modalObserver.observe(
            modal,
            {
                attributes: true,
                attributeFilter: [
                    "class"
                ]
            }
        );

    });


/* ==========================================================
   END OF EXPIRY.JS
========================================================== */