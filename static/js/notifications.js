/*
=========================================================
AI SMART PHARMACY
Notifications Module
JavaScript
=========================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const tableBody =
        document.getElementById(
            "notificationsTableBody"
        );

    const typeFilter =
        document.getElementById(
            "notificationTypeFilter"
        );

    const statusFilter =
        document.getElementById(
            "notificationStatusFilter"
        );

    const dateButton =
        document.getElementById(
            "notificationDateBtn"
        );

    const dateInput =
        document.getElementById(
            "notificationDateFilter"
        );

    const markAllButton =
        document.getElementById(
            "markAllReadBtn"
        );

    const saveSettingsButton =
        document.getElementById(
            "saveNotificationSettings"
        );

    const detailsModal =
        document.getElementById(
            "notificationDetailsModal"
        );

    const detailsContent =
        document.getElementById(
            "notificationDetailsContent"
        );

    const closeDetailsButton =
        document.getElementById(
            "closeNotificationDetails"
        );

    const closeDetailsFooterButton =
        document.getElementById(
            "closeNotificationDetailsBtn"
        );

    const detailsOverlay =
        document.querySelector(
            ".notification-details-overlay"
        );


    /* =====================================================
       UTILITY
    ===================================================== */

    function showNotification(
        message,
        type = "success"
    ) {

        /*
         * Use the existing global notification system
         * if your project already has one.
         */

        if (
            typeof window.showNotification ===
            "function"
        ) {

            window.showNotification(
                message,
                type
            );

            return;
        }


        /*
         * Fallback notification.
         */

        const notification =
            document.createElement("div");

        notification.className =
            "notification-js-message";


        notification.textContent =
            message;


        notification.style.position =
            "fixed";

        notification.style.top =
            "85px";

        notification.style.right =
            "25px";

        notification.style.zIndex =
            "20000";

        notification.style.padding =
            "11px 17px";

        notification.style.borderRadius =
            "7px";

        notification.style.background =
            type === "error"
                ? "#fee4e4"
                : "#e5f8ed";

        notification.style.color =
            type === "error"
                ? "#c62828"
                : "#128653";

        notification.style.border =
            type === "error"
                ? "1px solid #f3bcbc"
                : "1px solid #bde8cf";

        notification.style.fontSize =
            "11px";

        notification.style.fontWeight =
            "600";

        notification.style.boxShadow =
            "0 8px 25px rgba(0,0,0,0.12)";


        document.body.appendChild(
            notification
        );


        setTimeout(
            function () {

                notification.remove();

            },
            2500
        );

    }


    /* =====================================================
       GET CURRENT ROWS
    ===================================================== */

    function getRows() {

        if (!tableBody) {
            return [];
        }

        return Array.from(
            tableBody.querySelectorAll(
                ".notification-row"
            )
        );

    }


    /* =====================================================
       FILTER NOTIFICATIONS
    ===================================================== */

    function filterNotifications(
        selectedTab = "all"
    ) {

        const rows =
            getRows();

        const selectedType =
            typeFilter
                ? typeFilter.value
                : "all";

        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";

        const selectedDate =
            dateInput
                ? dateInput.value
                : "";


        let visibleRows = [];


        rows.forEach(
            function (row) {

                const rowType =
                    row.dataset.type || "";

                const rowPriority =
                    row.dataset.priority || "";

                const rowStatus =
                    row.dataset.status || "";

                const rowDate =
                    row.querySelector(
                        ".notification-date strong"
                    );


                let dateMatches = true;


                /*
                 * Date filtering.
                 *
                 * The displayed date is in the format:
                 *
                 * 31 Jul 2026
                 *
                 * Convert it to a comparable date.
                 */

                if (
                    selectedDate &&
                    rowDate
                ) {

                    const selected =
                        new Date(
                            selectedDate
                        );


                    const displayedDate =
                        new Date(
                            rowDate.textContent.trim()
                        );


                    if (
                        !isNaN(
                            selected.getTime()
                        ) &&
                        !isNaN(
                            displayedDate.getTime()
                        )
                    ) {

                        dateMatches =
                            selected.toDateString() ===
                            displayedDate.toDateString();

                    }

                }


                let tabMatches = true;


                if (
                    selectedTab ===
                    "unread"
                ) {

                    tabMatches =
                        rowStatus ===
                        "Unread";

                }


                if (
                    selectedTab ===
                    "high"
                ) {

                    tabMatches =
                        rowPriority ===
                        "High";

                }


                const typeMatches =
                    selectedType === "all" ||
                    rowType === selectedType;


                const statusMatches =
                    selectedStatus === "all" ||
                    rowStatus === selectedStatus;


                const visible =
                    tabMatches &&
                    typeMatches &&
                    statusMatches &&
                    dateMatches;


                if (visible) {

                    row.style.display =
                        "";

                    visibleRows.push(
                        row
                    );

                } else {

                    row.style.display =
                        "none";

                }

            }
        );


        updateVisibleCount(
            visibleRows.length
        );

    }


    /* =====================================================
       UPDATE COUNT
    ===================================================== */

    function updateVisibleCount(
        count
    ) {

        const startElement =
            document.getElementById(
                "visibleNotificationCount"
            );

        const endElement =
            document.getElementById(
                "visibleNotificationEnd"
            );


        if (startElement) {

            startElement.textContent =
                count > 0
                    ? "1"
                    : "0";

        }


        if (endElement) {

            endElement.textContent =
                count;

        }

    }


    /* =====================================================
       TAB BUTTONS
    ===================================================== */

    const tabButtons =
        document.querySelectorAll(
            ".notification-tab"
        );


    tabButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    tabButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const tab =
                        button.dataset.tab ||
                        "all";


                    filterNotifications(
                        tab
                    );

                }
            );

        }
    );


    /* =====================================================
       TYPE FILTER
    ===================================================== */

    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            function () {

                const activeTab =
                    document.querySelector(
                        ".notification-tab.active"
                    );


                filterNotifications(
                    activeTab
                        ? activeTab.dataset.tab
                        : "all"
                );

            }
        );

    }


    /* =====================================================
       STATUS FILTER
    ===================================================== */

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function () {

                const activeTab =
                    document.querySelector(
                        ".notification-tab.active"
                    );


                filterNotifications(
                    activeTab
                        ? activeTab.dataset.tab
                        : "all"
                );

            }
        );

    }


    /* =====================================================
       DATE PICKER
    ===================================================== */

    if (dateButton && dateInput) {

        dateButton.addEventListener(
            "click",
            function () {

                if (
                    typeof dateInput.showPicker ===
                    "function"
                ) {

                    dateInput.showPicker();

                } else {

                    dateInput.click();

                }

            }
        );


        dateInput.addEventListener(
            "change",
            function () {

                const selectedDate =
                    dateInput.value;


                const dateText =
                    dateButton.querySelector(
                        "span"
                    );


                if (dateText) {

                    if (selectedDate) {

                        const date =
                            new Date(
                                selectedDate +
                                "T00:00:00"
                            );


                        dateText.textContent =
                            date.toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }
                            );

                    } else {

                        dateText.textContent =
                            "Select Date";

                    }

                }


                const activeTab =
                    document.querySelector(
                        ".notification-tab.active"
                    );


                filterNotifications(
                    activeTab
                        ? activeTab.dataset.tab
                        : "all"
                );

            }
        );

    }


    /* =====================================================
       MARK ALL AS READ
    ===================================================== */

    if (markAllButton) {

        markAllButton.addEventListener(
            "click",
            async function () {

                try {

                    markAllButton.disabled =
                        true;


                    const response =
                        await fetch(
                            "/notifications/mark-all-read",
                            {
                                method: "POST"
                            }
                        );


                    const data =
                        await response.json();


                    if (!data.success) {

                        throw new Error(
                            data.message ||
                            "Unable to update notifications."
                        );

                    }


                    /*
                     * Update every visible row.
                     */

                    getRows().forEach(
                        function (row) {

                            row.dataset.status =
                                "Read";

                            row.classList.remove(
                                "notification-unread"
                            );


                            const statusBadge =
                                row.querySelector(
                                    ".notification-status-badge"
                                );


                            if (statusBadge) {

                                statusBadge.textContent =
                                    "Read";

                                statusBadge.classList.remove(
                                    "status-unread"
                                );

                                statusBadge.classList.add(
                                    "status-read"
                                );

                            }

                        }
                    );


                    showNotification(
                        "All notifications marked as read.",
                        "success"
                    );


                    /*
                     * Re-run current filter.
                     */

                    const activeTab =
                        document.querySelector(
                            ".notification-tab.active"
                        );


                    filterNotifications(
                        activeTab
                            ? activeTab.dataset.tab
                            : "all"
                    );

                } catch (error) {

                    console.error(
                        "Mark all as read error:",
                        error
                    );


                    showNotification(
                        "Unable to mark notifications as read.",
                        "error"
                    );

                } finally {

                    markAllButton.disabled =
                        false;

                }

            }
        );

    }


    /* =====================================================
       MARK SINGLE NOTIFICATION AS READ
    ===================================================== */

    async function markSingleAsRead(
        notificationId,
        row
    ) {

        try {

            const response =
                await fetch(
                    `/notifications/${notificationId}/read`,
                    {
                        method: "POST"
                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to mark notification as read."
                );

            }


            if (row) {

                row.dataset.status =
                    "Read";

                row.classList.remove(
                    "notification-unread"
                );


                const statusBadge =
                    row.querySelector(
                        ".notification-status-badge"
                    );


                if (statusBadge) {

                    statusBadge.textContent =
                        "Read";

                    statusBadge.classList.remove(
                        "status-unread"
                    );

                    statusBadge.classList.add(
                        "status-read"
                    );

                }

            }


            return true;

        } catch (error) {

            console.error(
                "Mark notification read error:",
                error
            );

            showNotification(
                "Unable to update notification.",
                "error"
            );

            return false;

        }

    }


    /* =====================================================
       SHOW NOTIFICATION DETAILS
    ===================================================== */

    function openDetailsModal(
        notification
    ) {

        if (
            !detailsModal ||
            !detailsContent ||
            !notification
        ) {

            return;

        }


        detailsContent.innerHTML = `

            <div style="
                display:flex;
                align-items:center;
                gap:12px;
                margin-bottom:18px;
            ">

                <div style="
                    width:42px;
                    height:42px;
                    border-radius:8px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#f0eaff;
                    color:#5525d7;
                    font-size:16px;
                ">

                    <i class="fa-solid ${notification.icon}"></i>

                </div>

                <div>

                    <strong style="
                        display:block;
                        color:#101828;
                        font-size:14px;
                        margin-bottom:3px;
                    ">
                        ${escapeHtml(notification.title)}
                    </strong>

                    <span style="
                        color:#667085;
                        font-size:9px;
                    ">
                        ${escapeHtml(notification.date)}
                        &nbsp; ${escapeHtml(notification.time)}
                    </span>

                </div>

            </div>


            <div style="
                margin-bottom:15px;
                padding:14px;
                border:1px solid #edf0f4;
                border-radius:7px;
                background:#fbfcfe;
            ">

                <p style="
                    margin:0;
                    color:#475467;
                    font-size:10px;
                    line-height:1.6;
                ">
                    ${escapeHtml(notification.description)}
                </p>

            </div>


            <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:10px;
            ">

                <div style="
                    padding:11px;
                    border:1px solid #edf0f4;
                    border-radius:6px;
                ">

                    <span style="
                        display:block;
                        color:#98a2b3;
                        font-size:8px;
                        margin-bottom:4px;
                    ">
                        Type
                    </span>

                    <strong style="
                        color:#344054;
                        font-size:10px;
                    ">
                        ${escapeHtml(notification.type)}
                    </strong>

                </div>


                <div style="
                    padding:11px;
                    border:1px solid #edf0f4;
                    border-radius:6px;
                ">

                    <span style="
                        display:block;
                        color:#98a2b3;
                        font-size:8px;
                        margin-bottom:4px;
                    ">
                        Priority
                    </span>

                    <strong style="
                        color:#344054;
                        font-size:10px;
                    ">
                        ${escapeHtml(notification.priority)}
                    </strong>

                </div>


                <div style="
                    padding:11px;
                    border:1px solid #edf0f4;
                    border-radius:6px;
                ">

                    <span style="
                        display:block;
                        color:#98a2b3;
                        font-size:8px;
                        margin-bottom:4px;
                    ">
                        Status
                    </span>

                    <strong style="
                        color:#344054;
                        font-size:10px;
                    ">
                        ${escapeHtml(notification.status)}
                    </strong>

                </div>

            </div>

        `;


        detailsModal.style.display =
            "block";

        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE DETAILS MODAL
    ===================================================== */

    function closeDetailsModal() {

        if (!detailsModal) {
            return;
        }

        detailsModal.style.display =
            "none";

        document.body.style.overflow =
            "";

    }


    if (closeDetailsButton) {

        closeDetailsButton.addEventListener(
            "click",
            closeDetailsModal
        );

    }


    if (closeDetailsFooterButton) {

        closeDetailsFooterButton.addEventListener(
            "click",
            closeDetailsModal
        );

    }


    if (detailsOverlay) {

        detailsOverlay.addEventListener(
            "click",
            closeDetailsModal
        );

    }


    /* =====================================================
       VIEW NOTIFICATION
    ===================================================== */

    if (tableBody) {

        tableBody.addEventListener(
            "click",
            async function (event) {

                const viewButton =
                    event.target.closest(
                        ".view-notification-btn"
                    );


                if (viewButton) {

                    const id =
                        viewButton.dataset.id;


                    const row =
                        viewButton.closest(
                            ".notification-row"
                        );


                    const wasUnread =
                        row &&
                        row.dataset.status ===
                        "Unread";


                    /*
                     * Mark unread notification as read.
                     */

                    if (wasUnread) {

                        await markSingleAsRead(
                            id,
                            row
                        );

                    }


                    try {

                        const response =
                            await fetch(
                                `/notifications/${id}`
                            );


                        const data =
                            await response.json();


                        if (!data.success) {

                            throw new Error(
                                data.message ||
                                "Notification not found."
                            );

                        }


                        openDetailsModal(
                            data.notification
                        );

                    } catch (error) {

                        console.error(
                            "View notification error:",
                            error
                        );


                        showNotification(
                            "Unable to load notification details.",
                            "error"
                        );

                    }


                    return;

                }


                /* =================================================
                   DELETE NOTIFICATION
                ================================================== */

                const deleteButton =
                    event.target.closest(
                        ".delete-notification-btn"
                    );


                if (deleteButton) {

                    const id =
                        deleteButton.dataset.id;


                    const confirmed =
                        window.confirm(
                            "Are you sure you want to delete this notification?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    try {

                        const response =
                            await fetch(
                                `/notifications/${id}/delete`,
                                {
                                    method: "POST"
                                }
                            );


                        const data =
                            await response.json();


                        if (!data.success) {

                            throw new Error(
                                data.message ||
                                "Unable to delete notification."
                            );

                        }


                        const row =
                            deleteButton.closest(
                                ".notification-row"
                            );


                        if (row) {

                            row.remove();

                        }


                        const activeTab =
                            document.querySelector(
                                ".notification-tab.active"
                            );


                        filterNotifications(
                            activeTab
                                ? activeTab.dataset.tab
                                : "all"
                        );


                        showNotification(
                            "Notification deleted successfully.",
                            "success"
                        );

                    } catch (error) {

                        console.error(
                            "Delete notification error:",
                            error
                        );


                        showNotification(
                            "Unable to delete notification.",
                            "error"
                        );

                    }

                }

            }
        );

    }


    /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    if (saveSettingsButton) {

        saveSettingsButton.addEventListener(
            "click",
            async function () {

                const switches =
                    document.querySelectorAll(
                        ".notification-switch input[data-setting]"
                    );


                const settings = {};


                switches.forEach(
                    function (input) {

                        settings[
                            input.dataset.setting
                        ] = input.checked;

                    }
                );


                try {

                    saveSettingsButton.disabled =
                        true;


                    const response =
                        await fetch(
                            "/notifications/settings",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        settings
                                    )
                            }
                        );


                    const data =
                        await response.json();


                    if (!data.success) {

                        throw new Error(
                            data.message ||
                            "Unable to save preferences."
                        );

                    }


                    showNotification(
                        "Notification preferences saved.",
                        "success"
                    );

                } catch (error) {

                    console.error(
                        "Settings error:",
                        error
                    );


                    showNotification(
                        "Unable to save notification preferences.",
                        "error"
                    );

                } finally {

                    saveSettingsButton.disabled =
                        false;

                }

            }
        );

    }


    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginationButtons =
        document.querySelectorAll(
            ".pagination-btn"
        );


    paginationButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    /*
                     * This is visual pagination for the
                     * current demo data.
                     */

                    if (
                        button.id ===
                        "previousNotificationPage"
                    ) {

                        showNotification(
                            "Previous page selected.",
                            "success"
                        );

                        return;

                    }


                    if (
                        button.id ===
                        "nextNotificationPage"
                    ) {

                        showNotification(
                            "Next page selected.",
                            "success"
                        );

                        return;

                    }


                    paginationButtons.forEach(
                        function (item) {

                            if (
                                item.id !==
                                "previousNotificationPage" &&
                                item.id !==
                                "nextNotificationPage"
                            ) {

                                item.classList.remove(
                                    "active"
                                );

                            }

                        }
                    );


                    button.classList.add(
                        "active"
                    );

                }
            );

        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeDetailsModal();

            }

        }
    );


    /* =====================================================
       HTML ESCAPE
    ===================================================== */

    function escapeHtml(
        value
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


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


    /* =====================================================
       INITIAL FILTER
    ===================================================== */

    filterNotifications("all");

});