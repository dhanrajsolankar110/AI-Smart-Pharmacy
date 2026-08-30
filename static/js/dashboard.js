document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
        ==========================================================
        DASHBOARD MODULE
        ==========================================================
        */


        // --------------------------------------------------------
        // Smooth card interaction
        // --------------------------------------------------------

        const cards =
            document.querySelectorAll(
                ".dashboard-summary-card, " +
                ".dashboard-card, " +
                ".quick-stat"
            );


        cards.forEach(
            function (card) {

                card.addEventListener(
                    "mouseenter",
                    function () {

                        card.classList.add(
                            "dashboard-hover"
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    function () {

                        card.classList.remove(
                            "dashboard-hover"
                        );

                    }
                );

            }
        );


        // --------------------------------------------------------
        // Expiry alert interaction
        // --------------------------------------------------------

        const expiryItems =
            document.querySelectorAll(
                ".expiry-alert-item"
            );


        expiryItems.forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        item.classList.toggle(
                            "selected"
                        );

                    }
                );

            }
        );


        // --------------------------------------------------------
        // Quick action buttons
        // --------------------------------------------------------

        const actionButtons =
            document.querySelectorAll(
                ".dashboard-action"
            );


        actionButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        button.classList.add(
                            "clicked"
                        );


                        setTimeout(
                            function () {

                                button.classList.remove(
                                    "clicked"
                                );

                            },
                            180
                        );

                    }
                );

            }
        );


        // --------------------------------------------------------
        // Dashboard date
        // --------------------------------------------------------

        const dashboardDate =
            document.querySelector(
                "#dashboardDate"
            );


        if (dashboardDate) {

            const now =
                new Date();


            const day =
                String(
                    now.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const monthNames = [

                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"

            ];


            const weekdayNames = [

                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"

            ];


            dashboardDate.textContent =
                `${day} ${monthNames[now.getMonth()]} ${now.getFullYear()}, ${weekdayNames[now.getDay()]}`;

        }


        // ========================================================
// STOCK STATUS DOUGHNUT CHART
// ========================================================

const stockChartCanvas =
    document.getElementById(
        "stockStatusChart"
    );


if (
    stockChartCanvas &&
    typeof Chart !== "undefined"
) {

    // ----------------------------------------------------
    // Read values supplied by dashboard.html
    // ----------------------------------------------------

    const inStock =
        Number(
            stockChartCanvas.dataset.inStock
        ) || 0;


    const lowStock =
        Number(
            stockChartCanvas.dataset.lowStock
        ) || 0;


    const outOfStock =
        Number(
            stockChartCanvas.dataset.outOfStock
        ) || 0;


    // ----------------------------------------------------
    // Create chart
    // ----------------------------------------------------

    new Chart(
        stockChartCanvas,
        {

            type: "doughnut",


            data: {

                labels: [

                    "In Stock",

                    "Low Stock",

                    "Out of Stock"

                ],


                datasets: [

                    {

                        data: [

                            inStock,

                            lowStock,

                            outOfStock

                        ],


                        backgroundColor: [

                            "#18b878",

                            "#ff9410",

                            "#f04444"

                        ],


                        borderColor: [

                            "#ffffff",

                            "#ffffff",

                            "#ffffff"

                        ],


                        borderWidth: 2,


                        hoverOffset: 8

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                cutout: "60%",


                animation: {

                    duration: 700

                },


                plugins: {

                    /*
                    ------------------------------------------------
                    Legend is handled by the HTML beside the chart.
                    ------------------------------------------------
                    */

                    legend: {

                        display: false

                    },


                    /*
                    ------------------------------------------------
                    Tooltip
                    ------------------------------------------------
                    */

                    tooltip: {

                        enabled: true,

                        backgroundColor:
                            "#111827",

                        titleColor:
                            "#ffffff",

                        bodyColor:
                            "#ffffff",

                        borderColor:
                            "#374151",

                        borderWidth: 1,

                        padding: 10,

                        displayColors: true,


                        callbacks: {

                            label:
                                function (
                                    context
                                ) {

                                    const value =
                                        Number(
                                            context.raw
                                        );


                                    const total =
                                        context
                                            .dataset
                                            .data
                                            .reduce(
                                                function (
                                                    sum,
                                                    item
                                                ) {

                                                    return (
                                                        sum +
                                                        Number(
                                                            item
                                                        )
                                                    );

                                                },
                                                0
                                            );


                                    const percentage =
                                        total > 0
                                            ? (
                                                value /
                                                total *
                                                100
                                            ).toFixed(1)
                                            : "0.0";


                                    return (

                                        context.label
                                        +
                                        ": "
                                        +
                                        value
                                        +
                                        " ("
                                        +
                                        percentage
                                        +
                                        "%)"

                                    );

                                }

                        }

                    }

                }

            }

        }
    );

}

    }
);