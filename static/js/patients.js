/* ==========================================================
   PATIENT CARE
   AI SMART PHARMACY
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const searchInput =
        document.getElementById("patientSearch");

    const statusFilter =
        document.getElementById("patientStatus");

    const ageGroupFilter =
        document.getElementById("patientAgeGroup");

    const tableBody =
        document.getElementById("patientsTableBody");

    const prevButton =
        document.getElementById("patientPrev");

    const nextButton =
        document.getElementById("patientNext");

    const exportButton =
        document.getElementById("exportPatients");

    const showingPatients =
        document.getElementById("showingPatients");

    const endingPatients =
        document.getElementById("endingPatients");

    const totalPatientResults =
        document.getElementById("totalPatientResults");


    /* ======================================================
       CONFIGURATION
    ====================================================== */

    const rowsPerPage = 10;

    let currentPage = 1;

    let filteredRows = [];


    /* ======================================================
       GET ALL PATIENT ROWS
    ====================================================== */

    function getPatientRows() {

        if (!tableBody) {

            return [];

        }

        return Array.from(
            tableBody.querySelectorAll(
                ".patient-row"
            )
        );

    }


    /* ======================================================
       AGE GROUP
    ====================================================== */

    function getAgeGroup(age) {

        age = Number(age);

        if (age < 18) {

            return "Child";

        }

        if (age >= 60) {

            return "Senior";

        }

        return "Adult";

    }


    /* ======================================================
       FILTER PATIENTS
    ====================================================== */

    function filterPatients() {

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        const status =
            statusFilter
                ? statusFilter.value
                : "";

        const ageGroup =
            ageGroupFilter
                ? ageGroupFilter.value
                : "";


        const rows =
            getPatientRows();


        filteredRows =
            rows.filter(
                function (row) {

                    const name =
                        (
                            row.dataset.name
                            || ""
                        ).toLowerCase();

                    const patientId =
                        (
                            row.dataset.id
                            || ""
                        ).toLowerCase();

                    const phone =
                        (
                            row.dataset.phone
                            || ""
                        ).toLowerCase();

                    const patientStatus =
                        row.dataset.status
                        || "";

                    const age =
                        row.dataset.age
                        || "";


                    const matchesSearch =
                        !search ||
                        name.includes(search) ||
                        patientId.includes(search) ||
                        phone.includes(search);


                    const matchesStatus =
                        !status ||
                        patientStatus === status;


                    const matchesAge =
                        !ageGroup ||
                        getAgeGroup(age)
                        === ageGroup;


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesAge
                    );

                }
            );


        currentPage = 1;

        renderPatients();

    }


    /* ======================================================
       RENDER PATIENTS
    ====================================================== */

    function renderPatients() {

        const rows =
            getPatientRows();


        rows.forEach(
            function (row) {

                row.style.display =
                    "none";

            }
        );


        const start =
            (
                currentPage - 1
            ) * rowsPerPage;


        const end =
            start +
            rowsPerPage;


        const visibleRows =
            filteredRows.slice(
                start,
                end
            );


        visibleRows.forEach(
            function (row) {

                row.style.display =
                    "";

            }
        );


        updatePagination(
            start,
            visibleRows.length
        );


        if (
            filteredRows.length === 0
        ) {

            showEmptyState();

        } else {

            removeEmptyState();

        }

    }


    /* ======================================================
       EMPTY STATE
    ====================================================== */

    function showEmptyState() {

        removeEmptyState();


        if (!tableBody) {

            return;

        }


        const emptyRow =
            document.createElement(
                "tr"
            );


        emptyRow.id =
            "patientEmptyRow";


        emptyRow.innerHTML = `

            <td
                colspan="7"
                class="patient-empty-state">

                <i class="fa-solid fa-user-slash"></i>

                <p>
                    No patients found
                </p>

            </td>

        `;


        tableBody.appendChild(
            emptyRow
        );

    }


    function removeEmptyState() {

        const emptyRow =
            document.getElementById(
                "patientEmptyRow"
            );


        if (emptyRow) {

            emptyRow.remove();

        }

    }


    /* ======================================================
       PAGINATION
    ====================================================== */

    function updatePagination(
        start,
        visibleCount
    ) {

        const total =
            filteredRows.length;


        if (showingPatients) {

            showingPatients.textContent =
                total === 0
                    ? 0
                    : start + 1;

        }


        if (endingPatients) {

            endingPatients.textContent =
                start + visibleCount;

        }


        if (totalPatientResults) {

            totalPatientResults.textContent =
                total;

        }


        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    total /
                    rowsPerPage
                )
            );


        if (prevButton) {

            prevButton.disabled =
                currentPage <= 1;

        }


        if (nextButton) {

            nextButton.disabled =
                currentPage >=
                totalPages;

        }

    }


    /* ======================================================
       PREVIOUS PAGE
    ====================================================== */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                if (currentPage > 1) {

                    currentPage--;

                    renderPatients();

                }

            }
        );

    }


    /* ======================================================
       NEXT PAGE
    ====================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                const totalPages =
                    Math.max(
                        1,
                        Math.ceil(
                            filteredRows.length /
                            rowsPerPage
                        )
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderPatients();

                }

            }
        );

    }


    /* ======================================================
       SEARCH
    ====================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterPatients
        );

    }


    /* ======================================================
       STATUS FILTER
    ====================================================== */

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterPatients
        );

    }


    /* ======================================================
       AGE GROUP FILTER
    ====================================================== */

    if (ageGroupFilter) {

        ageGroupFilter.addEventListener(
            "change",
            filterPatients
        );

    }


    /* ======================================================
       INITIAL FILTER
    ====================================================== */

    filteredRows =
        getPatientRows();


    renderPatients();

});



