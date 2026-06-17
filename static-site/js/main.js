(() => {
  // 取引に使うGoogleフォーム/スプレッドシートのリンク（正本はここに集約）
  const LINKS = {
    sellerListing:
      "https://docs.google.com/forms/d/e/1FAIpQLScYDNmMtkbsa7-_AXUM2YYeCEsv2PKWHvp3uxKYjuyFcARYag/viewform",
    buyerInquiry:
      "https://docs.google.com/forms/d/e/1FAIpQLSfMFlXD-B9aXB3QDq7HK_pfkFrwRBGdqVLn0MROKpnKm2AtTA/viewform",
    completeSeller: "https://forms.gle/sy2DU1ZaCvJWQQJb6",
    completeBuyer:
      "https://docs.google.com/forms/d/e/1FAIpQLSc9PQKQ67HaV1B4d4nLliJy7JpH7B6ib19VoZ_J_LvymQoWhw/viewform",
    adminSheet:
      "https://docs.google.com/spreadsheets/d/1raQMxjZ3HGdq0f-CBxsNw1Q27bviHkpxU4SNoxa7bgY/edit",
  };
  window.GATAFY_LINKS = LINKS;

  // data-form="<key>" を持つ要素を、対応するフォームを新規タブで開くように配線する
  document.querySelectorAll("[data-form]").forEach((el) => {
    const url = LINKS[el.dataset.form];
    if (!url) return;
    if (el.tagName === "A") {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    } else {
      el.addEventListener("click", () => {
        window.open(url, "_blank", "noopener");
      });
      el.style.cursor = "pointer";
    }
  });

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
