document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchInput =
            document.getElementById(
                "globalSearchInput"
            );

        const resultsBox =
            document.getElementById(
                "globalSearchResults"
            );


        if (
            !searchInput ||
            !resultsBox
        ) {
            return;
        }


        let searchTimer = null;


        // ==================================================
        // SEARCH INPUT
        // ==================================================

        searchInput.addEventListener(
            "input",
            function () {

                const keyword =
                    searchInput.value.trim();


                clearTimeout(
                    searchTimer
                );


                if (!keyword) {

                    resultsBox.innerHTML = "";

                    resultsBox.classList.remove(
                        "show"
                    );

                    return;
                }


                searchTimer = setTimeout(
                    function () {

                        performGlobalSearch(
                            keyword
                        );

                    },
                    250
                );

            }
        );


        // ==================================================
        // GLOBAL SEARCH
        // ==================================================

        function performGlobalSearch(
            keyword
        ) {

            fetch(
                "/global-search?q="
                +
                encodeURIComponent(
                    keyword
                )
            )

            .then(
                function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Search request failed"
                        );

                    }

                    return response.json();

                }
            )

            .then(
                function (data) {

                    displayResults(
                        data.results || []
                    );

                }
            )

            .catch(
                function (error) {

                    console.error(
                        "Global search error:",
                        error
                    );

                    resultsBox.innerHTML = `
                        <div class="global-search-empty">
                            Unable to search right now.
                        </div>
                    `;

                    resultsBox.classList.add(
                        "show"
                    );

                }
            );

        }


        // ==================================================
        // DISPLAY RESULTS
        // ==================================================

        function displayResults(
            results
        ) {

            resultsBox.innerHTML = "";


            if (
                results.length === 0
            ) {

                resultsBox.innerHTML = `
                    <div class="global-search-empty">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span>No results found</span>
                    </div>
                `;

                resultsBox.classList.add(
                    "show"
                );

                return;
            }


            results.forEach(
                function (result) {

                    const item =
                        document.createElement(
                            "a"
                        );


                    item.href =
                        result.url;


                    item.className =
                        "global-search-result";


                    item.innerHTML = `

                        <div
                            class="
                                global-search-result-icon
                                ${result.color || ""}
                            "
                        >

                            <i
                                class="${result.icon}"
                            ></i>

                        </div>


                        <div
                            class="global-search-result-content"
                        >

                            <strong>
                                ${escapeHtml(
                                    result.title
                                )}
                            </strong>

                            <span>
                                ${escapeHtml(
                                    result.subtitle || ""
                                )}
                            </span>

                        </div>


                        <div
                            class="global-search-result-type"
                        >

                            ${escapeHtml(
                                result.type
                            )}

                        </div>

                    `;


                    resultsBox.appendChild(
                        item
                    );

                }
            );


            resultsBox.classList.add(
                "show"
            );

        }


        // ==================================================
        // ESCAPE HTML
        // ==================================================

        function escapeHtml(
            value
        ) {

            const div =
                document.createElement(
                    "div"
                );

            div.textContent =
                value == null
                    ? ""
                    : String(value);

            return div.innerHTML;

        }


        // ==================================================
        // CLICK OUTSIDE
        // ==================================================

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !event.target.closest(
                        ".header-search"
                    )
                ) {

                    resultsBox.classList.remove(
                        "show"
                    );

                }

            }
        );


        // ==================================================
        // ESC KEY
        // ==================================================

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    resultsBox.classList.remove(
                        "show"
                    );

                    searchInput.blur();

                }

            }
        );

    }
);