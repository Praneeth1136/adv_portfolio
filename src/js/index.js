import LoconativeScroll from "./loconative-scroll.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copyText } from "./utils/index";
import { mapEach } from "./utils/dom";
import Time from "./components/Time";
import emailjs from '@emailjs/browser';

const toContactButtons = document.querySelectorAll(".contact-scroll");
const footer = document.getElementById("js-footer");
const scrollEl = document.querySelector("[data-scroll-container]");
const emailButton = document.querySelector("button.email");
const toCopyText = document.querySelector(".to-copy span");
const time = new Time();

gsap.registerPlugin(ScrollTrigger);

const scroll = new LoconativeScroll({
  el: scrollEl,
  smooth: true,
  lerp: 0.06,
  tablet: {
    smooth: false,
    breakpoint: 768,
  },
  smartphone: {
    smooth: false,
  },
});

setTimeout(() => {
  scroll.update();
}, 1000);

scroll.on("scroll", ScrollTrigger.update);

// Scroll progress bar
const progressBar = document.getElementById("js-progress");
scroll.on("scroll", (args) => {
  if (!progressBar) return;
  const y = args && args.scroll ? args.scroll.y : 0;
  const limit = args && args.limit ? args.limit.y : 1;
  const pct = limit > 0 ? Math.min((y / limit) * 100, 100) : 0;
  progressBar.style.width = pct + "%";
});