/* ==========================================================
   PATIENT DATA FROM FLASK
========================================================== */

const patientProfiles = {};


if (Array.isArray(window.patientData)) {

    window.patientData.forEach(
        function (patient) {

            patientProfiles[
                String(patient.id)
            ] = patient;

        }
    );

}


/* ==========================================================
   PROFILE ELEMENTS
========================================================== */

const profileName =
    document.getElementById("profileName");

const profileId =
    document.getElementById("profileId");

const profileDob =
    document.getElementById("profileDob");

const profileGender =
    document.getElementById("profileGender");

const profilePhone =
    document.getElementById("profilePhone");

const profileEmail =
    document.getElementById("profileEmail");

const profileAddress =
    document.getElementById("profileAddress");

const profileAvatar =
    document.getElementById("profileAvatar");


/* ==========================================================
   VIEW PATIENT MODAL
========================================================== */

const viewPatientModal =
    document.getElementById(
        "viewPatientModal"
    );


/* ==========================================================
   GET PATIENT
========================================================== */

function getPatientById(
    patientId
) {

    return patientProfiles[
        String(patientId)
    ];

}


/* ==========================================================
   LOAD RIGHT-SIDE PROFILE
========================================================== */

function loadPatientProfile(
    patientId
) {

    const patient =
        getPatientById(
            patientId
        );


    if (!patient) {

        console.warn(
            "Patient not found:",
            patientId
        );

        return null;

    }


    if (profileName) {

        profileName.textContent =
            patient.name || "--";

    }


    if (profileId) {

        profileId.textContent =
            patient.id || "--";

    }


    if (profileDob) {

        profileDob.textContent =
            patient.date_of_birth
                ? `${patient.date_of_birth} (${patient.age || "--"} Years)`
                : `${patient.age || "--"} Years`;

    }


    if (profileGender) {

        profileGender.textContent =
            patient.gender || "--";

    }


    if (profilePhone) {

        profilePhone.textContent =
            patient.phone || "--";

    }


    if (profileEmail) {

        profileEmail.textContent =
            patient.email || "--";

    }


    if (profileAddress) {

        profileAddress.textContent =
            patient.address || "--";

    }


    if (profileAvatar) {

        profileAvatar.classList.remove(
            "avatar-blue",
            "avatar-pink",
            "avatar-yellow"
        );


        if (
            patient.gender === "Female"
        ) {

            profileAvatar.classList.add(
                "avatar-pink"
            );

        }

        else if (
            patient.gender === "Other"
        ) {

            profileAvatar.classList.add(
                "avatar-yellow"
            );

        }

        else {

            profileAvatar.classList.add(
                "avatar-blue"
            );

        }

    }


    if (typeof loadConsultations === "function") {

        loadConsultations(
            patientId
        );

    }


    return patient;

}


