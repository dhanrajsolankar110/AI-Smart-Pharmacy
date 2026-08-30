/* =========================================================
   AI SMART PHARMACY
   MODULE 9 — SETTINGS JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SETTINGS MENU
       ===================================================== */

    const menuItems = document.querySelectorAll(".settings-menu-item");
    const settingsSections = document.querySelectorAll(
        "[data-settings-section]"
    );

    function showSettingsSection(sectionName) {

        settingsSections.forEach(function (section) {

            if (section.dataset.settingsSection === sectionName) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }

        });

        menuItems.forEach(function (item) {

            if (item.dataset.section === sectionName) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }

        });
    }

    menuItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const sectionName = this.dataset.section;

            showSettingsSection(sectionName);

        });

    });

    /*
     * Show Profile Settings when page loads.
     */
    showSettingsSection("profile");


    /* =====================================================
       SAVE PROFILE
       ===================================================== */

    const saveProfileBtn =
        document.getElementById("saveProfileBtn");

    if (saveProfileBtn) {

        saveProfileBtn.addEventListener("click", function () {

            const fullName =
                document.getElementById("fullName")?.value.trim();

            const email =
                document.getElementById("emailAddress")?.value.trim();

            const phone =
                document.getElementById("phoneNumber")?.value.trim();

            const username =
                document.getElementById("username")?.value.trim();

            if (!fullName || !email || !phone || !username) {

                showSettingsMessage(
                    "Please fill in all required profile fields.",
                    "warning"
                );

                return;
            }

            showSettingsMessage(
                "Profile changes saved successfully.",
                "success"
            );

        });

    }


    /* =====================================================
       PASSWORD VISIBILITY
       ===================================================== */

    const passwordEyes =
        document.querySelectorAll(".password-eye");

    passwordEyes.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId =
                this.dataset.target;

            const input =
                document.getElementById(targetId);

            const icon =
                this.querySelector("i");

            if (!input) {
                return;
            }

            if (input.type === "password") {

                input.type = "text";

                if (icon) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }

            } else {

                input.type = "password";

                if (icon) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }

            }

        });

    });


    /* =====================================================
       UPDATE PASSWORD MODAL
       ===================================================== */

    const updatePasswordBtn =
        document.getElementById("updatePasswordBtn");

    const passwordConfirmModal =
        document.getElementById("passwordConfirmModal");

    const closePasswordModal =
        document.getElementById("closePasswordModal");

    const cancelPasswordModal =
        document.getElementById("cancelPasswordModal");

    const confirmPasswordUpdate =
        document.getElementById("confirmPasswordUpdate");


    function openPasswordModal() {

        if (!passwordConfirmModal) {
            return;
        }

        passwordConfirmModal.style.display = "block";

        document.body.style.overflow = "hidden";
    }


    function closePasswordConfirmation() {

        if (!passwordConfirmModal) {
            return;
        }

        passwordConfirmModal.style.display = "none";

        document.body.style.overflow = "";
    }


    if (updatePasswordBtn) {

        updatePasswordBtn.addEventListener(
            "click",
            function () {

                const currentPassword =
                    document.getElementById(
                        "currentPassword"
                    )?.value.trim();

                const newPassword =
                    document.getElementById(
                        "newPassword"
                    )?.value.trim();

                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    )?.value.trim();


                if (
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                ) {

                    showSettingsMessage(
                        "Please enter all password fields.",
                        "warning"
                    );

                    return;
                }


                if (newPassword !== confirmPassword) {

                    showSettingsMessage(
                        "New password and confirmation password do not match.",
                        "warning"
                    );

                    return;
                }


                if (newPassword.length < 6) {

                    showSettingsMessage(
                        "Password must contain at least 6 characters.",
                        "warning"
                    );

                    return;
                }


                openPasswordModal();

            }
        );

    }


    if (closePasswordModal) {

        closePasswordModal.addEventListener(
            "click",
            closePasswordConfirmation
        );

    }


    if (cancelPasswordModal) {

        cancelPasswordModal.addEventListener(
            "click",
            closePasswordConfirmation
        );

    }


    if (confirmPasswordUpdate) {

        confirmPasswordUpdate.addEventListener(
            "click",
            function () {

                closePasswordConfirmation();

                showSettingsMessage(
                    "Password updated successfully.",
                    "success"
                );


                const currentPassword =
                    document.getElementById(
                        "currentPassword"
                    );

                const newPassword =
                    document.getElementById(
                        "newPassword"
                    );

                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    );


                if (currentPassword) {
                    currentPassword.value = "";
                }

                if (newPassword) {
                    newPassword.value = "";
                }

                if (confirmPassword) {
                    confirmPassword.value = "";
                }

            }
        );

    }


    /* =====================================================
       SAVE SYSTEM PREFERENCES
       ===================================================== */

    const savePreferencesBtn =
        document.getElementById(
            "savePreferencesBtn"
        );

    if (savePreferencesBtn) {

        savePreferencesBtn.addEventListener(
            "click",
            function () {

                showSettingsMessage(
                    "System preferences saved successfully.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       SAVE APPLICATION SETTINGS
       ===================================================== */

    const saveApplicationSettingsBtn =
        document.getElementById(
            "saveApplicationSettingsBtn"
        );

    if (saveApplicationSettingsBtn) {

        saveApplicationSettingsBtn.addEventListener(
            "click",
            function () {

                showSettingsMessage(
                    "Application settings saved successfully.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       BACKUP DATA
       ===================================================== */

    const backupDataBtn =
        document.getElementById("backupDataBtn");

    if (backupDataBtn) {

        backupDataBtn.addEventListener(
            "click",
            function () {

                showSettingsMessage(
                    "Backup process started successfully.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       RESET SYSTEM MODAL
       ===================================================== */

    const resetSystemBtn =
        document.getElementById("resetSystemBtn");

    const resetSystemModal =
        document.getElementById("resetSystemModal");

    const closeResetModal =
        document.getElementById("closeResetModal");

    const cancelResetModal =
        document.getElementById("cancelResetModal");

    const confirmSystemReset =
        document.getElementById("confirmSystemReset");


    function openResetModal() {

        if (!resetSystemModal) {
            return;
        }

        resetSystemModal.style.display = "block";

        document.body.style.overflow = "hidden";
    }


    function closeResetConfirmation() {

        if (!resetSystemModal) {
            return;
        }

        resetSystemModal.style.display = "none";

        document.body.style.overflow = "";
    }


    if (resetSystemBtn) {

        resetSystemBtn.addEventListener(
            "click",
            function () {

                openResetModal();

            }
        );

    }


    if (closeResetModal) {

        closeResetModal.addEventListener(
            "click",
            closeResetConfirmation
        );

    }


    if (cancelResetModal) {

        cancelResetModal.addEventListener(
            "click",
            closeResetConfirmation
        );

    }


    if (confirmSystemReset) {

        confirmSystemReset.addEventListener(
            "click",
            function () {

                closeResetConfirmation();

                showSettingsMessage(
                    "System reset request processed.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       CLOSE MODALS WHEN CLICKING OVERLAY
       ===================================================== */

    const modalOverlays =
        document.querySelectorAll(
            ".settings-modal-overlay"
        );

    modalOverlays.forEach(function (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                const modal =
                    this.closest(".settings-modal");

                if (!modal) {
                    return;
                }

                modal.style.display = "none";

                document.body.style.overflow = "";

            }
        );

    });


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            const openModals =
                document.querySelectorAll(
                    ".settings-modal"
                );

            openModals.forEach(function (modal) {

                if (modal.style.display === "block") {

                    modal.style.display = "none";

                }

            });

            document.body.style.overflow = "";

        }
    );


    /* =====================================================
       SETTINGS MESSAGE
       ===================================================== */

    function showSettingsMessage(
        message,
        type = "success"
    ) {

        /*
         * Remove existing message.
         */

        const existingMessage =
            document.querySelector(
                ".settings-toast"
            );

        if (existingMessage) {
            existingMessage.remove();
        }


        /*
         * Create toast.
         */

        const toast =
            document.createElement("div");

        toast.className =
            "settings-toast " + type;


        const icon =
            type === "success"
                ? "fa-circle-check"
                : type === "warning"
                    ? "fa-triangle-exclamation"
                    : "fa-circle-info";


        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;


        document.body.appendChild(toast);


        /*
         * Animate in.
         */

        requestAnimationFrame(function () {

            toast.classList.add("show");

        });


        /*
         * Remove after 3 seconds.
         */

        setTimeout(function () {

            toast.classList.remove("show");

            setTimeout(function () {

                toast.remove();

            }, 250);

        }, 3000);

    }


    /* =====================================================
       SELECT / INPUT CHANGE INDICATION
       ===================================================== */

    const settingInputs =
        document.querySelectorAll(
            ".settings-card input, .settings-card select"
        );

    settingInputs.forEach(function (input) {

        input.addEventListener(
            "change",
            function () {

                this.dataset.changed = "true";

            }
        );

    });


    /* =====================================================
       PROFILE AVATAR BUTTON
       ===================================================== */

    const avatarEditBtn =
        document.querySelector(
            ".avatar-edit-btn"
        );

    if (avatarEditBtn) {

        avatarEditBtn.addEventListener(
            "click",
            function () {

                showSettingsMessage(
                    "Profile photo selection is ready.",
                    "success"
                );

            }
        );

    }

});