ScrollTrigger.scrollerProxy(scroll.el, {
  scrollTop(value) {
    return arguments.length
      ? scroll.scrollTo(value, 0, 0)
      : scroll.scroll.instance.scroll.y;
  },

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

/* ----------------------------------------------------------------
   CUSTOM CURSOR — follows pointer with smooth lerp, grows on hover
----------------------------------------------------------------- */
class Cursor {
  constructor() {
    this.el = document.querySelector(".c-cursor");
    this.ring = document.querySelector(".c-cursor__ring");
    this.dot = document.querySelector(".c-cursor__dot");
    if (!this.el || !window.matchMedia("(any-pointer: fine)").matches) return;

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    // dot follows fast, ring trails for an elastic feel
    this.dotPos = { ...this.mouse };
    this.ringPos = { ...this.mouse };
    this.dotSpeed = 0.35;
    this.ringSpeed = 0.15;

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // grow cursor over interactive elements
    const hoverTargets = document.querySelectorAll(
      "a, button, .home__projects__project__link, .c-button, .email"
    );
    hoverTargets.forEach((t) => {
      t.addEventListener("mouseenter", () => this.el.classList.add("is-active"));
      t.addEventListener("mouseleave", () =>
        this.el.classList.remove("is-active")
      );
    });

    // hide when pointer leaves the window
    document.addEventListener("mouseleave", () => (this.el.style.opacity = 0));
    document.addEventListener("mouseenter", () => (this.el.style.opacity = 1));

    this.render();
  }

  render() {
    this.dotPos.x += (this.mouse.x - this.dotPos.x) * this.dotSpeed;
    this.dotPos.y += (this.mouse.y - this.dotPos.y) * this.dotSpeed;
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * this.ringSpeed;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * this.ringSpeed;

    if (this.dot) {
      this.dot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0)`;
    }
    if (this.ring) {
      this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0)`;
    }
    requestAnimationFrame(() => this.render());
  }
}

/* ----------------------------------------------------------------
   MAGNETIC BUTTONS — pull toward the cursor when hovered
----------------------------------------------------------------- */
class Magnetic {
  constructor(el) {
    this.el = el;
    this.strength = 0.35;
    this.bind();
  }

  bind() {
    this.el.addEventListener("mousemove", (e) => {
      const rect = this.el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(this.el, {
        x: x * this.strength,
        y: y * this.strength,
        duration: 0.6,
        ease: "power3.out",
      });
    });

    this.el.addEventListener("mouseleave", () => {
      gsap.to(this.el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    });
  }
}

export default class Home {
  constructor(scroll) {
    this.locomotive = scroll;
    this.heroTextAnimation();
    this.homeIntro();
    this.homeAnimations();
    this.homeActions();
    this.initInteractions();
  }

  initInteractions() {
    if (window.matchMedia("(any-pointer: fine)").matches) {
      new Cursor();
      document
        .querySelectorAll(".nav__button, .footer__links .c-button, .email")
        .forEach((el) => new Magnetic(el));
    }
  }

  homeActions() {
    mapEach(toContactButtons, (button) => {
      button.onclick = () => {
        this.locomotive.scrollTo(footer);
      };
    });

    emailButton.addEventListener("click", (e) => {
      copyText(e);
      toCopyText.textContent = "copied";

      setTimeout(() => {
        toCopyText.textContent = "Click To Copy";
      }, 2000);
    });

    const viewMoreBtn = document.getElementById("view-more-btn");
    const moreProjects = document.getElementById("more-projects");
    if (viewMoreBtn && moreProjects) {
      viewMoreBtn.addEventListener("click", () => {
        if (moreProjects.style.display === "none") {
          moreProjects.style.display = "block";
          viewMoreBtn.textContent = "VIEW LESS PROJECTS";
          setTimeout(() => {
            this.locomotive.update();
            ScrollTrigger.refresh();
          }, 100);
        } else {
          moreProjects.style.display = "none";
          viewMoreBtn.textContent = "VIEW MORE PROJECTS";
          setTimeout(() => {
            this.locomotive.update();
            ScrollTrigger.refresh();
          }, 100);
        }
      });
    }
  }

  homeIntro() {
    const tl = gsap.timeline();

    gsap.to(scrollEl, {
      autoAlpha: 1,
    });

    tl.from(".home__nav", {
      duration: 0.5,
      delay: 0.3,
      opacity: 0,
      yPercent: -100,
      ease: "power4.out",
    })
      // per-letter staggered reveal of the hero headline
      .from(
        ".hero__hover",
        {
          duration: 0.9,
          yPercent: 120,
          opacity: 0,
          stagger: {
            amount: 0.5,
            from: "start",
          },
          ease: "power4.out",
        },
        "-=0.1"
      )
      .from(
        ".hero__title .bottom__right",
        {
          duration: 1,
          yPercent: 60,
          opacity: 0,
          ease: "power4.out",
        },
        "<30%"
      )
      .set(".hero__title .overflow", { overflow: "unset" })
      .from(
        ".hero__title .mobile",
        {
          duration: 0.7,
          yPercent: 100,
          stagger: {
            amount: 0.2,
          },
          ease: "power4.out",
        },
        "-=1.4"
      );
  }

  homeAnimations() {
    gsap.to(".home__projects__line", { autoAlpha: 1 });
    gsap.utils.toArray(".home__projects__line").forEach((el) => {
      const line = el.querySelector("span");
      gsap.from(line, {
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
        },
        scaleX: 0,
      });
    });

    gsap.utils.toArray("[data-fade-in]").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
        },
        duration: 1.5,
        yPercent: 100,
        opacity: 0,
        ease: "power4.out",
      });
    });

    // project titles clip-reveal on scroll (desktop)
    if (window.innerWidth > 768) {
      gsap.utils.toArray(".home__projects__project__title").forEach((el) => {
        const inner = el.querySelector(".title__main");
        if (!inner) return;
        gsap.from(inner, {
          scrollTrigger: {
            trigger: el,
            scroller: "[data-scroll-container]",
            start: "top 95%",
          },
          duration: 1.2,
          yPercent: 100,
          ease: "power4.out",
        });
      });
    }

    if (window.innerWidth <= 768) {
      gsap.utils.toArray(".home__projects__project").forEach((el) => {
        const text = el.querySelector(".title__main");
        const link = el.querySelector(".project__link");
        gsap.from([text, link], {
          scrollTrigger: {
            trigger: el,
            scroller: "[data-scroll-container]",
          },
          duration: 1.5,
          yPercent: 100,
          stagger: {
            amount: 0.2,
          },
          ease: "power4.out",
        });
      });

      const awardsTl = gsap.timeline({
        defaults: {
          ease: "power1.out",
        },
        scrollTrigger: {
          trigger: ".home__awards",
          scroller: "[data-scroll-container]",
        },
      });
      awardsTl.from(".awards__title span", {
        duration: 1,
        opacity: 0,
        yPercent: 100,
        stagger: {
          amount: 0.2,
        },
      });
    }
  }

  heroTextAnimation() {
    gsap.to(".hero__title__dash.desktop", {
      scrollTrigger: {
        trigger: ".hero__title",
        scroller: "[data-scroll-container]",
        scrub: true,
        start: "-8% 9%",
        end: "110% 20%",
      },
      scaleX: 4,
      ease: "none",
    });
  }
}