/* ==========================================================
   OPEN VIEW PATIENT
========================================================== */

function openPatientProfileModal(
    patientId
) {

    const patient =
        getPatientById(
            patientId
        );


    if (!patient) {

        console.warn(
            "Patient profile not found:",
            patientId
        );

        return;

    }


    const modal =
        document.getElementById(
            "viewPatientModal"
        );


    if (!modal) {

        console.error(
            "viewPatientModal does not exist."
        );

        return;

    }


    /* ------------------------------------------------------
       PROFILE
    ------------------------------------------------------ */

    const modalName =
        modal.querySelector(
            "[data-profile-name]"
        );

    const modalId =
        modal.querySelector(
            "[data-profile-id]"
        );

    const modalAge =
        modal.querySelector(
            "[data-profile-age]"
        );

    const modalGender =
        modal.querySelector(
            "[data-profile-gender]"
        );

    const modalPhone =
        modal.querySelector(
            "[data-profile-phone]"
        );

    const modalEmail =
        modal.querySelector(
            "[data-profile-email]"
        );

    const modalAddress =
        modal.querySelector(
            "[data-profile-address]"
        );


    if (modalName) {

        modalName.textContent =
            patient.name || "--";

    }


    if (modalId) {

        modalId.textContent =
            patient.id || "--";

    }


    if (modalAge) {

        modalAge.textContent =
            patient.date_of_birth
                ? `${patient.date_of_birth} (${patient.age || "--"} Years)`
                : `${patient.age || "--"} Years`;

    }


    if (modalGender) {

        modalGender.textContent =
            patient.gender || "--";

    }


    if (modalPhone) {

        modalPhone.textContent =
            patient.phone || "--";

    }


    if (modalEmail) {

        modalEmail.textContent =
            patient.email || "--";

    }


    if (modalAddress) {

        modalAddress.textContent =
            patient.address || "--";

    }


    /* ------------------------------------------------------
       STATUS
    ------------------------------------------------------ */

    const modalStatus =
        modal.querySelector(
            ".modal-profile-header .patient-status"
        );


    if (modalStatus) {

        const status =
            patient.status || "Active";


        modalStatus.textContent =
            status;


        modalStatus.classList.remove(
            "active",
            "inactive"
        );


        modalStatus.classList.add(
            status.toLowerCase() === "active"
                ? "active"
                : "inactive"
        );

    }


    /* ------------------------------------------------------
       HEALTH INFORMATION
    ------------------------------------------------------ */

    const healthBoxes =
        modal.querySelectorAll(
            ".health-info-box"
        );


    if (healthBoxes.length >= 4) {

        const height =
            Number(
                patient.height
            );

        const weight =
            Number(
                patient.weight
            );


        let bmi = "--";


        if (
            height > 0 &&
            weight > 0
        ) {

            const meters =
                height / 100;


            bmi =
                (
                    weight /
                    (
                        meters *
                        meters
                    )
                ).toFixed(1);

        }


        const healthValues = [

            patient.blood_group || "--",

            height > 0
                ? `${height} cm`
                : "--",

            weight > 0
                ? `${weight} kg`
                : "--",

            bmi

        ];


        healthBoxes.forEach(
            function (
                box,
                index
            ) {

                const value =
                    box.querySelector(
                        "strong"
                    );


                if (
                    value &&
                    healthValues[index] !== undefined
                ) {

                    value.textContent =
                        healthValues[index];

                }

            }
        );

    }


    /* ------------------------------------------------------
       MEDICAL HISTORY
    ------------------------------------------------------ */

    const historyList =
        modal.querySelector(
            ".medical-history-list"
        );


    if (historyList) {

        let html = "";


        if (patient.medical_history) {

            html += `

                <div class="medical-history-item">

                    <div class="history-icon">

                        <i class="fa-solid fa-pills"></i>

                    </div>

                    <div>

                        <strong>
                            ${escapePatientValue(
                                patient.medical_history
                            )}
                        </strong>

                        <p>
                            Medical History
                        </p>

                    </div>

                </div>

            `;

        }


        if (patient.allergies) {

            html += `

                <div class="medical-history-item">

                    <div class="history-icon">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                    </div>

                    <div>

                        <strong>
                            Allergies
                        </strong>

                        <p>
                            ${escapePatientValue(
                                patient.allergies
                            )}
                        </p>

                    </div>

                </div>

            `;

        }


        if (!html) {

            html = `

                <div class="medical-history-item">

                    <div class="history-icon">

                        <i class="fa-solid fa-circle-check"></i>

                    </div>

                    <div>

                        <strong>
                            No medical history recorded
                        </strong>

                        <p>
                            No known conditions or allergies
                        </p>

                    </div>

                </div>

            `;

        }


        historyList.innerHTML =
            html;

    }


    /* ------------------------------------------------------
       SAVE CURRENT PATIENT
    ------------------------------------------------------ */

    modal.dataset.patientId =
        String(
            patient.id
        );


    /* ------------------------------------------------------
       OPEN
    ------------------------------------------------------ */

    modal.classList.add(
        "show"
    );


    modal.style.setProperty(
        "display",
        "flex",
        "important"
    );


    document.body.style.overflow =
        "hidden";

}


