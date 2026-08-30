/* ==========================================================
   REPORTS & ANALYTICS
   AI SMART PHARMACY
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       CHECK CHART.JS
    ====================================================== */

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    /* ======================================================
       DEFAULT CHART OPTIONS
    ====================================================== */

    Chart.defaults.font.family =
        "Inter, Arial, sans-serif";

    Chart.defaults.color =
        "#64748b";


    /* ======================================================
       SALES TREND
    ====================================================== */

    const salesCanvas =
        document.getElementById(
            "salesTrendChart"
        );


    if (salesCanvas) {

        new Chart(
            salesCanvas,
            {

                type: "line",

                data: {

                    labels: [

                        "1 Jul",
                        "5 Jul",
                        "10 Jul",
                        "15 Jul",
                        "20 Jul",
                        "25 Jul",
                        "27 Jul",
                        "28 Jul",
                        "29 Jul",
                        "30 Jul"

                    ],

                    datasets: [

                        {

                            label:
                                "Sales (₹)",

                            data: [

                                14000,
                                21000,
                                25000,
                                32000,
                                24000,
                                33000,
                                31000,
                                35000,
                                39000,
                                44500

                            ],

                            borderWidth: 3,

                            borderColor:
                                "#5b21b6",

                            backgroundColor:
                                "rgba(91, 33, 182, 0.10)",

                            pointBackgroundColor:
                                "#5b21b6",

                            pointBorderColor:
                                "#ffffff",

                            pointBorderWidth:
                                2,

                            pointRadius:
                                4,

                            pointHoverRadius:
                                6,

                            fill:
                                true,

                            tension:
                                0.4

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        intersect:
                            false,

                        mode:
                            "index"

                    },

                    plugins: {

                        legend: {

                            display:
                                false

                        },

                        tooltip: {

                            backgroundColor:
                                "#111827",

                            titleColor:
                                "#ffffff",

                            bodyColor:
                                "#ffffff",

                            padding:
                                10,

                            displayColors:
                                false,

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            " Sales: ₹" +
                                            Number(
                                                context.parsed.y
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        x: {

                            grid: {

                                color:
                                    "#eef2f7",

                                drawBorder:
                                    false

                            },

                            ticks: {

                                color:
                                    "#64748b",

                                font: {

                                    size:
                                        11

                                }

                            }

                        },

                        y: {

                            beginAtZero:
                                true,

                            suggestedMax:
                                50000,

                            grid: {

                                color:
                                    "#eef2f7",

                                drawBorder:
                                    false

                            },

                            ticks: {

                                color:
                                    "#64748b",

                                font: {

                                    size:
                                        11

                                },

                                callback:
                                    function (
                                        value
                                    ) {

                                        return (
                                            "₹" +
                                            Number(
                                                value
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

    }


    /* ======================================================
       MEDICINE CATEGORY SALES
    ====================================================== */

    const categoryCanvas =
        document.getElementById(
            "categorySalesChart"
        );


    if (categoryCanvas) {

        new Chart(
            categoryCanvas,
            {

                type:
                    "doughnut",

                data: {

                    labels: [

                        "Antibiotics",
                        "Pain Relief",
                        "Multivitamins",
                        "Antacids",
                        "Others"

                    ],

                    datasets: [

                        {

                            data: [

                                28,
                                22,
                                18,
                                12,
                                20

                            ],

                            backgroundColor: [

                                "#5b21b6",
                                "#2563eb",
                                "#059669",
                                "#f59e0b",
                                "#94a3b8"

                            ],

                            borderWidth:
                                2,

                            borderColor:
                                "#ffffff",

                            hoverOffset:
                                5

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "65%",

                    plugins: {

                        legend: {

                            display:
                                false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            context.label +
                                            ": " +
                                            context.parsed +
                                            "%"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

    }


    /* ======================================================
   STOCK STATUS
   ====================================================== */

const stockCanvas =
    document.getElementById(
        "stockStatusChart"
    );


if (stockCanvas) {

    new Chart(
        stockCanvas,
        {

            type:
                "doughnut",

            data: {

                labels: [

                    "In Stock",
                    "Low Stock",
                    "Out of Stock"

                ],

                datasets: [

                    {

                        data: [

                            80.6,
                            12.5,
                            7.0

                        ],

                        backgroundColor: [

                            "#10b981",
                            "#f59e0b",
                            "#ef4444"

                        ],

                        borderWidth:
                            2,

                        borderColor:
                            "#ffffff",

                        hoverOffset:
                            5

                    }

                ]

            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                cutout:
                    "65%",

                plugins: {

                    legend: {

                        display:
                            false

                    },

                    tooltip: {

                        callbacks: {

                            label:
                                function (
                                    context
                                ) {

                                    return (
                                        context.label +
                                        ": " +
                                        context.parsed +
                                        "%"
                                    );

                                }

                        }

                    }

                }

            }

        }
    );

}

});

/* ==========================================================
   DATE RANGE FILTER
========================================================== */

const reportDateRange =
    document.getElementById(
        "reportDateRange"
    );


if (reportDateRange) {

    reportDateRange.addEventListener(
        "change",
        function () {

            const selectedRange =
                this.value;

            console.log(
                "Report date range:",
                selectedRange,
                "days"
            );


            /*
             * The backend will use this value later
             * to generate real report data.
             *
             * For now the dashboard keeps the
             * existing professional UI and charts.
             */

            updateReportRangeLabel(
                selectedRange
            );

        }
    );

}


/* ==========================================================
   UPDATE DATE RANGE
========================================================== */

function updateReportRangeLabel(
    days
) {

    let label = "";

    switch (String(days)) {

        case "7":

            label =
                "Showing data for the last 7 days";

            break;


        case "30":

            label =
                "Showing data for the last 30 days";

            break;


        case "90":

            label =
                "Showing data for the last 90 days";

            break;


        case "365":

            label =
                "Showing data for the last 12 months";

            break;


        default:

            label =
                "Showing selected report period";

    }


    console.log(label);

}


/* ==========================================================
   CARD HOVER INTERACTION
========================================================== */

const reportCards =
    document.querySelectorAll(
        ".report-card"
    );


reportCards.forEach(
    function (card) {

        card.addEventListener(
            "mouseenter",
            function () {

                this.classList.add(
                    "report-card-hover"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            function () {

                this.classList.remove(
                    "report-card-hover"
                );

            }
        );

    }
);


/* ==========================================================
   TOP SELLING MEDICINE ROWS
========================================================== */

const medicineRows =
    document.querySelectorAll(
        ".reports-table tbody tr"
    );


medicineRows.forEach(
    function (row) {

        row.addEventListener(
            "click",
            function () {

                const medicineName =
                    this.cells[1]
                        ? this.cells[1]
                            .textContent
                            .trim()
                        : "";

                if (medicineName) {

                    console.log(
                        "Selected medicine:",
                        medicineName
                    );

                }

            }
        );

    }
);


/* ==========================================================
   VIEW ALL ACTIVITIES
========================================================== */

const activityLink =
    document.querySelector(
        ".recent-activities-card .card-footer-link a"
    );


if (activityLink) {

    activityLink.addEventListener(
        "click",
        function (event) {

            /*
             * The complete Activities module
             * can be connected later.
             *
             * Prevents the "#" link from
             * jumping to the top of the page.
             */

            if (
                this.getAttribute("href") === "#"
            ) {

                event.preventDefault();

                console.log(
                    "View All Activities clicked"
                );

            }

        }
    );

}


/* ==========================================================
   REPORT REFRESH FUNCTION
========================================================== */

function refreshReports() {

    window.location.reload();

}


/* ==========================================================
   NUMBER FORMATTER
========================================================== */

function formatIndianNumber(
    value
) {

    const number =
        Number(value || 0);

    return number.toLocaleString(
        "en-IN"
    );

}


/* ==========================================================
   CURRENCY FORMATTER
========================================================== */

function formatCurrency(
    value
) {

    const number =
        Number(value || 0);

    return (
        "₹" +
        number.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )
    );

}


/* ==========================================================
   REPORT NOTIFICATION
========================================================== */

function showReportNotification(
    message,
    type = "success"
) {

    const existing =
        document.querySelector(
            ".report-notification"
        );


    if (existing) {

        existing.remove();

    }


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        "report-notification " +
        type;


    notification.innerHTML = `

        <i class="fa-solid ${
            type === "success"
                ? "fa-circle-check"
                : "fa-circle-exclamation"
        }"></i>

        <span>
            ${message}
        </span>

    `;


    document.body.appendChild(
        notification
    );


    setTimeout(
        function () {

            notification.classList.add(
                "hide"
            );


            setTimeout(
                function () {

                    notification.remove();

                },
                300
            );

        },
        3000
    );

}


/* ==========================================================
   ESCAPE KEY
========================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            console.log(
                "Reports page Escape key pressed"
            );

        }

    }
);