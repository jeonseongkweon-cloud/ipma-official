/* =========================================================
   IPMA GitHub Pages - Common Script
   File: /assets/js/app.js
   Features:
   1) Auto year in footer
   2) Mobile menu toggle
========================================================= */

(function () {
  "use strict";

  // ---------- 1) Footer year auto ----------
  // 사용법: <span id="year"></span> 또는 <span data-year></span>
  const year = String(new Date().getFullYear());
  const yearById = document.getElementById("year");
  if (yearById) yearById.textContent = year;

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = year;
  });

  // ---------- 2) Mobile menu toggle ----------
  // 권장 구조:
  // <button class="menu-btn" data-menu-btn aria-controls="site-nav" aria-expanded="false">☰</button>
  // <nav class="nav" id="site-nav" data-site-nav> ... </nav>
  const btn = document.querySelector("[data-menu-btn]");
  const nav = document.querySelector("[data-site-nav]") || document.getElementById("site-nav");

  if (btn && nav) {
    const setExpanded = (isOpen) => {
      btn.setAttribute("aria-expanded", String(isOpen));
      nav.classList.toggle("open", isOpen);
    };

    // 초기 상태
    setExpanded(false);

    // 버튼 클릭: 토글
    btn.addEventListener("click", () => {
      const isOpen = nav.classList.contains("open");
      setExpanded(!isOpen);
    });

    // 바깥 클릭: 닫기 (모바일에서 유용)
    document.addEventListener("click", (e) => {
      const isOpen = nav.classList.contains("open");
      if (!isOpen) return;
      const target = e.target;
      if (target === btn || nav.contains(target)) return;
      setExpanded(false);
    });

    // ESC: 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const isOpen = nav.classList.contains("open");
      if (isOpen) setExpanded(false);
    });

    // 화면이 커지면(데스크톱) 모바일 메뉴 상태 초기화
    const mq = window.matchMedia("(min-width: 721px)");
    mq.addEventListener("change", (evt) => {
      if (evt.matches) setExpanded(false);
    });
  }

  // ---------- (선택) Active menu highlight ----------
  // nav 안의 링크가 현재 경로와 일치하면 active 클래스 부여
  // CSS에서 .nav a.active 스타일 적용됨
  const path = window.location.pathname.replace(/\/+$/, "/");
  document.querySelectorAll(".nav a").forEach((a) => {
    try {
      const url = new URL(a.getAttribute("href"), window.location.origin);
      const hrefPath = url.pathname.replace(/\/+$/, "/");
      if (hrefPath === path) a.classList.add("active");
    } catch (_) {}
  });
})();
