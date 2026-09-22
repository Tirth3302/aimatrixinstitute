/* =========================================================
   AI MATRIX INSTITUTE
   Main JavaScript
   ========================================================= */


/* =========================================================
   GOOGLE SHEETS ENQUIRY SYSTEM
   ========================================================= */

const GOOGLE_SHEETS_WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycby-svWTTPEMhgvIFmW_RkxO7gECK67fm1-pvgQkRpPTsaoLc7JHzGy5xQd9fJkT91muTA/exec";


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


                    filterButtons.forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                    button.classList.add(
                        "active"
                    );


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


    /* =====================================================
       GOOGLE SHEETS FORM SUBMISSION
       ===================================================== */

    async function submitEnquiryToGoogleSheets(
        form,
        statusElement,
        submitButton
    ) {

        if (!form) {

            return false;

        }


        if (!GOOGLE_SHEETS_WEB_APP_URL) {

            console.error(
                "Google Sheets Web App URL is missing."
            );

            if (statusElement) {

                statusElement.textContent =
                    "Something went wrong. Please try again later.";

                statusElement.style.color =
                    "#B00020";

            }

            return false;

        }


        /* =================================================
           COLLECT FORM DATA
           ================================================= */

        const formData =
            new FormData(form);


        /*
         * URLSearchParams is intentionally used here
         * instead of JSON.
         *
         * This keeps the request simple and avoids
         * unnecessary CORS preflight handling with
         * Google Apps Script.
         */

        const payload =
            new URLSearchParams();


        for (
            const [key, value]
            of formData.entries()
        ) {

            payload.append(
                key,
                value
            );

        }


        /* =================================================
           BUTTON STATE
           ================================================= */

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.dataset.originalText =
                submitButton.innerHTML;

            if (
                submitButton.classList.contains(
                    "enquiry-modal-submit"
                )
            ) {

                submitButton.innerHTML =
                    'Sending... <span>→</span>';

            } else {

                submitButton.textContent =
                    "Sending...";

            }

        }


        /* =================================================
           STATUS
           ================================================= */

        if (statusElement) {

            statusElement.textContent =
                "Sending your enquiry...";

            statusElement.style.color =
                "#B88632";

            statusElement.classList.remove(
                "success"
            );

        }


        try {

            /*
             * Google Apps Script may return an opaque
             * response because this request is cross-origin.
             *
             * We therefore verify the actual submission
             * by checking the Google Sheet after testing.
             */

            await fetch(
                GOOGLE_SHEETS_WEB_APP_URL,
                {
                    method: "POST",

                    mode: "no-cors",

                    body: payload
                }
            );


            /* =============================================
               SUCCESS
               ============================================= */

            form.reset();


            if (statusElement) {

                statusElement.textContent =
                    "Thank you. Your enquiry has been submitted successfully.";

                statusElement.style.color =
                    "#B88632";

                statusElement.classList.add(
                    "success"
                );

            }


            return true;

        } catch (error) {

            console.error(
                "Google Sheets submission error:",
                error
            );


            if (statusElement) {

                statusElement.textContent =
                    "Something went wrong. Please try again.";

                statusElement.style.color =
                    "#B00020";

                statusElement.classList.remove(
                    "success"
                );

            }


            return false;

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                if (
                    submitButton.dataset.originalText
                ) {

                    submitButton.innerHTML =
                        submitButton.dataset.originalText;

                }

            }

        }

    }


    /* =====================================================
       CONTACT FORM
       ===================================================== */

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
            async function (event) {

                event.preventDefault();


                const submitButton =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );


                await submitEnquiryToGoogleSheets(
                    contactForm,
                    formMessage,
                    submitButton
                );

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
                        Tell us a little about yourself and
                        we'll get back to you soon.
                    </p>

                </div>


                <form
                    id="enquiryModalForm"
                    class="enquiry-modal-form"
                >

                    <!-- ================= NAME ================= -->

                    <div class="form-group">

                        <label for="enquiryModalName">
                            Full Name
                        </label>

                        <input
                            type="text"
                            id="enquiryModalName"
                            name="name"
                            placeholder="Enter your full name"
                            autocomplete="name"
                            required
                        >

                    </div>


                    <!-- ================= EMAIL + PHONE ================= -->

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
                                autocomplete="email"
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
                                placeholder="+91 XXXXX XXXXX"
                                autocomplete="tel"
                                required
                            >

                        </div>

                    </div>


                    <!-- ================= CURRENT EDUCATION ================= -->

                    <div class="form-group">

                        <label for="enquiryModalEducation">
                            Current Education
                        </label>

                        <select
                            id="enquiryModalEducation"
                            name="education"
                            required
                        >

                            <option
                                value=""
                                disabled
                                selected
                            >
                                Select an option
                            </option>


                            <option value="Undergraduate Student">
                                Undergraduate Student
                            </option>


                            <option value="Postgraduate Student">
                                Postgraduate Student
                            </option>


                            <option value="Diploma Student">
                                Diploma Student
                            </option>


                            <option value="School Student">
                                School Student
                            </option>


                            <option value="Working Professional">
                                Working Professional
                            </option>


                            <option value="Non-IT Background, Interested in Learning AI">
                                Non-IT Background, Interested in Learning AI
                            </option>


                            <option value="Interested in Learning New Technology & AI">
                                Interested in Learning New Technology &amp; AI
                            </option>


                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    <!-- ================= MESSAGE ================= -->

                    <div class="form-group">

                        <label for="enquiryModalMessage">
                            Message
                            <span class="optional-label">
                                (Optional)
                            </span>
                        </label>

                        <textarea
                            id="enquiryModalMessage"
                            name="message"
                            rows="4"
                            placeholder="Tell us anything you'd like us to know..."
                        ></textarea>

                    </div>


                    <!-- ================= SUBMIT ================= -->

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

    async function handleEnquirySubmission(event) {

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


        const submissionSuccessful =
            await submitEnquiryToGoogleSheets(
                enquiryForm,
                statusMessage,
                submitButton
            );


        if (submissionSuccessful) {

            /*
             * Keep the success message visible briefly
             * before closing the modal.
             */

            setTimeout(() => {

                closeEnquiryModal();

            }, 1800);

        }

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