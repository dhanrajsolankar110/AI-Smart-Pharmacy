/* =========================================================
   AI SMART PHARMACY
   PRESCRIPTIONS MODULE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchInput =
        document.getElementById("prescriptionSearch");

    const statusFilter =
        document.getElementById("prescriptionStatusFilter");

    const doctorFilter =
        document.getElementById("prescriptionDoctorFilter");

    const tableBody =
        document.getElementById("prescriptionsTableBody");

    const resultCount =
        document.getElementById("prescriptionResultCount");

    const newPrescriptionBtn =
        document.getElementById("newPrescriptionBtn");

    const exportBtn =
        document.getElementById("exportPrescriptions");


    /* =====================================================
       GET TABLE ROWS
    ===================================================== */

    function getRows() {

        if (!tableBody) {
            return [];
        }

        return Array.from(
            tableBody.querySelectorAll(
                ".prescription-row"
            )
        );

    }


    /* =====================================================
       FILTER PRESCRIPTIONS
    ===================================================== */

    function filterPrescriptions() {

        const searchValue =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";

        const selectedDoctor =
            doctorFilter
                ? doctorFilter.value
                : "all";


        const rows = getRows();

        let visibleCount = 0;


        rows.forEach(function (row) {

            const patient =
                (
                    row.dataset.patient || ""
                ).toLowerCase();

            const prescriptionId =
                (
                    row.dataset.id || ""
                ).toLowerCase();

            const status =
                row.dataset.status || "";

            const doctor =
                row.dataset.doctor || "";


            const matchesSearch =
                !searchValue ||
                patient.includes(searchValue) ||
                prescriptionId.includes(searchValue);


            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;


            const matchesDoctor =
                selectedDoctor === "all" ||
                doctor === selectedDoctor;


            const shouldShow =
                matchesSearch &&
                matchesStatus &&
                matchesDoctor;


            if (shouldShow) {

                row.classList.remove(
                    "hidden"
                );

                visibleCount++;

            } else {

                row.classList.add(
                    "hidden"
                );

            }

        });


        updateResultCount(
            visibleCount,
            rows.length
        );

    }


    /* =====================================================
       RESULT COUNT
    ===================================================== */

    function updateResultCount(
        visibleCount,
        totalCount
    ) {

        if (!resultCount) {
            return;
        }


        if (visibleCount === 0) {

            resultCount.textContent =
                "No prescriptions found";

            return;

        }


        if (visibleCount === totalCount) {

            resultCount.textContent =
                "Showing 1 to " +
                visibleCount +
                " of 500 prescriptions";

            return;

        }


        resultCount.textContent =
            "Showing " +
            visibleCount +
            " matching prescriptions";

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterPrescriptions
        );

    }


    /* =====================================================
       STATUS FILTER
    ===================================================== */

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterPrescriptions
        );

    }


    /* =====================================================
       DOCTOR FILTER
    ===================================================== */

    if (doctorFilter) {

        doctorFilter.addEventListener(
            "change",
            filterPrescriptions
        );

    }


    /* =====================================================
       VIEW PRESCRIPTION
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const viewButton =
                event.target.closest(
                    ".view-prescription"
                );


            if (!viewButton) {
                return;
            }


            const prescriptionId =
                viewButton.dataset.prescriptionId;


            showPrescriptionDetails(
                prescriptionId
            );

        }
    );


    /* =====================================================
       PRESCRIPTION DETAILS
    ===================================================== */

    function showPrescriptionDetails(
        prescriptionId
    ) {

        const row =
            document.querySelector(
                `.prescription-row[data-id="${prescriptionId}"]`
            );


        if (!row) {

            showNotification(
                "Prescription details not found.",
                "error"
            );

            return;

        }


        const patient =
            row.dataset.patient || "Patient";

        const status =
            row.dataset.status || "Unknown";

        const doctor =
            row.dataset.doctor || "Doctor";


        showNotification(
            prescriptionId +
            " • " +
            patient +
            " • " +
            doctor +
            " • " +
            status,
            "success"
        );

    }


    /* =====================================================
       THREE-DOT MENU
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const menuButton =
                event.target.closest(
                    ".prescription-menu"
                );


            if (!menuButton) {
                return;
            }


            event.stopPropagation();


            closePrescriptionMenus();


            const prescriptionId =
                menuButton.dataset.prescriptionId;


            const menu =
                createPrescriptionMenu(
                    menuButton,
                    prescriptionId
                );


            document.body.appendChild(menu);

        }
    );


    /* =====================================================
       CREATE ACTION MENU
    ===================================================== */

    function createPrescriptionMenu(
        button,
        prescriptionId
    ) {

        const menu =
            document.createElement("div");


        menu.className =
            "prescription-dropdown-menu";


        menu.innerHTML = `

            <button
                type="button"
                data-action="view"
                data-id="${prescriptionId}">

                <i class="fa-regular fa-file-lines"></i>

                View Prescription

            </button>


            <button
                type="button"
                data-action="download"
                data-id="${prescriptionId}">

                <i class="fa-solid fa-download"></i>

                Download

            </button>


            <button
                type="button"
                data-action="print"
                data-id="${prescriptionId}">

                <i class="fa-solid fa-print"></i>

                Print

            </button>


            <div class="prescription-menu-divider"></div>


            <button
                type="button"
                class="danger-action"
                data-action="delete"
                data-id="${prescriptionId}">

                <i class="fa-regular fa-trash-can"></i>

                Cancel Prescription

            </button>

        `;


        const rect =
            button.getBoundingClientRect();


        menu.style.position =
            "fixed";

        menu.style.top =
            (rect.bottom + 5) + "px";

        menu.style.left =
            Math.max(
                10,
                rect.right - 190
            ) + "px";


        return menu;

    }


    /* =====================================================
       MENU ACTIONS
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const actionButton =
                event.target.closest(
                    ".prescription-dropdown-menu button"
                );


            if (!actionButton) {
                return;
            }


            const action =
                actionButton.dataset.action;

            const prescriptionId =
                actionButton.dataset.id;


            closePrescriptionMenus();


            if (action === "view") {

                showPrescriptionDetails(
                    prescriptionId
                );

            }


            if (action === "download") {

                downloadPrescription(
                    prescriptionId
                );

            }


            if (action === "print") {

                printPrescription(
                    prescriptionId
                );

            }


            if (action === "delete") {

                cancelPrescription(
                    prescriptionId
                );

            }

        }
    );


    /* =====================================================
       CLOSE MENUS
    ===================================================== */

    function closePrescriptionMenus() {

        document
            .querySelectorAll(
                ".prescription-dropdown-menu"
            )
            .forEach(function (menu) {

                menu.remove();

            });

    }


    /* =====================================================
       CLICK OUTSIDE MENU
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".prescription-menu"
                ) &&
                !event.target.closest(
                    ".prescription-dropdown-menu"
                )
            ) {

                closePrescriptionMenus();

            }

        }
    );


    /* =====================================================
       DOWNLOAD PRESCRIPTION
    ===================================================== */

    function downloadPrescription(
        prescriptionId
    ) {

        showNotification(
            "Preparing " +
            prescriptionId +
            " for download...",
            "success"
        );


        setTimeout(function () {

            showNotification(
                "Prescription " +
                prescriptionId +
                " download is ready.",
                "success"
            );

        }, 800);

    }


    /* =====================================================
       PRINT PRESCRIPTION
    ===================================================== */

    function printPrescription(
        prescriptionId
    ) {

        showNotification(
            "Preparing prescription " +
            prescriptionId +
            " for printing...",
            "success"
        );


        setTimeout(function () {

            window.print();

        }, 500);

    }


    /* =====================================================
       CANCEL PRESCRIPTION
    ===================================================== */

    function cancelPrescription(
        prescriptionId
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel prescription " +
                prescriptionId +
                "?"
            );


        if (!confirmed) {
            return;
        }


        const row =
            document.querySelector(
                `.prescription-row[data-id="${prescriptionId}"]`
            );


        if (row) {

            row.dataset.status =
                "Cancelled";


            const statusElement =
                row.querySelector(
                    ".prescription-status"
                );


            if (statusElement) {

                statusElement.textContent =
                    "Cancelled";

                statusElement.className =
                    "prescription-status cancelled";

            }

        }


        showNotification(
            "Prescription " +
            prescriptionId +
            " has been cancelled.",
            "success"
        );


        filterPrescriptions();

    }


    /* =====================================================
       NEW PRESCRIPTION
    ===================================================== */

    if (newPrescriptionBtn) {

        newPrescriptionBtn.addEventListener(
            "click",
            function () {

                openNewPrescription();

            }
        );

    }


    function openNewPrescription() {

    const modal =
        document.getElementById(
            "newPrescriptionModal"
        );


    if (!modal) {

        showNotification(
            "New Prescription form could not be loaded.",
            "error"
        );

        return;

    }


    modal.style.display = "block";

    document.body.style.overflow = "hidden";


    const dateInput =
        document.getElementById(
            "prescriptionDate"
        );


    if (
        dateInput &&
        !dateInput.value
    ) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        dateInput.value = today;

    }

}


    /* =====================================================
       EXPORT
    ===================================================== */

    if (exportBtn) {

        exportBtn.addEventListener(
            "click",
            function () {

                exportPrescriptions();

            }
        );

    }


    function exportPrescriptions() {

        const rows =
            getRows().filter(function (row) {

                return !row.classList.contains(
                    "hidden"
                );

            });


        if (rows.length === 0) {

            showNotification(
                "There are no prescriptions to export.",
                "error"
            );

            return;

        }


        let csv =
            "Prescription ID,Patient Name,Doctor,Date,Medicines,Status,Total Amount\n";


        rows.forEach(function (row) {

            const cells =
                row.querySelectorAll(
                    "td"
                );


            if (cells.length < 7) {
                return;
            }


            const id =
                row.dataset.id || "";


            const patient =
                row.dataset.patient || "";


            const doctor =
                row.dataset.doctor || "";


            const date =
                cells[3]
                    ? cells[3].innerText
                        .replace(/\n/g, " ")
                        .trim()
                    : "";


            const medicines =
                cells[4]
                    ? cells[4].innerText
                        .trim()
                    : "";


            const status =
                row.dataset.status || "";


            const amount =
                cells[6]
                    ? cells[6].innerText
                        .trim()
                    : "";


            csv +=
                `"${id}","${patient}","${doctor}","${date}","${medicines}","${status}","${amount}"\n`;

        });


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "prescriptions.csv";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        showNotification(
            "Prescription data exported successfully.",
            "success"
        );

    }


    /* =====================================================
       VIEW ALL
    ===================================================== */

    const viewAllTop =
        document.getElementById(
            "viewAllPrescriptions"
        );

    const viewAllBottom =
        document.getElementById(
            "viewAllPrescriptionsBottom"
        );


    function viewAllPrescriptions() {

        if (searchInput) {

            searchInput.value =
                "";

        }


        if (statusFilter) {

            statusFilter.value =
                "all";

        }


        if (doctorFilter) {

            doctorFilter.value =
                "all";

        }


        filterPrescriptions();

        showNotification(
            "Showing all prescriptions.",
            "success"
        );

    }


    if (viewAllTop) {

        viewAllTop.addEventListener(
            "click",
            viewAllPrescriptions
        );

    }


    if (viewAllBottom) {

        viewAllBottom.addEventListener(
            "click",
            viewAllPrescriptions
        );

    }


    /* =====================================================
       PAGINATION
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const paginationButton =
                event.target.closest(
                    ".pagination-btn"
                );


            if (!paginationButton) {
                return;
            }


            const buttons =
                document.querySelectorAll(
                    ".pagination-btn"
                );


            if (
                paginationButton
                    .querySelector(
                        ".fa-chevron-left"
                    ) ||
                paginationButton
                    .querySelector(
                        ".fa-chevron-right"
                    )
            ) {

                showNotification(
                    "Pagination is ready for backend integration.",
                    "success"
                );

                return;

            }


            buttons.forEach(
                function (button) {

                    button.classList.remove(
                        "active"
                    );

                }
            );


            paginationButton.classList.add(
                "active"
            );

        }
    );


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    function showNotification(
        message,
        type = "success"
    ) {

        const oldNotification =
            document.querySelector(
                ".prescription-notification"
            );


        if (oldNotification) {

            oldNotification.remove();

        }


        const notification =
            document.createElement("div");


        notification.className =
            "prescription-notification " +
            type;


        notification.innerHTML = `

            <div class="prescription-notification-icon">

                <i class="${
                    type === "error"
                        ? "fa-solid fa-circle-exclamation"
                        : "fa-solid fa-circle-check"
                }"></i>

            </div>


            <div class="prescription-notification-message">

                ${message}

            </div>


            <button
                type="button"
                class="prescription-notification-close">

                <i class="fa-solid fa-xmark"></i>

            </button>

        `;


        document.body.appendChild(
            notification
        );


        requestAnimationFrame(
            function () {

                notification.classList.add(
                    "show"
                );

            }
        );


        const closeButton =
            notification.querySelector(
                ".prescription-notification-close"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    removeNotification(
                        notification
                    );

                }
            );

        }


        setTimeout(
            function () {

                removeNotification(
                    notification
                );

            },
            3500
        );

    }


    function removeNotification(
        notification
    ) {

        if (!notification) {
            return;
        }


        notification.classList.remove(
            "show"
        );


        setTimeout(
            function () {

                if (
                    notification.parentNode
                ) {

                    notification.remove();

                }

            },
            250
        );

    }

/* =====================================================
   CLOSE NEW PRESCRIPTION MODAL
===================================================== */