/* ==========================================================
   TABLE ROW CLICK
========================================================== */

document.addEventListener(
    "click",
    function (event) {

        const row =
            event.target.closest(
                ".patient-row"
            );


        if (!row) {

            return;

        }


        if (
            event.target.closest(
                ".patient-action-btn"
            )
        ) {

            return;

        }


        const patientId =
            row.dataset.id;


        loadPatientProfile(
            patientId
        );


        document
            .querySelectorAll(
                ".patient-row"
            )
            .forEach(
                function (item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


        row.classList.add(
            "selected"
        );

    }
);


/* ==========================================================
   VIEW BUTTON
========================================================== */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".view-patient"
            );


        if (!button) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const patientId =
            button.getAttribute(
                "data-patient-id"
            );


        if (!patientId) {

            console.error(
                "data-patient-id is missing."
            );

            return;

        }


        const row =
            button.closest(
                ".patient-row"
            );


        if (row) {

            document
                .querySelectorAll(
                    ".patient-row"
                )
                .forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


            row.classList.add(
                "selected"
            );

        }


        openPatientProfileModal(
            patientId
        );

    }
);


/* ==========================================================
   DEFAULT PROFILE
========================================================== */

if (
    patientProfiles.P1001
) {

    loadPatientProfile(
        "P1001"
    );

}


/* ==========================================================
   CLOSE VIEW PATIENT
========================================================== */

function closePatientModal() {

    const modal =
        document.getElementById(
            "viewPatientModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "show"
    );


    modal.style.setProperty(
        "display",
        "none",
        "important"
    );


    document.body.style.overflow =
        "";

}


/* ==========================================================
   CLOSE BUTTON
========================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.closest(
                ".close-patient-modal"
            )
        ) {

            event.preventDefault();

            closePatientModal();

        }

    }
);


/* ==========================================================
   VIEW MODAL OVERLAY
========================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "viewPatientModal"
            );


        if (
            modal &&
            event.target.classList.contains(
                "patient-modal-overlay"
            )
        ) {

            closePatientModal();

        }

    }
);


/* ==========================================================
   ESCAPE
========================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closePatientModal();

        }

    }
);


/* ==========================================================
   HTML ESCAPE
========================================================== */

