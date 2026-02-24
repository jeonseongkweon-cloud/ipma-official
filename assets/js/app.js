(() => {
  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const btn = document.querySelector("[data-menu-btn]");
  const nav = document.querySelector("[data-site-nav]");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const opened = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", opened ? "true" : "false");
    });

    // outside click close
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("open")) return;
      const t = e.target;
      if (btn.contains(t) || nav.contains(t)) return;
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  // Scroll top buttons
  const topBtn = document.querySelector("[data-scroll-top]");
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // HERO slider (right -> left, 3s interval, dots, no center emphasis)
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  const dotsWrap = slider.querySelector("[data-dots]");
  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");

  if (!track) return;

  const slides = Array.from(track.children);
  const count = slides.length;

  // Create dots
  const dots = [];
  if (dotsWrap) {
    for (let i = 0; i < count; i++) {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", `슬라이드 ${i + 1}`);
      d.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(d);
      dots.push(d);
    }
  }

  let index = 0;
  let timer = null;
  let isPaused = false;

  const setDots = (i) => {
    dots.forEach((d, di) => d.classList.toggle("active", di === i));
  };

  const apply = () => {
    track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
    setDots(index);
  };

  const go = (i, user = false) => {
    index = (i + count) % count;
    apply();
    if (user) restart();
  };

  const next = (user = false) => go(index + 1, user); // 우→좌 이동 느낌 (왼쪽으로 넘어감)
  const prev = (user = false) => go(index - 1, user);

  const start = () => {
    stop();
    timer = setInterval(() => {
      if (!isPaused) next(false);
    }, 3000);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const restart = () => {
    // 사용자가 눌렀을 때 템포 재정렬
    start();
  };

  if (nextBtn) nextBtn.addEventListener("click", () => next(true));
  if (prevBtn) prevBtn.addEventListener("click", () => prev(true));

  // Pause on hover/touch focus
  slider.addEventListener("mouseenter", () => (isPaused = true));
  slider.addEventListener("mouseleave", () => (isPaused = false));
  slider.addEventListener("focusin", () => (isPaused = true));
  slider.addEventListener("focusout", () => (isPaused = false));

  // Swipe (mobile)
  let sx = 0, dx = 0, down = false;
  const onDown = (x) => { sx = x; dx = 0; down = true; isPaused = true; };
  const onMove = (x) => { if (!down) return; dx = x - sx; };
  const onUp = () => {
    if (!down) return;
    down = false;
    const threshold = 40;
    if (dx < -threshold) next(true);
    else if (dx > threshold) prev(true);
    isPaused = false;
    dx = 0;
  };

  slider.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), { passive: true });
  slider.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
  slider.addEventListener("touchend", onUp);

  // Init
  apply();
  start();

  // Reduce motion
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches) stop();
})();