const prescriptionModal =
    document.getElementById(
        "newPrescriptionModal"
    );

const closePrescriptionModal =
    document.getElementById(
        "closePrescriptionModal"
    );

const cancelPrescriptionModal =
    document.getElementById(
        "cancelPrescriptionModal"
    );

const prescriptionModalOverlay =
    prescriptionModal
        ? prescriptionModal.querySelector(
            ".prescription-modal-overlay"
        )
        : null;


function closeNewPrescriptionModal() {

    if (!prescriptionModal) {
        return;
    }

    prescriptionModal.style.display =
        "none";

    document.body.style.overflow =
        "";

}


/* Close button */

if (closePrescriptionModal) {

    closePrescriptionModal.addEventListener(
        "click",
        closeNewPrescriptionModal
    );

}


/* Cancel button */

if (cancelPrescriptionModal) {

    cancelPrescriptionModal.addEventListener(
        "click",
        closeNewPrescriptionModal
    );

}


/* Overlay */

if (prescriptionModalOverlay) {

    prescriptionModalOverlay.addEventListener(
        "click",
        closeNewPrescriptionModal
    );

}


/* Escape key */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            prescriptionModal &&
            prescriptionModal.style.display !== "none"
        ) {

            closeNewPrescriptionModal();

        }

    }
);