function escapePatientValue(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* ==========================================================
   VIEW ALL CONSULTATIONS
========================================================== */

const viewAllConsultations =
    document.getElementById(
        "viewAllConsultations"
    );


if (viewAllConsultations) {

    viewAllConsultations.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const patientId =
                document.getElementById(
                    "profileId"
                )?.textContent.trim();


            if (!patientId) {

                return;

            }


            const consultations =
                consultationData[
                    patientId
                ] || [];


            console.log(
                "All consultations:",
                consultations
            );

        }
    );

}



/* ==========================================================
   VIEW HISTORY
========================================================== */

const viewHistoryButton =
    document.getElementById(
        "viewHistory"
    );


if (viewHistoryButton) {

    viewHistoryButton.addEventListener(
        "click",
        function () {

            const patientId =
                document.getElementById(
                    "profileId"
                )?.textContent.trim();


            if (!patientId) {

                return;

            }


            const consultations =
                consultationData[
                    patientId
                ] || [];


            console.log(
                "Patient history:",
                patientId,
                consultations
            );

        }
    );

}



/* ==========================================================
   ADD PATIENT MODAL
========================================================== */

const addPatientButton =
    document.getElementById(
        "openAddPatient"
    );

const addPatientModal =
    document.getElementById(
        "addPatientModal"
    );

const addPatientForm =
    document.getElementById(
        "addPatientForm"
    );


/* ==========================================================
   OPEN ADD PATIENT
========================================================== */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "#openAddPatient"
            );


        if (!button) {

            return;

        }


        event.preventDefault();


        const modal =
            document.getElementById(
                "addPatientModal"
            );


        if (!modal) {

            console.error(
                "addPatientModal does not exist."
            );

            return;

        }


        modal.classList.add(
            "show"
        );


        modal.style.setProperty(
            "display",
            "flex",
            "important"
        );


        document.body.style.overflow =
            "hidden";

    }
);


/* ==========================================================
   CLOSE ADD PATIENT
========================================================== */

function closeAddPatientModal() {

    const modal =
        document.getElementById(
            "addPatientModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "show"
    );


    modal.style.setProperty(
        "display",
        "none",
        "important"
    );


    document.body.style.overflow =
        "";

}


/* ==========================================================
   CLOSE BUTTON
========================================================== */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".close-add-patient-modal"
            );


        if (!button) {

            return;

        }


        event.preventDefault();


        closeAddPatientModal();

    }
);


/* ==========================================================
   ADD PATIENT OVERLAY
========================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "patient-modal-overlay"
            )
            &&
            event.target.closest(
                "#addPatientModal"
            )
        ) {

            closeAddPatientModal();

        }

    }
);


/* ==========================================================
   ESCAPE
========================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            const modal =
                document.getElementById(
                    "addPatientModal"
                );


            if (
                modal &&
                (
                    modal.style.display ===
                        "flex"
                    ||
                    modal.classList.contains(
                        "show"
                    )
                )
            ) {

                closeAddPatientModal();

            }

        }

    }
);


/* ==========================================================
   PHONE VALIDATION
========================================================== */

const patientPhone =
    document.getElementById(
        "patientPhone"
    );


if (patientPhone) {

    patientPhone.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(
                        /[^0-9]/g,
                        ""
                    )
                    .slice(
                        0,
                        10
                    );

        }
    );

}


/* ==========================================================
   FORM SUBMIT
========================================================== */

if (addPatientForm) {

    addPatientForm.addEventListener(
        "submit",
        function () {

            const submitButton =
                addPatientForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.classList.add(
                    "loading"
                );


                submitButton.disabled =
                    true;


                submitButton.innerHTML = `

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Adding Patient...

                `;

            }

        }
    );

}



/* ==========================================================
   PREVENT BACKGROUND SCROLL
========================================================== */

function updateBodyScroll() {

    const addVisible =
        addPatientModal &&
        addPatientModal.style.display ===
        "flex";


    const viewModal =
        document.getElementById(
            "viewPatientModal"
        );


    const viewVisible =
        viewModal &&
        viewModal.style.display ===
        "flex";


    if (
        addVisible ||
        viewVisible
    ) {

        document.body.style.overflow =
            "hidden";

    } else {

        document.body.style.overflow =
            "";

    }

}