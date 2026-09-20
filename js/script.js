/* =========================================================
   AI MATRIX INSTITUTE
   Main JavaScript
   ========================================================= */


/* =========================================================
   SHARED NAVBAR & FOOTER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       LOAD NAVBAR
       ===================================================== */

    const navbarContainer =
        document.getElementById("site-navbar");


    if (navbarContainer) {

        fetch("components/navbar.html")

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Navbar could not be loaded. Status: ${response.status}`
                    );

                }

                return response.text();

            })

            .then(html => {

                navbarContainer.innerHTML = html;

                setupNavigation();

                setActiveNavigation();

                setupEnquiryButtons();

            })

            .catch(error => {

                console.error(
                    "Navbar loading error:",
                    error
                );

            });

    }


    /* =====================================================
       LOAD FOOTER
       ===================================================== */

    const footerContainer =
        document.getElementById("site-footer");


    if (footerContainer) {

        fetch("components/footer.html")

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Footer could not be loaded. Status: ${response.status}`
                    );

                }

                return response.text();

            })

            .then(html => {

                footerContainer.innerHTML = html;

                setCurrentYear();

                setupEnquiryButtons();

            })

            .catch(error => {

                console.error(
                    "Footer loading error:",
                    error
                );

            });

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    function setupNavigation() {

        const menuToggle =
            document.querySelector(
                ".mobile-menu-toggle"
            );


        const mobileNav =
            document.querySelector(
                ".mobile-nav"
            );


        if (!menuToggle || !mobileNav) {

            return;

        }


        /* ================= OPEN / CLOSE MENU ================= */

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileNav.classList.toggle(
                        "open"
                    );


                menuToggle.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

            }
        );


        /* ================= MOBILE LINKS ================= */

        const mobileLinks =
            mobileNav.querySelectorAll("a");


        mobileLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove(
                        "open"
                    );


                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    function setActiveNavigation() {

        let currentPage =
            window.location.pathname
                .split("/")
                .pop();


        /*
         * When opening index.html through a server,
         * the pathname may end with "/" instead.
         */

        if (
            currentPage === "" ||
            currentPage === "/"
        ) {

            currentPage = "index.html";

        }


        const navLinks =
            document.querySelectorAll(
                ".desktop-nav a, .mobile-nav a"
            );


        navLinks.forEach(link => {

            const linkPage =
                link.getAttribute("href");


            if (linkPage === currentPage) {

                link.classList.add(
                    "active"
                );

            } else {

                link.classList.remove(
                    "active"
                );

            }

        });

    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(

                (entries, observer) => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },

                {
                    threshold: 0.12
                }

            );


        revealElements.forEach(element => {

            revealObserver.observe(
                element
            );

        });

    } else {

        /*
         * Fallback for browsers that do not support
         * IntersectionObserver.
         */

        revealElements.forEach(element => {

            element.classList.add(
                "visible"
            );

        });

    }


    /* =====================================================
       COURSE FILTER
       ===================================================== */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const courseCards =
        document.querySelectorAll(
            ".course-card"
        );


    if (
        filterButtons.length > 0 &&
        courseCards.length > 0
    ) {

        filterButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const selectedCategory =
                        button.dataset.filter;


                    /* ================= REMOVE ACTIVE ================= */

                    filterButtons.forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                    /* ================= ACTIVATE SELECTED ================= */

                    button.classList.add(
                        "active"
                    );


                    /* ================= FILTER COURSES ================= */

                    courseCards.forEach(card => {

                        const cardCategory =
                            card.dataset.category;


                        if (
                            selectedCategory === "all" ||
                            cardCategory === selectedCategory
                        ) {

                            card.classList.remove(
                                "hidden"
                            );

                        } else {

                            card.classList.add(
                                "hidden"
                            );

                        }

                    });

                }
            );

        });

    }


    /* =====================================================
       CONTACT PAGE
       ===================================================== */


    /* ================= FAQ ACCORDION ================= */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    faqItems.forEach(item => {

        const question =
            item.querySelector(
                ".faq-question"
            );


        if (!question) {

            return;

        }


        question.addEventListener(
            "click",
            () => {


                faqItems.forEach(
                    otherItem => {

                        if (
                            otherItem !== item
                        ) {

                            otherItem.classList.remove(
                                "active"
                            );

                        }

                    }
                );


                item.classList.toggle(
                    "active"
                );

            }
        );

    });


    /* ================= CONTACT FORM ================= */

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    const formMessage =
        document.getElementById(
            "formMessage"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (formMessage) {

                    formMessage.textContent =
                        "Thank you. Your enquiry has been recorded. We'll get back to you soon.";


                    formMessage.style.color =
                        "#B88632";

                }


                contactForm.reset();

            }
        );

    }


    /* =====================================================
       ENQUIRY MODAL
       ===================================================== */

    createEnquiryModal();

    setupEnquiryButtons();


    /* =====================================================
       CREATE ENQUIRY MODAL
       ===================================================== */

    function createEnquiryModal() {

        /*
         * Prevent the modal from being created more than once.
         */

        if (
            document.getElementById(
                "enquiryModal"
            )
        ) {

            return;

        }


        const modal =
            document.createElement(
                "div"
            );


        modal.id = "enquiryModal";

        modal.className =
            "enquiry-modal";


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        modal.innerHTML = `

            <div
                class="enquiry-modal-overlay"
                data-enquiry-close
            ></div>


            <div
                class="enquiry-modal-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="enquiryModalTitle"
            >

                <button
                    type="button"
                    class="enquiry-modal-close"
                    data-enquiry-close
                    aria-label="Close enquiry form"
                >
                    <span></span>
                    <span></span>
                </button>


                <div class="enquiry-modal-header">

                    <span class="section-label">
                        ENQUIRE NOW
                    </span>

                    <h2 id="enquiryModalTitle">
                        Let's start a conversation.
                    </h2>

                    <p>
                        Have a question about our courses,
                        programs, or learning options?
                        Send us your details and we'll
                        get back to you soon.
                    </p>

                </div>


                <form
                    id="enquiryModalForm"
                    class="enquiry-modal-form"
                >

                    <div class="form-group">

                        <label for="enquiryModalName">
                            Full Name
                        </label>

                        <input
                            type="text"
                            id="enquiryModalName"
                            name="name"
                            placeholder="Enter your full name"
                            required
                        >

                    </div>


                    <div class="form-row">

                        <div class="form-group">

                            <label for="enquiryModalEmail">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="enquiryModalEmail"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="enquiryModalPhone">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                id="enquiryModalPhone"
                                name="phone"
                                placeholder="Enter your phone number"
                                required
                            >

                        </div>

                    </div>


                    <div class="form-group">

                        <label for="enquiryModalType">
                            What can we help you with?
                        </label>

                        <select
                            id="enquiryModalType"
                            name="enquiry"
                            required
                        >

                            <option
                                value=""
                                disabled
                                selected
                            >
                                Select an option
                            </option>

                            <option value="Course Enquiry">
                                Course Enquiry
                            </option>

                            <option value="Career Guidance">
                                Career Guidance
                            </option>

                            <option value="Corporate Training">
                                Corporate Training
                            </option>

                            <option value="School Programs">
                                School Programs
                            </option>

                            <option value="General Enquiry">
                                General Enquiry
                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label for="enquiryModalMessage">
                            Message
                        </label>

                        <textarea
                            id="enquiryModalMessage"
                            name="message"
                            rows="4"
                            placeholder="Tell us how we can help you..."
                            required
                        ></textarea>

                    </div>


                    <button
                        type="submit"
                        class="enquiry-modal-submit"
                    >
                        Send Enquiry
                        <span>→</span>
                    </button>


                    <p
                        id="enquiryModalMessageStatus"
                        class="enquiry-modal-status"
                        aria-live="polite"
                    ></p>

                </form>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        setupEnquiryModal();

    }


    /* =====================================================
       ENQUIRY BUTTONS
       ===================================================== */

    function setupEnquiryButtons() {

        const enquiryButtons =
            document.querySelectorAll(
                "[data-enquiry-open]"
            );


        enquiryButtons.forEach(button => {

            /*
             * Prevent duplicate event listeners when
             * navbar/footer components are loaded.
             */

            if (
                button.dataset.enquiryReady === "true"
            ) {

                return;

            }


            button.dataset.enquiryReady =
                "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    openEnquiryModal();


                    /*
                     * Close mobile navigation if
                     * the button was clicked there.
                     */

                    const mobileNav =
                        document.querySelector(
                            ".mobile-nav"
                        );


                    const menuToggle =
                        document.querySelector(
                            ".mobile-menu-toggle"
                        );


                    if (mobileNav) {

                        mobileNav.classList.remove(
                            "open"
                        );

                    }


                    if (menuToggle) {

                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        });

    }


    /* =====================================================
       ENQUIRY MODAL SETUP
       ===================================================== */

    function setupEnquiryModal() {

        const modal =
            document.getElementById(
                "enquiryModal"
            );


        if (!modal) {

            return;

        }


        const closeButtons =
            modal.querySelectorAll(
                "[data-enquiry-close]"
            );


        const enquiryForm =
            document.getElementById(
                "enquiryModalForm"
            );


        /* ================= CLOSE BUTTONS ================= */

        closeButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    closeEnquiryModal();

                }
            );

        });


        /* ================= ESCAPE KEY ================= */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    modal.classList.contains("open")
                ) {

                    closeEnquiryModal();

                }

            }
        );


        /* ================= FORM SUBMISSION ================= */

        if (enquiryForm) {

            enquiryForm.addEventListener(
                "submit",
                handleEnquirySubmission
            );

        }

    }


    /* =====================================================
       OPEN ENQUIRY MODAL
       ===================================================== */

    function openEnquiryModal() {

        const modal =
            document.getElementById(
                "enquiryModal"
            );


        if (!modal) {

            return;

        }


        modal.classList.add(
            "open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );


        /*
         * Put keyboard focus on the first field.
         */

        setTimeout(() => {

            const firstInput =
                document.getElementById(
                    "enquiryModalName"
                );


            if (firstInput) {

                firstInput.focus();

            }

        }, 100);

    }


    /* =====================================================
       CLOSE ENQUIRY MODAL
       ===================================================== */

    function closeEnquiryModal() {

        const modal =
            document.getElementById(
                "enquiryModal"
            );


        if (!modal) {

            return;

        }


        modal.classList.remove(
            "open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );

    }


    /* =====================================================
       ENQUIRY FORM SUBMISSION
       ===================================================== */

    function handleEnquirySubmission(event) {

        event.preventDefault();


        const enquiryForm =
            event.target;


        const submitButton =
            enquiryForm.querySelector(
                ".enquiry-modal-submit"
            );


        const statusMessage =
            document.getElementById(
                "enquiryModalMessageStatus"
            );


        if (submitButton) {

            submitButton.disabled =
                true;


            submitButton.innerHTML =
                "Submitting...";

        }


        /*
         * =================================================
         * GOOGLE APPS SCRIPT CONNECTION
         * =================================================
         *
         * The enquiry data will eventually be
         * sent directly to Google Sheets through
         * a Google Apps Script Web App.
         *
         * The Web App URL will be added here
         * once the Google Sheet and Apps Script
         * are created.
         *
         * IMPORTANT:
         * Do not add the URL until the Apps Script
         * endpoint has been created and tested.
         */


        const formData =
            new FormData(
                enquiryForm
            );


        /*
         * Temporary submission simulation.
         *
         * This will be replaced with the actual
         * Google Apps Script request.
         */

        setTimeout(() => {

            if (statusMessage) {

                statusMessage.textContent =
                    "Thank you. Your enquiry has been recorded. We'll get back to you soon.";


                statusMessage.classList.add(
                    "success"
                );

            }


            enquiryForm.reset();


            if (submitButton) {

                submitButton.disabled =
                    false;


                submitButton.innerHTML =
                    'Send Enquiry <span>→</span>';

            }


            /*
             * Keep the success message visible
             * briefly before closing the modal.
             */

            setTimeout(() => {

                closeEnquiryModal();


                if (statusMessage) {

                    statusMessage.textContent =
                        "";

                    statusMessage.classList.remove(
                        "success"
                    );

                }

            }, 1800);


        }, 800);

    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    function setCurrentYear() {

        const yearElement =
            document.querySelector(
                ".footer-year"
            );


        if (yearElement) {

            yearElement.textContent =
                new Date().getFullYear();

        }

    }

});