/* ----------------------------------------------------------------
   PRELOADER — counts 0 -> 100, then wipes up to reveal the site
----------------------------------------------------------------- */
class Preloader {
  constructor(onComplete) {
    this.el = document.getElementById("js-preloader");
    this.counter = document.getElementById("js-counter");
    this.onComplete = onComplete;

    if (!this.el) {
      this.onComplete();
      return;
    }
    this.run();
  }

  run() {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (this.counter) this.counter.textContent = Math.round(obj.val);
      },
      onComplete: () => this.reveal(),
    });
  }

  reveal() {
    // Reveal the site content underneath FIRST, while the preloader still
    // covers the screen — then wipe the preloader away over the live site.
    this.onComplete();

    const tl = gsap.timeline({
      onComplete: () => {
        this.el.classList.add("is-hidden");
        this.el.style.display = "none";
      },
    });

    tl.to(".c-preloader__inner, .c-preloader__count", {
      duration: 0.6,
      yPercent: -120,
      opacity: 0,
      stagger: 0.08,
      ease: "power3.inOut",
    }).to(
      this.el,
      {
        duration: 0.9,
        yPercent: -100,
        ease: "power4.inOut",
      },
      "-=0.2"
    );
  }
}

// Gate the site intro behind the preloader.
// Home initialises the moment the counter finishes (content revealed underneath),
// then the preloader wipes away to show it — no flash of hidden content.
new Preloader(() => {
  new Home(scroll);
  setTimeout(() => scroll.update(), 100);
});
// --- EXTRA ADDONS ---
document.addEventListener("DOMContentLoaded", () => {

  // 2. Interactive Terminal
  const termInput = document.getElementById("terminal-input");
  const termOutput = document.getElementById("terminal-output");
  const termBody = document.getElementById("terminal-body");

  if (termInput && termOutput) {
    termBody.addEventListener("click", () => termInput.focus());

    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = termInput.value.trim().toLowerCase();
        let response = "";
        
        termOutput.innerHTML += `<div style="display: flex; gap: 10px; margin-top: 10px;">
          <span style="color: #27c93f;">➜</span>
          <span style="color: #58a6ff;">~</span>
          <span>${termInput.value}</span>
        </div>`;

        switch(cmd) {
          case "help":
            response = "Available commands: <br> - <span style='color: #ffbd2e;'>whoami</span>: Learn about me <br> - <span style='color: #ffbd2e;'>skills</span>: View my tech stack <br> - <span style='color: #ffbd2e;'>clear</span>: Clear terminal";
            break;
          case "whoami":
            response = "Praneeth Kilaparthi. Full-Stack Engineer specializing in React, Node.js, and Agentic AI. Currently seeking SWE roles.";
            break;
          case "skills":
            response = "Python, Java, React, Node.js, Kubernetes, Docker, AWS, LangChain.";
            break;
          case "clear":
            termOutput.innerHTML = "";
            break;
          case "":
            break;
          default:
            response = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        if (response) {
          termOutput.innerHTML += `<div style="margin-top: 5px; color: #ddd; line-height: 1.5;">${response}</div>`;
        }

        termInput.value = "";
        setTimeout(() => {
          termBody.scrollTop = termBody.scrollHeight;
        }, 10);
      }
    });
  }

  // 4. Back to Top Button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    // Show/hide based on scroll
    scroll.on("scroll", (args) => {
      if (args.scroll.y > 500) {
        backToTop.style.bottom = "20px";
      } else {
        backToTop.style.bottom = "-60px";
      }
    });

    // Click to scroll to top
    backToTop.addEventListener("click", () => {
      scroll.scrollTo(0, { duration: 1000, easing: [0.25, 0.0, 0.35, 1.0] });
    });
  }

  // 5. EmailJS Form Submission
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit-btn");

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "SENDING...";
      submitBtn.style.pointerEvents = "none";
      submitBtn.style.opacity = "0.7";

      emailjs.sendForm("service_swwp8hp", "template_n173wlk", contactForm, {
        publicKey: "6RBPWTVq7FNR0ndNG",
      })
        .then(() => {
          // Success! Redirect to our custom professional thanks page
          window.location.href = "/thanks.html";
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          submitBtn.textContent = "FAILED. TRY AGAIN";
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.pointerEvents = "auto";
            submitBtn.style.opacity = "1";
          }, 3000);
        });
    });
  }
});
