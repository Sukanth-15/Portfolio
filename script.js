  
document.addEventListener("DOMContentLoaded", function () {

    
    //   1. Grab elements we need from the page
    
    var header      = document.getElementById("site-header");
    var themeToggle = document.getElementById("theme-toggle");
    var themeIcon   = document.getElementById("theme-icon");
    var hamburger   = document.getElementById("hamburger");
    var mobileMenu  = document.getElementById("mobile-menu");
    var mobileLinks = document.querySelectorAll(".mobile-link");
    var navLinks    = document.querySelectorAll(".nav-link");
    var backToTop   = document.getElementById("back-to-top");
    var fadeItems   = document.querySelectorAll(".fade-in");
    var htmlEl      = document.documentElement;   /* the <html> tag */


  //2. Theme toggle (dark ↔ light)
    

    /* Read saved theme from localStorage — so preference is remembered across visits */
    var savedTheme = localStorage.getItem("theme");

    /* If no saved preference, default to "dark" */
    if (savedTheme === "light") {
        htmlEl.setAttribute("data-theme", "light");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    }

    /* When the toggle button is clicked, flip the theme */
    themeToggle.addEventListener("click", function () {
        var currentTheme = htmlEl.getAttribute("data-theme");

        if (currentTheme === "dark") {
            /* Switch to light */
            htmlEl.setAttribute("data-theme", "light");
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
            localStorage.setItem("theme", "light");
        } else {
            /* Switch to dark */
            htmlEl.setAttribute("data-theme", "dark");
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
            localStorage.setItem("theme", "dark");
        }
    });


    
    //   3. Mobile navigation (hamburger menu)
    

    function openMobileMenu() {
        mobileMenu.classList.add("open");
        hamburger.classList.add("open");
        hamburger.setAttribute("aria-expanded", "true");
        mobileMenu.setAttribute("aria-hidden", "false");
        /* Prevent the page from scrolling while menu is open */
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        /* Allow page scrolling again */
        document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", function () {
        /* Toggle: if open → close, if closed → open */
        var isOpen = mobileMenu.classList.contains("open");
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    /* Close menu when any mobile nav link is clicked */
    mobileLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeMobileMenu();
        });
    });

    /* Close menu if user clicks outside of it */
    document.addEventListener("click", function (event) {
        var clickedInsideMenu = mobileMenu.contains(event.target);
        var clickedHamburger  = hamburger.contains(event.target);
        if (!clickedInsideMenu && !clickedHamburger) {
            closeMobileMenu();
        }
    });

    /* Close menu on Escape key press — accessibility */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });


    
    //   4. Scroll-based behaviours
    //   (header shadow, back-to-top, active nav link)
    

    /* Collect all sections that correspond to nav links */
    var sections = document.querySelectorAll("section[id]");

    function handleScroll() {
        var scrollY = window.scrollY;

        /* 4a. Add shadow to header once user scrolls down */
        if (scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        /* 4b. Show / hide the back-to-top button */
        if (scrollY > 400) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }

        /* 4c. Highlight the active nav link
               We loop through sections and find which one the
               top of the viewport is currently inside */
        var currentSectionId = "";

        sections.forEach(function (section) {
            /* offsetTop = how far from the top of the document the section is */
            /* We subtract 80px to trigger the highlight slightly before reaching the section */
            var sectionTop = section.offsetTop - 80;
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute("id");
            }
        });

        /* Add 'active' class to the matching nav link, remove from others */
        navLinks.forEach(function (link) {
            link.classList.remove("active");
            /* The href is like "#about" — we strip the "#" with slice(1) */
            if (link.getAttribute("href").slice(1) === currentSectionId) {
                link.classList.add("active");
            }
        });
    }

    /* Run once on load, then on every scroll event */
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });


    
    //   5. Back-to-top button click
    
    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    /* ────────────────────────────────────────────────
       6. Scroll-triggered fade-in animations
          Using IntersectionObserver — watches elements
          and fires when they enter the visible part of
          the screen.
    ──────────────────────────────────────────────── */

    /*
     * IntersectionObserver fires a callback whenever a
     * watched element crosses the threshold (here 10%
     * of the element is visible).
     */
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                /*
                 * Add a small sequential delay based on the element's
                 * position inside its parent — creates a "cascade"
                 * effect for grid items.
                 */
                var el     = entry.target;
                var parent = el.parentElement;
                var siblings = Array.from(parent.querySelectorAll(".fade-in"));
                var index  = siblings.indexOf(el);

                /* Delay each sibling by 80ms */
                el.style.transitionDelay = (index * 80) + "ms";
                el.classList.add("visible");

                /*
                 * Stop observing once the element has appeared.
                 * This is efficient — no need to keep watching.
                 */
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1          /* trigger when 10% of element is visible */
    });

    /* Start observing every element with class "fade-in" */
    fadeItems.forEach(function (item) {
        observer.observe(item);
    });


    /* 
       7. Highlight nav link for the current hash on load
          (e.g. if someone visits portfolio.html#projects)
    */
    var hash = window.location.hash;
    if (hash) {
        navLinks.forEach(function (link) {
            if (link.getAttribute("href") === hash) {
                link.classList.add("active");
            }
        });
    }

});  
