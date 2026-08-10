/* =========================================
   MX-MAFIA - SCRIPT.JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     MOBILE MENU
  ========================================= */

  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      menuBtn.classList.toggle("active");
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuBtn.classList.remove("active");
      });
    });
  }


  /* =========================================
     RELEASE COUNTDOWN
     28 FEBRUARY 2027
  ========================================= */

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const releaseDate = new Date("2027-02-28T00:00:00");

  function updateCountdown() {

    const now = new Date();
    const difference = releaseDate - now;

    if (difference <= 0) {

      if (daysEl) daysEl.textContent = "000";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";

      return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) {
      daysEl.textContent = String(days).padStart(3, "0");
    }

    if (hoursEl) {
      hoursEl.textContent = String(hours).padStart(2, "0");
    }

    if (minutesEl) {
      minutesEl.textContent = String(minutes).padStart(2, "0");
    }

    if (secondsEl) {
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* =========================================
     TRAILER MODAL
  ========================================= */

  const trailerBtn = document.getElementById("trailerBtn");
  const trailerModal = document.getElementById("trailerModal");
  const closeTrailer = document.getElementById("closeTrailer");

  if (trailerBtn && trailerModal) {

    trailerBtn.addEventListener("click", () => {
      trailerModal.classList.add("active");
      document.body.classList.add("modal-open");
    });

  }

  if (closeTrailer && trailerModal) {

    closeTrailer.addEventListener("click", () => {
      trailerModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    });

  }

  if (trailerModal) {

    trailerModal.addEventListener("click", (event) => {

      if (event.target === trailerModal) {
        trailerModal.classList.remove("active");
        document.body.classList.remove("modal-open");
      }

    });

  }

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && trailerModal) {
      trailerModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }

  });


  /* =========================================
     FORMSPREE EMAIL FORM
  ========================================= */

  const emailForm = document.getElementById("emailForm");
  const emailInput = document.getElementById("emailInput");
  const formMessage = document.getElementById("formMessage");

  const FORMSPREE_URL =
    "https://formspree.io/f/xaewedog";


  if (emailForm) {

    emailForm.addEventListener("submit", async (event) => {

      /*
        Stop normal page redirect.
        We send the form using fetch().
      */

      event.preventDefault();

      if (!emailInput) {
        return;
      }

      const email = emailInput.value.trim();

      if (!email) {

        if (formMessage) {
          formMessage.textContent =
            "Please enter your email.";
        }

        return;
      }


      /* Simple email validation */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {

        if (formMessage) {
          formMessage.textContent =
            "Please enter a valid email.";
        }

        return;
      }


      const submitButton =
        emailForm.querySelector("button[type='submit']");


      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "SENDING...";
      }


      if (formMessage) {
        formMessage.textContent =
          "Sending...";
      }


      try {

        const formData = new FormData(emailForm);

        /*
          Make absolutely sure the email field
          is included.
        */

        formData.set("email", email);


        const response = await fetch(FORMSPREE_URL, {

          method: "POST",

          body: formData,

          headers: {
            "Accept": "application/json"
          }

        });


        if (response.ok) {

          /*
            SUCCESS
          */

          if (formMessage) {
            formMessage.textContent =
              "You're on the MX-Mafia list. Updates are coming soon.";
          }

          emailForm.reset();

        } else {

          let errorMessage =
            "Something went wrong. Please try again.";

          try {

            const data = await response.json();

            if (data && data.errors && data.errors.length) {
              errorMessage = data.errors
                .map(error => error.message)
                .join(" ");
            }

          } catch (error) {
            /* Ignore JSON parsing error */
          }

          if (formMessage) {
            formMessage.textContent = errorMessage;
          }

        }

      } catch (error) {

        console.error(
          "MX-Mafia Formspree error:",
          error
        );

        if (formMessage) {
          formMessage.textContent =
            "Connection failed. Please try again.";
        }

      }


      if (submitButton) {

        submitButton.disabled = false;
        submitButton.textContent = "JOIN";

      }

    });

  }


  /* =========================================
     SMOOTH SCROLL
  ========================================= */

  document.querySelectorAll("a[href^='#']").forEach(link => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  /* =========================================
     SCROLL REVEAL
  ========================================= */

  const revealElements =
    document.querySelectorAll(
      ".feature-card, .character-card, .vehicle-card, .news-card, .gallery-item"
    );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries, observerInstance) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("show");

              observerInstance.unobserve(
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
      observer.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("show");
    });

  }


  /* =========================================
     CONSOLE MESSAGE
  ========================================= */

  console.log(
    "%cMX-MAFIA",
    "font-size:30px;font-weight:bold;"
  );

  console.log(
    "Official website loaded successfully."
  );

});