/* =====================================================
   ADD MEDICINE
===================================================== */

const addMedicineButton =
    document.getElementById(
        "addPrescriptionMedicine"
    );

const medicineList =
    document.getElementById(
        "prescriptionMedicineList"
    );


if (
    addMedicineButton &&
    medicineList
) {

    addMedicineButton.addEventListener(
        "click",
        function () {

            const firstRow =
                medicineList.querySelector(
                    "[data-medicine-row]"
                );


            if (!firstRow) {
                return;
            }


            const newRow =
                firstRow.cloneNode(true);


            newRow
                .querySelectorAll("input")
                .forEach(
                    function (input) {

                        input.value = "";

                    }
                );


            newRow
                .querySelectorAll("select")
                .forEach(
                    function (select) {

                        select.selectedIndex = 0;

                    }
                );


            medicineList.appendChild(
                newRow
            );

        }
    );

}


/* =====================================================
   REMOVE MEDICINE
===================================================== */

if (medicineList) {

    medicineList.addEventListener(
        "click",
        function (event) {

            const removeButton =
                event.target.closest(
                    ".remove-medicine-btn"
                );


            if (!removeButton) {
                return;
            }


            const rows =
                medicineList.querySelectorAll(
                    "[data-medicine-row]"
                );


            if (rows.length <= 1) {

                showNotification(
                    "At least one medicine is required.",
                    "error"
                );

                return;

            }


            const row =
                removeButton.closest(
                    "[data-medicine-row]"
                );


            if (row) {

                row.remove();

            }

        }
    );

}


