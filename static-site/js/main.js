(() => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");

  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
  };

  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      panel.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("is-menu-open", !expanded);
    });

    panel.addEventListener("click", (event) => {
      if (event.target === panel || event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px" },
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const filters = document.querySelectorAll("[data-case-filter]");
  const caseCards = document.querySelectorAll("[data-case-card]");
  const noResults = document.querySelector("[data-no-results]");

  const applyCaseFilters = () => {
    if (!filters.length || !caseCards.length) return;
    const selected = Array.from(filters).reduce((values, select) => {
      values[select.dataset.caseFilter] = select.value;
      return values;
    }, {});

    let visibleCount = 0;
    caseCards.forEach((card) => {
      const matches = Object.entries(selected).every(([key, value]) => {
        return value === "all" || card.dataset[key] === value;
      });
      card.classList.toggle("is-hidden", !matches);
      if (matches) visibleCount += 1;
    });

    if (noResults) noResults.classList.toggle("is-visible", visibleCount === 0);
  };

  filters.forEach((select) => {
    select.addEventListener("change", applyCaseFilters);
  });
  applyCaseFilters();
})();
