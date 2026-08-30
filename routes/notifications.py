from flask import (
    Blueprint,
    render_template,
    request,
    jsonify
)

from utils.auth import login_required
from utils.data_loader import load_notifications_data


notifications_bp = Blueprint(
    "notifications",
    __name__,
    url_prefix="/notifications"
)


# =========================================================
# LOAD CSV DATA
# =========================================================

def get_notifications():

    data = load_notifications_data()

    notifications = []

    if data is None or data.empty:
        return notifications

    data = data.fillna("")

    for row in data.to_dict(
        orient="records"
    ):

        notification = {

            "id": str(
                row.get(
                    "Notification_ID",
                    row.get(
                        "notification_id",
                        row.get(
                            "ID",
                            row.get("id", "")
                        )
                    )
                )
            ),

            "title": str(
                row.get(
                    "Title",
                    row.get(
                        "Notification_Title",
                        row.get(
                            "title",
                            ""
                        )
                    )
                )
            ),

            "description": str(
                row.get(
                    "Description",
                    row.get(
                        "Message",
                        row.get(
                            "description",
                            row.get(
                                "message",
                                ""
                            )
                        )
                    )
                )
            ),

            "type": str(
                row.get(
                    "Type",
                    row.get(
                        "Notification_Type",
                        row.get(
                            "type",
                            "System"
                        )
                    )
                )
            ),

            "priority": str(
                row.get(
                    "Priority",
                    row.get(
                        "priority",
                        "Medium"
                    )
                )
            ),

            "date": str(
                row.get(
                    "Date",
                    row.get(
                        "date",
                        ""
                    )
                )
            ),

            "time": str(
                row.get(
                    "Time",
                    row.get(
                        "time",
                        ""
                    )
                )
            ),

            "status": str(
                row.get(
                    "Status",
                    row.get(
                        "status",
                        "Unread"
                    )
                )
            ),

            "icon": str(
                row.get(
                    "Icon",
                    row.get(
                        "icon",
                        "fa-bell"
                    )
                )
            )
        }

        notifications.append(
            notification
        )

    return notifications


# =========================================================
# NOTIFICATIONS PAGE
# =========================================================

@notifications_bp.route("/")
@login_required
def notifications():

    # -----------------------------------------------------
    # LOAD IMPORTED CSV DATA
    # -----------------------------------------------------

    all_notifications = get_notifications()


    # -----------------------------------------------------
    # PAGINATION
    # -----------------------------------------------------

    page = request.args.get(
        "page",
        1,
        type=int
    )

    per_page = 10

    total_notifications = len(
        all_notifications
    )

    total_pages = max(
        1,
        (
            total_notifications
            + per_page
            - 1
        ) // per_page
    )


    if page < 1:
        page = 1

    if page > total_pages:
        page = total_pages


    start_index = (
        (page - 1)
        * per_page
    )

    end_index = (
        start_index
        + per_page
    )


    page_notifications = (
        all_notifications[
            start_index:end_index
        ]
    )


    # -----------------------------------------------------
    # DISPLAY RANGE
    # -----------------------------------------------------

    display_start = (
        start_index + 1
        if total_notifications > 0
        else 0
    )

    display_end = min(
        end_index,
        total_notifications
    )


    # -----------------------------------------------------
    # COUNTS
    # -----------------------------------------------------

    high_priority = sum(
        1
        for item in all_notifications
        if item["priority"] == "High"
    )

    pending_notifications = sum(
        1
        for item in all_notifications
        if item["status"] == "Unread"
    )

    information_notifications = sum(
        1
        for item in all_notifications
        if item["type"] == "System"
    )

    read_notifications = sum(
        1
        for item in all_notifications
        if item["status"] == "Read"
    )

    unread_count = pending_notifications

    high_priority_count = high_priority


    # -----------------------------------------------------
    # DEFAULT SETTINGS
    # -----------------------------------------------------

    notification_settings = {
        "expiry_alerts": True,
        "stock_alerts": True,
        "prescription_alerts": True,
        "appointment_reminders": True,
        "system_updates": True,
        "reports_analytics": True
    }


    # -----------------------------------------------------
    # RENDER
    # -----------------------------------------------------

    return render_template(
        "notifications/notifications.html",

        notifications=page_notifications,

        total_notifications=
            total_notifications,

        high_priority=
            high_priority,

        pending_notifications=
            pending_notifications,

        information_notifications=
            information_notifications,

        read_notifications=
            read_notifications,

        unread_count=
            unread_count,

        high_priority_count=
            high_priority_count,

        notification_settings=
            notification_settings,

        current_page=
            page,

        total_pages=
            total_pages,

        start_index=
            display_start,

        end_index=
            display_end
    )