/* =====================================================
   SAVE PRESCRIPTION
===================================================== */

const savePrescriptionButton =
    document.getElementById(
        "savePrescription"
    );


if (savePrescriptionButton) {

    savePrescriptionButton.addEventListener(
        "click",
        function () {

            const patient =
                document.getElementById(
                    "prescriptionPatient"
                );

            const doctor =
                document.getElementById(
                    "prescriptionDoctor"
                );

            const date =
                document.getElementById(
                    "prescriptionDate"
                );


            if (
                !patient ||
                !patient.value
            ) {

                showNotification(
                    "Please select a patient.",
                    "error"
                );

                return;

            }


            if (
                !doctor ||
                !doctor.value
            ) {

                showNotification(
                    "Please select a doctor.",
                    "error"
                );

                return;

            }


            if (
                !date ||
                !date.value
            ) {

                showNotification(
                    "Please select the prescription date.",
                    "error"
                );

                return;

            }


            const medicineRows =
                document.querySelectorAll(
                    "[data-medicine-row]"
                );


            let validMedicine =
                false;


            medicineRows.forEach(
                function (row) {

                    const medicine =
                        row.querySelector(
                            ".prescription-medicine-select"
                        );


                    if (
                        medicine &&
                        medicine.value
                    ) {

                        validMedicine = true;

                    }

                }
            );


            if (!validMedicine) {

                showNotification(
                    "Please add at least one medicine.",
                    "error"
                );

                return;

            }


            showNotification(
                "Prescription saved successfully.",
                "success"
            );


            setTimeout(
                function () {

                    closeNewPrescriptionModal();

                },
                800
            );

        }
    );

}

    /* =====================================================
       INITIAL FILTER
    ===================================================== */

    filterPrescriptions();

});